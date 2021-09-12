import "../styles/globals.css";
import { useEffect, useState, useContext } from "react";
import UserContext from "../lib/userContext";
import { supabase } from "@supabase/supabase-js";
import Router from "next/router";

function MyApp({ Component, pageProps }) {
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
  }, [user]);

  async function signOut() {
    await supabase.auth.signOut();
    Router.push("/");
  }

  return (
    <UserContext.Provider value={{ user, signOut }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
