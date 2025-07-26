import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Link as LinkIcon, Mail, Lock, User, Chrome , Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, registerSchema, validateJoi, type LoginForm, type RegisterForm } from "@/lib/validation/auth";
import toast from "react-hot-toast";
import { useLogin } from "@/hooks/auth/useLogin";
import { useRegister } from "@/hooks/auth/useRegister";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/auth";
import { AUTH_MESSAGES } from "@/constants/messages";
import { useGoogleCodeLogin } from "@/hooks/auth/useGoogleCodeLogin";
import { useGoogleLogin } from '@react-oauth/google';

const Auth = () => {
  const { mutate: loginMutate, isPending: loginLoading } = useLogin();
  const { mutate: registerMutate, isPending: registerLoading } = useRegister();
  const { mutate: googleMutate } = useGoogleCodeLogin();
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [form, setForm] = useState<{
    login: LoginForm;
    register: RegisterForm;
  }>({
    login: { email: "", password: "" },
    register: { name: "", email: "", password: "" },
  });
    
  const handleChange = (
    type: "login" | "register",
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };
  
  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((msg) => toast.error(msg));
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: ({ code }) => {
      googleMutate({ code });
    },
    onError: (error) => {
      console.error("Google auth error:", error);
      toast.error("Google auth failed");
    },
    scope: "openid email profile",
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    // Add these to handle COOP issues
    ux_mode: "popup",
    select_account: true,
  });

  const handleAuth = async (type: "login" | "register") => {
    const data = form[type];
    const schema = type === "login" ? loginSchema : registerSchema;
    const { errors } = validateJoi(schema, data);

    if (errors) {
        showValidationErrors(errors);
        return;
    }

    if (type === "login") {
        loginMutate(data, {
        onSuccess: (res) => {
            console.log('This is the login  response :',res)
            toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
            navigate('/');
        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data?.message || AUTH_MESSAGES.LOGIN_ERROR);
        },
        });
    } else {
        registerMutate(data as RegisterForm, {
        onSuccess: (res) => {
            console.log('This is the register  response :',res)
            toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);
            sessionStorage.setItem("verifyEmail", data.email);
            navigate('/verify-otp');
        },
         onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data?.message || AUTH_MESSAGES.REGISTER_ERROR);
        },
        });
    }
    };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 grid-bg opacity-20"></div>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>

      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Logo */}
        <Link to="/">
          <div className="flex cursor-pointer items-center justify-center space-x-2 mb-8">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <LinkIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-shimmer">LinkGuard</span>
          </div>
        </Link>

        <Card className="glass animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12"
                        value={form.login.email}
                        onChange={(e) =>
                          handleChange("login", "email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12"
                        value={form.login.password}
                        onChange={(e) =>
                          handleChange("login", "password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-primary hover:text-primary-light"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    variant="premium"
                    size="lg"
                    className="w-full"
                    onClick={() => handleAuth("login")}
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 h-12"
                        value={form.register.name}
                        onChange={(e) =>
                          handleChange("register", "name", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12"
                        value={form.register.email}
                        onChange={(e) =>
                          handleChange("register", "email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12"
                        value={form.register.password}
                        onChange={(e) =>
                          handleChange("register", "password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowRegisterPassword(!showRegisterPassword)
                        }
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary-light"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary-light"
                    >
                      Privacy Policy
                    </a>
                  </div>

                  <Button
                    variant="premium"
                    size="lg"
                    className="w-full"
                    onClick={() => handleAuth("register")}
                    disabled={registerLoading}
                  >
                    {registerLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-6">
                <Button variant="outline" className="h-12 w-full" onClick={() => googleLogin()}>
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Enterprise SSO available for team plans.{" "}
              <a href="#" className="text-primary hover:text-primary-light">
                Contact sales
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Secured with enterprise-grade JWT authentication
        </div>
      </div>
    </div>
  );
};

export default Auth;