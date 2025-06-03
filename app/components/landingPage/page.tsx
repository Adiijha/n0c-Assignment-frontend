import Link from "next/link";
import { Zap, Factory, HardHat } from "lucide-react";

const LandingCenter: React.FC = () => {
  return (
    <div className="max-h-full  flex items-center justify-center bg-black px-4 py-20 sm:py-24">
      <main className="flex flex-col items-center justify-center max-w-6xl text-center space-y-6">
        <h2 className="text-4xl sm:text-6xl font-extrabold mb-2 leading-tight">
          Welcome to{" "}
          <span className="text-purple-500 highlight-animation">n0c tech</span>
        </h2>

        <p className="text-gray-400 text-sm sm:text-xl max-w-sm sm:max-w-xl md:max-w-3xl">
          Low Cost & Compact Carbon Capture & utilization solutions for a sustainable future.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 w-72 shadow-md flex flex-col items-center text-center">
            <Zap className="text-purple-500 mb-3" size={36} />
            <h3 className="text-white font-semibold text-xl mb-2">Coal Power Plant</h3>
            <p className="text-gray-400 text-sm">
              Efficient carbon capture to reduce emissions and increase plant sustainability.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 w-72 shadow-md flex flex-col items-center text-center">
            <Factory className="text-purple-500 mb-3" size={36} />
            <h3 className="text-white font-semibold text-xl mb-2">Cement Plant</h3>
            <p className="text-gray-400 text-sm">
              Innovative solutions to lower carbon footprint in cement production processes.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 w-72 shadow-md flex flex-col items-center text-center">
            <HardHat className="text-purple-500 mb-3" size={36} />
            <h3 className="text-white font-semibold text-xl mb-2">Steel Plant</h3>
            <p className="text-gray-400 text-sm">
              Advanced technologies for sustainable steel manufacturing and emission control.
            </p>
          </div>
        </div>

        <Link
          href="/signup"
          className="inline-block px-10 py-3 sm:px-12 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-semibold text-white text-base sm:text-lg hover:from-purple-700 hover:to-indigo-700 transition-shadow shadow-lg mt-6"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
};

export default LandingCenter;
