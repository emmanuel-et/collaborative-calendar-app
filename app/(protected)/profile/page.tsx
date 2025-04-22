"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/models/User";

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/users?uid=${user.uid}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-purple-50 text-purple-800">
      <h1 className="text-3xl font-semibold mb-6">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 gap-2 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p>
          <strong>Name:</strong> {userProfile?.name || "Not set"}
        </p>
        <p>
          <strong>Email:</strong> {userProfile?.email || user?.email}
        </p>
        <p>
          <strong>Account Created:</strong>{" "}
          {userProfile?.createdAt
            ? new Date(userProfile.createdAt).toLocaleDateString()
            : "Unknown"}
        </p>
        <button
          onClick={signOut}
          className="mt-8 px-4 py-2 bg-purple-800 text-white font-medium rounded-full hover:bg-purple-700 transition self-start"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
