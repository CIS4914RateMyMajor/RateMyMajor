"use client";

import { useState } from "react";
import Navbar from "../nav-bar.tsx";
import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";

const MOCK_MAJORS_DATA = [
    {
        id: 1,
        name: "Computer Science",
        reviews: [
            { difficulty: 5, content: 4, professors: 3, advisors: 2, text: "Tough but rewarding.", gpa: "3.9", userId: "other-user" }
        ]
    },
    { id: 2, name: "Digital Arts", reviews: [] },
    { id: 3, name: "Mechanical Engineering", reviews: [] },
];

export default function SchoolsPage() {
    const [majors, setMajors] = useState(MOCK_MAJORS_DATA);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);

    // Review Form States
    const [ratings, setRatings] = useState({ difficulty: 5, content: 5, professors: 5, advisors: 5 });
    const [reviewText, setReviewText] = useState("");

    const MY_USER_ID = "mock-user-123";
    const userGpa = "3.8";

    // --- SEARCH LOGIC ---
    const filteredOptions = majors.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) && search.length > 0
    );

    const selectedMajor = majors.find(m => m.id === selectedId);
    const hasAlreadyReviewed = selectedMajor?.reviews.some(r => r.userId === MY_USER_ID);

    // --- CALCULATION LOGIC ---
    const calculateTotalAvg = (reviews: any[]) => {
        if (reviews.length === 0) return "N/A";
        const allScores = reviews.flatMap(r => [r.difficulty, r.content, r.professors, r.advisors]);
        return (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);
    };

    const getCategoryAvg = (reviews: any[], category: string) => {
        if (reviews.length === 0) return "0.0";
        return (reviews.reduce((a, b) => a + b[category], 0) / reviews.length).toFixed(1);
    };

    const handleUpdateReview = (e: React.FormEvent) => {
        e.preventDefault();
        const newReview = { ...ratings, text: reviewText, gpa: userGpa, userId: MY_USER_ID };

        setMajors(prev => prev.map(m => {
            if (m.id !== selectedId) return m;
            const filtered = m.reviews.filter(r => r.userId !== MY_USER_ID);
            return { ...m, reviews: [...filtered, newReview] };
        }));
        setIsReviewing(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-4xl mx-auto p-8">

                {/* 1. SEARCH BAR SECTION */}
                <div className="mb-10 relative">
                    <label className="block text-sm font-black uppercase mb-2 text-slate-600">
                        Search for your major
                    </label>
                    <Input
                        placeholder="e.g. Computer Science..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            if (selectedId) setSelectedId(null); // Clear selection if typing again
                        }}
                        className="text-lg py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-0"
                    />

                    {/* Search Dropdown */}
                    {filteredOptions.length > 0 && !selectedId && (
                        <div className="absolute w-full z-10 bg-white border-4 border-black mt-2 divide-y-4 divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {filteredOptions.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => {
                                        setSelectedId(m.id);
                                        setSearch(m.name);
                                    }}
                                    className="w-full text-left p-4 hover:bg-yellow-400 font-bold transition-colors"
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. MAJOR DETAIL DISPLAY */}
                {selectedMajor && (
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center justify-between gap-6 mb-6">
                            <h2 className="text-4xl font-black uppercase leading-tight">{selectedMajor.name}</h2>
                            <div className="flex flex-col items-center bg-yellow-400 border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <span className="text-5xl font-black">{calculateTotalAvg(selectedMajor.reviews)}</span>
                                <span className="text-xs font-bold uppercase mt-1">Total Avg</span>
                            </div>
                        </div>

                        {/* Category Stats Display */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {['difficulty', 'content', 'professors', 'advisors'].map(cat => (
                                <div key={cat} className="border-2 border-black p-3 bg-slate-50">
                                    <p className="text-[10px] font-black uppercase text-slate-400">{cat}</p>
                                    <p className="text-xl font-bold">{getCategoryAvg(selectedMajor.reviews, cat)} <span className="text-sm">★</span></p>
                                </div>
                            ))}
                        </div>

                        {/* Review Toggle Button */}
                        <Button
                            onClick={() => setIsReviewing(!isReviewing)}
                            className="w-full bg-black text-white hover:bg-slate-800 py-6 text-lg font-bold mb-8"
                        >
                            {hasAlreadyReviewed ? "UPDATE YOUR PREVIOUS REVIEW" : "LEAVE A REVIEW"}
                        </Button>

                        {/* 3. REVIEW FORM (Stars + Text) */}
                        {isReviewing && (
                            <form onSubmit={handleUpdateReview} className="bg-slate-100 p-6 border-4 border-black mb-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.keys(ratings).map((cat) => (
                                        <div key={cat} className="flex flex-col gap-2">
                                            <label className="capitalize font-black text-sm">{cat} Rating</label>
                                            <select
                                                value={ratings[cat as keyof typeof ratings]}
                                                onChange={(e) => setRatings({...ratings, [cat]: Number(e.target.value)})}
                                                className="border-2 border-black p-3 font-bold bg-white focus:outline-none"
                                            >
                                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-black text-sm uppercase">Detailed Review</label>
                                    <textarea
                                        className="w-full border-4 border-black p-4 min-h-[150px] font-medium"
                                        placeholder="Tell us about the coursework, workload, and career support..."
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex justify-between items-center bg-white border-2 border-black p-4 italic text-sm">
                                    <span>Posting with GPA: <b>{userGpa}</b></span>
                                    <Button type="submit" className="bg-green-500 text-black border-2 border-black font-black px-8">
                                        {hasAlreadyReviewed ? "SAVE UPDATES" : "SUBMIT REVIEW"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* 4. REVIEWS LIST */}
                        <div className="space-y-6 border-t-4 border-black pt-6">
                            <h3 className="text-2xl font-black uppercase mb-4">Student Feedback</h3>
                            {selectedMajor.reviews.length === 0 ? (
                                <p className="italic text-slate-400 text-center py-10">No reviews yet. Be the first to rate this major!</p>
                            ) : (
                                selectedMajor.reviews.map((r, i) => (
                                    <div key={i} className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-black text-white px-4 py-2 font-black text-lg">
                                                {( (r.difficulty + r.content + r.professors + r.advisors) / 4 ).toFixed(1)} ★
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Student GPA</p>
                                                <p className="font-bold text-lg">{r.gpa}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed font-medium">{r.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
