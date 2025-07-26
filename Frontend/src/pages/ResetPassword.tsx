import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AUTH_MESSAGES } from "@/constants/messages";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/auth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();
  const { mutate: resetPassword, isPending } = useResetPassword();  
  const token = searchParams.get("token") ?? "";
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas,
      requirements: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasNonalphas
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(AUTH_MESSAGES.RESET_LINK_INVALID);
      return;
    }

    const { isValid } = validatePassword(formData.password);
    if (!isValid) {
      toast.error(AUTH_MESSAGES.RESET_PASSWORD_POLICY);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(AUTH_MESSAGES.RESET_PASSWORD_MISMATCH);
      return;
    }

    resetPassword(
      {token, newPassword: formData.password },
      {
        onSuccess: (res) => {
          setIsReset(true);
          toast.success(res.message ?? AUTH_MESSAGES.RESET_SUCCESS);
          navigate("/auth");
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data?.message || AUTH_MESSAGES.RESET_ERROR);
        },
      }
    );
  };

  const passwordValidation = validatePassword(formData.password);

  if (isReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-success/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="w-full max-w-md mx-auto animate-fade-in-up">
          <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-glow">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-success to-success-foreground rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-success">
                  Password Reset Complete!
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Your password has been successfully updated. You can now sign in with your new password.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Button
                onClick={() => navigate("/auth")}
                className="w-full"
                variant="premium"
                size="lg"
              >
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-4">
        <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-glow max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forgot-password">
              <Button className="w-full" variant="premium">
                Request New Reset Link
              </Button>
            </Link>
          </CardContent>
        </Card>
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
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Choose a strong password to secure your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg backdrop-blur-sm">
                    <p className="text-xs font-medium text-muted-foreground">Password Requirements:</p>
                    <div className="space-y-1">
                      {Object.entries({
                        minLength: "At least 8 characters",
                        hasUpperCase: "One uppercase letter",
                        hasLowerCase: "One lowercase letter", 
                        hasNumbers: "One number",
                        hasNonalphas: "One special character"
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full transition-colors ${
                            passwordValidation.requirements[key as keyof typeof passwordValidation.requirements]
                              ? 'bg-success' 
                              : 'bg-muted-foreground'
                          }`} />
                          <span className={
                            passwordValidation.requirements[key as keyof typeof passwordValidation.requirements]
                              ? 'text-success' 
                              : 'text-muted-foreground'
                          }>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit"
                disabled={isPending || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
                className="w-full"
                variant="premium"
                size="lg"
              >
                {isPending ? "Updating Password..." : "Update Password"}
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
            Having trouble?{" "}
            <Link to="/support" className="text-primary hover:text-primary-dark underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;