import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AUTH_MESSAGES } from "@/constants/messages";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(AUTH_MESSAGES.FORGOT_REQUIRED_EMAIL);
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error(AUTH_MESSAGES.FORGOT_INVALID_EMAIL);
      return;
    }

    forgotPassword(
      { email },
      {
        onSuccess: (res) => {
          setIsEmailSent(true);
          toast.success(res.message ?? AUTH_MESSAGES.FORGOT_SUCCESS);
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data?.message || AUTH_MESSAGES.FORGOT_ERROR);
        },
      }
    );
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="w-full max-w-md mx-auto animate-fade-in-up">
          <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-glow">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center shadow-accent">
                <Send className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  We've sent password reset instructions to <strong>{email}</strong>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to reset your password. The link will expire in 24 hours.
                </p>
                
                <Button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Send Another Email
                </Button>
              </div>

              <div className="flex items-center justify-center pt-4 border-t border-border/50">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full animate-shimmer"></div>
      </div>

      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-glow">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-primary">
              <KeyRound className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isPending}
                className="w-full"
                variant="premium"
                size="lg"
              >
                {isPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="flex items-center justify-center pt-6 border-t border-border/50 mt-6">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Remember your password?{" "}
            <Link to="/auth" className="text-primary hover:text-primary-dark underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;