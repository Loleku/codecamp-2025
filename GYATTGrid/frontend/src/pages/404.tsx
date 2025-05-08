import { Link } from "react-router-dom";
import { Links } from "../constants/links";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const NotFoundPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    if (containerRef.current && textRef.current) {
      // Initial state
      gsap.set(textRef.current.children, { 
        opacity: 0, 
        y: 20 
      });

      // Animation sequence
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      ).fromTo(
        textRef.current.children,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-[#072453] to-[#0F518C]">
      <div ref={textRef} className="text-center p-8">
        <h1 className="text-9xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">404</h1>
        <h2 className="text-4xl font-semibold mb-6">
          <span className="text-[#208EF3]">Page</span>{" "}
          <span className="text-white">Not</span>{" "}
          <span className="text-[#0F518C]">Found</span>
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={Links.HOME}
          className="inline-block px-8 py-3 rounded-lg bg-[#208EF3] text-white text-lg font-medium hover:bg-[#0F518C] transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};