'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function PostsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  // Load posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/my-posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create post
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/my-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPosts();
        setFormData({ title: '', content: '' });
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Error creating post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating post');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit post
  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/my-posts/${editingPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPosts();
        setFormData({ title: '', content: '' });
        setEditingPost(null);
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Error updating post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating post');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/my-posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting post');
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white">My Posts</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage all your posts</p>
          </div>
          <button
            onClick={() => {
              setEditingPost(null);
              setFormData({ title: '', content: '' });
              setShowForm(true);
            }}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + New Post
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
              {editingPost ? 'Edit Post' : 'New Post'}
            </h2>
            <form onSubmit={editingPost ? handleUpdate : handleCreate}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingPost ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
            <p className="text-gray-600 dark:text-gray-400">
              You don&apos;t have any posts yet. Create your first post!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-zinc-900"
              >
                <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
                  {post.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">{post.content}</p>
                <div className="mb-4 text-xs text-gray-500 dark:text-gray-500">
                  <p>Created: {new Date(post.createdAt).toLocaleDateString('en-US')}</p>
                  {post.updatedAt !== post.createdAt && (
                    <p>Updated: {new Date(post.updatedAt).toLocaleDateString('en-US')}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 rounded-md bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
