"use client";

import { Container, Header } from "semantic-ui-react";
import EmployeeList from "../components/employee-list";

export default function ViewerPage() {
  return (
    <Container fluid style={{ marginTop: "2em", padding: "0 1em" }}>
      <Header as="h2">Employee Directory</Header>
      <EmployeeList viewerMode={true} />
    </Container>
  );
}
