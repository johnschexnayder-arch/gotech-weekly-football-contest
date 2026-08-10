"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
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


  useEffect(() => {

    const player =
      getLoggedInPlayer();


    if (!player || !player.is_admin) {

      router.push("/login");

    }

  }, [router]);



  return (

    <div className="flex min-h-screen">


      <Sidebar />


      <div className="flex flex-1 flex-col">


        <Header />


        <main className="flex-1 p-8">

          {children}

        </main>


      </div>


    </div>

  );

}