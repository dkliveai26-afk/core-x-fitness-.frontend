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
    const bookingsCol = db.collection('bookings');
    const bookings = await bookingsCol.find().sort({ createdAt: -1 }).toArray();

    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { error: 'No data available to export.' },
        { status: 404 }
      );
    }

    // Format real MongoDB documents for clean Excel presentation
    const exportData = bookings.map((b, index) => ({
      '#': index + 1,
      'Booking ID': b._id.toString(),
      'Athlete Name': b.customerName || 'N/A',
      'Email Address': b.email || 'N/A',
      'Phone Number': b.phone || 'N/A',
      'State': b.state || 'West Bengal',
      'City': b.city || 'Kolkata',
      'Selected Plan / Service': b.planName || 'N/A',
      'Price': b.planPrice || 'N/A',
      'Billing Period': b.planPeriod || 'N/A',
      'Allocation Type': b.bookingType || 'N/A',
      'Preferred Date': b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : 'N/A',
      'Current Status': b.status || 'PENDING',
      'Notes Count': Array.isArray(b.notes) ? b.notes.length : 0,
      'Submission Date (UTC)': b.createdAt ? new Date(b.createdAt).toISOString() : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

    // Auto-size column widths
    const columnKeys = Object.keys(exportData[0] || {});
    worksheet['!cols'] = columnKeys.map((key) => ({
      wch: Math.max(key.length, 18),
    }));

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const timestamp = new Date().toISOString().split('T')[0];

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="corex_bookings_export_${timestamp}.xlsx"`,
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch (error) {
    console.error('API /api/admin/bookings/export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel export from MongoDB.' },
      { status: 500 }
    );
  }
}
