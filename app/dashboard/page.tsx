"use client";

import Image from "next/image";
import target from "../assets/target.svg";
import starbucks from "../assets/starbucks.png";
import amazon from "../assets/amazon.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/supabaseClient";

// Mock deals data
const deals = [
  {
    id: 1,
    title: "Target Rewards",
    description: "5% cashback on your next purchase at Target based on your shopping history",
    image: target,
    savings: "$25"
  },
  {
    id: 2,
    title: "Starbucks Reward",
    description: "Free drink reward based on your frequent visits",
    image: starbucks,
    savings: "$6"
  },
  {
    id: 3,
    title: "Amazon Prime Deal",
    description: "Special discount on items from your wishlist",
    image: amazon,
    savings: "$30"
  }
];

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };
  // For infinite carousel: add clones
  const extendedDeals = [deals[deals.length - 1], ...deals, deals[0]];
  const [currentDeal, setCurrentDeal] = useState(1); // Start at first real deal
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  const nextDeal = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentDeal((prev) => prev + 1);
  };

  const prevDeal = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentDeal((prev) => prev - 1);
  };

  // Handle transition end for infinite loop
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentDeal === extendedDeals.length - 1) {
      setCurrentDeal(1);
    } else if (currentDeal === 0) {
      setCurrentDeal(extendedDeals.length - 2);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDragStart('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const end = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = dragStart - end;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextDeal();
      else prevDeal();
    }

    setIsDragging(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Here you would typically handle the file upload to your backend
    console.log("Files selected:", files);
    // TODO: Implement actual file upload and processing
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">TailorMade</div>
          <button
            onClick={handleSignOut}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>

          {/* Deals Carousel */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Personalized Deals</h2>
            <div className="relative">
              <div
                className="overflow-hidden relative rounded-xl"
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
              >
                <div
                  className={`flex ${isTransitioning ? 'transition-transform duration-300 ease-in-out' : ''}`}
                  style={{ transform: `translateX(-${currentDeal * 100}%)` }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {extendedDeals.map((deal, i) => (
                    <div
                      key={i === 0 ? 'clone-last' : i === extendedDeals.length - 1 ? 'clone-first' : deal.id}
                      className="w-full flex-shrink-0 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={deal.image}
                            alt={deal.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{deal.description}</p>
                          <div className="text-green-600 dark:text-green-400 font-semibold">
                            Potential savings: {deal.savings}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              <button
                onClick={prevDeal}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={nextDeal}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {deals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDeal(index + 1)}
                    className={`w-2 h-2 rounded-full transition-colors ${index + 1 === currentDeal ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bank Statement Upload */}
          <div className="max-w-xl mx-auto">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Connect Your Bank</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Upload your bank statements to get personalized deals and insights based on your spending habits.
              </p>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-600 dark:hover:border-blue-400 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpTrayIcon className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, CSV (max. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.csv"
                  onChange={handleFileUpload}
                  multiple
                />
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
