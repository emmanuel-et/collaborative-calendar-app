import clientPromise from "@/utils/mongodb";
import { User, UserInput } from "@/models/User";
import { Calendar, CalendarRole } from "@/models/Calendar";
import { NextRequest } from "next/server";

export async function createUser(userData: UserInput): Promise<User> {
  const client = await clientPromise;
  const db = client.db();

  const newUser: User = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}

export async function getUserByUid(uid: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();

  return db.collection("users").findOne<User>({ uid });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();

  return db.collection("users").findOne<User>({ email });
}

export async function getUserFromRequest(
  request: NextRequest
): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();

  const user = request.headers.get("user");

  if (!user) {
    console.error("User field is missing in the request body");
    return null;
  }

  return db.collection("users").findOne<User>({ uid: user });
}

export function getUserRole(
  calendar: Calendar,
  userId: string
): CalendarRole | null {
  return calendar.members[userId] || null;
}

export async function updateUser(
  uid: string,
  userData: Partial<User>
): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();

  const updateData = {
    ...userData,
    updatedAt: new Date(),
  };

  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { uid },
      { $set: updateData },
      { returnDocument: "after" }
    );

  return result?.value || null;
}
