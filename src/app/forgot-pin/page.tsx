"use client";

import Link from "next/link";
import {
  Trophy,
  UserRoundCog,
} from "lucide-react";


export default function ForgotPinPage() {


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

              Forgot PIN?

            </h1>


            <p className="mt-3 text-sm text-slate-500">

              For security, PIN resets are handled by the commissioner.

            </p>


          </div>





          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">


            <UserRoundCog className="mx-auto mb-4 h-8 w-8 text-green-900" />


            <p className="font-semibold text-green-950">

              Please contact the contest commissioner to reset your PIN.

            </p>


            <p className="mt-3 text-sm text-green-800">

              The commissioner can update your PIN from the admin dashboard.

            </p>


          </div>







          <div className="mt-8 text-center text-sm">


            <Link

              href="/login"

              className="font-semibold text-slate-500 hover:text-green-900"

            >

              Back to Login

            </Link>


          </div>



        </div>


      </section>


    </main>

  );

}