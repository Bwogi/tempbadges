import BadgeManagement from '../components/badge-management';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function BadgesPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Badge Management</h1>
      <BadgeManagement />
    </div>
  );
}
