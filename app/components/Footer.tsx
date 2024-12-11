'use client';

import { Container, Segment, Grid, Header, List } from 'semantic-ui-react';

const Footer = () => {
  return (
    <Segment inverted vertical style={{ 
      padding: '2em 0em',
      marginTop: 'auto',
      width: '100%'
    }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={7} mobile={16} tablet={8} computer={7}>
              <Header as='h4' inverted>
                Badge Management System
              </Header>
              <p className="text-sm md:text-base">
                Efficiently manage temporary badges and track their status.
              </p>
            </Grid.Column>
            <Grid.Column width={3} mobile={16} tablet={8} computer={3}>
              <Header inverted as='h4'>
                Links
              </Header>
              <List link inverted className="text-sm md:text-base">
                <List.Item as='a' href='/'>Home</List.Item>
                <List.Item as='a' href='/badges'>Badges</List.Item>
                <List.Item as='a' href='/about'>About</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={6} mobile={16} computer={6}>
              <Header as='h4' inverted>
                Contact
              </Header>
              <p className="text-sm md:text-base">
                For support, please contact the IT department.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};

export default Footer;
