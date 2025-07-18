import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const chambre = await prisma.chambre.findUnique({
    where: { id: Number(params.id) },
    include: { months: true },
  })
  return NextResponse.json(chambre)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const chambre = await prisma.chambre.update({
    where: { id: Number(params.id) },
    data,
  })
  return NextResponse.json(chambre)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Delete all months related to the chambre first (if not cascading)
    await prisma.month.deleteMany({ where: { chambreId: Number(params.id) } })
    // Then delete the chambre
    await prisma.chambre.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
} 