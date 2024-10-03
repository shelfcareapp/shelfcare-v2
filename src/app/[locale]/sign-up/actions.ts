import UserModel from '@/models/user';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';

export async function signup(_: any, formData: FormData) {
  'use server';
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password') as any;

  const hashedPassword = await new Argon2id().hash(password);

  try {
    await dbConnect();
    const user = await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    const session = await lucia.createSession(user._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    console.log('error', e);
    return {
      error: 'An unknown error occurred'
    };
  }
  return redirect('/');
}
