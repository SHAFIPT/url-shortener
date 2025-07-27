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
  Copy,
  Check,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  QrCode,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { savePendingUrl } from "@/utils/pendingUrl";
import { useShortenUrl } from "@/hooks/url/useShortenUrl";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { useLogout } from "@/hooks/auth/useLogout";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/auth";

const LandingPage = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
     const navigate = useNavigate();
    const logoutMutation = useLogout();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const { mutate: shortenUrl, isPaused } = useShortenUrl();

  const handleShortenClick = () => {
    if (!url) return;

      if (!isAuthenticated) {
        toast.error('Please login to shorten your URL.');
        savePendingUrl(url);
        navigate('/auth');
        return;
      }


    shortenUrl(
      { longUrl: url },
      {
        onSuccess: (data) => {
        toast.success('Short URL created successfully!');
        setShortenedUrl(data.shortUrl); 
        setShowResult(true);            
        },
        onError: (err: AxiosError<ApiError>) => {
          const message =
            err?.response?.data?.message || 'Failed to shorten URL.';
          toast.error(message);
        },
      }
    );
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
    

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast.success("Shortened URL copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err)
      toast.success("Please copy the URL manually.");
    }
  };

  const handleReset = () => {
    setUrl("");
    setShortenedUrl("");
    setShowResult(false);
    setCopied(false);
  };



  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 grid-bg opacity-30"></div>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>

      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-white/10 shadow-premium">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur opacity-75"></div>
                <div className="relative p-3 rounded-xl bg-gradient-primary shadow-premium">
                  <LinkIcon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-shimmer tracking-tight">
                  LinkSpark Pro
                </span>
                <span className="text-xs text-accent/80 font-medium tracking-widest uppercase">
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
                  className="text-foreground/90 hover:text-foreground hover:bg-accent/10 font-semibold tracking-wide"
                >
                  Features
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-foreground/90 hover:text-foreground hover:bg-accent/10 font-semibold tracking-wide"
                >
                  Pricing
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-foreground/90 hover:text-foreground hover:bg-accent/10 font-semibold tracking-wide"
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
                      className="border-2 border-border hover:bg-accent/10 hover:border-accent font-semibold px-6"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button
                      variant="premium"
                      size="sm"
                      className="px-8 py-2.5"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* User Profile Dropdown */}
                  <div className="flex items-center space-x-2 glass px-3 py-2 rounded-lg hover:bg-accent/10 transition-all duration-200 cursor-pointer">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground">{user?.name || "User"}</span>
                      <span className="text-xs text-muted-foreground">Pro Plan</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Quick Actions */}
                  <Link to="/dashboard">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-2 border-primary/30 hover:bg-primary/30 hover:border-primary/50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-400 border-red-500/30 hover:bg-red-500/40 hover:border-red-500/50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Logout</span>
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
            className="mb-6 px-4 py-2 text-sm font-medium animate-bounce-in glass"
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
          {!showResult ? (
            <Card className="glass max-w-2xl mx-auto mb-12 animate-scale-in shadow-premium">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter your long URL here..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-14 text-lg bg-background/50 border-border/50 focus:border-primary"
                      onKeyDown={(e) => e.key === 'Enter' && handleShortenClick()}
                    />
                  </div>
                  <Button
                    variant="premium"
                    size="lg"
                    onClick={handleShortenClick}
                    disabled={!url || isPaused}
                    className={isPaused ? "pulse-glow" : ""}
                  >
                    {isPaused ? "Shortening..." : "Shorten URL"}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3 text-left">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Free tier: 100 URLs per day. Enterprise plans available.
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Result Display */
            <Card className="glass max-w-3xl mx-auto mb-12 animate-scale-in shadow-premium glow-primary">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-primary shadow-premium">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-shimmer">
                  Your Link is Ready! 🎉
                </CardTitle>
                <CardDescription className="text-base">
                  Your URL has been successfully shortened and is ready to share
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {/* Original URL */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Original URL:
                  </label>
                  <div className="glass p-3 rounded-lg border border-border/30">
                    <p className="text-sm text-foreground/80 truncate">{url}</p>
                  </div>
                </div>

                {/* Shortened URL */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Shortened URL:
                  </label>
                  <div className="flex items-center space-x-3 glass p-4 rounded-lg border-2 border-primary/30">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-primary break-all">
                        {shortenedUrl}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopy}
                        className="border-primary/20 hover:bg-primary/50"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(shortenedUrl, '_blank')}
                        className="border-primary/30 hover:bg-primary/50"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="premium"
                    size="lg"
                    onClick={handleCopy}
                    className="flex-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-primary/30 hover:bg-primary/50"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-primary/30 hover:bg-primary/50"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Create Another */}
                <div className="mt-6 pt-6 border-t border-border/30">
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="w-full hover:bg-accent/50"
                  >
                    Create Another Short Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feature Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Requests/min</div>
            </div>
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold text-warning mb-2">30 Days</div>
              <div className="text-sm text-muted-foreground">URL Lifespan</div>
            </div>
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold text-success mb-2">100+</div>
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
                  <Zap className="h-6 w-6 text-white" />
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
                  <Shield className="h-6 w-6 text-white" />
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
                  <BarChart3 className="h-6 w-6 text-white" />
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
                  <Clock className="h-6 w-6 text-white" />
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
                  <Globe className="h-6 w-6 text-white" />
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
                  <Users className="h-6 w-6 text-white" />
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
          <Card className="glass p-12 shadow-premium">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg mb-8">
                Join thousands of developers and teams using LinkSpark Pro for their
                URL shortening needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="premium" size="xl">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button variant="outline" size="xl" className="border-primary/30 hover:bg-primary/10">
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
      <footer className="relative z-10 border-t border-border/20 glass">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <LinkIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">LinkSpark Pro</span>
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
            © 2024 LinkSpark Pro. Built with precision for modern applications.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;