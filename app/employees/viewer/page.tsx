"use client";

import { Container, Header } from "semantic-ui-react";
import EmployeeList from "../components/employee-list";

export default function ViewerPage() {
  return (
    <Container fluid style={{ marginTop: "2em", padding: "0 1em" }}>
      <div className="header-container">
        <Header as="h2">Employee Directory</Header>
      </div>
      <EmployeeList viewerMode={true} />
    </Container>
  );
}
