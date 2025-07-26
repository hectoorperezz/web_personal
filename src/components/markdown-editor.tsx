"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Eye,
  Edit3,
  Type,
  Minus,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function MarkdownEditor({ value, onChange, placeholder, rows = 20 }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback((before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + 
      replacement + 
      after + 
      value.substring(end);
    
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertMarkdown('**', '**', 'bold text');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*', '*', 'italic text');
          break;
        case 'k':
          e.preventDefault();
          insertMarkdown('[', '](url)', 'link text');
          break;
        case '`':
          e.preventDefault();
          insertMarkdown('`', '`', 'code');
          break;
      }
    }
  }, [insertMarkdown]);

  const toolbarButtons = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertMarkdown("# ", "", "Heading 1"),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertMarkdown("## ", "", "Heading 2"),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertMarkdown("### ", "", "Heading 3"),
    },
    { divider: true },
    {
      icon: Bold,
      label: "Bold (Cmd+B)",
      action: () => insertMarkdown("**", "**", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic (Cmd+I)",
      action: () => insertMarkdown("*", "*", "italic text"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => insertMarkdown("~~", "~~", "strikethrough"),
    },
    {
      icon: Code,
      label: "Code (Cmd+`)",
      action: () => insertMarkdown("`", "`", "code"),
    },
    { divider: true },
    {
      icon: Link,
      label: "Link (Cmd+K)",
      action: () => insertMarkdown("[", "](url)", "link text"),
    },
    {
      icon: Image,
      label: "Image",
      action: () => insertMarkdown("![", "](image-url)", "alt text"),
    },
    { divider: true },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertMarkdown("- ", "", "list item"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertMarkdown("1. ", "", "list item"),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertMarkdown("> ", "", "quote"),
    },
    {
      icon: Minus,
      label: "Horizontal Rule",
      action: () => insertMarkdown("\n---\n", "", ""),
    },
  ];

  const renderPreview = (markdown: string) => {
    // Simple markdown to HTML conversion for preview
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/~~(.*)~~/gim, '<del>$1</del>')
      .replace(/`(.*)`/gim, '<code>$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\n/gim, '<br>');
  };

  return (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 backdrop-blur-sm border border-border p-1">
            <TabsTrigger value="write" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-0">
              <Edit3 className="h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-0">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <div className="text-xs text-muted-foreground">
            {value.split(/\s+/).filter(word => word.length > 0).length} words • {value.length} characters
          </div>
        </div>

        <TabsContent value="write" className="space-y-3 mt-3">
          {/* Toolbar */}
          <Card className="p-2 border-0 bg-card/50 backdrop-blur-sm border border-border">
            <div className="flex flex-wrap items-center gap-1">
              {toolbarButtons.map((button, index) => {
                if (button.divider) {
                  return <div key={index} className="w-px h-6 bg-border mx-1" />;
                }
                
                const Icon = button.icon!;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted border-0"
                    onClick={button.action}
                    title={button.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* Editor */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Start writing your article in Markdown..."}
              rows={rows}
              className="font-mono text-sm leading-relaxed resize-none border-0 focus-visible:ring-2 focus-visible:ring-ring p-4 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
              style={{ minHeight: `${rows * 1.5}rem` }}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-3">
          <Card className="p-6 min-h-96 border-0 bg-card/50 backdrop-blur-sm border border-border">
            {value ? (
              <div 
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-muted-foreground prose-blockquote:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
              />
            ) : (
              <div className="text-muted-foreground text-center py-12">
                <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nothing to preview yet. Start writing in the Write tab.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Markdown cheatsheet */}
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">Markdown Quick Reference</summary>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div><code className="text-muted-foreground"># H1</code> → Heading 1</div>
          <div><code className="text-muted-foreground">## H2</code> → Heading 2</div>
          <div><code className="text-muted-foreground">**bold**</code> → <strong>bold</strong></div>
          <div><code className="text-muted-foreground">*italic*</code> → <em>italic</em></div>
          <div><code className="text-muted-foreground">`code`</code> → <code>code</code></div>
          <div><code className="text-muted-foreground">[link](url)</code> → link</div>
          <div><code className="text-muted-foreground">- item</code> → bullet list</div>
          <div><code className="text-muted-foreground">&gt; quote</code> → blockquote</div>
        </div>
      </details>
    </div>
  );
}