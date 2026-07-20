"use client";

import { useState } from "react";
import Link from "next/link";
import { Cross, Menu, X, ArrowRight, BookOpen, Layers, Monitor, Rocket } from "lucide-react";
import { GithubIcon } from "@/components/landing/github-icon";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Cross className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-foreground">OpenEHR Bridge</span>
            <span className="ml-2 hidden rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary sm:inline-block">
              v0.1 Enterprise
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex text-sm font-medium text-muted-foreground">
          <Link href="/#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#workflow" className="transition-colors hover:text-foreground">
            Workflow
          </Link>
          <Link href="/architecture" className="flex items-center gap-1 transition-colors hover:text-foreground">
            <Layers className="h-3.5 w-3.5" />
            Architecture
          </Link>
          <Link href="/docs" className="flex items-center gap-1 transition-colors hover:text-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Documentation
          </Link>
          <Link href="/screenshots" className="flex items-center gap-1 transition-colors hover:text-foreground">
            <Monitor className="h-3.5 w-3.5" />
            Screenshots
          </Link>
          <Link href="/docs/deployment-guide" className="flex items-center gap-1 transition-colors hover:text-foreground">
            <Rocket className="h-3.5 w-3.5" />
            Deployment
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/Abhishek1106kr/ehr-core"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button size="sm" asChild className="gap-1.5 shadow-sm">
            <Link href="/dashboard">
              Launch App
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-muted-foreground hover:text-foreground"
            >
              Workflow
            </Link>
            <Link
              href="/architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-muted-foreground hover:text-foreground"
            >
              Architecture
            </Link>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-muted-foreground hover:text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="/screenshots"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-muted-foreground hover:text-foreground"
            >
              Screenshots
            </Link>
            <Link
              href="/docs/deployment-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-muted-foreground hover:text-foreground"
            >
              Deployment Guide
            </Link>
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-border">
              <Button asChild className="w-full justify-center">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  Launch App
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-center gap-2">
                <a
                  href="https://github.com/Abhishek1106kr/ehr-core"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub Repository
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
