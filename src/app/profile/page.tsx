"use client";

import { useEffect, useState } from "react";
import Navbar from "../nav-bar.tsx";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { usersAPI } from "@/lib/users";

export default function ProfilePage() {
  // 1. MOCK DATA STATE
  const [isEditing, setIsEditing] = useState(true); // Set to true initially as requested
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: "", 
    email: "", 
    major: "", 
    college: "", 
    gpa: "", 
    image: null as string | null,
    id: "",
    createdAt: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const serverProfile = await usersAPI.getProfile();
        setProfile((current) => ({
          ...current,
          name: serverProfile.username || "",
          email: serverProfile.email || "",
          major: serverProfile.major || "",
          college: serverProfile.college || "",
          gpa: serverProfile.gpa || "",
          image: (serverProfile as any).image || null,
        }));
      } catch (err: any) {
        setError(err?.message || "Failed to load profile");
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await usersAPI.updateProfile({ 
        username: profile.name,
        major: profile.major,
        college: profile.college,
        gpa: profile.gpa
      });
      // name and email remain in state from form and API
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-slate-50">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 text-center">
              {isEditing ? "Edit Profile" : "User Profile"}
            </h1>

            {isLoading && <p className="text-center text-slate-500">Loading profile...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            <div className="space-y-6">
              {/* PROFILE PICTURE SECTION */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 border-2 border-slate-200 overflow-hidden">
                    {profile.image ? (
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      (profile.name.charAt(0) || "?").toUpperCase()
                    )}
                  </div>
                  {isEditing && (
                      <div className="mt-2 text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                        Change Photo
                      </div>
                  )}
                </div>
                {!isEditing && (
                    <>
                      <h2 className="text-xl font-semibold text-slate-800 mt-4">{profile.name}</h2>
                      <p className="text-slate-500">{profile.email}</p>
                    </>
                )}
              </div>

              {/* FORM FIELDS */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                {/* Name (Editable) */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                  {isEditing ? (
                      <Input name="name" value={profile.name} onChange={handleChange} className="mt-1" />
                  ) : (
                      <p className="text-sm text-slate-700 mt-1">{profile.name}</p>
                  )}
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Email (Private)</label>
                  <p className="text-sm text-slate-500 mt-1 italic">{profile.email}</p>
                </div>

                {/* Major (Editable) */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Major</label>
                  {isEditing ? (
                      <Input name="major" value={profile.major} onChange={handleChange} className="mt-1" />
                  ) : (
                      <p className="text-sm text-slate-700 mt-1">{profile.major}</p>
                  )}
                </div>

                {/* College (Editable) */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">College</label>
                  {isEditing ? (
                      <Input name="college" value={profile.college} onChange={handleChange} className="mt-1" />
                  ) : (
                      <p className="text-sm text-slate-700 mt-1">{profile.college}</p>
                  )}
                </div>

                {/* GPA (Editable) */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">GPA</label>
                  {isEditing ? (
                      <Input name="gpa" type="number" step="0.1" value={profile.gpa} onChange={handleChange} className="mt-1" />
                  ) : (
                      <p className="text-sm text-slate-700 mt-1">{profile.gpa}</p>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-6">
                {isEditing ? (
                    <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Save Changes
                    </Button>
                ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                      Edit Profile
                    </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

