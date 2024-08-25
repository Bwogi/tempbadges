import { NextRequest, NextResponse } from "next/server";
import { Employee } from "@/types/employee";
import { readEmployees, writeEmployees } from "@/lib/employees";

export async function GET() {
  const employees = await readEmployees();
  return NextResponse.json(employees);
}

export async function POST(request: NextRequest) {
  const employee: Employee = await request.json();
  if (employee.building !== "Caleres1" && employee.building !== "Caleres2") {
    return NextResponse.json({ error: "Invalid building" }, { status: 400 });
  }
  if (employee.provider !== "Staffmark" && employee.provider !== "A1") {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }
  const employees = await readEmployees();
  employees.push(employee);
  await writeEmployees(employees);
  return NextResponse.json(employee, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedEmployee: Employee = await request.json();
  if (
    updatedEmployee.building !== "Caleres1" &&
    updatedEmployee.building !== "Caleres2"
  ) {
    return NextResponse.json({ error: "Invalid building" }, { status: 400 });
  }
  if (
    updatedEmployee.provider !== "Staffmark" &&
    updatedEmployee.provider !== "A1"
  ) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }
  let employees = await readEmployees();
  employees = employees.map((emp) =>
    emp.id === updatedEmployee.id ? updatedEmployee : emp
  );
  await writeEmployees(employees);
  return NextResponse.json(updatedEmployee);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  let employees = await readEmployees();
  employees = employees.filter((employee) => employee.id !== id);
  await writeEmployees(employees);
  return NextResponse.json({ message: "Employee deleted" });
}
