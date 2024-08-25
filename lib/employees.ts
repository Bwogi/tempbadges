import fs from "fs/promises";
import path from "path";
import { Employee } from "@/types/employee";

const filePath = path.join(process.cwd(), "data", "employees.json");

export async function readEmployees(): Promise<Employee[]> {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data).employees;
}

export async function writeEmployees(employees: Employee[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify({ employees }, null, 2));
}
