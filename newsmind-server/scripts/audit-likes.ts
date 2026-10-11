import "dotenv/config";
import { articlesCollection, client, connectToMongoDB, disconnectFromMongoDB, userCollection } from "../src/config/db";

async function auditLikes() {
  await connectToMongoDB();
  try {
    const [users, articles] = await Promise.all([
      userCollection.find({}, { projection: { likedPosts: 1 } }).toArray(),
      articlesCollection.find({}, { projection: { likes: 1, likedBy: 1 } }).toArray(),
    ]);
    const knownUsers = new Set(users.map((user) => String(user._id)));
    const articleIds = new Set(articles.map((article) => String(article._id)));
    const likedByArticle = new Map<string, Set<string>>();
    const orphanedUserLikes: Array<{ userId: string; articleId: string }> = [];

    for (const user of users) {
      for (const value of Array.isArray(user.likedPosts) ? user.likedPosts : []) {
        const articleId = String(value);
        if (!articleIds.has(articleId)) {
          orphanedUserLikes.push({ userId: String(user._id), articleId });
          continue;
        }
        const likedUsers = likedByArticle.get(articleId) || new Set<string>();
        likedUsers.add(String(user._id));
        likedByArticle.set(articleId, likedUsers);
      }
    }

    const discrepancies = articles.flatMap((article) => {
      const articleId = String(article._id);
      const canonicalLikes = likedByArticle.get(articleId) || new Set<string>();
      const articleLikes = new Set(
        (Array.isArray(article.likedBy) ? article.likedBy : []).map((id: unknown) => String(id))
      );
      const missingFromUser = [...articleLikes].filter((userId) => knownUsers.has(userId) && !canonicalLikes.has(userId));
      const unknownLikedByUsers = [...articleLikes].filter((userId) => !knownUsers.has(userId));
      const missingFromLikedBy = [...canonicalLikes].filter((userId) => !articleLikes.has(userId));
      const expectedCount = canonicalLikes.size;
      const reconciledCount = new Set([
        ...canonicalLikes,
        ...[...articleLikes].filter((userId) => knownUsers.has(userId)),
      ]).size;
      const storedCount = Number(article.likes || 0);

      if (
        missingFromUser.length === 0 &&
        unknownLikedByUsers.length === 0 &&
        missingFromLikedBy.length === 0 &&
        storedCount === expectedCount
      ) {
        return [];
      }

      return [{
        articleId,
        storedCount,
        expectedCount,
        reconciledCount,
        likedByOnly: missingFromUser,
        unknownLikedByUsers,
        likedPostsOnly: missingFromLikedBy,
      }];
    });

    const apply = process.argv.includes("--apply");
    const unresolvedOrphans = orphanedUserLikes.length > 0 ||
      discrepancies.some((item) => item.unknownLikedByUsers.length > 0);
    const report = {
      mode: apply ? "apply" : "read-only",
      userCount: users.length,
      articleCount: articles.length,
      discrepancies,
      orphanedUserLikes,
    };
    console.log(JSON.stringify(report, null, 2));

    if (!apply) return;
    if (unresolvedOrphans) {
      throw new Error("Resolve orphaned user/article references before applying reconciliation");
    }

    const userById = new Map(users.map((user) => [String(user._id), user]));
    for (const article of articles) {
      const articleId = String(article._id);
      const desiredUsers = new Set([
        ...(likedByArticle.get(articleId) || []),
        ...(Array.isArray(article.likedBy) ? article.likedBy.map((id: unknown) => String(id)) : []),
      ]);
      const session = client.startSession();
      try {
        await session.withTransaction(async () => {
          for (const userId of desiredUsers) {
            const user = userById.get(userId);
            if (!user) continue;
            await userCollection.updateOne(
              { _id: user._id },
              { $addToSet: { likedPosts: articleId } },
              { session }
            );
          }
          await articlesCollection.updateOne(
            { _id: article._id },
            { $set: { likes: desiredUsers.size }, $unset: { likedBy: "" } },
            { session }
          );
        });
      } finally {
        await session.endSession();
      }
    }
    console.log("Like reconciliation applied.");
  } finally {
    await disconnectFromMongoDB();
  }
}

auditLikes().catch((error) => {
  console.error("Like audit failed:", error);
  process.exitCode = 1;
});
