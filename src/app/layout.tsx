import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Globe, MapPin } from "lucide-react";
import { Toaster } from "sonner";

import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import AppHeader from "@/components/layout/AppHeader";
import { AuthProvider } from "@/context/AuthContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GOTECH Weekly Football Contest",
  description:
    "Weekly football picks competition and leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />

            <div className="football-page-shell flex min-h-screen flex-1 flex-col">
              <AppHeader />

              <main className="flex-1 px-8 py-8">
                {children}
              </main>

              <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-6 text-sm text-slate-600 lg:flex-row">
                  <div>
                    <div className="text-lg font-bold text-green-900">
                      GOTECH
                    </div>

                    <div className="mt-1">
                      Civil Engineering • Land Surveying • Construction Inspection
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      Celebrating 45 Years • Founded 1981
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <a
                      href="https://gotechinc.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition hover:text-green-900"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>

                    <a
                      href="https://facebook.com/gotechinc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-green-900"
                    >
                      Facebook
                    </a>

                    <a
                      href="https://linkedin.com/company/gotech-inc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-green-900"
                    >
                      LinkedIn
                    </a>
                  </div>

                  <div className="text-xs text-slate-500">
                    © {new Date().getFullYear()} GOTECH. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </div>

          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
          />
        </AuthProvider>
      </body>
    </html>
  );
}