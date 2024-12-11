'use client';

import { useRouter } from 'next/navigation';
import { Button, Container, Header, Grid, Segment } from 'semantic-ui-react';
import { useEffect } from 'react';

export default function BuildingSelect() {
  const router = useRouter();

  const selectBuilding = (building: string) => {
    localStorage.setItem('selectedBuilding', building);
    router.push('/badge-management');
  };

  useEffect(() => {
    // Clear any existing building selection when visiting this page
    localStorage.removeItem('selectedBuilding');
  }, []);

  return (
    <Container style={{ marginTop: '3rem' }}>
      <Segment raised>
        <Header as='h2' textAlign='center' style={{ marginBottom: '2rem' }}>
          Select Building Location
        </Header>
        <Grid columns={2} stackable centered>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Button
                size='massive'
                color='blue'
                onClick={() => selectBuilding('Caleres1')}
                style={{ minWidth: '200px', margin: '1rem' }}
              >
                Caleres1
              </Button>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Button
                size='massive'
                color='green'
                onClick={() => selectBuilding('Caleres2')}
                style={{ minWidth: '200px', margin: '1rem' }}
              >
                Caleres2
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
}
