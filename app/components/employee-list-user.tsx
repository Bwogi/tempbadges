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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("Received non-array data:", data);
        throw new Error("Received invalid data format");
      }
      setEmployees(data);
      setFilteredEmployees(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees. Please try again later.");
      setEmployees([]);
      setFilteredEmployees([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (viewerMode) return;
    try {
      const response = await fetch(`/api/employees?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete employee");
      }
      await fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete employee. Please try again."
      );
    }
  };

  const handleEdit = (id: string) => {
    if (viewerMode) return;
    setEditingId(id);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    if (viewerMode) return;
    try {
      const response = await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });
      if (!response.ok) {
        throw new Error("Failed to update employee");
      }
      setEditingId(null);
      await fetchEmployees();
    } catch (err) {
      console.error("Error updating employee:", err);
      setError("Failed to update employee. Please try again.");
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

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      {filteredEmployees.length === 0 ? (
        <div>No employees found.</div>
      ) : (
        <>
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
                  editingId === employee._id?.toString() && !viewerMode ? (
                    <EditableRow
                      key={employee._id?.toString()}
                      employee={employee}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  ) : (
                    <Table.Row key={employee._id?.toString()}>
                      <Table.Cell>{employee.name}</Table.Cell>
                      <Table.Cell>{employee.id}</Table.Cell>
                      <Table.Cell>{employee.building}</Table.Cell>
                      <Table.Cell>{employee.provider}</Table.Cell>
                      {!viewerMode && (
                        <Table.Cell>
                          <Button.Group>
                            <Button
                              primary
                              onClick={() =>
                                handleEdit(employee._id?.toString() || "")
                              }
                            >
                              Edit
                            </Button>
                            <Button.Or />
                            <Button
                              color="red"
                              onClick={() =>
                                handleDelete(employee._id?.toString() || "")
                              }
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
                  key={employee._id?.toString()}
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
                        <Button
                          primary
                          onClick={() =>
                            handleEdit(employee._id?.toString() || "")
                          }
                        >
                          Edit
                        </Button>
                        <Button.Or />
                        <Button
                          color="red"
                          onClick={() =>
                            handleDelete(employee._id?.toString() || "")
                          }
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
        </>
      )}
    </div>
  );
}
