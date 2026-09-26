import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin credentials required' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid contact identifier' }, { status: 400 });
    }

    const body = await req.json();
    const { status, noteText } = body;

    const db = await getDatabase();
    const collection = db.collection('contacts');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateOps: any = {
      $set: {
        updatedAt: new Date().toISOString(),
      },
    };

    if (status) {
      updateOps.$set.status = status;
    }

    if (noteText && typeof noteText === 'string' && noteText.trim()) {
      const newNote = {
        id: new ObjectId().toString(),
        text: noteText.trim(),
        author: session.user?.name || 'Admin',
        createdAt: new Date().toISOString(),
      };
      updateOps.$push = { notes: newNote };
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateOps,
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Contact inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      contact: {
        ...result,
        _id: result._id.toString(),
      },
    });
  } catch (error) {
    console.error('API /api/admin/contacts/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update contact inquiry' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin credentials required' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid contact identifier' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('contacts');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Inquiry removed from database' });
  } catch (error) {
    console.error('API /api/admin/contacts/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete contact inquiry' }, { status: 500 });
  }
}
