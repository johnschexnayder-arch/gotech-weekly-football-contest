"use client";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-8 py-6">
      <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 md:flex-row md:text-left">
        <div>
          © {new Date().getFullYear()} GOTECH Weekly Football Contest
        </div>

        <div className="font-semibold text-green-900">
          Built for weekly football competition
        </div>
      </div>
    </footer>
  );
}