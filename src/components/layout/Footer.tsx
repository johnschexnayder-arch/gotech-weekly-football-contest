"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-8 py-6">
      <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-500 md:flex-row md:text-left">
        <div>
          © {new Date().getFullYear()} GOTECH Weekly Football Contest
        </div>

        <div className="flex flex-col items-center gap-1 md:items-end">
          <div className="font-semibold text-green-900">
            Built for weekly football competition
          </div>

          <Link
            href="https://www.gotech-inc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-green-700 underline decoration-green-300 underline-offset-2 transition-colors hover:text-green-950"
          >
            Visit GOTECH, Inc.
          </Link>
        </div>
      </div>
    </footer>
  );
}