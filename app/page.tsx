"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">TailorMade</div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Features</a>
            <a href="#solutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Solutions</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</a>
          </div>
          <button 
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Solutions Tailored for You
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Experience the future of finance with our innovative platform that adapts to your unique needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg transition"
              >
                Start Your Journey
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 px-8 py-3 rounded-full text-lg transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TailorMade</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Analytics",
                description: "Get insights into your financial health with AI-powered analytics"
              },
              {
                title: "Secure Platform",
                description: "Bank-grade security to keep your finances safe and protected"
              },
              {
                title: "Personalized Solutions",
                description: "Custom financial recommendations tailored to your unique goals and preferences"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
