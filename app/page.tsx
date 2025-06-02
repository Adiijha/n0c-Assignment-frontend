'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from "./store/authStore";
import LandingPage from './components/landingPage/page';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();


  useEffect(() => {

    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);


  return (
    <section className="bg-black h-screen w-full">
      <div className="text-lg text-white">
        <LandingPage />
      </div>
    </section>
  );
}
