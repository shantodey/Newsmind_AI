

const BookMarks = () => {
    return (
         <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Saved Articles{" "}
                  <Badge variant="secondary" className="ml-2 text-xs font-bold">
                    {bookmarks.length}
                  </Badge>
                </h2>
              </div>
              {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <FaBookmark className="size-12 text-zinc-300 dark:text-zinc-700" />
                  <p className="font-bold text-zinc-500">No bookmarks saved yet</p>
                  <Link
                    href="/"
                    className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Explore articles
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {bookmarks.map((b) => (
                    <div
                      key={b.id}
                      className="flex gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <Image
                          src={b.imageUrl}
                          alt={b.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <Badge className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none font-bold uppercase tracking-wider">
                          {b.category}
                        </Badge>
                        <Link href={`/article/${b.id}`}>
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 line-clamp-2 hover:underline group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {b.title}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                            <FaRegClock className="size-2.5" /> {b.readTime}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeBookmark(b.id)}
                            aria-label="Remove bookmark"
                            className="text-zinc-300 hover:text-rose-500 dark:text-zinc-700 dark:hover:text-rose-500 transition-colors"
                          >
                            <FaTrash className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
    );
};

export default BookMarks;