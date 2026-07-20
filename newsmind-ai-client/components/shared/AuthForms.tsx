"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaRegLightbulb, FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth-client";
import { syncExpressAuth } from "@/lib/server";
import { uploadToImageBB } from "@/lib/imagebb";

type LoginValues = { email: string; password: string };
type RegisterValues = { name: string; email: string; password: string; confirm: string };

// ─── Shared auth layout ───────────────────────────────────────────────────────
function AuthLayout({ children, title, subtitle }: {
  children: React.ReactNode; title: string; subtitle: string;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.15),transparent)]" />
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 text-zinc-900 shadow-sm">
            <FaRegLightbulb className="size-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            NewsMind<span className="text-teal-400">.AI</span>
          </span>
        </Link>
        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl font-bold text-white leading-snug">
              &ldquo;Read Less.<br />Understand More.&rdquo;
            </p>
            <footer className="text-zinc-400 text-sm font-medium">
              — Your AI-powered news intelligence platform
            </footer>
          </blockquote>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "2.4M+", label: "Articles Analyzed" },
              { num: "98%", label: "Accuracy Rate" },
              { num: "180+", label: "News Sources" },
              { num: "50K+", label: "Active Users" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-lg font-extrabold text-teal-400">{s.num}</p>
                <p className="text-xs text-zinc-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-4 text-xs text-zinc-500 font-medium">
          <span>🔒 End-to-end encrypted</span>
          <span>·</span><span>GDPR compliant</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <FaRegLightbulb className="size-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              NewsMind<span className="text-teal-600">.AI</span>
            </span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{title}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Shared text input ────────────────────────────────────────────────────────
function FormInput({ icon, error, ...props }: {
  icon: React.ReactNode; error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <span className="absolute top-1/2 -translate-y-1/2 left-3.5 text-zinc-400 pointer-events-none">{icon}</span>
        <input
          className={`w-full h-11 rounded-lg border pl-10 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${error ? "border-rose-400 dark:border-rose-600" : "border-zinc-200 dark:border-zinc-700"
            }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const router = useRouter();
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>();

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    setServerError("");
    const { error } = await signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    });
    if (error) {
      setServerError(error.message || "Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      try {
        const result = await syncExpressAuth("login", undefined, data.email, data.password);
        if (result) {
          localStorage.setItem("newsmind_token", result.token);
          localStorage.setItem("newsmind_user", JSON.stringify(result.user));
        }
      } catch (err) {
        console.error("Express login error:", err);
      }
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400">
          {serverError}
        </div>
      )}
      <FormInput
        icon={<FaEnvelope className="size-4" />} type="email" placeholder="your@email.com"
        error={errors.email?.message}
        {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
      />
      <div className="space-y-1.5">
        <div className="relative">
          <span className="absolute top-1/2 -translate-y-1/2 left-3.5 text-zinc-400 pointer-events-none"><FaLock className="size-4" /></span>
          <input
            type={showPass ? "text" : "password"} placeholder="Password"
            className={`w-full h-11 rounded-lg border pl-10 pr-11 text-sm font-medium text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${errors.password ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
          />
          <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            {showPass ? <FaEyeSlash className="size-4" /> : <FaEye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs font-medium text-rose-500">{errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">
          <input type="checkbox" className="rounded border-zinc-300" /> Remember me
        </label>
        <Link href="#" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-11 font-bold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
        <div className="relative flex justify-center"><span className="bg-zinc-50 dark:bg-zinc-950 px-3 text-xs font-semibold text-zinc-400">OR CONTINUE WITH</span></div>
      </div>
      <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full h-11 font-bold rounded-lg border-zinc-200 dark:border-zinc-700 cursor-pointer flex items-center justify-center gap-2">
        <FaGoogle className="size-4 text-rose-500" /> Continue with Google
      </Button>
      <p className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-teal-600 dark:text-teal-400 hover:underline font-bold">Sign up free</Link>
      </p>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm() {
  const router = useRouter();
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string>("");
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterValues>();
  const password = watch("password");

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    setServerError("");
    let avatarUrl = "";
    if (avatarFile) {
      try {
        avatarUrl = await uploadToImageBB(avatarFile);
      } catch (err: any) {
        console.error("Avatar upload failed:", err);
        setServerError(err.message || "Failed to upload profile picture.");
        setLoading(false);
        return;
      }
    }

    const { error } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      image: avatarUrl,
      callbackURL: "/dashboard",
    });
    if (error) {
      setServerError(error.message || "Could not create account. Please try again.");
      setLoading(false);
    } else {
      try {
        const result = await syncExpressAuth("register", data.name, data.email, data.password, avatarUrl);
        if (result) {
          localStorage.setItem("newsmind_token", result.token);
          localStorage.setItem("newsmind_user", JSON.stringify(result.user));
        }
      } catch (err) {
        console.error("Express register error:", err);
      }
      router.push("/dashboard");
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400">
          {serverError}
        </div>
      )}
      <FormInput icon={<FaUser className="size-4" />} type="text" placeholder="Full name"
        error={errors.name?.message}
        {...register("name", { required: "Name is required", minLength: { value: 2, message: "At least 2 characters" } })}
      />

      {/* Profile picture upload */}
      <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-3">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Profile Picture (Optional)</label>
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="size-full object-cover" />
            ) : (
              <FaUser className="size-5 text-zinc-400" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
            className="text-xs font-semibold file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-950/30 dark:file:text-teal-400 text-zinc-500 cursor-pointer"
          />
        </div>
      </div>

      <FormInput icon={<FaEnvelope className="size-4" />} type="email" placeholder="your@email.com"
        error={errors.email?.message}
        {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
      />
      <div className="space-y-1.5">
        <div className="relative">
          <span className="absolute top-1/2 -translate-y-1/2 left-3.5 text-zinc-400 pointer-events-none"><FaLock className="size-4" /></span>
          <input type={showPass ? "text" : "password"} placeholder="Create a password (min 8 chars)"
            className={`w-full h-11 rounded-lg border pl-10 pr-11 text-sm font-medium text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${errors.password ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
            {...register("password", { required: "Password required", minLength: { value: 8, message: "Minimum 8 characters" } })}
          />
          <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors">
            {showPass ? <FaEyeSlash className="size-4" /> : <FaEye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs font-medium text-rose-500">{errors.password.message}</p>}
      </div>
      <FormInput icon={<FaLock className="size-4" />} type="password" placeholder="Confirm password"
        error={errors.confirm?.message}
        {...register("confirm", { required: "Please confirm", validate: (v) => v === password || "Passwords do not match" })}
      />
      <label className="flex items-start gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">
        <input type="checkbox" required className="rounded border-zinc-300 mt-0.5" />
        <span>I agree to the <Link href="#" className="text-teal-600 dark:text-teal-400 hover:underline">Terms</Link> and <Link href="#" className="text-teal-600 dark:text-teal-400 hover:underline">Privacy Policy</Link></span>
      </label>
      <Button type="submit" disabled={loading} className="w-full h-11 font-bold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
        <div className="relative flex justify-center"><span className="bg-zinc-50 dark:bg-zinc-950 px-3 text-xs font-semibold text-zinc-400">OR</span></div>
      </div>
      <Button type="button" variant="outline" onClick={handleGoogleSignUp} className="w-full h-11 font-bold rounded-lg border-zinc-200 dark:border-zinc-700 cursor-pointer flex items-center justify-center gap-2">
        <FaGoogle className="size-4 text-rose-500" /> Sign up with Google
      </Button>
      <p className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-teal-600 dark:text-teal-400 hover:underline font-bold">Sign in</Link>
      </p>
    </form>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────
export function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your NewsMind AI account.">
      <LoginForm />
    </AuthLayout>
  );
}

export function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Join 50,000+ users getting smarter news insights with AI.">
      <RegisterForm />
    </AuthLayout>
  );
}
