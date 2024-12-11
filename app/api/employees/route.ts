import { NextRequest, NextResponse } from "next/server";
import dbConnect from '../../../lib/dbConnect';
import Employee from '../../../models/Employee';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database successfully');

    // Check if we have a valid database connection
    const connection = mongoose.connection;
    if (!connection || !connection.db) {
      throw new Error('Database connection not established');
    }

    // Log the current database and collection
    const db = connection.db;
    console.log('Current database:', db.databaseName);
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Count documents in the employees collection
    const count = await Employee.countDocuments();
    console.log('Total employees in collection:', count);

    const { searchParams } = new URL(request.url);
    const wantsPagination = searchParams.get('paginate') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchQuery = searchParams.get('q') || '';
    const building = request.headers.get('x-building');

    let query: any = {};
    if (building) {
      query.building = building;
    }
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { id: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    let employees;
    if (wantsPagination) {
      const skip = (page - 1) * limit;
      employees = await Employee.find(query)
        .skip(skip)
        .limit(limit)
        .select('id name building provider');
    } else {
      employees = await Employee.find(query)
        .select('id name building provider');
    }

    return NextResponse.json(employees);
  } catch (error: any) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch employees", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['id', 'name', 'building', 'provider'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate enum fields
    if (!['Caleres1', 'Caleres2'].includes(data.building)) {
      return NextResponse.json(
        { error: "Building must be either 'Caleres1' or 'Caleres2'" },
        { status: 400 }
      );
    }

    if (!['Staffmark', 'A1'].includes(data.provider)) {
      return NextResponse.json(
        { error: "Provider must be either 'Staffmark' or 'A1'" },
        { status: 400 }
      );
    }

    const employee = await Employee.create(data);
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate entry found", details: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create employee", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error: any) {
    console.error("Failed to update employee:", error);
    return NextResponse.json(
      { 
        error: "Failed to update employee", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employee = await Employee.findByIdAndDelete(id);
    
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete employee:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete employee", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
