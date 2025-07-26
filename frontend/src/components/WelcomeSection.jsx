import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getRandomQoute } from "../../Data/healthQuotes";

const WelcomeSection = ({ data }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [quote, setQuote] = useState(getRandomQoute());

  if (!data) return null;

  return (
    <div className="bg-white shadow-md rounded-xl px-3 py-4 sm:px-5 sm:py-6 max-w-2xl mx-4 sm:mx-auto mt-5 border relative">
      {/* Toggle Icon */}
      <button
        onClick={() => setShowWelcome(!showWelcome)}
        className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-800 transition"
      >
        {showWelcome ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          showWelcome
            ? "opacity-100 max-h-[500px]"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left leading-snug">
          Welcome back, {data.username}! 🥦
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-1 text-center sm:text-left leading-normal">
          Track your meals. Crush your goals. Stay consistent.
        </p>

        <p className="mt-4 italic text-sm text-gray-500 text-center">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;