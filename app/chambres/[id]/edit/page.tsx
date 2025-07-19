import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import EditChambreClient from './EditChambreClient';

export default async function EditChambrePage({ params }: { params: any }) {
  const resolvedParams = (typeof params?.then === 'function') ? await params : params;
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return <EditChambreClient params={resolvedParams} />;
} 