import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");

  console.log("Verify component rendered. Token:", token);

  useEffect(() => {
    console.log("useEffect running with token:", token);
    if (token) {
      console.log("calling apiiiiiii");
      axios
        .get(`http://localhost:8080/auth/verify-email?token=${token}`)
        .then((res) => {
          setMessage(res.data);
          console.log("Verification success:", res.data);

          setTimeout(() => {
            navigate("/login", {
              state: { message: "Email Verified. Now you can login!" },
            });
          }, 2000); // 2-second delay before redirect
        })
        .catch((err) => {
          if (err.response) {
            setMessage(err.response.data);
            console.log("Verification error response:", err.response.data);
          } else {
            setMessage("Verification failed. Try again later.");
            console.log("Verification error:", err);
          }
        });
    } else {
      setMessage("Invalid verification link.");
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-2xl font-semibold">{message}</h1>
    </div>
  );
};

export default Verify;
