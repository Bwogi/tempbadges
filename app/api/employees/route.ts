import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const employees = await db.collection("employees").find({}).toArray();
    return NextResponse.json(employees);
  } catch (e) {
    console.error("Failed to fetch employees:", e);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
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
    console.error("Failed to add employee:", e);
    return NextResponse.json(
      { error: "Failed to add employee" },
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
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update employee" },
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
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
