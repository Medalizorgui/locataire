import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string; monthId: string } }) {
  const data = await req.json()
  const month = await prisma.month.update({
    where: { id: Number(params.monthId) },
    data,
  })
  return NextResponse.json(month)
} 