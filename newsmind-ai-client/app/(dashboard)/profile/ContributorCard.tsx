"use client";

import { useState } from "react";
import { PenLine, CheckCircle2, Loader2, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/auth-client";
import { requestJournalist } from "@/lib/actions/user";

export function ContributorCard({
  isPendingReview = false,
}: {
  isPendingReview?: boolean;
}) {
  const { user } = useCurrentUser();
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(isPendingReview);

  // Already a journalist — hide the card entirely
  if (user?.role === "journalist" || user?.role === "admin") return null;

  const handleApply = async () => {
    if (!user?.id) return;
    setSubmitting(true);
    const res = await requestJournalist(user.id);
    setSubmitting(false);
    if (res.success) {
      setApplied(true);
      toast.success("Application submitted! The admin will review it.");
    } else {
      toast.error(res.error || "Failed to submit. Try again.");
    }
  };

  return (
    <Card className="border border-blue-200/80 bg-gradient-to-b from-[#EFF6FF] to-white shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="size-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
          <PenLine className="size-4" />
        </div>
        <CardTitle className="text-base font-bold text-[#14213D] leading-tight">
          Become a Journalist
        </CardTitle>
        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
          Join our editorial team and share your stories with thousands of readers.
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4">
        <div className="space-y-2.5 pt-1 border-t border-blue-100">
          {[
            { icon: BookOpen, text: "Submit your application" },
            { icon: Star,     text: "Admin reviews and approves" },
            { icon: CheckCircle2, text: "Start publishing articles" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-[#14213D]">
              <span className="size-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                {i + 1}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {applied ? (
          <div className="w-full py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4 text-amber-600" />
            <span>Application under review</span>
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleApply}
            disabled={submitting}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs h-9 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <PenLine className="size-3.5" />
            )}
            <span>{submitting ? "Submitting..." : "Apply to become a Journalist"}</span>
          </Button>
        )}

        <p className="text-[11px] text-[#64748B] text-center">
          Reviewed by our editorial team.
        </p>
      </CardContent>
    </Card>
  );
}

// Keep export so page.tsx doesn't break — ContributorApplicationDialog no longer needed
export function ContributorApplicationDialog() {
  return null;
}
