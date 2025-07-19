import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, password: hashed } });
  return NextResponse.json({ success: true });
}