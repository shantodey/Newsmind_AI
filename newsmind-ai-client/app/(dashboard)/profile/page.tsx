"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, 
  Bookmark, 
  PenLine,
  CheckCircle2, 
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  FileText,
  Eye,
  Heart,
  Users,
  ShieldAlert,
  Layers
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { getArticleStats } from "@/lib/actions/articles";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileHistory } from "./ProfileHistory";
import { AccountDetails } from "./ProfileForm";
import { ContributorCard } from "./ContributorCard";
import { AdminQuickActions, AdminUserTable } from "./AdminSections";
import { NewArticleContent } from "./NewArticleContent";
import { ManageArticlesContent } from "./ManageArticlesContent";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const sessionUser = session?.user;

  const [profileOverride, setProfileOverride] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("Profile");
  const [historyCount, setHistoryCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  // Real backend platform metrics for admin
  const [platformStats, setPlatformStats] = useState<{
    totalArticles: number;
    totalPublished: number;
    totalDraft: number;
    totalViews: number;
    totalLikes: number;
  } | null>(null);

  const profileUser = profileOverride ?? sessionUser;
  
  // Real database-backed role from session
  const userRole = (profileUser as any)?.role || "user";
  const isAdmin = userRole === "admin";
  const isJournalist = userRole === "journalist";

  useEffect(() => {
    if (isAdmin) {
      getArticleStats()
        .then((stats) => {
          if (stats) setPlatformStats(stats);
        })
        .catch((err) => console.error("Error fetching admin stats:", err));
    }
  }, [isAdmin]);

  // Loading Skeleton State to avoid layout flash
  if (isPending) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] text-[#14213D] pb-16">
        <section className="border-b border-[#E2E8F0] bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="size-20 sm:size-24 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-48 bg-slate-100 rounded" />
                  <div className="h-4 w-32 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-16 w-32 bg-slate-100 rounded-xl" />
                <div className="h-16 w-32 bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const roleDisplay = isAdmin 
    ? "Admin" 
    : isJournalist
    ? "Journalist"
    : userRole === "creator"
    ? "Contributor"
    : "Reader";

  const initials = profileUser?.name
    ? profileUser.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  // Tab configurations per role
  type ProfileTabItem = { id: string; label: string; icon: any; badge?: number };

  const tabs: ProfileTabItem[] = isAdmin 
    ? [
        { id: "Profile", label: "Profile", icon: UserIcon },
        { id: "Users", label: "Users", icon: Users },
        { id: "Write", label: "Write Article", icon: PenLine },
        { id: "Manage", label: "Manage Articles", icon: Layers },
      ]
    : isJournalist
    ? [
        { id: "Profile", label: "Profile", icon: UserIcon },
        { id: "Write", label: "Write Article", icon: PenLine },
        { id: "Bookmarks", label: "Bookmarks", icon: Bookmark, badge: bookmarksCount },
        { id: "History", label: "History", icon: BookOpen, badge: historyCount },
      ]
    : [
        { id: "Profile", label: "Profile", icon: UserIcon },
        { id: "Bookmarks", label: "Bookmarks", icon: Bookmark, badge: bookmarksCount },
        { id: "History", label: "History", icon: BookOpen, badge: historyCount },
      ];

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#14213D] pb-16">
      {/* ─── Shared Profile Overview Hero ─── */}
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left: User Identity */}
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                <Avatar className="size-20 sm:size-24 border-2 border-white shadow-md ring-2 ring-slate-100">
                  <AvatarImage
                    src={profileUser?.image || ""}
                    alt={profileUser?.name || "User Avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className={`text-xl font-bold ${
                    isAdmin 
                      ? "bg-purple-50 text-purple-700" 
                      : "bg-[#EFF6FF] text-[#2563EB]"
                  }`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => setActiveTab("Profile")}
                  aria-label="Edit Profile"
                  title="Edit Profile"
                  className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
                >
                  <PenLine className="size-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#14213D]">
                    {profileUser?.name || "User"}
                  </h1>
                  
                  {/* Role Badge */}
                  <Badge className={`${
                    isAdmin 
                      ? "bg-purple-100 text-purple-800 border-purple-200" 
                      : "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                  } text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
                    {isAdmin && <ShieldCheck className="size-3 text-purple-700" />}
                    <span>{roleDisplay}</span>
                  </Badge>

                  {/* Verification indicator */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0D9488] bg-[#F0FDFA] border border-teal-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="size-3 text-[#0D9488]" />
                    Verified
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                  {profileUser?.email || "No email linked"}
                </p>

                <p className="text-xs text-[#64748B] pt-0.5 flex items-center gap-1.5">
                  {isAdmin ? (
                    <>
                      <ShieldAlert className="size-3.5 text-purple-600" />
                      <span>Full system access and editorial administration privileges.</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5 text-blue-500" />
                      <span>Your personal space for reading and discovering stories.</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Conditional Hero Statistics Cards */}
            {isAdmin ? (
              /* Administrator Real Backend Platform Metrics */
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white shadow-2xs min-w-[120px]">
                  <div className="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-[#14213D] leading-none">
                      {platformStats?.totalPublished ?? 0}
                    </p>
                    <p className="text-xs text-[#64748B] font-medium mt-1">
                      Articles Published
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white shadow-2xs min-w-[120px]">
                  <div className="size-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Eye className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-[#14213D] leading-none">
                      {platformStats?.totalViews ?? 0}
                    </p>
                    <p className="text-xs text-[#64748B] font-medium mt-1">
                      Total Views
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white shadow-2xs min-w-[120px]">
                  <div className="size-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-[#14213D] leading-none">
                      {platformStats?.totalLikes ?? 0}
                    </p>
                    <p className="text-xs text-[#64748B] font-medium mt-1">
                      Total Likes
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular User Statistics Cards */
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div 
                  onClick={() => setActiveTab("History")}
                  className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-teal-200 hover:bg-slate-50 transition-all shadow-2xs min-w-[120px] sm:min-w-[130px]"
                >
                  <div className="size-10 rounded-lg bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-[#14213D] leading-none">
                      {historyCount}
                    </p>
                    <p className="text-xs text-[#64748B] font-medium mt-1">
                      Reading History
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("Bookmarks")}
                  className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-blue-200 hover:bg-slate-50 transition-all shadow-2xs min-w-[120px] sm:min-w-[130px]"
                >
                  <div className="size-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Bookmark className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-[#14213D] leading-none">
                      {bookmarksCount}
                    </p>
                    <p className="text-xs text-[#64748B] font-medium mt-1">
                      Saved Stories
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ─── Horizontal Navigation Tabs Bar (No Sidebar) ─── */}
        <div className="border-t border-[#E2E8F0] bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 px-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                      isActive
                        ? "border-[#2563EB] text-[#2563EB]"
                        : "border-transparent text-[#64748B] hover:text-[#14213D] hover:border-slate-300"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Container ─── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Tab: Shared AccountDetails + Role-specific Secondary Card */}
        {activeTab === "Profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <AccountDetails
                onProfileUpdated={(updated) => {
                  setProfileOverride((prev: any) => ({
                    ...prev,
                    ...sessionUser,
                    ...updated,
                  }));
                }}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              {isAdmin ? (
                /* Admin Quick Access Summary in Profile Tab */
                <AdminQuickActions />
              ) : (
                /* Regular User Contributor Callout */
                <ContributorCard />
              )}
            </div>
          </div>
        )}

        {/* Bookmarks (user + journalist) */}
        {!isAdmin && activeTab === "Bookmarks" && (
          <div className="max-w-4xl mx-auto">
            <ProfileBookmarks onCountChange={setBookmarksCount} />
          </div>
        )}

        {!isAdmin && activeTab === "History" && (
          <div className="max-w-4xl mx-auto">
            <ProfileHistory onCountChange={setHistoryCount} />
          </div>
        )}

        {/* Write Article (journalist + admin) */}
        {(isJournalist || isAdmin) && activeTab === "Write" && (
          <div className="max-w-6xl mx-auto">
            <NewArticleContent />
          </div>
        )}

        {/* Admin Only Tabs */}
        {isAdmin && activeTab === "Users" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <AdminUserTable />
          </div>
        )}

        {isAdmin && activeTab === "Manage" && (
          <div className="max-w-6xl mx-auto">
            <ManageArticlesContent />
          </div>
        )}

      </div>

    </main>
  );
}