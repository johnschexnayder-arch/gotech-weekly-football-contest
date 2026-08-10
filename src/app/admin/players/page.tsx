"use client";

import { useEffect, useState } from "react";

import {
  getPlayers,
  createPlayer,
  deletePlayerCascade,
  resetPlayerPin,
} from "@/lib/players";


type Player = {
  id: string;
  name: string;
  email: string | null;
  pin: string;
};



export default function PlayersAdminPage() {

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [pin, setPin] =
    useState("");

  const [loading, setLoading] =
    useState(true);



  async function loadPlayers() {

    const data =
      await getPlayers();

    setPlayers(data);

    setLoading(false);

  }





  useEffect(() => {

    loadPlayers();

  }, []);





  async function handleCreate() {

    if (!name || !pin) {

      alert(
        "Name and PIN are required."
      );

      return;

    }


    try {

      await createPlayer({
        name,
        email,
        pin,
      });


      setName("");

      setEmail("");

      setPin("");


      await loadPlayers();


    } catch (error) {

      console.error(
        "Create player failed:",
        error
      );


      alert(
        "Unable to create player."
      );

    }

  }





  async function handleResetPin(
    player: Player
  ) {

    const newPin =
      prompt(
        `Enter new 4 digit PIN for ${player.name}:`
      );


    if (!newPin) {

      return;

    }


    try {

      await resetPlayerPin(
        player.id,
        newPin
      );


      alert(
        "PIN updated successfully."
      );


      await loadPlayers();


    } catch (error) {

      if (error instanceof Error) {

        alert(
          error.message
        );

      }

    }

  }





  async function handleDelete(
    player: Player
  ) {

    const confirmed =
      confirm(
        `Delete ${player.name} and all contest picks?`
      );


    if (!confirmed) {

      return;

    }


    try {

      await deletePlayerCascade(
        player.id
      );


      alert(
        "Player deleted successfully."
      );


      await loadPlayers();


    } catch (error) {

      console.error(
        "Delete player failed:",
        error
      );


      if (error instanceof Error) {

        alert(
          error.message
        );

      } else {

        alert(
          "Unable to delete player."
        );

      }

    }

  }





  if (loading) {

    return (

      <main className="p-6">

        Loading players...

      </main>

    );

  }





  return (

    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">


      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-8 text-white shadow-xl">


        <div className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">

          Commissioner Tools

        </div>


        <h1 className="mt-3 text-4xl font-black">

          Player Management

        </h1>


        <p className="mt-2 text-green-100">

          Add and manage contest participants.

        </p>


      </section>





      <section className="rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl">


        <h2 className="mb-5 text-2xl font-black text-green-950">

          Add Player

        </h2>


        <div className="grid gap-4 md:grid-cols-3">


          <input
            className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 font-semibold text-green-950 outline-none focus:border-yellow-400"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


          <input
            className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 font-semibold text-green-950 outline-none focus:border-yellow-400"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          <input
            className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 font-semibold text-green-950 outline-none focus:border-yellow-400"
            placeholder="PIN"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value)
            }
          />


        </div>


        <button
          onClick={handleCreate}
          className="mt-5 rounded-xl border-2 border-yellow-400 bg-green-950 px-7 py-3 font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-green-900"
        >

          Add Player

        </button>


      </section>





      <section className="rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl">


        <h2 className="mb-5 text-2xl font-black text-green-950">

          Players

        </h2>


        <div className="space-y-3">


          {players.map((player) => (

            <div
              key={player.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-5 transition hover:border-yellow-400/40"
            >


              <div>

                <p className="text-lg font-black text-green-950">

                  {player.name}

                </p>


                <p className="text-sm font-medium text-slate-500">

                  {player.email ?? "No email"}

                </p>


              </div>





              <div className="flex items-center gap-3">


                <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-900">

                  PIN: ****

                </span>



                <button
                  onClick={() =>
                    handleResetPin(player)
                  }
                  className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-green-950 transition hover:bg-yellow-400"
                >

                  Reset PIN

                </button>



                <button
                  onClick={() =>
                    handleDelete(player)
                  }
                  className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
                >

                  Delete

                </button>


              </div>


            </div>

          ))}


        </div>


      </section>


    </main>

  );

}