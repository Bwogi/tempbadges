import React from "react";
import List from "../components/employee-list-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmployeeForm from "../components/employee-form";

const Employees = () => {
  return (
    <div className="px-5 mt-10">
      <div>
        <h1 className="text-center text-2xl mb-10">Employee List</h1>
        <List />
        {/* <Link href="/">
          <Button>Add Employee</Button>
        </Link> */}
      </div>
      {/* <List />s */}
    </div>
  );
};

export default Employees;
