import dbConnect from '@/lib/mongoose';
import UserModel from '@/models/user';
import { redirect } from 'next/navigation';
import { lucia } from '@/lib/auth';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';

export async function signin(_: any, formData: FormData) {
  'use server';

  const username = formData.get('username');
  const password = formData.get('password') as any;

  await dbConnect();
  const existingUser = await UserModel.findOne({ username: username });

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password
  );

  if (!validPassword) {
    return {
      error: 'Invalid credentials'
    };
  }

  const session = await lucia.createSession(existingUser._id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/');
}
