"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PaperTrail
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/blog">
            <Button variant="ghost">Blog</Button>
          </Link>
          <Link href="/blog?category=design">
            <Button variant="ghost">Design</Button>
          </Link>
          <Link href="/blog?category=research">
            <Button variant="ghost">Research</Button>
          </Link>
          <Link href="/blog?category=software">
            <Button variant="ghost">Software</Button>
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col space-y-1 p-4">
            <Link href="/blog" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Blog
              </Button>
            </Link>
            <Link href="/blog?category=design" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Design
              </Button>
            </Link>
            <Link href="/blog?category=research" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Research
              </Button>
            </Link>
            <Link href="/blog?category=software" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Software
              </Button>
            </Link>
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex-1">
                <Button className="w-full">Dashboard</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
