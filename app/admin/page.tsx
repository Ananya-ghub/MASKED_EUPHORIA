"use client";

import { useState, useEffect } from "react";
import { Users, User, HeartHandshake, Download, Loader2, LogOut, X } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("couples");
  const [couples, setCouples] = useState([]);
  const [singles, setSingles] = useState([]);
  const [matches, setMatches] = useState({ pairs: [], unmatched: [] });
  
  const [loading, setLoading] = useState(true);
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSingle, setSelectedSingle] = useState<any | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const authFlag = localStorage.getItem("adminAuthenticated");
    if (authFlag === "true") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsCheckingAuth(false);
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "MaskedEuphoria1403") {
      localStorage.setItem("adminAuthenticated", "true");
      setIsAuthenticated(true);
      setLoginError("");
      setIsCheckingAuth(false);
      setLoading(true);
      fetchData();
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [couplesRes, singlesRes, matchesRes] = await Promise.all([
        fetch("/api/admin/couples").then(res => res.json()),
        fetch("/api/admin/singles").then(res => res.json()),
        fetch("/api/admin/match").then(res => res.json())
      ]);

      if (couplesRes.success) setCouples(couplesRes.data);
      if (singlesRes.success) setSingles(singlesRes.data);
      if (matchesRes.success) {
        setMatches(prev => ({ ...prev, pairs: matchesRes.data }));
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMatches = async () => {
    setGeneratingMatches(true);
    try {
      const res = await fetch("/api/admin/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Generate matches failed", data);
        return alert(data?.message || "Failed to generate matches");
      }

      if (data.success) {
        setMatches({ pairs: data.pairs, unmatched: data.unmatched });
        setActiveTab("matches");
      } else {
        alert("Failed to generate matches");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating matches");
    } finally {
      setGeneratingMatches(false);
    }
  };

  const handleCheckInToggle = async (regno: string, currentStatus: boolean) => {
    try {
      // Optimistically update UI
      setSingles((prev: any) => 
        prev.map((s: any) => s.regno === regno ? { ...s, checkedIn: !currentStatus } : s)
      );
      
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno, checkedIn: !currentStatus })
      });
      
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setSingles((prev: any) => 
          prev.map((s: any) => s.regno === regno ? { ...s, checkedIn: currentStatus } : s)
        );
        alert(data.message || "Failed to update check-in status");
      }
    } catch (error) {
      console.error(error);
      // Revert on failure
      setSingles((prev: any) => 
        prev.map((s: any) => s.regno === regno ? { ...s, checkedIn: currentStatus } : s)
      );
      alert("Error updating check-in status");
    }
  };

  const downloadCSV = (type: string) => {
    let data: any[] = [];
    let filename = "";

    if (type === "couples") {
      filename = "couples_registrations.csv";
      data = couples.map((c: any) => ({
        "Person 1 Name": c.name1,
        "Person 1 Reg No": c.regno1,
        "Person 1 Phone": c.phone1,
        "Person 2 Name": c.name2,
        "Person 2 Reg No": c.regno2,
        "Person 2 Phone": c.phone2,
        "King/Queen": c.kingQueenParticipation ? "Yes" : "No",
        "Registered At": new Date(c.createdAt).toLocaleString()
      }));
    } else if (type === "singles") {
      filename = "singles_registrations.csv";
      data = singles.map((s: any) => ({
        "Name": s.name,
        "Reg No": s.regno,
        "Phone": s.phone,
        "Gender": s.gender || "N/A",
        "Preferred Match": s.preferredMatch || "N/A",
        "Wants Pairing": s.wantsPair ? "Yes" : "No",
        "Checked In": s.checkedIn ? "Yes" : "No",
        "Registered At": new Date(s.createdAt).toLocaleString()
      }));
    } else if (type === "matches") {
      filename = "prom_matches.csv";
      data = matches.pairs.map((p: any, index: number) => ({
        "Match #": index + 1,
        "Person 1 Name": p.person1Name,
        "Person 1 Phone": "", // Redacted/Not saved in simple schema
        "Person 2 Name": p.person2Name,
        "Person 2 Phone": "",
        "Compatibility Score": p.compatibilityScore,
        "Generated At": new Date(p.createdAt).toLocaleString()
      }));
    }

    if (data.length === 0) return alert("No data to download");

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(fieldName => JSON.stringify((row as any)[fieldName])).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSingles = singles.filter((s: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.regno.toLowerCase().includes(q);
  });

  const stats = {
    registeredSingles: singles.length,
    checkedIn: singles.filter((s: any) => s.checkedIn).length,
    eligibleForMatching: singles.filter((s: any) => s.checkedIn && s.wantsPair).length,
    matchesGenerated: matches.pairs.length
  };

  if (isCheckingAuth || (loading && isAuthenticated)) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="w-12 h-12 text-gold-500 animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl border border-gray-800 w-full max-w-md animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"></div>
          <h1 className="text-3xl font-serif font-bold gold-gradient-text mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-deep-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-500"
              />
              {loginError && <p className="text-red-400 text-sm mt-2">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-deep-900 font-bold rounded-xl shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all flex items-center justify-center"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in px-4 pb-12 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold gold-gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage Masked Euphoria Registrations</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateMatches}
            disabled={generatingMatches}
            className="px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-deep-900 font-bold rounded-lg shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all flex items-center disabled:opacity-50"
          >
            {generatingMatches ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <HeartHandshake className="w-5 h-5 mr-2" />}
            Generate Matches
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-deep-800 hover:bg-deep-700 text-gray-300 font-medium rounded-lg border border-gray-700 transition-all flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 text-sm mb-1">Registered Singles</p>
          <p className="text-2xl font-bold text-white">{stats.registeredSingles}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 text-sm mb-1">Checked In</p>
          <p className="text-2xl font-bold text-green-400">{stats.checkedIn}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 text-sm mb-1">Eligible For Matching</p>
          <p className="text-2xl font-bold text-purple-400">{stats.eligibleForMatching}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 text-sm mb-1">Matches Generated</p>
          <p className="text-2xl font-bold text-gold-400">{stats.matchesGenerated}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 sm:space-x-4 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setActiveTab("couples")}
          className={`px-4 py-2 rounded-lg font-medium flex-shrink-0 flex items-center transition-colors ${activeTab === "couples" ? "bg-gold-600/20 text-gold-400 border border-gold-500/50" : "bg-deep-800 text-gray-400 hover:bg-deep-700 hover:text-white border border-transparent"}`}
        >
          <Users className="w-4 h-4 mr-2" /> Couples ({couples.length})
        </button>
        <button
          onClick={() => setActiveTab("singles")}
          className={`px-4 py-2 rounded-lg font-medium flex-shrink-0 flex items-center transition-colors ${activeTab === "singles" ? "bg-gold-600/20 text-gold-400 border border-gold-500/50" : "bg-deep-800 text-gray-400 hover:bg-deep-700 hover:text-white border border-transparent"}`}
        >
          <User className="w-4 h-4 mr-2" /> Singles ({singles.length})
        </button>
        {matches.pairs.length > 0 && (
          <button
            onClick={() => setActiveTab("matches")}
            className={`px-4 py-2 rounded-lg font-medium flex-shrink-0 flex items-center transition-colors ${activeTab === "matches" ? "bg-purple-600/20 text-purple-400 border border-purple-500/50" : "bg-deep-800 text-gray-400 hover:bg-deep-700 hover:text-white border border-transparent"}`}
          >
            <HeartHandshake className="w-4 h-4 mr-2" /> Matches ({matches.pairs.length})
          </button>
        )}
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif text-white capitalize">{activeTab} List</h2>
          <button
            onClick={() => downloadCSV(activeTab)}
            className="text-sm flex items-center px-3 py-1.5 bg-deep-800 hover:bg-deep-700 text-gray-300 rounded-md transition-colors border border-gray-700"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {activeTab === "couples" && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-deep-900/50 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Person 1</th>
                  <th className="px-4 py-3 font-medium">Person 2</th>
                  <th className="px-4 py-3 font-medium text-center">King/Queen</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 flex-1">
                {couples.map((c: any) => (
                  <tr key={c._id} className="hover:bg-deep-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{c.name1} <br /><span className="text-xs text-gray-500 font-normal">{c.regno1} | {c.phone1}</span></td>
                    <td className="px-4 py-3 font-medium text-white">{c.name2} <br /><span className="text-xs text-gray-500 font-normal">{c.regno2} | {c.phone2}</span></td>
                    <td className="px-4 py-3 text-center">{c.kingQueenParticipation ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-900/50 text-gold-400 border border-gold-500/20">Yes</span> : <span className="text-gray-500 text-xs">No</span>}</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {couples.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No couple registrations yet.</td></tr>}
              </tbody>
            </table>
          )}

          {activeTab === "singles" && (
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Search by Name or Registration Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 bg-deep-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold-500 transition-colors"
              />
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-deep-900/50 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Registration Number</th>
                    <th className="px-4 py-3 font-medium">Gender</th>
                    <th className="px-4 py-3 font-medium">Preferred Match</th>
                    <th className="px-4 py-3 font-medium text-center">Wants Pair</th>
                    <th className="px-4 py-3 font-medium text-center">Checked In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredSingles.map((s: any) => (
                    <tr key={s._id} onClick={() => setSelectedSingle(s)} className="hover:bg-deep-800/50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-medium text-white">{s.name} <br /><span className="text-xs text-gray-500 font-normal">{s.phone} | {s.email}</span></td>
                      <td className="px-4 py-3 text-gray-300">{s.regno}</td>
                      <td className="px-4 py-3 text-gray-300">{s.gender || "-"}</td>
                      <td className="px-4 py-3 text-gray-300">{s.preferredMatch || "-"}</td>
                      <td className="px-4 py-3 text-center">{s.wantsPair ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900/40 text-purple-400 border border-purple-500/20">Yes</span> : <span className="text-gray-500 text-xs">No</span>}</td>
                      <td className="px-4 py-3 text-center">
                        <label onClick={(e) => e.stopPropagation()} className="flex items-center justify-center cursor-pointer space-x-2">
                          <input 
                            type="checkbox" 
                            checked={!!s.checkedIn}
                            onChange={() => handleCheckInToggle(s.regno, !!s.checkedIn)}
                            className="w-4 h-4 rounded border-gray-600 text-gold-500 focus:ring-gold-500 bg-deep-800"
                          />
                          {s.checkedIn ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/40 text-green-400 border border-green-500/20">Checked In</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-400 border border-gray-600">Not Checked In</span>
                          )}
                        </label>
                      </td>
                    </tr>
                  ))}
                  {filteredSingles.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No single registrations found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "matches" && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-deep-900/50 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Match Score</th>
                  <th className="px-4 py-3 font-medium">Person 1</th>
                  <th className="px-4 py-3 font-medium">Person 2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {matches.pairs.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-deep-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-bold bg-gold-900/50 text-gold-400 border border-gold-500/30 shadow-[0_0_10px_rgba(217,119,6,0.2)]">
                        {m.compatibilityScore} pts
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-white">{m.person1Name} <br /><span className="text-xs text-gray-500 font-normal">{m.person1RegNo}</span></td>
                    <td className="px-4 py-4 font-medium text-white">{m.person2Name} <br /><span className="text-xs text-gray-500 font-normal">{m.person2RegNo}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Participant Details Modal */}
      {selectedSingle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedSingle(null)}>
          <div 
            className="glass-panel p-6 md:p-8 rounded-2xl border border-gold-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedSingle(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-serif font-bold text-white mb-6 border-b border-gray-800 pb-4">Participant Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-400">Name:</span> <span className="text-white font-medium">{selectedSingle.name}</span></p>
                  <p><span className="text-gray-400">Reg No:</span> <span className="text-white font-medium">{selectedSingle.regno}</span></p>
                  <p><span className="text-gray-400">Email:</span> <span className="text-white font-medium">{selectedSingle.email}</span></p>
                  <p><span className="text-gray-400">Phone:</span> <span className="text-white font-medium">{selectedSingle.phone}</span></p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status & Preferences</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-400">Gender:</span> <span className="text-white font-medium">{selectedSingle.gender || "N/A"}</span></p>
                  <p><span className="text-gray-400">Prefers Match:</span> <span className="text-white font-medium">{selectedSingle.preferredMatch || "N/A"}</span></p>
                  <p><span className="text-gray-400">Wants Pair:</span> <span className="text-white font-medium">{selectedSingle.wantsPair ? "Yes" : "No"}</span></p>
                  <p><span className="text-gray-400">Checked In:</span> <span className="text-white font-medium">{selectedSingle.checkedIn ? "Yes" : "No"}</span></p>
                </div>
              </div>
            </div>

            {selectedSingle.wantsPair && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 border-b border-gray-800 pb-2">Questionnaire Responses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-gray-800/50">
                    <p className="text-xs text-gold-500/70 mb-1">Prom Vibe</p>
                    <p className="text-sm text-gray-200">{selectedSingle.promVibe || "N/A"}</p>
                  </div>
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-gray-800/50">
                    <p className="text-xs text-gold-500/70 mb-1">Music Preference</p>
                    <p className="text-sm text-gray-200">{selectedSingle.musicPreference || "N/A"}</p>
                  </div>
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-gray-800/50">
                    <p className="text-xs text-gold-500/70 mb-1">Personality</p>
                    <p className="text-sm text-gray-200">{selectedSingle.personalityType || "N/A"}</p>
                  </div>
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-gray-800/50">
                    <p className="text-xs text-gold-500/70 mb-1">Energy Level</p>
                    <p className="text-sm text-gray-200">{selectedSingle.energyLevel || "N/A"}</p>
                  </div>
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-gray-800/50">
                    <p className="text-xs text-gold-500/70 mb-1">Humor Style</p>
                    <p className="text-sm text-gray-200">{selectedSingle.humorStyle || "N/A"}</p>
                  </div>
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-gray-800/50">
                    <p className="text-xs text-gold-500/70 mb-1">Dance Comfort</p>
                    <p className="text-sm text-gray-200">{selectedSingle.danceComfort || "N/A"}</p>
                  </div>
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-gray-800/50">
                    <p className="text-xs text-gold-500/70 mb-1">Partner Expectation</p>
                    <p className="text-sm text-gray-200">{selectedSingle.partnerExpectation || "N/A"}</p>
                  </div>
                  <div className="bg-deep-900/50 p-3 rounded-lg border border-red-900/30">
                    <p className="text-xs text-red-400 mb-1">Deal Breaker</p>
                    <p className="text-sm text-gray-200">{selectedSingle.dealBreaker || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
