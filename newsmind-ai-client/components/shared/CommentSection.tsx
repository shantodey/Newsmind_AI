"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  FaRegHeart,
  FaHeart,
  FaRegCommentDots,
  FaReply,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CommentFormValues {
  name: string;
  email: string;
  body: string;
}

interface CommentData {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  body: string;
  publishedAt: string;
  likes: number;
  replies?: CommentData[];
}

const INITIAL_COMMENTS: CommentData[] = [
  {
    id: "c1",
    author: {
      name: "Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
    },
    body: "This is a fascinating breakdown of the topic. The AI angle really opens up a lot of questions about how we consume media going forward. Really appreciate the depth of research here.",
    publishedAt: "2 hours ago",
    likes: 24,
    replies: [
      {
        id: "c1r1",
        author: {
          name: "James Okafor",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
        },
        body: "Totally agree, Sarah. I've been following this space for a while now, and the pace of change is extraordinary. The implications for journalism are huge.",
        publishedAt: "1 hour ago",
        likes: 9,
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    author: {
      name: "Priya Kapoor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop",
    },
    body: "Well-written article! Would love to see a follow-up exploring the regulatory side of this — especially in the context of global media laws.",
    publishedAt: "4 hours ago",
    likes: 11,
    replies: [],
  },
  {
    id: "c3",
    author: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop",
    },
    body: "The section on algorithmic bias is spot on. I've done research in this domain and it's refreshing to see mainstream coverage that doesn't oversimplify the nuances.",
    publishedAt: "6 hours ago",
    likes: 18,
    replies: [
      {
        id: "c3r1",
        author: {
          name: "Amara Nwosu",
          avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop",
        },
        body: "Couldn't agree more. Most pieces on this just scratch the surface. This article actually cites concrete examples.",
        publishedAt: "5 hours ago",
        likes: 6,
        replies: [],
      },
    ],
  },
];

interface CommentCardProps {
  comment: CommentData;
  depth?: number;
}

function CommentCard({ comment, depth = 0 }: CommentCardProps) {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(comment.likes);
  const [showReplies, setShowReplies] = React.useState(true);
  const [replying, setReplying] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<{ reply: string }>();

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const onReplySubmit = (data: { reply: string }) => {
    // In a real app this would call an API
    console.log("Reply submitted:", data.reply);
    reset();
    setReplying(false);
  };

  const isNested = depth > 0;

  return (
    <div className={`flex gap-3 ${isNested ? "ml-6 md:ml-10 mt-4" : ""}`}>
      {/* Thread line for nested */}
      {isNested && (
        <div className="absolute left-0 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800" />
      )}

      <div className="shrink-0">
        <Avatar className="size-9 ring-2 ring-zinc-100 dark:ring-zinc-800">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback className="text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {comment.author.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Bubble */}
        <div className="rounded-xl bg-zinc-50 border border-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {comment.author.name}
              </span>
              {depth === 0 && (
                <Badge className="bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border-none text-[9px] h-4 px-1.5 font-bold uppercase tracking-wider">
                  Verified
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-medium shrink-0">
              {comment.publishedAt}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {comment.body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 px-1">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-rose-500 transition-colors"
          >
            {liked ? (
              <FaHeart className="size-3.5 text-rose-500" />
            ) : (
              <FaRegHeart className="size-3.5" />
            )}
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setReplying((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <FaReply className="size-3.5" />
            <span>Reply</span>
          </button>

          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies((prev) => !prev)}
              className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors ml-auto"
            >
              <FaRegCommentDots className="size-3.5" />
              <span>{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</span>
              {showReplies ? (
                <FaChevronUp className="size-2.5" />
              ) : (
                <FaChevronDown className="size-2.5" />
              )}
            </button>
          )}
        </div>

        {/* Inline reply form */}
        {replying && (
          <form
            onSubmit={handleSubmit(onReplySubmit)}
            className="flex items-start gap-2 mt-2"
          >
            <Textarea
              {...register("reply", { required: true })}
              placeholder={`Reply to ${comment.author.name}...`}
              rows={2}
              className="flex-1 text-sm resize-none rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50"
            />
            <div className="flex flex-col gap-1.5">
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
              >
                Post
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setReplying(false)}
                className="text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && showReplies && (
          <div className="relative space-y-0 border-l-2 border-zinc-100 dark:border-zinc-800 pl-1">
            {comment.replies.map((reply) => (
              <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentSection() {
  const [comments, setComments] = React.useState<CommentData[]>(INITIAL_COMMENTS);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>();

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    const newComment: CommentData = {
      id: `c${Date.now()}`,
      author: {
        name: data.name,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop`,
      },
      body: data.body,
      publishedAt: "Just now",
      likes: 0,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    reset();
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FaRegCommentDots className="size-5 text-zinc-500 dark:text-zinc-400" />
        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Comments
        </h2>
        <Badge
          variant="secondary"
          className="text-xs font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-none rounded-full px-2.5"
        >
          {comments.length}
        </Badge>
      </div>

      {/* Comment Form */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          Add a Comment
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Name *
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Your name"
                className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all"
              />
              {errors.name && (
                <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Email *
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
                })}
                placeholder="your@email.com"
                type="email"
                className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all"
              />
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Comment *
            </label>
            <Textarea
              {...register("body", {
                required: "Comment is required",
                minLength: { value: 10, message: "Minimum 10 characters required" },
              })}
              placeholder="Share your thoughts on this article..."
              rows={4}
              className="resize-none rounded-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all"
            />
            {errors.body && (
              <p className="text-xs text-rose-500 font-medium">{errors.body.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-bold rounded-lg px-6 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 transition-all cursor-pointer"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
            {submitted && (
              <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 animate-in fade-in slide-in-from-left-2 duration-300">
                Comment posted!
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  );
}
