import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { redirect } from 'next/navigation';
import ChambreDetailsClient from './ChambreDetailsClient';

export default async function ChambreDetailsPage({ params }: { params: any }) {
  const resolvedParams = (typeof params?.then === 'function') ? await params : params;
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return <ChambreDetailsClient params={resolvedParams} />;
} 