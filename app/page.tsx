"use client";

import { useState } from "react";
import { Container, Header, Menu, MenuItemProps } from "semantic-ui-react";
import EmployeeList from "./components/employee-list";
import EmployeeForm from "./components/employee-form";

export default function Home() {
  const [activeItem, setActiveItem] = useState("list");

  const handleItemClick = (e: React.MouseEvent, data: MenuItemProps) => {
    if (typeof data.name === "string") {
      setActiveItem(data.name);
    }
  };

  return (
    <Container style={{ marginTop: "2em" }}>
      <Header as="h2">Employee Management</Header>
      <Menu pointing secondary>
        <Menu.Item
          name="list"
          active={activeItem === "list"}
          onClick={handleItemClick}
        >
          Employee List
        </Menu.Item>
        <Menu.Item
          name="add"
          active={activeItem === "add"}
          onClick={handleItemClick}
        >
          Add Employee
        </Menu.Item>
      </Menu>

      {activeItem === "list" && <EmployeeList />}
      {activeItem === "add" && <EmployeeForm />}
    </Container>
  );
}
