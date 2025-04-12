"use client";

import React, { useState, useEffect } from "react";
import { Notification, NotificationType } from "@/models/Notification";
import InviteNotification from "@/components/notifications/InviteNotification";
import EventNotification from "@/components/notifications/EventNotification";
import { ObjectId } from "mongodb";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user) return;
        const response = await fetch("/api/notifications/" + user.uid);
        if (!response.ok) {
          throw new Error("Failed to fetch notifications.");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleAccept = async (id: ObjectId) => {
    const notification = notifications.find((n) => n._id?.toString() === id.toString());
    if (!notification) return;
    const data = { calendarId: notification.calendarId, message: notification.message, userId: notification.userId };
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to accept notification.");
      }
      setNotifications((prev) =>
        prev.filter((notification) => notification._id?.toString() !== id.toString())
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDecline = async (id: ObjectId) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to decline notification.");
      }
      setNotifications((prev) =>
        prev.filter((notification) => notification._id?.toString() !== id.toString())
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleMarkAsRead = async (id: ObjectId) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to decline notification.");
      }
      setNotifications((prev) =>
        prev.filter((notification) => notification._id?.toString() !== id.toString())
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const renderNotification = (notification: Notification) => {
    switch (notification.type) {
      case NotificationType.INVITE:
        return (
          <InviteNotification
            key={notification._id?.toString() || "unknown-key"}
            notification={notification}
            onAccept={() => notification._id && handleAccept(notification._id)}
            onDecline={() => notification._id && handleDecline(notification._id)}
          />
        );
      case NotificationType.EVENT:
        return (
          <EventNotification
            key={notification._id?.toString() || "unknown-key"}
            notification={notification}
            onMarkAsRead={() => notification._id && handleMarkAsRead(notification._id)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 text-purple-800">
      <h1 className="text-3xl font-semibold p-6">Notifications</h1>
      <div className="p-6 pt-0">
        {notifications.map((notification) => renderNotification(notification))}
      </div>
    </div>
  );
}
