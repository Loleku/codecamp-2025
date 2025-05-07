import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaUser, FaEnvelope, FaCalendar, FaSignOutAlt } from "react-icons/fa";

export const ProfilePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  useEffect(() => {
    const tl = gsap.timeline();

    if (containerRef.current && contentRef.current) {
      gsap.set(contentRef.current.children, { 
        opacity: 0, 
        y: 20 
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
          ease: "power2.out"
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-10 bg-gradient-to-br from-[#051832] to-[#0a3865]">
      <div ref={contentRef} className="container mx-auto px-4">
        <div className="bg-[#181818f5] rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
          {/* Profile info section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <FaUser className="w-16 h-16 text-gray-400" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">John Doe</h1>
              <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-[#208EF3]" />
                example@example.com
              </p>
              <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                <FaCalendar className="text-[#208EF3]" />
                Member since: May 2025
              </p>
            </div>
          </div>

          {/* Settings section */}
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

          {/* Logout button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-[#208EF3] text-white rounded-lg hover:bg-[#0F518C] transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};