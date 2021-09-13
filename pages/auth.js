import { useState } from "react";
import { useUser } from "../utils/useUser";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const { signIn, user, signOut } = useUser();
  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      const { user, session, error } = await signIn({ provider });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <button onClick={() => signOut()}>logout</button>;
  } else {
    return (
      <div>
        <div>
          <h2>Login</h2>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOAuthLogin("twitter");
              }}
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Login with twitter"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
