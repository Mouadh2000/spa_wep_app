import { useEffect } from "react";
import axios from "axios";

function SignOut() {
  useEffect(() => {
    const handleSignOut = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          await axios.post("http://localhost:8000/api/logout", null, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }

        // Remove tokens and user data from localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        window.location.href = "/authentication/sign-in";
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
      }
    };
    handleSignOut();
  }, []);

  return null;
}

export default SignOut;
