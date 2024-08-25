"use client";

import { useState } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import { Employee } from "@/types/employee";

export default function EmployeeForm() {
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    id: "",
    building: "Caleres1",
    provider: "Staffmark",
  });
  const [message, setMessage] = useState<{
    content: string;
    negative?: boolean;
    positive?: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (response.ok) {
      setMessage({ content: "Employee added successfully", positive: true });
      setEmployee({
        name: "",
        id: "",
        building: "Caleres1",
        provider: "Staffmark",
      });
      // Optionally, you can trigger a refresh of the employee list here
    } else {
      setMessage({ content: "Failed to add employee", negative: true });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: "building" | "provider", value: string) => {
    if (name === "building" && (value === "Caleres1" || value === "Caleres2")) {
      setEmployee((prev) => ({ ...prev, building: value }));
    } else if (
      name === "provider" &&
      (value === "Staffmark" || value === "A1")
    ) {
      setEmployee((prev) => ({ ...prev, provider: value }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Input
        fluid
        label="Name"
        placeholder="Name"
        name="name"
        value={employee.name}
        onChange={handleChange}
        required
      />
      <Form.Input
        fluid
        label="ID"
        placeholder="ID"
        name="id"
        value={employee.id}
        onChange={handleChange}
        required
      />
      <Form.Select
        fluid
        label="Building"
        options={[
          { key: "caleres1", text: "Caleres1", value: "Caleres1" },
          { key: "caleres2", text: "Caleres2", value: "Caleres2" },
        ]}
        placeholder="Building"
        name="building"
        value={employee.building}
        onChange={(_, data) =>
          handleSelectChange("building", data.value as string)
        }
        required
      />
      <Form.Select
        fluid
        label="Provider"
        options={[
          { key: "staffmark", text: "Staffmark", value: "Staffmark" },
          { key: "a1", text: "A1", value: "A1" },
        ]}
        placeholder="Provider"
        name="provider"
        value={employee.provider}
        onChange={(_, data) =>
          handleSelectChange("provider", data.value as string)
        }
        required
      />
      <Button primary type="submit">
        Add Employee
      </Button>
      {message && <Message {...message}>{message.content}</Message>}
    </Form>
  );
}
