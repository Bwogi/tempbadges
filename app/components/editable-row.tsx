import React, { useState } from "react";
import { Table, Button, Input, Select } from "semantic-ui-react";
import { Employee } from "@/types/employee";

interface EditableRowProps {
  employee: Employee;
  onSave: (updatedEmployee: Employee) => void;
  onCancel: () => void;
}

export default function EditableRow({
  employee,
  onSave,
  onCancel,
}: EditableRowProps) {
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: "building" | "provider", value: string) => {
    if (name === "building" && (value === "Caleres1" || value === "Caleres2")) {
      setEditedEmployee((prev) => ({ ...prev, building: value }));
    } else if (
      name === "provider" &&
      (value === "Staffmark" || value === "A1")
    ) {
      setEditedEmployee((prev) => ({ ...prev, provider: value }));
    }
  };

  return (
    <Table.Row>
      <Table.Cell>
        <Input
          fluid
          name="name"
          value={editedEmployee.name}
          onChange={handleChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          fluid
          name="id"
          value={editedEmployee.id}
          onChange={handleChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Select
          fluid
          options={[
            { key: "caleres1", text: "Caleres1", value: "Caleres1" },
            { key: "caleres2", text: "Caleres2", value: "Caleres2" },
          ]}
          value={editedEmployee.building}
          onChange={(_, data) =>
            handleSelectChange("building", data.value as string)
          }
        />
      </Table.Cell>
      <Table.Cell>
        <Select
          fluid
          options={[
            { key: "staffmark", text: "Staffmark", value: "Staffmark" },
            { key: "a1", text: "A1", value: "A1" },
          ]}
          value={editedEmployee.provider}
          onChange={(_, data) =>
            handleSelectChange("provider", data.value as string)
          }
        />
      </Table.Cell>
      <Table.Cell>
        <Button.Group>
          <Button positive onClick={() => onSave(editedEmployee)}>
            Save
          </Button>
          <Button.Or />
          <Button onClick={onCancel}>Cancel</Button>
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  );
}
