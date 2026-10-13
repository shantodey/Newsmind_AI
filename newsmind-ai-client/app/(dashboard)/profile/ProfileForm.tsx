"use client";

import { useCurrentUser, authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { 
  Camera, 
  CheckCircle2, 
  User, 
  Mail, 
  Save, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface AccountDetailsProps {
  onProfileUpdated?: (updatedData: { name: string; email: string; image?: string | null }) => void;
}

export function AccountDetails({ onProfileUpdated }: AccountDetailsProps) {
  const { user } = useCurrentUser();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name || "", email: user.email || "" });
      setPhotoUrl(user.image || null);
    }
  }, [user, reset]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMG_UPLOAD_API;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data?.data?.url) {
        setPhotoUrl(data.data.url);
        toast.success("Profile photo uploaded!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch {
      toast.error("Upload error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!user?.id) {
      toast.error("User session not found.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: data.name,
        image: photoUrl ?? undefined,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
      } else {
        toast.success("Profile updated successfully!");
        onProfileUpdated?.({ name: data.name, email: data.email, image: photoUrl });
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-[#E2E8F0] shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="border-b border-[#E2E8F0] bg-slate-50/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-[#14213D]">
              Profile Details
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Update your personal identity, avatar, and contact email.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC]">
            <div className="relative size-20 sm:size-22 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200 shrink-0">
              <img
                src={
                  photoUrl ||
                  user?.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"
                }
                alt="Avatar"
                className="size-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-semibold text-[#14213D]">
                Profile Photo
              </h4>
              <p className="text-xs text-[#64748B]">
                PNG, JPG or WebP recommended (max 5MB).
              </p>
              <div className="pt-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#14213D] hover:bg-slate-50 cursor-pointer shadow-xs transition-colors">
                  <Camera className="size-3.5 text-blue-600" />
                  <span>{isUploading ? "Uploading..." : "Change photo"}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <User className="size-3.5 text-slate-400" />
                Full Name
              </label>
              <Input
                {...register("name", { required: true })}
                placeholder="Jane Doe"
                className="h-10 text-sm border-[#E2E8F0] focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" />
                Email Address
              </label>
              <Input
                {...register("email", { required: true })}
                type="email"
                placeholder="name@example.com"
                className="h-10 text-sm border-[#E2E8F0] focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Email Verification status indicator */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-800 text-xs">
            <CheckCircle2 className="size-4 text-teal-600 shrink-0" />
            <span>
              Your account email is verified and securely linked to NewsMind AI.
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 h-10 rounded-lg font-semibold text-sm shadow-xs flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}