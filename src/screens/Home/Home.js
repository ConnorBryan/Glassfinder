import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Card,
  Item,
  Icon,
  Message,
  Segment
} from "semantic-ui-react";

import config from "../../config";
import withPageHeader from "../../atomic/withPageHeader";
import HeroCard from "../../atomic/HeroCard";
import Update from "../../atomic/Update";

function Home(props) {
  return (
    <Container>
      <Card.Group stackable itemsPerRow={3}>
        {config.heroes.map(hero => <HeroCard {...hero} />)}
      </Card.Group>
      <Item.Group as={Segment} divided relaxed="very" attached="top">
        <Item>
          <Item.Header as="h3" className="fancy">
            <Icon name="newspaper" /> Latest Updates
          </Item.Header>
        </Item>
        {config.updates.map(update => <Update key={update.key} {...update} />)}
      </Item.Group>
      <Message attached="bottom">
        <Button.Group fluid>
          <Button
            as={Link}
            className="fancy"
            to="/updates"
            icon="arrow circle right"
            primary
          >
            View all <Icon name="arrow circle right" />
          </Button>
        </Button.Group>
      </Message>
    </Container>
  );
}

export default withPageHeader(config.pageHeaders.home, Home);
