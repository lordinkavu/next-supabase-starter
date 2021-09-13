import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "./supabaseClient";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const userContextValue = {
    session: session,
    user: user,
    signIn: (options) => supabase.auth.signIn(options),
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser must be used within UserContext provider");
  return context;
}
