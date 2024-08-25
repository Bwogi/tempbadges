"use client";

import { useState, useEffect } from "react";
import { Table, Button, Input, Grid } from "semantic-ui-react";
import { Employee } from "@/types/employee";
import EditableRow from "./editable-row";

interface EmployeeListProps {
  viewerMode?: boolean;
}

export default function EmployeeList({
  viewerMode = false,
}: EmployeeListProps) {
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
    if (viewerMode) return;
    const response = await fetch(`/api/employees?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchEmployees();
    }
  };

  const handleEdit = (id: string) => {
    if (viewerMode) return;
    setEditingId(id);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    if (viewerMode) return;
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
    if (viewerMode) return;
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
        fluid
      />
      <div className="desktop-view">
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Building</Table.HeaderCell>
              <Table.HeaderCell>Provider</Table.HeaderCell>
              {!viewerMode && <Table.HeaderCell>Actions</Table.HeaderCell>}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredEmployees.map((employee) =>
              editingId === employee.id && !viewerMode ? (
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
                  {!viewerMode && (
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
                  )}
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>
      </div>
      <div className="mobile-view">
        <Grid>
          {filteredEmployees.map((employee) => (
            <Grid.Row
              key={employee.id}
              style={{
                marginBottom: "1em",
                padding: "1em",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <Grid.Column width={16}>
                <p>
                  <strong>Name:</strong> {employee.name}
                </p>
                <p>
                  <strong>ID:</strong> {employee.id}
                </p>
                <p>
                  <strong>Building:</strong> {employee.building}
                </p>
                <p>
                  <strong>Provider:</strong> {employee.provider}
                </p>
                {!viewerMode && (
                  <Button.Group fluid>
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
                )}
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      </div>
    </div>
  );
}
