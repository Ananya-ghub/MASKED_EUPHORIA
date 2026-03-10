"use client";

import { useState, useEffect } from "react";
import { Users, User, HeartHandshake, Download, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("couples");
  const [couples, setCouples] = useState([]);
  const [singles, setSingles] = useState([]);
  const [matches, setMatches] = useState({ pairs: [], unmatched: [] });
  
  const [loading, setLoading] = useState(true);
  const [generatingMatches, setGeneratingMatches] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
      const res = await fetch("/api/admin/match");
      const data = await res.json();
      
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

  const downloadCSV = (type: string) => {
    let data = [];
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
        "Wants Pairing": s.wantsPair ? "Yes" : "No",
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

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-10 h-10 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold gold-gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage Masked Euphoria Registrations</p>
        </div>
        
        <button 
          onClick={handleGenerateMatches}
          disabled={generatingMatches}
          className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-deep-900 font-bold rounded-lg shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all flex items-center disabled:opacity-50"
        >
          {generatingMatches ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <HeartHandshake className="w-5 h-5 mr-2" />}
          Generate Matches
        </button>
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
                    <td className="px-4 py-3 font-medium text-white">{c.name1} <br/><span className="text-xs text-gray-500 font-normal">{c.regno1} | {c.phone1}</span></td>
                    <td className="px-4 py-3 font-medium text-white">{c.name2} <br/><span className="text-xs text-gray-500 font-normal">{c.regno2} | {c.phone2}</span></td>
                    <td className="px-4 py-3 text-center">{c.kingQueenParticipation ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-900/50 text-gold-400 border border-gold-500/20">Yes</span> : <span className="text-gray-500 text-xs">No</span>}</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {couples.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No couple registrations yet.</td></tr>}
              </tbody>
            </table>
          )}

          {activeTab === "singles" && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-deep-900/50 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium text-center">Wants Pairing</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {singles.map((s: any) => (
                  <tr key={s._id} className="hover:bg-deep-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{s.name} <br/><span className="text-xs text-gray-500 font-normal">{s.regno}</span></td>
                    <td className="px-4 py-3 text-gray-300">{s.phone} <br/><span className="text-xs text-gray-500">{s.email}</span></td>
                    <td className="px-4 py-3 text-center">{s.wantsPair ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/40 text-green-400 border border-green-500/20">Yes</span> : <span className="text-gray-500 text-xs">No</span>}</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {singles.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No single registrations yet.</td></tr>}
              </tbody>
            </table>
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
                    <td className="px-4 py-4 font-medium text-white">{m.person1Name} <br/><span className="text-xs text-gray-500 font-normal">{m.person1RegNo}</span></td>
                    <td className="px-4 py-4 font-medium text-white">{m.person2Name} <br/><span className="text-xs text-gray-500 font-normal">{m.person2RegNo}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
