import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const chambres = await prisma.chambre.findMany({ include: { months: true } })
  return NextResponse.json(chambres)
}

export async function POST(req: Request) {
  const data = await req.json()
  const chambre = await prisma.chambre.create({ data })
  return NextResponse.json(chambre)
} 