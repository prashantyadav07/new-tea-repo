import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TopRibbon from '@/components/TopRibbon';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <TopRibbon />
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
