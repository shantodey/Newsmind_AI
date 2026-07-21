"use client";

import { useSession, authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaUser, FaCircleCheck, FaPen } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/server";
import { Input } from "@base-ui/react/input";
import { toast } from "sonner";

export function AccountDetails() {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (user) {
            reset({ name: user.name, email: user.email });
            setPhotoUrl(user.image || null);
        }
    }, [user, reset]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const body = new FormData();
        body.append("image", file);
        
        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMG_UPLOAD_API}`, { method: "POST", body });
            const data = await res.json();
            if (data?.data?.url) {
                setPhotoUrl(data.data.url);
                toast.success("Image uploaded!");
            }
        } catch {
            toast.error("Upload failed.");
        }
    };

const onSubmit = async (data: any) => {
    if (!user?.id) {
        toast.error("User ID not found");
        return;
    }
    
    const res = await updateProfile(user.id, data.name, data.email, photoUrl);
    
    if (res.success) {
        toast.success("Profile updated successfully!");
    } else {
        toast.error(res.message || "Failed to update profile.");
    }
};

    return (
        <div className="w-full p-8">
            <div className="max-w-6xl mx-auto bg-white border border-slate-200/80 rounded-xl shadow-sm p-8 grid md:grid-cols-12 gap-10">
                <div className="md:col-span-4 space-y-6">
                    <div>
                        <h3 className="font-semibold text-slate-800 text-base mb-4">Account Management</h3>
                        <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center space-y-4 bg-slate-50/50">
                            <div className="w-full h-72 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                                <img 
                                  height={400} 
                                  width={400} 
                                  src={photoUrl || "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"} 
                                  alt="Profile" 
                                  className="w-full h-full object-cover" 
                                />
                            </div>
                            <label className="w-full">
                                <div className="w-full flex items-center justify-center inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer text-center">
                                    Upload Photo
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-8">
                    <h3 className="font-semibold text-slate-800 text-base mb-4">Profile Information</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Full Name</label>
                                <Input {...register("name")} className="border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-400 h-11" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Email (required)</label>
                                <Input {...register("email")} type="email" className="border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-400 h-11" />
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100 flex justify-center">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-lg font-medium">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}