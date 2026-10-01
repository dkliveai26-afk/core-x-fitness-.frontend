import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '50')));
    const campaignId = searchParams.get('campaignId');
    const type = searchParams.get('type');

    const db = await getDatabase();
    const logsCol = db.collection('email_logs');

    const query: any = {};
    if (campaignId) query.campaignId = campaignId;
    if (type && type !== 'ALL') query.type = type;

    const [logs, total] = await Promise.all([
      logsCol.find(query).sort({ createdAt: -1 }).limit(limit).toArray(),
      logsCol.countDocuments(query),
    ]);

    const formattedLogs = logs.map((l) => ({
      ...l,
      _id: l._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      logs: formattedLogs,
      total,
    });
  } catch (error: any) {
    console.error('API /api/admin/campaigns/logs error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to retrieve email logs.' }, { status: 500 });
  }
}
