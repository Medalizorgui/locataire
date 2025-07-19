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

export async function DELETE(req: Request, { params }: { params: { id: string; monthId: string } }) {
  try {
    await prisma.month.delete({
      where: { id: Number(params.monthId) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 