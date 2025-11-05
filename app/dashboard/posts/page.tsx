import { redirect } from 'next/navigation';
import { auth } from '../../../lib/auth';
import PostsClient from './PostsClient';

export default async function PostsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <PostsClient />;
}
