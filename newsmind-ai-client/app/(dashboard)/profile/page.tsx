"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaBookmark,
  FaRegClock,
  FaCircleCheck,
  FaTrash,
  FaChevronRight,
  FaLocationDot,
} from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useSession } from "@/lib/auth-client";
import { getArticles, getUserBookmarks, updateUserProfile, toggleBookmark } from "@/lib/server";

type ProfileValues = {
  name: string;
  email: string;
  bio: string;
  location: string;
};

type HistoryItem = {
  id: string;
  title: string;
  time: string;
  category: string;
};

type BookmarkItem = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
};

const TABS = ["Profile", "Bookmarks", "History"] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const { data: session } = useSession();
  const sessionUser = session?.user;
  const [profileUser, setProfileUser] = useState(sessionUser);

  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      location: "",
    },
  });

  useEffect(() => {
    setProfileUser(sessionUser);
  }, [sessionUser]);

  // Re-populate form when session updates
  useEffect(() => {
    if (profileUser) {
      reset({
        name: profileUser.name || "Reader",
        email: profileUser.email || "",
        bio: (profileUser as { bio?: string }).bio || "",
        location: (profileUser as { location?: string }).location || "",
      });
    }
  }, [profileUser, reset]);

  // Fetch articles for history tab
  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        const [articlesData, savedBookmarks] = await Promise.all([getArticles(), getUserBookmarks()]);

        if (!isMounted) return;

        if (Array.isArray(articlesData)) {
          const mappedHistory: HistoryItem[] = articlesData.slice(0, 5).map((a) => ({
            id: a._id || a.id || String(Math.random()),
            title: a.title || "Untitled Article",
            time: a.createdAt
              ? new Date(a.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Recently",
            category: a.category || "General",
          }));
          setHistory(mappedHistory);
        }

        if (Array.isArray(savedBookmarks)) {
          const mappedBookmarks: BookmarkItem[] = savedBookmarks.map((article: any) => ({
            id: article._id || article.id || String(Math.random()),
            title: article.title || "Untitled Article",
            category: article.category || "General",
            readTime: article.readTime || "5 min read",
            imageUrl: article.imageUrl || article.image || "",
          }));
          setBookmarks(mappedBookmarks);
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSave = async (data: ProfileValues) => {
    try {
      setIsSubmitting(true);

      const res = await updateUserProfile({
        name: data.name,
        bio: data.bio,
        avatar: sessionUser?.image || "",
      });

      if (res.success) {
        const updatedName = data.name.trim() || "Reader";
        const updatedAvatar = sessionUser?.image || "";

        setProfileUser((prev: any) => ({
          ...(prev || {}),
          name: updatedName,
          email: prev?.email || data.email || "",
          image: updatedAvatar,
          bio: data.bio,
          location: data.location || "",
        }));

        reset({
          name: updatedName,
          email: sessionUser?.email || data.email || "",
          bio: data.bio,
          location: data.location || "",
        });

        setSaved(true);
        setEditMode(false);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error(res.error);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    try {
      await toggleBookmark(id);
    } catch (e) {
      console.error("Failed to remove bookmark", e);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Profile Header */}
        <div className="bg-zinc-900 pt-12 pb-0">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 pb-6">
              <div className="relative">
                <Avatar className="size-24 ring-4 ring-zinc-700 shadow-xl">
                  <AvatarImage
                    src={profileUser?.image || sessionUser?.image || ""}
                    alt={profileUser?.name || sessionUser?.name || "User Avatar"}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-zinc-200">
                    {profileUser?.name ? profileUser.name.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  aria-label="Edit Profile"
                  className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-teal-500 text-white shadow-md hover:bg-teal-400 transition-colors"
                >
                  <FaPen className="size-3" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {profileUser?.name || sessionUser?.name || "User"}
                </h1>
                <p className="text-zinc-400 text-sm font-medium">
                  {profileUser?.email || sessionUser?.email || "No email provided"}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-[10px] font-bold uppercase tracking-widest">
                    Member
                  </Badge>
                </div>
              </div>

              <div className="flex gap-6 text-center pb-1">
                <div>
                  <p className="text-xl font-extrabold text-white">{history.length}</p>
                  <p className="text-xs font-semibold text-zinc-400">History</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">{bookmarks.length}</p>
                  <p className="text-xs font-semibold text-zinc-400">Bookmarks</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 border-b border-zinc-800">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-teal-500 text-teal-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Profile Tab */}
          {activeTab === "Profile" && (
            <div className="max-w-2xl space-y-6">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Account Details
                  </h2>
                  {saved && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                      <FaCircleCheck className="size-3.5" /> Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSave)} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FaUser className="size-3.5" /> Full Name
                    </label>
                    <input
                      disabled={!editMode || isSubmitting}
                      placeholder="Your name"
                      className={`w-full h-10 rounded-lg border px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${
                        editMode
                          ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 cursor-default"
                      } ${errors.name ? "border-rose-400" : ""}`}
                      {...register("name", { required: true })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FaEnvelope className="size-3.5" /> Email Address
                    </label>
                    <input
                      disabled={!editMode || isSubmitting}
                      placeholder="your@email.com"
                      type="email"
                      className={`w-full h-10 rounded-lg border px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${
                        editMode
                          ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 cursor-default"
                      } ${errors.email ? "border-rose-400" : ""}`}
                      {...register("email", { required: true })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FaLocationDot className="size-3.5" /> Location
                    </label>
                    <input
                      disabled={!editMode || isSubmitting}
                      placeholder="City, Country"
                      className={`w-full h-10 rounded-lg border px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${
                        editMode
                          ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 cursor-default"
                      }`}
                      {...register("location")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Bio
                    </label>
                    <textarea
                      disabled={!editMode || isSubmitting}
                      rows={3}
                      placeholder="Write a short bio..."
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${
                        editMode
                          ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 cursor-default"
                      }`}
                      {...register("bio")}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    {editMode ? (
                      <>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="font-bold rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900"
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSubmitting}
                          onClick={() => setEditMode(false)}
                          className="font-bold rounded-lg cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="font-bold rounded-lg cursor-pointer flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900"
                      >
                        <FaPen className="size-3" /> Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === "Bookmarks" && (
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
          )}

          {/* History Tab */}
          {activeTab === "History" && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Reading History
              </h2>
              {history.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500 font-medium bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  No recent reading history.
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <Badge className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none font-bold uppercase tracking-wider">
                          {item.category}
                        </Badge>
                        <Link href={`/article/${item.id}`}>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:underline group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {item.title}
                          </p>
                        </Link>
                        <p className="text-[10px] text-zinc-400 font-medium">{item.time}</p>
                      </div>
                      <FaChevronRight className="size-3 text-zinc-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}