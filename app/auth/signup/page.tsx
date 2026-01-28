"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");

  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length > 6) strength += 1; // Length
    if (password.match(/[A-Z]/)) strength += 1; // Capital
    if (password.match(/[0-9]/)) strength += 1; // Number
    if (password.match(/[^A-Za-z0-9]/)) strength += 1; // Special char
    return strength;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "password") {
      setPasswordStrength(calculateStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Profile
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // 3. Save to Firestore (optional but recommended for user data)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
        createdAt: new Date(),
      });

      // 4. Redirect
      router.push("/chat");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save/Update user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date(),
      }, { merge: true });

      router.push("/chat");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-destructive";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength >= 3) return "bg-green-500";
    return "bg-muted";
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <Card className="border-none shadow-2xl bg-black/40 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Enter your details below to start your journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              placeholder="First Name"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              id="lastName"
              placeholder="Last Name"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-12 w-12 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-1">
              <div className="flex h-1 w-full overflow-hidden rounded-full bg-muted/20">
                <div
                  className={cn("h-full transition-all duration-300", getStrengthColor())}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {passwordStrength <= 1 ? "Weak" : passwordStrength === 2 ? "Medium" : "Strong"}
              </p>
            </div>
          )}

          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={formData.confirmPassword && !passwordsMatch ? "Passwords do not match" : undefined}
          />

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <Button type="submit" className="w-full relative overflow-hidden group" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="relative z-10">Create Account</span>
            )}
            {/* Ripple effect can be CSS based or simple hover state in the btn component */}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0f1419] px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={handleGoogleSignIn} disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" disabled={isLoading}>
            GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
