"use client";

import { Container, Header, Grid } from "semantic-ui-react";
import BadgeManagement from "../components/badge-management";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function BadgeManagementPage() {
  return (
    <Container fluid style={{ marginTop: "2em", padding: "0 1em" }}>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Header as="h2">Badge Management</Header>
              <Link href="/" style={{ textDecoration: 'none' }}>
                Back to Employee Management
              </Link>
            </div>
          </Grid.Column>
        </Grid.Row>

        <SignedIn>
          <Grid.Row>
            <Grid.Column>
              <BadgeManagement />
            </Grid.Column>
          </Grid.Row>
        </SignedIn>

        <SignedOut>
          <Grid.Row>
            <Grid.Column>
              <Header as="h3">Please sign in to access badge management.</Header>
            </Grid.Column>
          </Grid.Row>
        </SignedOut>
      </Grid>
    </Container>
  );
}
