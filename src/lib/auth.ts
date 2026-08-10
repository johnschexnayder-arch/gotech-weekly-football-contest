import { supabase } from "@/lib/supabase";


export async function loginPlayer(
  email: string,
  pin: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedPin =
    String(pin).trim();


  const { data: player, error } =
    await supabase
      .from("players")
      .select("*")
      .eq("email", normalizedEmail)
      .single();


  if (error || !player) {
    throw new Error(
      "Invalid email or PIN"
    );
  }


  if (
    String(player.pin).trim() !==
    normalizedPin
  ) {
    throw new Error(
      "Invalid email or PIN"
    );
  }


  return player;
}





export async function registerPlayer(
  name: string,
  email: string,
  pin: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedPin =
    String(pin).trim();


  if (!name.trim()) {
    throw new Error(
      "Name is required"
    );
  }


  if (!normalizedEmail) {
    throw new Error(
      "Email is required"
    );
  }


  if (!/^\d{4}$/.test(normalizedPin)) {
    throw new Error(
      "PIN must be exactly 4 digits"
    );
  }


  const { data: existingPlayer } =
    await supabase
      .from("players")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();


  if (existingPlayer) {
    throw new Error(
      "An account with this email already exists"
    );
  }


  const { data, error } =
    await supabase
      .from("players")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        pin: normalizedPin,
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





export function saveLoggedInPlayer(
  player: any
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }


  localStorage.setItem(
    "gotech_player",
    JSON.stringify(player)
  );
}





export function getLoggedInPlayer() {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }


  const stored =
    localStorage.getItem(
      "gotech_player"
    );


  if (!stored) {
    return null;
  }


  return JSON.parse(stored);
}





export function logoutPlayer() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }


  localStorage.removeItem(
    "gotech_player"
  );
}