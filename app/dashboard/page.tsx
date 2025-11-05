import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../lib/auth';
import LogoutButton from './LogoutButton';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black dark:text-white">Dashboard</h1>
          <LogoutButton />
        </div>
        <div className="space-y-4">
          <div className="rounded-md bg-gray-50 p-4 dark:bg-zinc-800">
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Session Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Email:</span> {session.user?.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Username:</span>{' '}
              {session.user?.username || session.user?.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">ID:</span> {session.user?.id}
            </p>
          </div>
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="mb-4 text-sm text-blue-800 dark:text-blue-300">
              This is a protected route. You can only see it if you are authenticated.
            </p>
            <div className="flex gap-4">
              <Link
                href="/manage-posts"
                className="inline-block rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Manage Posts →
              </Link>
              <Link
                href="/posts"
                className="inline-block rounded-md bg-green-600 px-6 py-2 text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                View All Posts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
