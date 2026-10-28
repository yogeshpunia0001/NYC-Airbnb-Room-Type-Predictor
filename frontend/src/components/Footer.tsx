"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "0505yogesh.p@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/yogeshpunia0001",
      handle: "yogeshpunia0001",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
      hoverStyle: "hover:text-white hover:border-white/30",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/yogeshkumar0001",
      handle: "in/yogeshkumar0001",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      hoverStyle: "hover:text-[#0A66C2] hover:border-[#0A66C2]/40",
    },
    {
      name: "Portfolio",
      url: "https://theyogeshpoonia.in",
      handle: "theyogeshpoonia.in",
      icon: <Globe className="w-4 h-4" />,
      hoverStyle: "hover:text-accent-cyan hover:border-accent-cyan/40",
    },
  ];

  return (
    <footer className="mt-20 border-t border-white/10 bg-dark-950/90 backdrop-blur-2xl pt-12 pb-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-airbnb-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Restructured 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-white/10">
          {/* Column 1: Brand & Project Info (5 cols) */}
          <div className="md:col-span-12 lg:col-span-5 space-y-3.5">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-glow shrink-0">
                <Image
                  src="/favicon.png"
                  alt="Yogesh Poonia"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white font-display block">
                  NYC Room Predictor
                </span>
                <span className="text-[11px] text-airbnb-coral font-medium">
                  The Yogesh Poonia &bull; AI Engineer
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Production-grade machine learning system classifying New York City Airbnb accommodations using tuned Random Forest pipelines and real-time geographic inference.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>48,895 Verified NYC Listings</span>
            </div>
          </div>

          {/* Column 2: Contact (3 cols) */}
          <div className="md:col-span-6 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-airbnb-coral" />
              <span>Contact</span>
            </h3>

            <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Email</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={`mailto:${email}`}
                className="text-xs font-mono font-bold text-white hover:text-airbnb-coral transition-colors break-all block"
              >
                {email}
              </a>
            </div>
          </div>

          {/* Column 3: Profiles (4 cols) */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Profiles</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between text-xs text-slate-300 transition-all ${item.hoverStyle} group`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-slate-300 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <div>
                      <span className="font-bold text-white block text-xs">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.handle}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tech Badges */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-slate-400 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Yogesh Poonia. All rights reserved.</span>
            <span className="hidden sm:inline">&bull;</span>
            <a
              href="https://theyogeshpoonia.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white underline decoration-white/20 transition-colors"
            >
              theyogeshpoonia.in
            </a>
          </div>

          {/* Stack Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
              Next.js 16
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
              Tailwind CSS v3
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
              FastAPI
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
              Scikit-Learn
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
              Docker
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
