import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Links } from "../constants/links";
import axios from "axios";

export const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const togglePasswordVisibility = () => setShowPassword(!showPassword);
        const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const username = (document.getElementById("username") as HTMLInputElement).value;
          const email = (document.getElementById("email") as HTMLInputElement).value;
          const password = (document.getElementById("password") as HTMLInputElement).value;
          const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
        
          if (validateForm(username, password, confirmPassword)) {
            try {
              const res = await axios.post("http://localhost:3001/register", {
                username,
                email,
                password,
              });
              alert(res.data.message);
            } catch (err: any) {
              alert(err.response?.data?.message || "Wystąpił błąd");
            }
          }
        };
        
  
          const validateForm = (username: string, password: string, confirmPassword: string) => {
            if (username.length < 3 || username.length > 10) {
              alert("Username must be between 3 and 10 characters.");
              return false;
            }
  
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            if (!passwordRegex.test(password)) {
              alert(
                "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character."
              );
              return false;
            }
  
            if (password !== confirmPassword) {
              alert("Passwords do not match.");
              return false;
            }
  
            return true;
          };

        return (
          <div className="min-h-screen font-sans flex items-start justify-center bg-gradient-to-br from-[#072453] to-[#0F518C]">
            <div className="bg-[#181818eb] p-10 rounded-3xl w-full max-w-md text-center mt-25 mb-25">
              <h2 className="text-white text-2xl mb-5">
                Register for <span className="text-[#208EF3]">GYATT</span><span className="text-[#0F518C]">Grid</span>
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-5 text-left">
                  <label htmlFor="username" className="block text-white mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Type in your username..."
                    required
                    className="w-full p-3 rounded-lg bg-white text-black outline-none"
                  />
                </div>
                <div className="mb-5 text-left">
                  <label htmlFor="email" className="block text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Type in your E-mail..."
                    required
                    className="w-full p-3 rounded-lg bg-white text-black outline-none"
                  />
                </div>
                <div className="mb-5 text-left">
                  <label htmlFor="password" className="block text-white mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Type in your password..."
                      required
                      className="w-[calc(100%-45px)] p-3 rounded-l-lg bg-white text-black outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-0 top-0 h-full w-[45px] bg-[#208EF3] text-white flex items-center justify-center rounded-r-lg hover:bg-[#0F518C] transition-colors"
                    >
                      {showPassword ? <FaEyeSlash/> : <FaEye/>}
                    </button>
                  </div>
                </div>
                <div className="mb-5 text-left">
                  <label htmlFor="confirm-password" className="block text-white mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      name="confirm-password"
                      placeholder="Type in your password again..."
                      required
                      className="w-[calc(100%-45px)] p-3 rounded-l-lg bg-white text-black outline-none"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-0 top-0 h-full w-[45px] bg-[#208EF3] text-white flex items-center justify-center rounded-r-lg hover:bg-[#0F518C] transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full p-3 mt-7 rounded-lg bg-[#208EF3] text-white text-lg cursor-pointer hover:bg-[#0F518C] transition-colors"
                >
                  Register
                </button>
                <p className="text-white mt-5">
                  Already have an account?{" "}
                  <Link to={Links.LOGIN} className="text-[#208EF3] no-underline">
                    Sign in
                  </Link>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Username must be between 3 and 10 characters.<br />
                  Password must be at least 8 characters long, contain at least one
                  uppercase letter, one digit, and one special character.
                </p>
              </form>
            </div>
          </div>
        );
  }
