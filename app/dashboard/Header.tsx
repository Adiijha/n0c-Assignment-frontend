"use client";

import React from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    logout();
    alert("Logged out!");
    router.push("/");
  };

  return (
    <header className="w-full text-white shadow-md py-4 px-6 flex justify-between items-center border-b-4 border-purple-900 rounded-b-3xl bg-black/30 backdrop-blur-sm">
      <Link href="/">
        <p className="text-2xl font-bold tracking-wide cursor-pointer hover:text-gray-400 transition-colors">
          n0c tech
        </p>
      </Link>

      <button
        onClick={handleLogout}
        className="text-lg flex items-center cursor-pointer gap-2 text-red-500 hover:text-red-400 font-semibold tracking-wide transition-colors duration-300"
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </header>
  );
};

export default Header;
