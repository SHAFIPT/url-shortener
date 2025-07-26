import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  MousePointer,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  const [dailyUsage] = useState(47); // out of 100
  const [urls] = useState([
    {
      id: 1,
      originalUrl: "https://www.example.com/very-long-url-that-needs-shortening",
      shortUrl: "https://lnkg.dev/abc123",
      clicks: 1247,
      createdAt: "2024-01-15",
      expiresAt: "2024-02-14"
    },
    {
      id: 2,
      originalUrl: "https://www.documentation.com/api/reference/guide",
      shortUrl: "https://lnkg.dev/def456",
      clicks: 892,
      createdAt: "2024-01-20",
      expiresAt: "2024-02-19"
    },
    {
      id: 3,
      originalUrl: "https://www.blog.com/ultimate-guide-to-everything",
      shortUrl: "https://lnkg.dev/ghi789",
      clicks: 2156,
      createdAt: "2024-01-22",
      expiresAt: "2024-02-21"
    }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your shortened URLs and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Premium Plan
            </Badge>
            <Button variant="premium">
              <LinkIcon className="h-4 w-4 mr-2" />
              Create Short URL
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Usage</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{dailyUsage}/100</div>
              <Progress value={dailyUsage} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {100 - dailyUsage} URLs remaining today
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">147</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,456</div>
              <p className="text-xs text-muted-foreground">
                +24% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active URLs</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                5 expiring this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="urls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="urls">My URLs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                    placeholder="https://example.com/your-long-url"
                    className="flex-1"
                  />
                  <Button variant="premium">
                    Shorten URL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* URLs List */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Your Shortened URLs</CardTitle>
                <CardDescription>
                  Manage and track your shortened links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {urls.map((url) => (
                    <div key={url.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="text-sm font-medium text-primary">{url.shortUrl}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(url.shortUrl)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {url.originalUrl}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MousePointer className="h-4 w-4" />
                            <span>{url.clicks.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{url.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="text-xs">
                          Expires: {url.expiresAt}
                        </Badge>
                        <div className="text-muted-foreground">
                          Active • {Math.floor(Math.random() * 30)} days remaining
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Click Analytics</CardTitle>
                  <CardDescription>URL performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Analytics chart would be displayed here</p>
                      <p className="text-sm">Integration with Chart.js or Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Clicks by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">United States</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-20" />
                        <span className="text-sm text-muted-foreground">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">United Kingdom</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={20} className="w-20" />
                        <span className="text-sm text-muted-foreground">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Canada</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={10} className="w-20" />
                        <span className="text-sm text-muted-foreground">10%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={5} className="w-20" />
                        <span className="text-sm text-muted-foreground">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      <div className="text-sm text-muted-foreground">Current: 100 URLs per day</div>
                    </div>
                    <Button variant="outline">Upgrade Plan</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">URL Expiration</h3>
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <div className="font-medium">Default Expiry</div>
                      <div className="text-sm text-muted-foreground">URLs expire after 30 days</div>
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
  );
};

export default Dashboard;