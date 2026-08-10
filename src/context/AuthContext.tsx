"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  getLoggedInPlayer,
} from "@/lib/auth";

import type { Player } from "@/types";

type AuthContextType = {
  player: Player | null;
  isLoading: boolean;
  refreshPlayer: () => void;
};

const AuthContext = createContext<AuthContextType>({
  player: null,
  isLoading: true,
  refreshPlayer: () => {},
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [player, setPlayer] =
    useState<Player | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  function refreshPlayer() {
    setPlayer(getLoggedInPlayer());
  }

  useEffect(() => {
    refreshPlayer();
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        player,
        isLoading,
        refreshPlayer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}