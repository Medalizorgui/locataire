import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    const month = await prisma.month.create({
      data: {
        ...data,
        chambreId: Number(id),
      },
    });
    
    return NextResponse.json(month);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create month', details: (error as Error).message }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string; monthId: string }> }
) {
  try {
    const { id, monthId } = await params;
    const data = await req.json();
    
    const month = await prisma.month.update({
      where: { id: Number(monthId) },
      data,
    });
    
    return NextResponse.json(month);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update month', details: (error as Error).message }, 
      { status: 500 }
    );
  }
}