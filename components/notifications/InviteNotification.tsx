import React from "react";
import { Notification } from "@/models/Notification";

interface InviteNotificationProps {
  notification: Notification;
  onAccept: () => void;
  onDecline: () => void;
}

export default function InviteNotification({
  notification,
  onAccept,
  onDecline,
}: InviteNotificationProps) {
  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <p>{notification.message}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
