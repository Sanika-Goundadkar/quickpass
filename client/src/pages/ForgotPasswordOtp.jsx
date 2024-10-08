import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const ForgotPasswordOtp = () => {
  const email = localStorage.getItem("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("email") !== null;

  if (!isAuthenticated) {
    // alert("You must authenticate yourself");

    // Redirect the user to the login page if not authenticated
    navigate("/login", { replace: true });
    return null;
  }

  const handleChange = async (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add OTP verification logic here
    try {
      // console.log("email got from localStorage", email);

      const response = await axios.post("/api/verify-forgot-password-otp", {
        email,
        otp,
      });
      console.log(response);

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        alert("OTP verified successfully!");

        // console.log("Before removing email: ", localStorage.getItem("email"));
        // localStorage.removeItem(email);
        // console.log("After removing email: ", localStorage.getItem("email"));

        navigate("/verify-forgot-password-security-questions", { replace: true });
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Error verifying OTP");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-6 items-center justify-center rounded-lg w-80 mx-auto text-center">
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <p className="text-sm">OTP sent to your email: {email}</p>
          <h3 className="text-2xl my-1">Verify</h3>
          <h1 className="text-4xl my-1 font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text tracking-wide">
            OTP
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={otp}
                onChange={handleChange}
                maxLength="6"
                required={true}
                placeholder="Enter OTP"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white max-w-md"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-800 text-white py-2 px-4 rounded-md"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordOtp;
