"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function CoupleRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name1: "",
    regno1: "",
    email1: "",
    phone1: "",
    name2: "",
    regno2: "",
    email2: "",
    phone2: "",
    kingQueenParticipation: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register/couple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center space-y-6">
        <CheckCircle2 className="w-20 h-20 text-green-500 animate-pulse" />
        <h2 className="text-3xl font-serif text-white">Registration Complete!</h2>
        <p className="text-gray-300">Your couple registration for Masked Euphoria is complete!</p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 bg-gold-600 hover:bg-gold-500 text-deep-900 font-semibold rounded-full transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold gold-gradient-text mb-2">Couple Registration</h1>
        <p className="text-gray-400">Join the grand night together</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 relative overflow-hidden">
        {/* Subtle decorative background mask element */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          {/* Person 1 */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-gold-400 border-b border-gold-500/20 pb-2">Person 1</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input required name="name1" value={formData.name1} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Registration Number</label>
              <input required name="regno1" value={formData.regno1} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input required type="email" name="email1" value={formData.email1} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <input required type="tel" name="phone1" value={formData.phone1} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
          </div>

          {/* Person 2 */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-gold-400 border-b border-gold-500/20 pb-2">Person 2</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input required name="name2" value={formData.name2} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Registration Number</label>
              <input required name="regno2" value={formData.regno2} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input required type="email" name="email2" value={formData.email2} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <input required type="tel" name="phone2" value={formData.phone2} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
          </div>

        </div>

        {/* Extra Options */}
        <div className="pt-6 border-t border-gold-500/20 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input 
              type="checkbox" 
              name="kingQueenParticipation"
              checked={formData.kingQueenParticipation}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gold-500/50 text-gold-500 focus:ring-gold-500 bg-deep-900 accent-gold-500 cursor-pointer" 
            />
            <span className="text-gray-300 group-hover:text-gold-400 transition-colors">Participate in Prom King & Queen Competition</span>
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-deep-900 font-bold rounded-xl shadow-[0_0_15px_rgba(217,119,6,0.4)] hover:shadow-[0_0_25px_rgba(217,119,6,0.6)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {loading ? "Registering..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
