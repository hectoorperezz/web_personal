"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SplitEditor } from "@/components/split-editor";
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Search, 
  Calendar,
  Clock,
  BookOpen,
  Edit3,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Target,
  Save,
  Send,
  FilePenLine
} from "lucide-react";

interface Article {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
  };
  content: string;
}

interface Draft {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    savedAt: string;
    status: "draft";
  };
  content: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Article form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [message, setMessage] = useState("");
  
  // Article management state
  const [articles, setArticles] = useState<Article[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("articles");

  const handleAuth = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid password");
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/blog/list");
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await fetch("/api/blog/drafts/list");
      if (response.ok) {
        const data = await response.json();
        setDrafts(data);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
      fetchDrafts();
    }
  }, [isAuthenticated]);

  const handlePublish = async () => {
    if (!title || !summary || !content) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsPublishing(true);
    setMessage("");

    try {
      let url, method;
      
      if (editingDraft) {
        // Publishing a draft
        url = `/api/blog/drafts/${editingDraft}`;
        method = "POST";
      } else if (editingArticle) {
        // Editing existing article
        url = `/api/blog/${editingArticle}/edit`;
        method = "PUT";
      } else {
        // Creating new article
        url = "/api/blog/publish";
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          summary,
          content,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (editingDraft) {
          setMessage(`Draft published successfully! Slug: ${result.slug}`);
          fetchDrafts(); // Refresh drafts list
        } else {
          setMessage(`Article ${editingArticle ? 'updated' : 'published'} successfully! Slug: ${result.slug}`);
        }
        setTitle("");
        setSummary("");
        setContent("");
        setEditingArticle(null);
        setEditingDraft(null);
        fetchArticles(); // Refresh the articles list
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = (article: Article) => {
    setTitle(article.metadata.title);
    setSummary(article.metadata.summary);
    setContent(article.content);
    setEditingArticle(article.slug);
    setMessage("");
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${slug}/edit`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Article deleted successfully");
        fetchArticles(); // Refresh the articles list
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
    setEditingDraft(null);
    setTitle("");
    setSummary("");
    setContent("");
    setMessage("");
    setActiveTab("articles");
  };

  const handleSaveDraft = async () => {
    if (!title || !content) {
      setMessage("Title and content are required for draft");
      return;
    }

    setIsSavingDraft(true);
    setMessage("");

    try {
      const url = editingDraft 
        ? `/api/blog/drafts/${editingDraft}`
        : "/api/blog/drafts";
      
      const method = editingDraft ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          summary,
          content,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Draft ${editingDraft ? 'updated' : 'saved'} successfully! Slug: ${result.slug}`);
        fetchDrafts(); // Refresh the drafts list
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleEditDraft = (draft: Draft) => {
    setTitle(draft.metadata.title);
    setSummary(draft.metadata.summary);
    setContent(draft.content);
    setEditingDraft(draft.slug);
    setEditingArticle(null);
    setMessage("");
    setActiveTab("create");
  };

  const handlePublishDraft = async (slug: string) => {
    if (!confirm("Are you sure you want to publish this draft? It will be moved to published articles.")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/drafts/${slug}`, {
        method: "POST",
      });

      if (response.ok) {
        setMessage("Draft published successfully!");
        fetchArticles();
        fetchDrafts();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteDraft = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/drafts/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Draft deleted successfully");
        fetchDrafts();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.metadata.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrafts = drafts.filter(draft =>
    draft.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.metadata.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
        {/* Glassmorphism Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-foreground/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-foreground/4 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <Card className="w-full max-w-md relative backdrop-blur-xl bg-background/50 border border-border shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/50 backdrop-blur-sm rounded-2xl mb-4 border border-border">
                <BookOpen className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
              <p className="text-muted-foreground mt-2">Enter your password to access the dashboard</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className="h-12 text-center border-0 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              
              {authError && (
                <div className="text-sm text-red-400 text-center bg-red-500/10 backdrop-blur-sm p-3 rounded-lg border border-red-500/20">
                  {authError}
                </div>
              )}
              
              <Button 
                onClick={handleAuth} 
                className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 border-0"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-foreground/[0.02] to-transparent"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-foreground/[0.03] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-foreground/[0.02] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-foreground/[0.025] rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-foreground/[0.015] rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      {/* Header */}
      <div className="relative border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-border">
                  <BookOpen className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">Admin Panel - Hector Perez -</h1>
                  <p className="text-sm text-muted-foreground">Manage your blog articles</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-80 h-12 border-0 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button 
                onClick={() => {
                  setEditingArticle(null);
                  setEditingDraft(null);
                  setTitle("");
                  setSummary("");
                  setContent("");
                  setMessage("");
                  setActiveTab("create");
                }}
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8 relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 backdrop-blur-sm border border-border p-1.5 h-auto">
            <TabsTrigger value="articles" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-0">
              <FileText className="h-4 w-4" />
              <span>Articles</span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {filteredArticles.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-0">
              <FilePenLine className="h-4 w-4" />
              <span>Drafts</span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {filteredDrafts.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-0">
              <Edit3 className="h-4 w-4" />
              <span>{editingArticle || editingDraft ? "Edit" : "Create"}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-0">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6 mt-8">
            {filteredArticles.length === 0 ? (
              <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
                <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 bg-muted/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-foreground">
                    {searchTerm ? "No articles found" : "No articles yet"}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? `No articles match "${searchTerm}". Try a different search term.`
                      : "Get started by creating your first article and sharing your thoughts with the world."
                    }
                  </p>
                  <Button onClick={() => setActiveTab("create")} className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-medium px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Article
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredArticles
                  .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
                  .map((article) => (
                    <Card key={article.slug} className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl hover:bg-card/60 transition-all duration-300 group">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/30">
                                Published
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-foreground/80 transition-colors cursor-pointer">
                              {article.metadata.title}
                            </h3>
                            
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                              {article.metadata.summary}
                            </p>
                            
                            <div className="flex items-center space-x-8 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{article.metadata.publishedAt}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{Math.ceil(article.content.split(/\s+/).length / 200)} min read</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{article.content.split(/\s+/).length} words</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 ml-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleEdit(article);
                                setActiveTab("create");
                              }}
                              className="h-10 border-border bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted hover:border-border"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                              className="h-10 border-border bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted hover:border-border"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(article.slug)}
                              className="h-10 border-border bg-muted/50 backdrop-blur-sm text-foreground hover:bg-red-500/20 hover:border-red-500/30"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6 mt-8">
            {filteredDrafts.length === 0 ? (
              <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
                <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 bg-muted/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border">
                    <FilePenLine className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-foreground">
                    {searchTerm ? "No drafts found" : "No drafts yet"}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? `No drafts match "${searchTerm}". Try a different search term.`
                      : "Start writing and save drafts to continue your work later."
                    }
                  </p>
                  <Button onClick={() => setActiveTab("create")} className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-medium px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Draft
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredDrafts
                  .sort((a, b) => new Date(b.metadata.savedAt).getTime() - new Date(a.metadata.savedAt).getTime())
                  .map((draft) => (
                    <Card key={draft.slug} className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl hover:bg-card/60 transition-all duration-300 group">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                                Draft
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-foreground/80 transition-colors cursor-pointer">
                              {draft.metadata.title}
                            </h3>
                            
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                              {draft.metadata.summary || "No summary provided"}
                            </p>
                            
                            <div className="flex items-center space-x-8 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Save className="h-4 w-4" />
                                <span>Saved {new Date(draft.metadata.savedAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{Math.ceil(draft.content.split(/\s+/).length / 200)} min read</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{draft.content.split(/\s+/).length} words</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 ml-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDraft(draft)}
                              className="h-10 border-border bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted hover:border-border"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublishDraft(draft.slug)}
                              className="h-10 border-border bg-primary/10 backdrop-blur-sm text-primary hover:bg-primary/20 hover:border-primary/30"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Publish
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDraft(draft.slug)}
                              className="h-10 border-border bg-muted/50 backdrop-blur-sm text-foreground hover:bg-red-500/20 hover:border-red-500/30"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-8 mt-8">
            <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {editingDraft ? "Edit Draft" : editingArticle ? "Edit Article" : "Create New Article"}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-2">
                      {editingDraft ? `Editing draft: ${editingDraft}` : editingArticle ? `Editing: ${editingArticle}` : "Write something amazing for your readers"}
                    </p>
                  </div>
                  
                  {(editingArticle || editingDraft) && (
                    <Button variant="outline" onClick={handleCancelEdit} className="border-border bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted">
                      Cancel
                    </Button>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="title" className="text-sm font-medium text-foreground">
                        Title
                      </label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter a compelling title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-0 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring h-14 text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="summary" className="text-sm font-medium text-foreground">
                        Summary
                      </label>
                      <Input
                        id="summary"
                        type="text"
                        placeholder="Brief description of your article..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="border-0 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring h-14"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Content
                    </label>
                    <SplitEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Start writing your article..."
                      rows={28}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center space-x-4">
                      {message && (
                        <div className={`text-sm px-4 py-2 rounded-lg backdrop-blur-sm ${
                          message.includes("Error") 
                            ? "text-red-300 bg-red-500/20 border border-red-500/30" 
                            : "text-green-300 bg-green-500/20 border border-green-500/30"
                        }`}>
                          {message}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTitle("");
                          setSummary("");
                          setContent("");
                          setMessage("");
                        }}
                        className="border-border bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted h-12 px-6"
                      >
                        Clear
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft || !title || !content}
                        className="border-border bg-yellow-500/10 backdrop-blur-sm text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 h-12 px-6"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSavingDraft ? "Saving..." : (editingDraft ? "Update Draft" : "Save Draft")}
                      </Button>
                      <Button
                        onClick={handlePublish}
                        disabled={isPublishing || !title || !summary || !content}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 px-8 h-12 font-medium"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isPublishing ? "Publishing..." : (editingDraft ? "Publish Draft" : editingArticle ? "Update Article" : "Publish Article")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                      <p className="text-4xl font-bold text-foreground mt-3">{articles.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-muted/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-border">
                      <FileText className="h-7 w-7 text-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center mt-6 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">Published content</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Words</p>
                      <p className="text-4xl font-bold text-foreground mt-3">
                        {articles.reduce((acc, article) => acc + article.content.split(/\s+/).length, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-muted/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-border">
                      <Target className="h-7 w-7 text-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center mt-6 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">Words written</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Words/Article</p>
                      <p className="text-4xl font-bold text-foreground mt-3">
                        {articles.length > 0 ? Math.round(articles.reduce((acc, article) => acc + article.content.split(/\s+/).length, 0) / articles.length).toLocaleString() : 0}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-muted/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-border">
                      <Users className="h-7 w-7 text-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center mt-6 text-sm">
                    <span className="text-muted-foreground">~{articles.length > 0 ? Math.ceil((articles.reduce((acc, article) => acc + article.content.split(/\s+/).length, 0) / articles.length) / 200) : 0} min read time</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-8 text-foreground">Recent Articles</h3>
                  <div className="space-y-6">
                    {articles.length === 0 ? (
                      <p className="text-muted-foreground text-center py-12">No articles yet</p>
                    ) : (
                      articles
                        .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
                        .slice(0, 5)
                        .map((article) => (
                          <div key={article.slug} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {article.metadata.title}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{article.metadata.publishedAt}</span>
                                <span className="mx-2">•</span>
                                <span>{article.content.split(/\s+/).length} words</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleEdit(article);
                                setActiveTab("create");
                              }}
                              className="ml-4 h-10 w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-8 text-foreground">Content Overview</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-muted-foreground">Published Articles</span>
                      <span className="text-sm font-medium text-foreground">{articles.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-muted-foreground">Longest Article</span>
                      <span className="text-sm font-medium text-foreground">
                        {articles.length > 0 ? Math.max(...articles.map(a => a.content.split(/\s+/).length)).toLocaleString() : 0} words
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-muted-foreground">Shortest Article</span>
                      <span className="text-sm font-medium text-foreground">
                        {articles.length > 0 ? Math.min(...articles.map(a => a.content.split(/\s+/).length)).toLocaleString() : 0} words
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-muted-foreground">Total Reading Time</span>
                      <span className="text-sm font-medium text-foreground">
                        ~{Math.ceil(articles.reduce((acc, article) => acc + article.content.split(/\s+/).length, 0) / 200)} minutes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}