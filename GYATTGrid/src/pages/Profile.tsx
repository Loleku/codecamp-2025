import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaUser, FaEnvelope, FaCalendar, FaSignOutAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { Links } from "../constants/links";

interface DecodedToken {
  username: string;
  email: string;
  created_at?: string;
}


export const ProfilePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  useEffect(() => {
    const tl = gsap.timeline();

    if (containerRef.current && contentRef.current) {
      gsap.set(contentRef.current.children, {
        opacity: 0,
        y: 20,
      });

      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      ).fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  useEffect(() => {
    const getTokenFromCookies = () => {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : null;
    };

    const token = getTokenFromCookies();

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log(decoded.created_at)
        setUsername(decoded.username);
        setEmail(decoded.email);
        setCreatedAt(
          decoded.created_at
            ? new Date(decoded.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            : ""
        );
      } catch (err) {
        console.error("Błąd dekodowania tokena:", err);
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen pt-32 pb-10 bg-gradient-to-br from-[#051832] to-[#0a3865]"
    >
      <div ref={contentRef} className="container mx-auto px-4">
        <div className="bg-[#181818f5] rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <FaUser className="w-16 h-16 text-gray-400" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{username}</h1>
              <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-[#208EF3]" />
                {email}
              </p>
              <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                <FaCalendar className="text-[#208EF3]" />
                Member since: {createdAt}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
            <button className="w-full p-3 bg-gray-800 text-white rounded-lg text-left hover:bg-gray-700 transition-colors">
              Change Password
            </button>
            <button className="w-full p-3 bg-gray-800 text-white rounded-lg text-left hover:bg-gray-700 transition-colors">
              Email Preferences
            </button>
            <button className="w-full p-3 bg-red-900/50 text-red-400 rounded-lg text-left hover:bg-red-900/70 transition-colors">
              Delete Account
            </button>
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              to={Links.HOME}
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-[#208EF3] text-white rounded-lg hover:bg-[#0F518C] transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


