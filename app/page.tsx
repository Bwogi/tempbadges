"use client";

import { useState } from "react";
import {
  Container,
  Header,
  Menu,
  MenuItemProps,
  Grid,
} from "semantic-ui-react";
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
    <Container fluid style={{ marginTop: "2em", padding: "0 1em" }}>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as="h2">Employee Management</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Menu pointing secondary className="desktop-menu">
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
            <Menu vertical fluid className="mobile-menu">
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
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {activeItem === "list" && <EmployeeList viewerMode={false} />}
            {activeItem === "add" && <EmployeeForm />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
