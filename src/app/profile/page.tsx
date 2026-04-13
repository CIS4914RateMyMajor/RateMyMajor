"use client";

import { useEffect, useState } from "react";
import Navbar from "../nav-bar";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { usersAPI } from "@/lib/users";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    major: "",
    college: "",
    gpa: "",
    image: null as string | null,
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
      setIsSaving(true);
      setError(null);
      setSaveMessage(null);

      await usersAPI.updateProfile({
        username: profile.name,
        major: profile.major,
        college: profile.college,
        gpa: profile.gpa,
      });
      setIsEditing(false);
      setSaveMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(err?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8 space-y-8">
        <header className="border-b-6 border-black pb-8">
          <h1 className="text-5xl font-black tracking-tight uppercase leading-none mb-4">
            {isEditing ? "Edit Profile" : "User Profile"}
          </h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Keep your major, college, and academic info up to date.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-2xl font-black animate-pulse uppercase">LOADING PROFILE...</span>
          </div>
        ) : (
          <section className="border-6 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {error && (
              <div className="bg-red-50 border-4 border-red-500 p-4 text-red-700 font-bold mb-6">
                ERROR: {error}
              </div>
            )}
            {saveMessage && (
              <div className="bg-green-50 border-4 border-green-600 p-4 text-green-800 font-bold mb-6 uppercase tracking-wide">
                {saveMessage}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="border-4 border-black p-6 h-fit">
                <div className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center text-3xl font-black overflow-hidden mx-auto">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    (profile.name.charAt(0) || "?").toUpperCase()
                  )}
                </div>
                <h2 className="text-xl font-black uppercase mt-4 text-center">{profile.name || "Unnamed User"}</h2>
                <p className="text-xs font-bold text-gray-500 mt-1 text-center break-all">{profile.email}</p>
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Name</label>
                  {isEditing ? (
                    <Input name="name" value={profile.name} onChange={handleChange} className="mt-2 border-2 border-black rounded-none" />
                  ) : (
                    <p className="mt-2 border-2 border-black p-3 font-bold">{profile.name || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email (Private)</label>
                  <p className="mt-2 border-2 border-black p-3 font-bold bg-gray-50">{profile.email || "-"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Major</label>
                    {isEditing ? (
                      <Input name="major" value={profile.major} onChange={handleChange} className="mt-2 border-2 border-black rounded-none" />
                    ) : (
                      <p className="mt-2 border-2 border-black p-3 font-bold">{profile.major || "-"}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">College</label>
                    {isEditing ? (
                      <Input name="college" value={profile.college} onChange={handleChange} className="mt-2 border-2 border-black rounded-none" />
                    ) : (
                      <p className="mt-2 border-2 border-black p-3 font-bold">{profile.college || "-"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">GPA</label>
                  {isEditing ? (
                    <Input
                      name="gpa"
                      type="number"
                      step="0.1"
                      value={profile.gpa}
                      onChange={handleChange}
                      className="mt-2 border-2 border-black rounded-none"
                    />
                  ) : (
                    <p className="mt-2 border-2 border-black p-3 font-bold">{profile.gpa || "-"}</p>
                  )}
                </div>

                <div className="pt-2">
                  {isEditing ? (
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full px-6 py-3 border-4 border-black rounded-none bg-white text-black font-black uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full px-6 py-3 border-4 border-black rounded-none bg-white text-black font-black uppercase hover:bg-black hover:text-white"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

