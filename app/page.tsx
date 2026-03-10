import Link from "next/link";
import { Sparkles, Users, User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mt-12 sm:mt-24 space-y-12 animate-fade-in relative z-10">
      
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gold-600/10 border border-gold-500/20 text-gold-400">
          <Sparkles className="w-5 h-5 mr-2" />
          <span className="text-sm tracking-widest uppercase font-semibold">The Event of the Year</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-serif font-bold tracking-tight gold-gradient-text drop-shadow-2xl text-shadow-[0_0_30px_rgba(217,119,6,0.6)]">
          Masked Euphoria
        </h1>
        <h2 className="text-2xl sm:text-3xl font-serif text-gray-300 italic tracking-wide">
          "Where Mystery Meets Elegance"
        </h2>
      </div>

      {/* Registration Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl px-4 mt-8">
        
        {/* Couple Registration Card */}
        <Link href="/register/couple" className="flex-1 group">
          <div className="glass-panel rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-gold-900/10 hover:border-gold-500/30">
            <div className="w-16 h-16 rounded-full bg-gold-600/20 flex items-center justify-center mb-6 text-gold-400 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mb-2">Register as Couple</h3>
            <p className="text-gray-400 text-sm">Sign up with your date and compete for Prom King & Queen.</p>
          </div>
        </Link>

        {/* Single Registration Card */}
        <Link href="/register/single" className="flex-1 group">
          <div className="glass-panel rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-gold-900/10 hover:border-gold-500/30">
            <div className="w-16 h-16 rounded-full bg-gold-600/20 flex items-center justify-center mb-6 text-gold-400 group-hover:scale-110 transition-transform duration-300">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mb-2">Register as Single</h3>
            <p className="text-gray-400 text-sm">Join solo, answer our questionnaire, and find your perfect match.</p>
          </div>
        </Link>
        
      </div>

      <div className="text-center mt-12 text-gray-400">
        <p>Scan the QR code or register now to be part of Masked Euphoria.</p>
      </div>
      
    </div>
  );
}
