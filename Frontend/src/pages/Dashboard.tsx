import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Link as LinkIcon,
  Globe,
  Clock,
  Copy,
  ExternalLink,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/url/useDashboardStats";
import { useMyUrls } from "@/hooks/url/useMyUrls";
import Pagination from "@/components/Pagination";
import { useShortenUrl } from "@/hooks/url/useShortenUrl";
import { Link, useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const usage = stats?.dailyUsage ?? 0;
  const limit = stats?.dailyLimit ?? 1;
  const navigate = useNavigate();
  const percentUsed = (usage / limit) * 100;
  const [page, setPage] = useState(1);
  const limitPerPage = 5;
  const { data: urlData, isLoading: urlsLoading } = useMyUrls({
    page,
    limit: limitPerPage,
  });
  const urls = urlData?.data || [];
  const totalPages = urlData?.pagination.totalPages || 1;
  const { mutate: shortenUrl, isPending } = useShortenUrl();
  const [longUrlInput, setLongUrlInput] = useState("");


  const handleShorten = () => {
    if (!longUrlInput.trim()) return;

    shortenUrl(
      { longUrl: longUrlInput },
      {
        onSuccess: () => {
          setLongUrlInput("");    
          setPage(1);             
        },
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {statsLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {urlsLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {isPending && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-8">

           {/* Back Button */}
            <Button
              variant="outline"
              className="flex items-center space-x-2 mb-6"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your shortened URLs and analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                Premium Plan
              </Badge>
              <Link to='/'>
                <Button variant="premium">
                <LinkIcon className="h-4 w-4 mr-2" />
                Create Short URL
              </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Daily Usage */}
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Daily Usage
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {usage}/{limit}
                </div>
                <Progress value={percentUsed} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {limit - usage} URLs remaining today
                </p>
              </CardContent>
            </Card>

            {/* Total URLs */}
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total URLs
                </CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUrls}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            {/* Active URLs */}
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active URLs
                </CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeUrls}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.expiringSoon || 0} expiring this week
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Main Content Tabs */}
          <Tabs defaultValue="urls" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 lg:w-[400px]">
              <TabsTrigger value="urls">My URLs</TabsTrigger>
            </TabsList>

            <TabsContent value="urls" className="space-y-6">
              {/* Quick Create */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Create New Short URL</CardTitle>
                  <CardDescription>
                    Enter a URL to create a new shortened link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Input
                      value={longUrlInput}
                      onChange={(e) => setLongUrlInput(e.target.value)}
                      placeholder="https://example.com/your-long-url"
                      className="flex-1"
                    />
                    <Button variant="premium" onClick={handleShorten} disabled={isPending}>
                      {isPending ? "Shortening..." : "Shorten URL"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* URLs List */}
              <Card className="glass mt-6">
                <CardHeader>
                  <CardTitle>Your Shortened URLs</CardTitle>
                  <CardDescription>
                    Manage and track your shortened links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {urlsLoading ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Loading...
                      </div>
                    ) : urls.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No URLs found.
                      </div>
                    ) : (
                      urls.map((url) => {
                        const shortUrl = `${BASE_URL}/${url.shortCode}`;
                        return (
                          <div
                            key={url._id}
                            className="border border-border/50 rounded-lg p-4 hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="text-sm font-medium text-primary">
                                    {shortUrl}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(shortUrl)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <a
                                    href={shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </a>
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {url.longUrl}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(
                                      url.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <Badge variant="outline" className="text-xs">
                                Expires:{" "}
                                {new Date(url.expiresAt).toLocaleDateString()}
                              </Badge>
                              <div className="text-muted-foreground">
                                {url.isActive ? "Active" : "Inactive"}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="settings" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Rate Limiting</h3>
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div>
                        <div className="font-medium">Daily URL Limit</div>
                        <div className="text-sm text-muted-foreground">
                          Current: 100 URLs per day
                        </div>
                      </div>
                      <Button variant="outline">Upgrade Plan</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">URL Expiration</h3>
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div>
                        <div className="font-medium">Default Expiry</div>
                        <div className="text-sm text-muted-foreground">
                          URLs expire after 30 days
                        </div>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
