"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CalendarRole, Memberships } from "@/models/Calendar";
import { User } from "@/models/User";
import InviteMemberDialog from '@/components/calendar/InviteMemberDialog';
import { InviteNotificationInput } from '@/models/Notification';

export default function EditCalendarPage() {
    const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams(); // Get the calendar ID from the URL
  const calendarId = String(id); // Cast id to string
  const [name, setName] = useState("");
  const [role, setRole] = useState<CalendarRole>(CalendarRole.OWNER);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Memberships>({});
  const [membersToUserMap, setMembersToUserMap] = useState<Record<string, User>>({}); // Store member emails
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    const fetchCalendarAndMembers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/calendar/${calendarId}`); // Use the GET route from route.ts
        if (!res.ok) {
          throw new Error("Failed to fetch calendar details.");
        }
        const calendar = await res.json();
        setName(calendar.name);
        setRole(calendar.role);
        setMembers(calendar.members || {});
        
        // Fetch members
        const membersRes = await Promise.all(Object.keys(calendar.members).map(uid => fetch(`/api/users?uid=${uid}`)));
        const membersData = await Promise.all(membersRes.map(res => res.json()));
        const membersMap: Record<string, User> = {};
        membersData.forEach((member: User) => {
          membersMap[member.uid] = member;
        });
        setMembersToUserMap(membersMap);
        
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarAndMembers();

  }, [calendarId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/calendar/${calendarId}`, {
        method: "PUT", // Use the PUT route from route.ts
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, members: members }),
      });

      if (!res.ok) {
        throw new Error("Failed to update calendar. Please try again.");
      }

      router.push(`/calendar/${calendarId}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    if (!newMemberEmail) return;

    if (Object.values(membersToUserMap).some((user) => user.email === newMemberEmail)) {
        setError("This member is already added.");
        return;
    }

    // need to make api call to get user by email
  };

  const handleSendInvite = async (inviteData: InviteNotificationInput) => {
    if (Object.values(membersToUserMap).some((user) => user.email === inviteData.email)) {
      setError("This member is already added.");
      return;
    }

    try {
      const response = await fetch('/api/notifications?type=invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send invite notification.');
      }
  
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  const handleRemoveMember = (uid: string) => {
    setMembers((prev) => {
      const updatedMembers = { ...prev };
      delete updatedMembers[uid];
      return updatedMembers;
    });

    setMembersToUserMap((prev) => {
      const updatedMap = { ...prev };
      delete updatedMap[uid];
      return updatedMap;
    });
  };

  const handleRoleChange = (email: string, newRole: CalendarRole) => {
    if (email === user.email) {
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
          <label htmlFor="name" className="text-lg font-semibold mb-4">
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
          <InviteMemberDialog 
            onSubmit={handleSendInvite} 
            calendarId={calendarId}
          />
        </div>
        <ul>
          {Object.keys(members).map((memberUid) => ( memberUid != user.uid && 
            <li key={memberUid} className="flex items-center justify-between mb-2">
              <span>{membersToUserMap[memberUid].email}</span>
              <div className="flex items-center">
                <select
                  value={members[memberUid]}
                  onChange={(e) => handleRoleChange(memberUid, e.target.value as CalendarRole)}
                  className="mr-2 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                >
                  <option value={CalendarRole.EDITOR}>Editor</option>
                  <option value={CalendarRole.VIEWER}>Viewer</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(memberUid)}
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
