"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Type,
  Minus,
  Eye,
  Edit3,
  Maximize2,
} from "lucide-react";

interface SplitEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function SplitEditor({ value, onChange, placeholder, rows = 20 }: SplitEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
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

  const renderPreview = (markdown: string) => {
    // Enhanced markdown to HTML conversion
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h1>')
      // Bold, italic, strikethrough (handle nested formatting)
      .replace(/\*\*\*([^*]+)\*\*\*/gim, '<strong class="font-bold"><em class="italic">$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em class="italic">$1</em>')
      .replace(/~~([^~]+)~~/gim, '<del class="line-through opacity-70">$1</del>')
      // Code
      .replace(/```([a-zA-Z]*)\n([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm font-mono">$2</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary underline hover:text-primary/80 transition-colors">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" class="max-w-full h-auto rounded-lg my-4 shadow-sm" />')
      // Lists (improved)
      .replace(/^[\s]*[\*\-\+] (.+)$/gim, '<li class="ml-4 my-1">$1</li>')
      .replace(/^[\s]*\d+\. (.+)$/gim, '<li class="ml-4 my-1">$1</li>')
      // Blockquotes
      .replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2 rounded-r">$1</blockquote>')
      // Horizontal rule
      .replace(/^---+$/gim, '<hr class="border-border my-8" />')
      // Tables (basic support)
      .replace(/\|(.+)\|/gim, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        return '<tr>' + cells.map((cell: string) => `<td class="border border-border px-3 py-2">${cell}</td>`).join('') + '</tr>';
      })
      // Paragraphs and line breaks
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, '<br>');
  };

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
      action: () => insertMarkdown("* ", "", "list item"),
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

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <Card className="p-2 border-0 bg-card/50 backdrop-blur-sm border border-border">
        <div className="flex items-center justify-between">
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
          
          {/* View mode toggles */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 text-xs ${viewMode === 'edit' ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('edit')}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 text-xs ${viewMode === 'split' ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('split')}
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              Split
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 text-xs ${viewMode === 'preview' ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className={`flex ${viewMode === 'split' ? 'divide-x divide-border' : ''}`}>
          {/* Editor pane */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={viewMode === 'split' ? 'w-1/2' : 'w-full'}>
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Start writing your article in Markdown..."}
                rows={rows}
                className="font-mono text-sm leading-relaxed resize-none border-0 focus-visible:ring-0 p-4 bg-transparent rounded-none"
                style={{ minHeight: `${rows * 1.5}rem` }}
              />
            </div>
          )}
          
          {/* Preview pane */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={viewMode === 'split' ? 'w-1/2' : 'w-full'}>
              {value ? (
                <div 
                  className="p-4 prose prose-sm max-w-none dark:prose-invert overflow-y-auto"
                  style={{ minHeight: `${rows * 1.5}rem`, maxHeight: `${rows * 1.5}rem` }}
                  dangerouslySetInnerHTML={{ 
                    __html: `<p class="mb-4">${renderPreview(value)}</p>` 
                  }}
                />
              ) : (
                <div className="p-4 text-muted-foreground text-center flex items-center justify-center" style={{ minHeight: `${rows * 1.5}rem` }}>
                  <div>
                    <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nothing to preview yet. Start writing in the editor.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Word count */}
      <div className="text-xs text-muted-foreground text-right">
        {value.split(/\s+/).filter(word => word.length > 0).length} words • {value.length} characters
      </div>
    </div>
  );
}