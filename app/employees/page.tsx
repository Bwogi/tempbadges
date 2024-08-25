import React from "react";
import List from "../components/employee-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Employees = () => {
  return (
    <div className="px-5 mt-10">
      <div>
        <Link href="/">
          <Button>Add Employee</Button>
        </Link>
      </div>
      <List />
    </div>
  );
};

export default Employees;
