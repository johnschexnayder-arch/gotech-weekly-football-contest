"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { getLoggedInPlayer } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    const player =
      getLoggedInPlayer();

    if (!player || !player.is_admin) {
      setIsAdmin(false);
      setCheckingAccess(false);
      router.replace("/login");
      return;
    }

    setIsAdmin(true);
    setCheckingAccess(false);
  }, [router]);

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="text-center">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-green-900">
            GOTECH
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-500">
            Checking access...
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen min-w-0">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}