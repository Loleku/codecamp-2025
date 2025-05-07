import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiSearch } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

type FormValues = {
  city: string;
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
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

  // Typowanie `onSubmit` jako `SubmitHandler<FormValues>`
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.city.trim()) {
      navigate(`/weather/${encodeURIComponent(data.city)}`);
    } else {
      alert("Please enter a valid city name.");
    }
  };

  return (
    <div className="w-full h-full font-sans overflow-x-hidden bg-slate-800">
      <section
        ref={heroRef}
        className="relative flex items-center justify-center h-screen bg-transparent"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            // backgroundImage: `u`,
          }}
        />
        <div className="absolute inset-0 bg-blue-500 mix-blend-multiply opacity-60" />
        <div className="relative z-10 max-w-3xl text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md text-baloonBlue">
            MORE THAN <span className="text-logoYellow">WEATHER</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 drop-shadow text-gray-400">
            Weatherly is a modern weather system that provides you with accurate
            weather information in your area.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-64 mx-auto"
          >
            <input
              type="text"
              placeholder="Check the weather (city)..."
              {...register("city", { required: "City name is required" })}
              className={`w-full h-12 rounded-full bg-black/50 backdrop-blur-sm text-white pl-12 pr-4 outline-none border-2 ${
                errors.city ? "border-red-500" : "border-white/30"
              } placeholder-white/70`}
            />
            <button
              type="submit"
              className="absolute left-3 top-3 w-6 h-6 text-white/70"
            >
              <FiSearch />
            </button>
            {errors.city && (
              <p className="text-red-500 text-sm mt-2">{errors.city.message}</p>
            )}
          </form>
        </div>
      </section>
      <section
        ref={phoneRef}
        className="relative min-h-[80vh] flex items-center justify-between px-12"
      >
        <div className="text-left">
          <h2 className="text-5xl font-bold text-white leading-snug">
            CHECK WEATHER <br />
            <span className="text-logoYellow">ANYWHERE</span>
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
        <h2 className="text-4xl font-bold mb-4 text-logoBlue">Why Choose Weatherly?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          Discover the features that make Weatherly your go-to weather
          application. Get real-time data, personalized forecasts, and much
          more.
        </p>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 px-4">
          <div className="feature-card flex-1 bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-2 text-logoYellow">Real-Time Updates</h3>
            <p className="text-gray-300">
              Stay informed with instant weather updates and alerts tailored to
              your location.
            </p>
          </div>
          <div className="feature-card flex-1 bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-2 text-logoYellow">Advanced Forecasts</h3>
            <p className="text-gray-300">
              Access 7-day forecasts with high accuracy and detailed weather
              patterns.
            </p>
          </div>
          <div className="feature-card flex-1 bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-2 text-logoYellow">Personalized Alerts</h3>
            <p className="text-gray-300">
              Receive notifications for extreme weather events and stay
              prepared.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};