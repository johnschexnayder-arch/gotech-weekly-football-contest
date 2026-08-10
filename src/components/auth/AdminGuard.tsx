"use client";

import {
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const {
    player,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!player) {
      router.replace("/login");
    }
  }, [
    player,
    isLoading,
    router,
  ]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-semibold text-slate-500">
          Loading...
        </div>
      </main>
    );
  }

  if (!player) {
    return null;
  }

  return <>{children}</>;
}