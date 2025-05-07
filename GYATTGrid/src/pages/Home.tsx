import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import background from "../assets/sl_031420_28950_10.jpg"
import { Links } from "../constants/links"

gsap.registerPlugin(ScrollTrigger);

export const HomePage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
        }
      );
    }

    if (phoneRef.current) {
      gsap.fromTo(
        phoneRef.current,
        {
          scale: 0.8,
          y: -100,
          opacity: 0,
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1.5,
          scrollTrigger: {
            trigger: phoneRef.current,
            start: "top 65%",
            end: "bottom 50%",
            scrub: true,
          },
          ease: "power2.out",
        }
      );
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".feature-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 50%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <div className="w-full h-full font-sans overflow-x-hidden bg-slate-800">
      <section
        ref={heroRef}
        className="relative flex items-center justify-center h-screen bg-transparent"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${background})`,
            filter: 'blur(2px)'
          }}
        />
        <div className="absolute inset-0 bg-blue-500 mix-blend-multiply opacity-60" />
        <div className="relative z-10 max-w-3xl text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md text-baloonBlue">
            MORE THAN <span className="text-logoYellow">PUZZLES</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 drop-shadow text-gray-400">
            GYATTGrid is an offline puzzle system that helps students practice algorithms, 
            debug code, and analyze their solutions – all without internet access.
          </p>
          <Link 
            to={Links.REGISTER} 
            className="hidden lg:block bg-gradient-to-r from-[#208EF3] to-[#0F518C] text-white px-5 py-3 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-500 ease-in-out shadow-md">
            Start your journey
          </Link>
        </div>
      </section>
      <section
        ref={phoneRef}
        className="relative min-h-[80vh] flex items-center justify-between px-12"
      >
        <div className="text-left">
          <h2 className="text-5xl font-bold text-[#0F518C] leading-snug">
          SOLVE PUZZLES <br />
            <span className="text-[#208EF3]">ANYTIME, ANYWHERE</span>
          </h2>
          <p className="text-gray-300 mt-4 max-w-lg">
            Stay updated with the most accurate and real-time weather updates.
            Plan your days better with advanced forecasts and instant alerts.
          </p>
        </div>
        <div className="relative w-[400px] h-[800px]">
          <img
            alt="Phone mockup"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      <section
        ref={cardsRef}
        className="relative py-20 text-center bg-gray-800 text-white"
      >
        <h2 className="text-4xl font-bold mb-4 text-logoBlue">Why Choose GYATTGrid?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Discover the features that make GYATTGrid your ideal offline coding companion. Practice smarter, 
            code better, and grow faster.
        </p>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 px-4">
          <div className="feature-card flex-1 bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-2 text-white">Instant Feedback</h3>
            <p className="text-gray-300">
                Run your code locally with real test cases and get immediate, insightful feedback.
            </p>
          </div>
          <div className="feature-card flex-1 bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-2 text-white">Offline Ready</h3>
            <p className="text-gray-300">
                No internet? No problem. Solve algorithmic challenges anywhere, anytime – 
                even on an airplane without Wi-Fi.
            </p>
          </div>
          <div className="feature-card flex-1 bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-2 text-white">Bug-Fixing Challenges</h3>
            <p className="text-gray-300">
                Improve your debugging skills by finding and fixing hidden errors in real code samples.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};