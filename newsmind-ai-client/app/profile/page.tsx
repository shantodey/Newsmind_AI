"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  FaUser, FaEnvelope, FaPen, FaBookmark, FaRegClock,
  FaCircleCheck, FaTrash, FaChevronRight,
} from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useSession } from "@/lib/auth-client";
import { getArticles } from "@/app/actions";

type ProfileValues = { name: string; email: string; bio: string; location: string };

const BOOKMARKS = [
  { id: "b1", title: "The Quantum Computing Encryption Problem", category: "Technology", readTime: "7 min", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=200&fit=crop" },
  { id: "b2", title: "mRNA Cancer Vaccine Enters Phase III Trials", category: "Health", readTime: "9 min", imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop" },
  { id: "b3", title: "Federal Reserve Signals Three Rate Cuts", category: "Business", readTime: "5 min", imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop" },
  { id: "b4", title: "Mars Mission Update: Artemis VI Crew Training", category: "Science", readTime: "7 min", imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=200&fit=crop" },
];

const HISTORY = [
  { id: "h1", title: "AI Chip Wars: NVIDIA vs. AMD vs. Intel", time: "2 hours ago", category: "Technology" },
  { id: "h2", title: "Champions League Final: Real Madrid's Comeback", time: "Yesterday", category: "Sport" },
  { id: "h3", title: "Climate Summit Ends in Landmark Accord", time: "2 days ago", category: "Climate" },
  { id: "h4", title: "Netflix and Disney+ Announce Joint Tier", time: "3 days ago", category: "Entertainment" },
  { id: "h5", title: "Olympics 2028: LA Infrastructure Ready", time: "4 days ago", category: "Sport" },
];

const TABS = ["Profile", "Bookmarks", "History"] as const;
type Tab = typeof TABS[number];

export default function ProfilePage() {
  const { data: session } = useSession();
  const sessionUser = session?.user as any;

  const [activeTab, setActiveTab] = React.useState<Tab>("Profile");
  const [bookmarks, setBookmarks] = React.useState(BOOKMARKS);
  const [history, setHistory] = React.useState(HISTORY);
  const [editMode, setEditMode] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileValues>({
    defaultValues: {
      name: sessionUser?.name || "Reader",
      email: sessionUser?.email || "",
      bio: "Curious reader and tech enthusiast. Following AI, climate, and science news closely.",
      location: "San Francisco, CA",
    },
  });

  // Re-populate form when session loads
  React.useEffect(() => {
    if (sessionUser) {
      reset({
        name: sessionUser.name || "Reader",
        email: sessionUser.email || "",
        bio: "Curious reader and tech enthusiast.",
        location: "",
      });
    }
  }, [sessionUser?.name]);

  // Fetch recent articles as reading history
  React.useEffect(() => {
    getArticles()
      .then((data) => {
        if (data?.length) {
          setHistory(data.slice(0, 5).map((a: any) => ({
            id: a._id || a.id,
            title: a.title,
            time: new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            category: a.category,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const onSave = async (data: ProfileValues) => {
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const removeBookmark = (id: string) => setBookmarks((prev) => prev.filter((b) => b.id !== id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Profile header */}
        <div className="bg-zinc-900 pt-12 pb-0">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 pb-6">
              <div className="relative">
                <Avatar className="size-24 ring-4 ring-zinc-700 shadow-xl">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" />
                  <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-zinc-200">AJ</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-teal-500 text-white shadow-md hover:bg-teal-400 transition-colors">
                  <FaPen className="size-3" />
                </button>
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Alex Johnson</h1>
                <p className="text-zinc-400 text-sm font-medium">alex.johnson@example.com</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-[10px] font-bold uppercase tracking-widest">Pro Member</Badge>
                  <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px] font-bold uppercase tracking-widest">Since Jan 2025</Badge>
                </div>
              </div>
              <div className="flex gap-6 text-center pb-1">
                {[{ num: "1,247", label: "Articles" }, { num: "83", label: "Bookmarks" }, { num: "248", label: "AI Uses" }].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-extrabold text-white">{s.num}</p>
                    <p className="text-xs font-semibold text-zinc-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-zinc-800">
              {TABS.map((tab) => (
                <button
                  key={tab}
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

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Profile tab */}
          {activeTab === "Profile" && (
            <div className="max-w-2xl space-y-6">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Account Details</h2>
                  {saved && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 animate-in fade-in slide-in-from-right-2 duration-300">
                      <FaCircleCheck className="size-3.5" /> Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSave)} className="space-y-5">
                  {[
                    { field: "name" as const, label: "Full Name", icon: <FaUser className="size-3.5" />, placeholder: "Your name" },
                    { field: "email" as const, label: "Email Address", icon: <FaEnvelope className="size-3.5" />, placeholder: "your@email.com" },
                    { field: "location" as const, label: "Location", icon: null, placeholder: "City, Country" },
                  ].map(({ field, label, icon, placeholder }) => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        {icon}{label}
                      </label>
                      <input
                        disabled={!editMode}
                        placeholder={placeholder}
                        className={`w-full h-10 rounded-lg border px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${
                          editMode
                            ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                            : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 cursor-default"
                        } ${errors[field] ? "border-rose-400" : ""}`}
                        {...register(field, { required: field !== "location" })}
                      />
                    </div>
                  ))}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Bio</label>
                    <textarea
                      disabled={!editMode}
                      rows={3}
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
                        <Button type="submit" className="font-bold rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900">Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => setEditMode(false)} className="font-bold rounded-lg cursor-pointer">Cancel</Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setEditMode(true)} className="font-bold rounded-lg cursor-pointer flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900">
                        <FaPen className="size-3" /> Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bookmarks tab */}
          {activeTab === "Bookmarks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Saved Articles <Badge variant="secondary" className="ml-2 text-xs font-bold">{bookmarks.length}</Badge>
                </h2>
              </div>
              {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <FaBookmark className="size-12 text-zinc-300 dark:text-zinc-700" />
                  <p className="font-bold text-zinc-500">No bookmarks yet</p>
                  <Link href="/explore" className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">Explore articles</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {bookmarks.map((b) => (
                    <div key={b.id} className="flex gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <Image src={b.imageUrl} alt={b.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <Badge className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none font-bold uppercase tracking-wider">{b.category}</Badge>
                        <Link href={`/article/${b.id}`}>
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 line-clamp-2 hover:underline group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{b.title}</h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                            <FaRegClock className="size-2.5" /> {b.readTime}
                          </span>
                          <button onClick={() => removeBookmark(b.id)} className="text-zinc-300 hover:text-rose-500 dark:text-zinc-700 dark:hover:text-rose-500 transition-colors">
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

          {/* History tab */}
          {activeTab === "History" && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Reading History</h2>
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
                {HISTORY.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <Badge className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none font-bold uppercase tracking-wider">{item.category}</Badge>
                      <Link href={`/article/${item.id}`}>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:underline group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{item.title}</p>
                      </Link>
                      <p className="text-[10px] text-zinc-400 font-medium">{item.time}</p>
                    </div>
                    <FaChevronRight className="size-3 text-zinc-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
