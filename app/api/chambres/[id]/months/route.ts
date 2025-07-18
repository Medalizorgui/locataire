import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const month = await prisma.month.create({
    data: {
      ...data,
      chambreId: Number(params.id),
    },
  })
  return NextResponse.json(month)
}

export async function PUT(req: Request, { params }: { params: { id: string; monthId: string } }) {
  const data = await req.json()
  const month = await prisma.month.update({
    where: { id: Number(params.monthId) },
    data,
  })
  return NextResponse.json(month)
} 