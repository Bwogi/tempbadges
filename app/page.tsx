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
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
              <Header as="h2">Employee Management</Header>
              <div>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal" />
                </SignedOut>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
        <SignedIn>
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
        </SignedIn>
        <SignedOut>
          <Grid.Row>
            <Grid.Column>
              <p>Please sign in to manage employees.</p>
            </Grid.Column>
          </Grid.Row>
        </SignedOut>
      </Grid>
    </Container>
  );
}
