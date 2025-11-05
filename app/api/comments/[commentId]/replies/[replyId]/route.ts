import { NextResponse } from 'next/server';
import { auth } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';

// PATCH - Update a reply
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commentId: string; replyId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { replyId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Verify that the reply exists and belongs to the user
    const existingReply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!existingReply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (existingReply.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this reply' },
        { status: 403 }
      );
    }

    const reply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        content: content.trim(),
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

    return NextResponse.json({ reply, message: 'Reply updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating reply:', error);
    return NextResponse.json({ error: 'Error updating reply' }, { status: 500 });
  }
}

// DELETE - Delete a reply
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string; replyId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { replyId } = await params;

    // Verify that the reply exists and belongs to the user
    const existingReply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!existingReply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (existingReply.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this reply' },
        { status: 403 }
      );
    }

    await prisma.reply.delete({
      where: { id: replyId },
    });

    return NextResponse.json({ message: 'Reply deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json({ error: 'Error deleting reply' }, { status: 500 });
  }
}
