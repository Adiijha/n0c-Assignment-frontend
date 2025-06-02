import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="w-full text-white shadow-md py-4 px-6 flex justify-between items-center border-b-4 border-purple-900 rounded-b-3xl bg-black/90 backdrop-blur-lg">
      <Link href="/">
        <p className="text-2xl font-bold tracking-wide cursor-pointer hover:text-gray-400 transition-colors duration-300">
          n0c tech
        </p>
      </Link>
      <nav className="space-x-6">
        <Link href="/signin">
          <button className="px-7 py-2 border cursor-pointer border-gray-600 rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Sign In
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-7 py-2 cursor-pointer bg-purple-600 rounded-full hover:bg-purple-700 transition-all duration-300">
            Sign Up
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
