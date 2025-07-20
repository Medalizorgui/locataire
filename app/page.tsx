import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/authOptions';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function RentalManagement() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return <DashboardClient />;
}
