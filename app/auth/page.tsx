"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Github } from "lucide-react";
import { useEffect } from "react";

export default function AuthPage() {
  const router = useRouter();
  const user = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    window.location.href = "/handler/oauth-callback?provider=google";
  };

  const handleGithubSignIn = async () => {
    window.location.href = "/handler/oauth-callback?provider=github";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PaperTrail
          </span>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to PaperTrail</CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full h-12"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
              Continue with Google
            </Button>
            
            <Button 
              onClick={handleGithubSignIn}
              variant="outline" 
              className="w-full h-12"
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
