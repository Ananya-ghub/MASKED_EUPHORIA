"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

const steps = ["Personal Info", "Pairing Option", "Questionnaire"];

export default function SingleRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    regno: "",
    email: "",
    phone: "",
    wantsPair: false,
    
    // New Matching Enhancements
    gender: "",
    preferredMatch: "",

    // Questionnaire
    promVibe: "",
    personalityType: "",
    energyLevel: "",
    musicPreference: "",
    conversationStyle: "",
    photoPreference: "",
    danceComfort: "",
    humorStyle: "",
    partnerExpectation: "",
    interactionStyle: "",
    height: "",
    dealBreaker: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    // Basic validation before next step
    if (currentStep === 0) {
      if (!formData.name || !formData.regno || !formData.email || !formData.phone) {
        alert("Please fill all personal info fields.");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register/single", {
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center space-y-6 max-w-2xl px-4">
        <CheckCircle2 className="w-20 h-20 text-green-500 animate-pulse" />
        <h2 className="text-3xl font-serif text-white">
          {formData.wantsPair ? "Questionnaire Submitted!" : "Registration Complete!"}
        </h2>
        {formData.wantsPair ? (
          <p className="text-gray-300">
            Thanks for registering! Compatibility matches will be announced soon.<br/><br/>
            Follow the ELA Instagram page or BTH Instagram page for updates.
          </p>
        ) : (
          <p className="text-gray-300">Your single registration for Masked Euphoria is complete!</p>
        )}
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
    <div className="w-full max-w-3xl mx-auto animate-fade-in px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold gold-gradient-text mb-2">Single Registration</h1>
        <p className="text-gray-400">Step {currentStep + 1} of {formData.wantsPair ? 3 : 2}: {steps[currentStep]}</p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden">
        {/* Subtle decorative background mask element */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {currentStep === 0 && (
          <div className="space-y-5 relative z-10 animate-fade-in">
            <h3 className="text-xl font-serif text-gold-400 border-b border-gold-500/20 pb-2 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Registration Number</label>
                <input required name="regno" value={formData.regno} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-deep-900/50 border border-gold-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-8 relative z-10 animate-fade-in py-8 text-center">
             <h3 className="text-2xl font-serif text-white mb-6">Would you like to be paired with someone for the prom?</h3>
             <div className="flex flex-col sm:flex-row justify-center gap-6">
                <label className={`cursor-pointer w-full sm:w-48 p-6 rounded-xl border transition-all ${formData.wantsPair === true ? 'border-gold-500 bg-gold-900/20 shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'border-gray-700 bg-deep-900/50 hover:border-gray-500'}`}>
                  <input type="radio" name="wantsPair" className="hidden" checked={formData.wantsPair === true} onChange={() => setFormData(p => ({...p, wantsPair: true}))} />
                  <div className="text-xl font-bold flex flex-col items-center">
                    <span className="text-gold-400 mb-2">Yes</span>
                    <span className="text-xs text-gray-400 font-normal">Take the questionnaire</span>
                  </div>
                </label>
                <label className={`cursor-pointer w-full sm:w-48 p-6 rounded-xl border transition-all ${formData.wantsPair === false ? 'border-gold-500 bg-gold-900/20 shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'border-gray-700 bg-deep-900/50 hover:border-gray-500'}`}>
                  <input type="radio" name="wantsPair" className="hidden" checked={formData.wantsPair === false} onChange={() => setFormData(p => ({...p, wantsPair: false}))} />
                  <div className="text-xl font-bold flex flex-col items-center">
                    <span className="text-gray-300 mb-2">No</span>
                    <span className="text-xs text-gray-400 font-normal">I want to go solo</span>
                  </div>
                </label>
             </div>
             {formData.wantsPair === false && (
                <div className="mt-8 p-4 bg-deep-800 rounded-lg border border-gray-700 text-sm text-gray-400">
                  You can proceed to submit your registration.
                </div>
             )}
          </div>
        )}

        {currentStep === 2 && formData.wantsPair && (
          <div className="space-y-6 relative z-10 animate-fade-in max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xl font-serif text-gold-400 border-b border-gold-500/20 pb-2 mb-4 sticky top-0 bg-[#1A1A24] z-20 pt-2">Compatibility Questionnaire</h3>
            
            <div className="space-y-6">
              {/* New Gender Options */}
              <SelectGroup label="Your Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other", "Prefer not to say"]} />
              <SelectGroup label="Who would you like to be paired with?" name="preferredMatch" value={formData.preferredMatch} onChange={handleChange} options={["Male", "Female", "Anyone"]} />
              
              <SelectGroup label="1. Ideal Prom Night Vibe" name="promVibe" value={formData.promVibe} onChange={handleChange} options={["Dancing the whole night", "Chill conversations & photos", "A mix of both", "Just here for the vibes"]} />
              <SelectGroup label="2. Introvert or Extrovert" name="personalityType" value={formData.personalityType} onChange={handleChange} options={["Very Introverted", "Slightly Introverted", "Balanced", "Slightly Extroverted", "Very Extroverted"]} />
              <SelectGroup label="3. Energy Level at Parties" name="energyLevel" value={formData.energyLevel} onChange={handleChange} options={["Calm & relaxed", "Moderate", "High energy", "Absolute chaos"]} />
              <SelectGroup label="4. Music Preference" name="musicPreference" value={formData.musicPreference} onChange={handleChange} options={["Bollywood", "English Pop", "EDM / DJ", "Romantic slow songs", "Anything that plays"]} />
              <SelectGroup label="5. Conversation Style" name="conversationStyle" value={formData.conversationStyle} onChange={handleChange} options={["Deep philosophical talks", "Fun random topics", "Gossip & campus drama", "Light casual chat"]} />
              <SelectGroup label="6. Photo Preference" name="photoPreference" value={formData.photoPreference} onChange={handleChange} options={["Love taking lots of photos", "Some photos are nice", "Only a few photos", "I avoid cameras"]} />
              <SelectGroup label="7. Dance Comfort Level" name="danceComfort" value={formData.danceComfort} onChange={handleChange} options={["I love dancing", "I'll dance if my partner pushes me", "Maybe a little", "I prefer not to dance"]} />
              <SelectGroup label="8. Humor Style" name="humorStyle" value={formData.humorStyle} onChange={handleChange} options={["Sarcastic", "Dark humor", "Wholesome / cute jokes", "Random chaos memes"]} />
              <SelectGroup label="9. Prom Partner Expectation" name="partnerExpectation" value={formData.partnerExpectation} onChange={handleChange} options={["Someone fun and energetic", "Someone chill and easygoing", "Someone confident and outgoing", "Someone thoughtful and calm"]} />
              <SelectGroup label="10. Interaction Preference" name="interactionStyle" value={formData.interactionStyle} onChange={handleChange} options={["I start conversations", "I respond if someone starts", "Depends on the vibe", "I'm shy but warm up later"]} />
              
              <div className="space-y-2">
                <label className="block text-sm text-gold-500 mb-1">11. Height (Optional)</label>
                <input name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 5'8&quot;" className="w-full bg-deep-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              
              <SelectGroup label="12. Deal Breaker" name="dealBreaker" value={formData.dealBreaker} onChange={handleChange} options={["Too quiet", "Too loud", "Not dancing", "Awkward conversations"]} />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gold-500/20 relative z-10 flex items-center justify-between">
          {currentStep > 0 ? (
            <button type="button" onClick={handlePrev} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white flex items-center transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </button>
          ) : <div></div>}

          {(currentStep < 1 || (currentStep === 1 && formData.wantsPair)) ? (
            <button type="button" onClick={handleNext} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg flex items-center transition-colors border border-gray-600">
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={loading || (formData.wantsPair && (Object.values(formData).slice(7).filter(Boolean).length < 10 || !formData.gender || !formData.preferredMatch))} 
              className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-deep-900 font-bold rounded-xl shadow-[0_0_15px_rgba(217,119,6,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for questionnaire selects
function SelectGroup({ label, name, value, onChange, options }: { label: string, name: string, value: string, onChange: any, options: string[] }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gold-500 mb-1">{label}</label>
      <select 
        required 
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full bg-deep-900/80 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none"
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
