import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin credentials required to export records.' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const contactsCol = db.collection('contacts');
    const contacts = await contactsCol.find().sort({ createdAt: -1 }).toArray();

    if (!contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: 'No data available to export.' },
        { status: 404 }
      );
    }

    // Format real MongoDB documents for clean Excel presentation
    const exportData = contacts.map((c, index) => ({
      '#': index + 1,
      'Dispatch ID': c._id.toString(),
      'Applicant / Sender': c.name || 'N/A',
      'Email Address': c.email || 'N/A',
      'Phone Number': c.phone || 'N/A',
      'Inquiry Topic': c.topic || 'General Inquiry',
      'Message Content': c.message || 'N/A',
      'Status': c.status || 'NEW',
      'Notes Count': Array.isArray(c.notes) ? c.notes.length : 0,
      'Dispatch Timestamp (UTC)': c.createdAt ? new Date(c.createdAt).toISOString() : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Inquiries');

    // Auto-size column widths
    const columnKeys = Object.keys(exportData[0] || {});
    worksheet['!cols'] = columnKeys.map((key) => ({
      wch: Math.max(key.length, 20),
    }));

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const timestamp = new Date().toISOString().split('T')[0];

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="corex_contacts_export_${timestamp}.xlsx"`,
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch (error) {
    console.error('API /api/admin/contacts/export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel export from MongoDB.' },
      { status: 500 }
    );
  }
}
