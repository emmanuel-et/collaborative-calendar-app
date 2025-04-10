import clientPromise from '@/utils/mongodb';
import { User, UserInput } from '@/models/User';

export async function createUser(userData: UserInput): Promise<User> {
  const client = await clientPromise;
  const db = client.db();
  
  const newUser: User = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('users').insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}

export async function getUserByUid(uid: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection('users').findOne<User>({ uid });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection('users').findOne<User>({ email });
}

export async function updateUser(uid: string, userData: Partial<User>): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();
  
  const updateData = {
    ...userData,
    updatedAt: new Date(),
  };
  
  const result = await db.collection('users').findOneAndUpdate(
    { uid },
    { $set: updateData },
    { returnDocument: 'after' }
  );
  
  return result?.value || null;
}
