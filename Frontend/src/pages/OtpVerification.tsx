import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Clock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useVerifyOtp } from "@/hooks/auth/useVerifyOtp";
import { useResendOtp } from "@/hooks/auth/useResendOtp";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/auth";
import { AUTH_MESSAGES } from "@/constants/messages";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); 
  const navigate = useNavigate();
  
  const email = sessionStorage.getItem("verifyEmail");
  
  const { mutate: verifyOtp, isPending: isVerifying, } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending, } = useResendOtp();
    

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

   const handleVerify = () => {
    if (!email) {
      toast.error(AUTH_MESSAGES.EMAIL_MISSING);
      return;
    }
    if (otp.length !== 6) {
      toast.error(AUTH_MESSAGES.INVALID_OTP);
      return;
    }

    verifyOtp(
      { email, otp },
      {
        onSuccess: (res) => {
          toast.success(res.message ??  AUTH_MESSAGES.OTP_SUCCESS);
          navigate("/auth");
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data?.message || AUTH_MESSAGES.OTP_VERIFY_ERROR);
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!email) {
      toast.error(AUTH_MESSAGES.EMAIL_MISSING);
      return;
    }
    resendOtp(
      { email },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? AUTH_MESSAGES.OTP_RESEND_SUCCESS);
          setTimeLeft(120);
          setOtp("");
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data?.message || AUTH_MESSAGES.OTP_RESEND_ERROR);
        },
      }
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                We've sent a 6-digit verification code to your email address. Enter it below to verify your account.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="gap-3"
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg font-semibold border-2 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary transition-colors" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg font-semibold border-2 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary transition-colors" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg font-semibold border-2 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary transition-colors" />
                  </InputOTPGroup>
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg font-semibold border-2 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary transition-colors" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg font-semibold border-2 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary transition-colors" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg font-semibold border-2 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary transition-colors" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {timeLeft > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Expires in {formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            <Button 
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full"
              variant="premium"
              size="lg"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </Button>

            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Didn't receive the code?
              </div>
              
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={timeLeft > 0 || isResending}
                className="text-primary hover:text-primary-dark"
              >
                {isResending ? "Resending..." : "Resend OTP"}
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

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? Contact our{" "}
            <Link to="/support" className="text-primary hover:text-primary-dark underline">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;