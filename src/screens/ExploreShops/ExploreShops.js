import React from "react";
import PropTypes from "prop-types";
import { Button, Card, Icon, Image, Segment } from "semantic-ui-react";

import config from "../../config";

function Map(props) {
  return (
    <Card fluid>
      <Card.Content>Map</Card.Content>
      <Card.Content extra>
        <Button className="fancy" fluid>
          <Icon name="map pin" /> Find my location
        </Button>
      </Card.Content>
    </Card>
  );
}

function ShopCard(props) {
  return (
    <Card key={props.key}>
      <Image src={props.image} />
      <Card.Content>
        <Card.Header as="h3" className="fancy">
          {props.name}
        </Card.Header>
        <Card.Description>{props.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>
          <Icon name="phone" /> {props.phone}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>
          <Icon name="envelope" /> {props.email}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>
          {props.street}, {props.city}, {props.state} {props.zip}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button className="fancy" fluid>
          <Icon name="send" /> Visit this shop
        </Button>
      </Card.Content>
    </Card>
  );
}

function ExploreShops(props) {
  return (
    <Segment.Group>
      <Segment attached="top">
        <Map />
      </Segment>
      <Segment attached="bottom">
        <Card.Group stackable itemsPerRow={3}>
          {config.shops.map(shop => (
            <ShopCard
              key={shop.key}
              image={shop.image}
              name={shop.name}
              description={shop.description}
              phone={shop.phone}
              email={shop.email}
              street={shop.street}
              city={shop.city}
              state={shop.state}
              zip={shop.zip}
            />
          ))}
        </Card.Group>
      </Segment>
    </Segment.Group>
  );
}

ExploreShops.propTypes = {};

export default ExploreShops;
