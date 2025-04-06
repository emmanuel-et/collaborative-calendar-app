import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUid, updateUser } from '@/lib/db';
import { UserInput } from '@/models/User';

// GET /api/users?uid=123
export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const user = await getUserByUid(uid);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const userData: UserInput = await request.json();
    
    // Validate required fields
    if (!userData.uid || !userData.email || !userData.name) {
      return NextResponse.json(
        { error: 'Missing required fields: uid, email, name' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await getUserByUid(userData.uid);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = await createUser(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/users?uid=123
export async function PATCH(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const updateData = await request.json();
    const updatedUser = await updateUser(uid, updateData);
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 