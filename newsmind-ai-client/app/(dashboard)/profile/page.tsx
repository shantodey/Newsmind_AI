"use client";

import { useState } from "react";
import { FaPen } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useSession } from "@/lib/auth-client";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileHistory } from "./ProfileHistory";
import { AccountDetails } from "./ProfileForm";

const TABS = ["Profile", "Bookmarks", "History"] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const { data: session } = useSession();
  const sessionUser = session?.user;
  const [profileOverride, setProfileOverride] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [historyCount, setHistoryCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const profileUser = profileOverride ?? sessionUser;

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
                    src={profileUser?.image || ""}
                    alt={profileUser?.name || "User Avatar"}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-zinc-200">
                    {profileUser?.name ? profileUser.name.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => setActiveTab("Profile")}
                  aria-label="Edit Profile"
                  className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-teal-500 text-white shadow-md hover:bg-teal-400 transition-colors"
                >
                  <FaPen className="size-3" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {profileUser?.name || "User"}
                </h1>
                <p className="text-zinc-400 text-sm font-medium">
                  {profileUser?.email || "No email provided"}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-[10px] font-bold uppercase tracking-widest">
                    Member
                  </Badge>
                </div>
              </div>

              <div className="flex gap-6 text-center pb-1">
                <div>
                  <p className="text-xl font-extrabold text-white">{historyCount}</p>
                  <p className="text-xs font-semibold text-zinc-400">History</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">{bookmarksCount}</p>
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
          {activeTab === "Profile" && (
            <AccountDetails
              // sessionUser={profileUser}
              // setProfileUser={setProfileOverride}
            />
          )}

          {activeTab === "Bookmarks" && (
            <ProfileBookmarks onCountChange={setBookmarksCount} />
          )}

          {activeTab === "History" && (
            <ProfileHistory onCountChange={setHistoryCount} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}