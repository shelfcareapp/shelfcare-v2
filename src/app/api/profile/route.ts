import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import UserModel from '@/models/user';
import dbConnect from '@/lib/mongoose';

export async function GET() {
  try {
    const { user } = await validateRequest();

    await dbConnect();

    const userData = await UserModel.findById(user.id);

    if (!userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const { user } = await validateRequest();
    const body = await req.json();

    console.log('Incoming request body:', body);

    await dbConnect();

    const update = {
      $set: body
    };

    const updatedUser = await UserModel.findByIdAndUpdate(user.id, update, {
      new: true,
      upsert: true
    });

    console.log('Updated user:', updatedUser);

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
