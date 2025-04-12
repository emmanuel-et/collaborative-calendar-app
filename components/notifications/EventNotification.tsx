import React from "react";
import { Notification } from "@/models/Notification";

interface EventNotificationProps {
  notification: Notification;
  onMarkAsRead: () => void;
}

export default function EventNotification({
  notification,
  onMarkAsRead,
}: EventNotificationProps) {
  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <p>{notification.message}</p>
      <div className="mt-2">
        <button
          onClick={onMarkAsRead}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Mark as Read
        </button>
      </div>
    </div>
  );
}
