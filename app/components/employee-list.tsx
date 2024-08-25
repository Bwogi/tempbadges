"use client";

import { useState, useEffect } from "react";
import { Table, Button, Input } from "semantic-ui-react";
import { Employee } from "@/types/employee";
import EditableRow from "./editable-row";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();
    setEmployees(data);
    setFilteredEmployees(data);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/employees?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchEmployees();
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    const response = await fetch("/api/employees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEmployee),
    });
    if (response.ok) {
      setEditingId(null);
      fetchEmployees();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(query) ||
        employee.id.includes(query) ||
        employee.building.toLowerCase().includes(query) ||
        employee.provider.toLowerCase().includes(query)
      );
    });
    setFilteredEmployees(filtered);
  };

  return (
    <div>
      <Input
        icon="search"
        placeholder="Search employees..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: "1em" }}
      />
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Building</Table.HeaderCell>
            <Table.HeaderCell>Provider</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredEmployees.map((employee) =>
            editingId === employee.id ? (
              <EditableRow
                key={employee.id}
                employee={employee}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <Table.Row key={employee.id}>
                <Table.Cell>{employee.name}</Table.Cell>
                <Table.Cell>{employee.id}</Table.Cell>
                <Table.Cell>{employee.building}</Table.Cell>
                <Table.Cell>{employee.provider}</Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    <Button primary onClick={() => handleEdit(employee.id)}>
                      Edit
                    </Button>
                    <Button.Or />
                    <Button
                      color="red"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
            )
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
