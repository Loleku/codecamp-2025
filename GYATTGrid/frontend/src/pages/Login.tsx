import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Links } from "../constants/links";
import axios from "axios";
import { useAuth } from "../context/authContext";

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    
    const navigate = useNavigate();

    const { setToken } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        try {
            const res = await axios.post("http://localhost:3001/login", {
                username,
                password,
            });

            if (res.data.message === "Zalogowano pomyślnie.") {
                if (res.data.token) {
                    setToken(res.data.token);
                }
                navigate('/');
            } else {
                alert("Błąd logowania");
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Nieprawidłowe dane logowania.");
        }
    };

    return (
        <div className="min-h-screen font-sans flex items-start justify-center bg-gradient-to-br from-[#072453] to-[#0F518C]">
            <div className="bg-[#181818eb] p-10 rounded-3xl w-full max-w-md text-center mt-25 mb-25">
                <h2 className="text-white text-2xl mb-5">
                    Login for <span className="text-[#208EF3]">GYATT</span><span className="text-[#0F518C]">Grid</span>
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
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 mt-7 rounded-lg bg-[#208EF3] text-white text-lg cursor-pointer hover:bg-[#0F518C] transition-colors"
                    >
                        Login
                    </button>
                    <p className="text-white mt-5">
                        Don't have an account?{" "}
                        <button onClick={() => handleSubmit} className="text-[#208EF3] no-underline">
                            Sign up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};
