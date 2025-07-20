import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string; monthId: string }> }
) {
  try {
    const { id, monthId } = await params;
    
    await prisma.month.delete({
      where: { id: Number(monthId) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message }, 
      { status: 500 }
    );
  }
}