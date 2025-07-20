import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const chambre = await prisma.chambre.findUnique({
      where: { id: Number(id) },
      include: { months: true },
    });
    
    return NextResponse.json(chambre);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch chambre', details: (error as Error).message }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    const chambre = await prisma.chambre.update({
      where: { id: Number(id) },
      data,
    });
    
    return NextResponse.json(chambre);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update chambre', details: (error as Error).message }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Delete all months related to the chambre first (if not cascading)
    await prisma.month.deleteMany({ where: { chambreId: Number(id) } });
    // Then delete the chambre
    await prisma.chambre.delete({ where: { id: Number(id) } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message }, 
      { status: 500 }
    );
  }
}