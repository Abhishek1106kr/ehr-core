import Link from "next/link";
import { Cross, ShieldCheck, Heart } from "lucide-react";
import { GithubIcon } from "@/components/landing/github-icon";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Cross className="h-4 w-4" aria-hidden />
              </div>
              <span className="text-base font-bold text-foreground">OpenEHR Bridge</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Universal healthcare integration platform bridging modern AI agents, FHIR R4 standard servers, and legacy EHR portals.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>HIPAA & ABDM Interoperability Architecture</span>
            </div>
          </div>

          {/* Product & Docs Col */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Operations Dashboard
                </Link>
              </li>
              <li>
                <Link href="/automation" className="hover:text-foreground transition-colors">
                  Automation Engine
                </Link>
              </li>
              <li>
                <Link href="/fhir" className="hover:text-foreground transition-colors">
                  FHIR R4 Explorer
                </Link>
              </li>
              <li>
                <Link href="/browser-automation" className="hover:text-foreground transition-colors">
                  Browser Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Docs Col */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Documentation</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  Documentation Overview
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-foreground transition-colors">
                  High Level Architecture
                </Link>
              </li>
              <li>
                <Link href="/docs/developer-guide" className="hover:text-foreground transition-colors">
                  Developer Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference" className="hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs/deployment-guide" className="hover:text-foreground transition-colors">
                  Railway Deployment Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer & Community Col */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/Abhishek1106kr/ehr-core"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link href="/screenshots" className="hover:text-foreground transition-colors">
                  Screenshots Gallery
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Abhishek1106kr/ehr-core/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  MIT License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} OpenEHR Bridge. Designed for Confido Health Technical Audit.</p>
          <p className="mt-2 flex items-center gap-1 sm:mt-0">
            Engineered with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for Healthcare Interoperability.
          </p>
        </div>
      </div>
    </footer>
  );
}
