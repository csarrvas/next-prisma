'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Author {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  replies: Reply[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  comments: Comment[];
}

export default function PostsPageClient() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [editingComment, setEditingComment] = useState<{
    id: string;
    type: 'comment' | 'reply';
    postId: string;
    commentId?: string;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; postId: string } | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
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

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleCreateComment = async (postId: string) => {
    if (!session?.user) {
      alert('You must be logged in to comment');
      return;
    }

    if (!newCommentContent.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newCommentContent }),
      });

      if (response.ok) {
        await fetchPosts();
        setNewCommentContent('');
      } else {
        const error = await response.json();
        alert(error.error || 'Error creating comment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating comment');
    }
  };

  const handleUpdateComment = async (commentId: string, content: string, postId: string) => {
    if (!content.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        await fetchPosts();
        setEditingComment(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Error updating comment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating comment');
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting comment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting comment');
    }
  };

  const handleCreateReply = async (commentId: string) => {
    if (!session?.user) {
      alert('You must be logged in to reply');
      return;
    }

    if (!newReplyContent.trim()) {
      alert('Reply cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newReplyContent }),
      });

      if (response.ok) {
        await fetchPosts();
        setNewReplyContent('');
        setReplyingTo(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Error creating reply');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating reply');
    }
  };

  const handleUpdateReply = async (replyId: string, content: string, commentId: string) => {
    if (!content.trim()) {
      alert('Reply cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/replies/${replyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        await fetchPosts();
        setEditingComment(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Error updating reply');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating reply');
    }
  };

  const handleDeleteReply = async (replyId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/replies/${replyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting reply');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting reply');
    }
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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white">All Posts</h1>
          {session?.user && (
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Dashboard →
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
            <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-black dark:text-white">{post.title}</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    By {post.author.name || post.author.username} •{' '}
                    {new Date(post.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
                <p className="mb-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {post.content}
                </p>

                <div className="border-t border-gray-200 pt-4 dark:border-zinc-700">
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="mb-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    {expandedComments.has(post.id) ? 'Hide' : 'Show'} Comments (
                    {post.comments.length})
                  </button>

                  {expandedComments.has(post.id) && (
                    <div className="space-y-4">
                      {/* Create Comment Form */}
                      {session?.user && (
                        <div className="rounded-md bg-gray-50 p-4 dark:bg-zinc-800">
                          <textarea
                            placeholder="Write a comment..."
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            rows={3}
                            className="mb-2 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleCreateComment(post.id)}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                          >
                            Post Comment
                          </button>
                        </div>
                      )}

                      {/* Comments List */}
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border-l-2 border-gray-200 pl-4 dark:border-zinc-700"
                        >
                          <div className="mb-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-black dark:text-white">
                                  {comment.author.name || comment.author.username}
                                </span>
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString('en-US')}
                                </span>
                              </div>
                              {session?.user?.id === comment.author.id && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      setEditingComment({
                                        id: comment.id,
                                        type: 'comment',
                                        postId: post.id,
                                      })
                                    }
                                    className="text-xs text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id, post.id)}
                                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                            {editingComment?.id === comment.id &&
                            editingComment.type === 'comment' ? (
                              <div className="mt-2">
                                <textarea
                                  defaultValue={comment.content}
                                  rows={3}
                                  className="mb-2 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                  onBlur={(e) => {
                                    if (e.target.value !== comment.content) {
                                      handleUpdateComment(comment.id, e.target.value, post.id);
                                    } else {
                                      setEditingComment(null);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                      const target = e.target as HTMLTextAreaElement;
                                      handleUpdateComment(comment.id, target.value, post.id);
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingComment(null);
                                    }
                                  }}
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-gray-700 dark:text-gray-300">
                                {comment.content}
                              </p>
                            )}
                          </div>

                          {/* Reply Button */}
                          {session?.user && replyingTo?.commentId !== comment.id && (
                            <button
                              onClick={() =>
                                setReplyingTo({ commentId: comment.id, postId: post.id })
                              }
                              className="mb-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                              Reply
                            </button>
                          )}

                          {/* Reply Form */}
                          {replyingTo?.commentId === comment.id && (
                            <div className="mb-4 ml-4 rounded-md bg-gray-50 p-3 dark:bg-zinc-800">
                              <textarea
                                placeholder="Write a reply..."
                                value={newReplyContent}
                                onChange={(e) => setNewReplyContent(e.target.value)}
                                rows={2}
                                className="mb-2 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCreateReply(comment.id)}
                                  className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                >
                                  Post Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setNewReplyContent('');
                                  }}
                                  className="rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-300 dark:bg-zinc-700 dark:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Replies List */}
                          {comment.replies.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="border-l-2 border-gray-300 pl-3 dark:border-zinc-600"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="font-semibold text-sm text-black dark:text-white">
                                        {reply.author.name || reply.author.username}
                                      </span>
                                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(reply.createdAt).toLocaleDateString('en-US')}
                                      </span>
                                    </div>
                                    {session?.user?.id === reply.author.id && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() =>
                                            setEditingComment({
                                              id: reply.id,
                                              type: 'reply',
                                              postId: post.id,
                                              commentId: comment.id,
                                            })
                                          }
                                          className="text-xs text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteReply(reply.id, comment.id)}
                                          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  {editingComment?.id === reply.id &&
                                  editingComment.type === 'reply' ? (
                                    <div className="mt-2">
                                      <textarea
                                        defaultValue={reply.content}
                                        rows={2}
                                        className="mb-2 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                        onBlur={(e) => {
                                          if (
                                            e.target.value !== reply.content &&
                                            editingComment.commentId
                                          ) {
                                            handleUpdateReply(
                                              reply.id,
                                              e.target.value,
                                              editingComment.commentId
                                            );
                                          } else {
                                            setEditingComment(null);
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === 'Enter' &&
                                            e.ctrlKey &&
                                            editingComment.commentId
                                          ) {
                                            const target = e.target as HTMLTextAreaElement;
                                            handleUpdateReply(
                                              reply.id,
                                              target.value,
                                              editingComment.commentId
                                            );
                                          }
                                          if (e.key === 'Escape') {
                                            setEditingComment(null);
                                          }
                                        }}
                                        autoFocus
                                      />
                                    </div>
                                  ) : (
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                      {reply.content}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
