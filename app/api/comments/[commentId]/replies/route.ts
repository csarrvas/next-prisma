import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

// GET - Get all replies for a comment
export async function GET(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const replies = await prisma.reply.findMany({
      where: {
        commentId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ replies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ error: 'Error fetching replies' }, { status: 500 });
  }
}

// POST - Create a new reply
export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Verify that the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        commentId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ reply, message: 'Reply created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json({ error: 'Error creating reply' }, { status: 500 });
  }
}
