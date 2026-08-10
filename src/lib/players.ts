import { supabase } from "@/lib/supabase";


export async function getPlayers() {

  const { data, error } =
    await supabase
      .from("players")
      .select("*")
      .order("name");


  if (error) {
    throw new Error(
      error.message
    );
  }


  return data ?? [];

}





export async function createPlayer(
  player: {
    name: string;
    email?: string;
    pin: string;
  }
) {

  const { data, error } =
    await supabase
      .from("players")
      .insert({
        name: player.name,
        email: player.email || null,
        pin: player.pin,
        is_admin: false,
      })
      .select()
      .single();


  if (error) {
    throw new Error(
      error.message
    );
  }


  return data;

}





export async function updatePlayer(
  id: string,
  player: {
    name: string;
    email?: string;
    pin: string;
  }
) {

  const { data, error } =
    await supabase
      .from("players")
      .update({
        name: player.name,
        email: player.email || null,
        pin: player.pin,
      })
      .eq("id", id)
      .select()
      .single();


  if (error) {
    throw new Error(
      error.message
    );
  }


  return data;

}





export async function resetPlayerPin(
  id: string,
  pin: string
) {

  const normalizedPin =
    String(pin).trim();


  if (!/^\d{4}$/.test(normalizedPin)) {
    throw new Error(
      "PIN must be exactly 4 digits"
    );
  }


  const { data, error } =
    await supabase
      .from("players")
      .update({
        pin: normalizedPin,
      })
      .eq("id", id)
      .select()
      .single();


  if (error) {
    throw new Error(
      error.message
    );
  }


  return data;

}





export async function deletePlayer(
  id: string
) {

  const { error } =
    await supabase
      .from("players")
      .delete()
      .eq("id", id);


  if (error) {
    throw new Error(
      error.message
    );
  }

}