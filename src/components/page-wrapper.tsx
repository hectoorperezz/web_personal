"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  
  // Admin pages should use full width
  const isAdminPage = pathname.startsWith("/admin");
  
  return (
    <div
      className={cn(
        isAdminPage 
          ? "min-h-screen" 
          : "max-w-2xl mx-auto py-12 sm:py-24 px-6"
      )}
    >
      {children}
    </div>
  );
}