import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import BadgeRecord from '../../../models/BadgeRecord';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { employeeName, employeeId, badgeNumber, building, provider } = await req.json();

    // Validate required fields
    if (!employeeName || !employeeId || !badgeNumber || !building || !provider) {
      return NextResponse.json({ 
        error: `Missing required fields: ${[
          !employeeName && 'employeeName',
          !employeeId && 'employeeId',
          !badgeNumber && 'badgeNumber',
          !building && 'building',
          !provider && 'provider'
        ].filter(Boolean).join(', ')}`
      }, { status: 400 });
    }

    // Validate building enum
    if (!['Caleres1', 'Caleres2'].includes(building)) {
      return NextResponse.json({ 
        error: `Invalid building value. Must be one of: Caleres1, Caleres2. Got: ${building}`
      }, { status: 400 });
    }

    // Validate provider enum
    if (!['Staffmark', 'A1'].includes(provider)) {
      return NextResponse.json({ 
        error: `Invalid provider value. Must be one of: Staffmark, A1. Got: ${provider}`
      }, { status: 400 });
    }

    const badgeRecord = await BadgeRecord.create({
      employeeName,
      employeeId,
      badgeNumber,
      building,
      provider,
      issuedAt: new Date(),
      status: 'issued'
    });

    return NextResponse.json(badgeRecord, { status: 201 });
  } catch (error: any) {
    console.error('Error creating badge record:', error);
    return NextResponse.json({ 
      error: error.message || 'Error creating badge record'
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const records = await BadgeRecord.find().sort({ issuedAt: -1 });
    return NextResponse.json(records || []);
  } catch (error) {
    console.error('Error fetching badge records:', error);
    return NextResponse.json({ error: 'Error fetching badge records' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: 'Badge ID is required' }, { status: 400 });
    }

    const badgeRecord = await BadgeRecord.findByIdAndUpdate(
      id,
      { 
        status: 'returned',
        returnedAt: new Date()
      },
      { new: true }
    );

    if (!badgeRecord) {
      return NextResponse.json({ error: 'Badge record not found' }, { status: 404 });
    }

    return NextResponse.json(badgeRecord);
  } catch (error) {
    console.error('Error updating badge record:', error);
    return NextResponse.json({ error: 'Error updating badge record' }, { status: 500 });
  }
}
