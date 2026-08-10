"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Mail,
  KeyRound,
  ArrowRight,
} from "lucide-react";

import {
  loginPlayer,
  saveLoggedInPlayer,
} from "@/lib/auth";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { refreshPlayer } = useAuth();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const player = await loginPlayer(
        email,
        pin
      );

      saveLoggedInPlayer(player);

      refreshPlayer();

      router.push("/picks");

      router.refresh();

    } catch {
      setError(
        "Invalid email or PIN"
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="flex min-h-[70vh] items-center justify-center">

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-yellow-400/30 bg-white shadow-2xl">

        <div className="h-1 bg-gradient-to-r from-green-900 via-yellow-500 to-green-900" />

        <div className="p-10">

          <div className="mb-10 text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-900 to-green-700 shadow-xl ring-4 ring-yellow-400/25">

              <Trophy className="h-10 w-10 text-yellow-400" />

            </div>


            <h1 className="text-3xl font-black tracking-tight text-green-950">
              GOTECH Football Contest
            </h1>


            <p className="mt-3 text-sm text-slate-500">
              Sign in to make your weekly picks.
            </p>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-green-900">

                <Mail className="h-4 w-4" />

                Email

              </label>


              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="john@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold text-slate-800 outline-none transition-all focus:border-yellow-400 focus:bg-white"
              />

            </div>


            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-green-900">

                <KeyRound className="h-4 w-4" />

                PIN

              </label>


              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value)
                }
                placeholder="1234"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold text-slate-800 outline-none transition-all focus:border-yellow-400 focus:bg-white"
              />

            </div>


            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}


            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-900 via-green-800 to-green-700 px-6 py-4 font-bold uppercase tracking-wide text-white shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login
                  <ArrowRight className="h-5 w-5" />
                </>
              )}

            </button>

          </form>


          <div className="mt-6 space-y-3 text-center text-sm">

            <Link
              href="/register"
              className="font-bold text-green-900 hover:text-green-700"
            >
              Create Account
            </Link>


            <div>
              <Link
                href="/forgot-pin"
                className="font-semibold text-slate-500 hover:text-green-900"
              >
                Forgot PIN?
              </Link>
            </div>

          </div>


          <div className="mt-8 border-t border-slate-200 pt-6 text-center">

            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Celebrating 45 Years
            </p>


            <p className="mt-2 text-sm font-semibold text-green-900">
              Civil Engineering • Land Surveying • Construction Inspection
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}