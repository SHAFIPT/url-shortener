import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link as LinkIcon,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Globe,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import toast from "react-hot-toast";
import { useLogout } from "@/hooks/auth/useLogout";

const LandingPage = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const logoutMutation = useLogout();
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const handleShorten = async () => {
    if (!url) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };
  
   const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("persist:root");
        toast.success("Logged out successfully");
        navigate("/");
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      },
    });
    };
    

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 grid-bg opacity-30"></div>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>

 {/* Navigation */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-75"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-xl">
                  <LinkIcon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                  LinkGuard
                </span>
                <span className="text-xs text-purple-300/80 font-medium tracking-widest uppercase">
                  Premium Security
                </span>
              </div>
            </div>

            {/* Menu */}
            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/90 hover:text-white hover:bg-white/5 font-semibold tracking-wide"
                >
                  Features
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/90 hover:text-white hover:bg-white/5 font-semibold tracking-wide"
                >
                  Pricing
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/90 hover:text-white hover:bg-white/5 font-semibold tracking-wide"
                >
                  About
                </Button>
              </div>

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link to="/auth">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-6"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button
                      variant="premium"
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold px-8 py-2.5 shadow-2xl hover:shadow-purple-500/25"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="font-medium text-white/90 text-sm">{user?.name || "User"}</span>
                    </div>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-400 border-2 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 font-semibold"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium animate-bounce-in"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Advanced Rate Limiting & Analytics
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Professional <span className="text-shimmer">URL Shortener</span> for
            Modern Teams
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in-up">
            Secure, scalable, and smart. Create shortened links with
            enterprise-grade features including rate limiting, analytics, and
            JWT authentication. Built for high-performance applications.
          </p>

          {/* URL Shortener Input */}
          <Card className="glass max-w-2xl mx-auto mb-12 animate-scale-in">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter your long URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-14 text-lg bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                <Button
                  variant="premium"
                  size="lg"
                  onClick={handleShorten}
                  disabled={!url || isLoading}
                  className={isLoading ? "pulse-glow" : ""}
                >
                  {isLoading ? "Shortening..." : "Shorten URL"}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3 text-left">
                <Shield className="h-4 w-4 inline mr-1" />
                Free tier: 100 URLs per day. Enterprise plans available.
              </p>
            </CardContent>
          </Card>

          {/* Feature Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Requests/min</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">30 Days</div>
              <div className="text-sm text-muted-foreground">URL Lifespan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Daily Limit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for professional URL management at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass card-hover">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-primary w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Rate Limiting</CardTitle>
                <CardDescription>
                  Smart rate limiting with 100 URLs per day. Prevents abuse
                  while ensuring reliability.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass card-hover">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-secondary w-fit mb-4">
                  <Shield className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>JWT Authentication</CardTitle>
                <CardDescription>
                  Secure JWT tokens with refresh token support. Enterprise-grade
                  security standards.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass card-hover">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-accent w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Real-time analytics with geo-distribution, click tracking, and
                  performance metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass card-hover">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-primary w-fit mb-4">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Auto Expiry</CardTitle>
                <CardDescription>
                  URLs automatically expire after 30 days. Configurable
                  expiration for enterprise plans.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass card-hover">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-secondary w-fit mb-4">
                  <Globe className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Global CDN</CardTitle>
                <CardDescription>
                  Lightning-fast redirects with global edge locations. Sub-100ms
                  response times.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass card-hover">
              <CardHeader>
                <div className="p-3 rounded-lg bg-gradient-accent w-fit mb-4">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Collaborative workspace with role-based access control and
                  team analytics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass p-12">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg mb-8">
                Join thousands of developers and teams using LinkGuard for their
                URL shortening needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="premium" size="xl">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button variant="outline" size="xl">
                  View Documentation
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required. 14-day free trial with all features
                included.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/20 bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <LinkIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">LinkGuard</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/docs"
                className="hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <Link
                to="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground">
            © 2024 LinkGuard. Built with precision for modern applications.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage
