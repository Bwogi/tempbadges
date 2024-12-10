import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    const db = client.db(process.env.MONGODB_DB);
    console.log('Database selected:', process.env.MONGODB_DB);
    
    const collection = db.collection("employees");
    console.log('Accessing employees collection');
    
    const employees = await collection.find({}).toArray();
    console.log('Query executed, found', employees.length, 'employees');
    
    return NextResponse.json(employees);
  } catch (e) {
    const error = e as Error;
    console.error("Failed to fetch employees - Detailed error:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: "Failed to fetch employees", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const employee = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection("employees").insertOne(employee);
    return NextResponse.json(
      { ...employee, _id: result.insertedId },
      { status: 201 }
    );
  } catch (e) {
    const error = e as Error;
    console.error("Failed to add employee - Detailed error:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: "Failed to add employee", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedEmployee = await request.json();
    const { _id, ...employeeWithoutId } = updatedEmployee;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    await db
      .collection("employees")
      .updateOne({ _id: new ObjectId(_id) }, { $set: employeeWithoutId });
    return NextResponse.json(updatedEmployee);
  } catch (e) {
    const error = e as Error;
    console.error("Failed to update employee - Detailed error:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: "Failed to update employee", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }

    const result = await db.collection("employees").deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee deleted" });
  } catch (e) {
    const error = e as Error;
    console.error("Failed to delete employee - Detailed error:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: "Failed to delete employee", details: error.message },
      { status: 500 }
    );
  }
}
