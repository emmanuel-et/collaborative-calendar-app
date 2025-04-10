"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CalendarRole, Memberships } from "@/models/Calendar";

export default function EditCalendarPage() {
    const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams(); // Get the calendar ID from the URL
  const [name, setName] = useState("");
  const [role, setRole] = useState<CalendarRole>(CalendarRole.OWNER);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Memberships>({});
//   const [memberEmails, setMemberEmails] = useState<Record<string, string>([]); // Store member emails
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/calendar/${id}`); // Use the GET route from route.ts
        if (!res.ok) {
          throw new Error("Failed to fetch calendar details.");
        }
        const calendar = await res.json();
        setName(calendar.name);
        setRole(calendar.role);
        setMembers(calendar.members || {});
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();

  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/calendar/${id}`, {
        method: "PUT", // Use the PUT route from route.ts
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, members }),
      });

      if (!res.ok) {
        throw new Error("Failed to update calendar. Please try again.");
      }

      router.push(`/calendar/${id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/calendar/${id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newMemberEmail }),
      });

      if (!res.ok) {
        throw new Error("Failed to add member.");
      }

      const updatedMembers = await res.json();
      setMembers(updatedMembers);
      setNewMemberEmail("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/calendar/${id}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove member.");
      }

      const updatedMembers = await res.json();
      setMembers(updatedMembers);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (email: string, newRole: CalendarRole) => {
    if (email === "currentUserEmail") {
      setError("You cannot reassign your own role.");
      return;
    }

    setMembers((prev) =>
        ({ ...prev, [email]:  newRole }))
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
      <h1 className="text-3xl font-semibold mb-6">Edit Calendar</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Calendar Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      <div className="mt-6 w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Manage Members</h2>
        <div className="mb-4">
          <label htmlFor="newMemberEmail" className="block text-sm font-medium text-gray-700">
            Add Member
          </label>
          <div className="flex mt-1">
            <input
              id="newMemberEmail"
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddMember}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>
        <ul>
          {Object.keys(members).map((member) => ( member != user.uid && 
            <li key={member} className="flex items-center justify-between mb-2">
              <span>{member}</span>
              <div className="flex items-center">
                <select
                  value={members[member]}
                  onChange={(e) => handleRoleChange(member, e.target.value as CalendarRole)}
                  disabled={member === "currentUserEmail"}
                  className="mr-2 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                >
                  <option value={CalendarRole.EDITOR}>Editor</option>
                  <option value={CalendarRole.VIEWER}>Viewer</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
