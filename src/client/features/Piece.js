import React from "react";
import { Link } from "react-router-dom";
import {
  Responsive,
  Container,
  Segment,
  Divider,
  Button,
  Item,
  Icon
} from "semantic-ui-react";
import Aux from "react-aux";
import accounting from "accounting";

import * as config from "../../config";
import ScreenHeader from "../components/ScreenHeader";
import Thing from "../components/Thing";
import ModelExplorer from "../components/ModelExplorer";
import ModelDetail from "../components/ModelDetail";
import ModelViewer from "../components/ModelViewer";
import API from "../services";
import {
  genericSorts,
  renderGenericTile,
  renderGenericItem,
  renderGenericCard
} from "./common";

export function PieceThing(props) {
  const {
    id,
    name: title,
    image,
    price: top,
    location: bottom,
    description: content
  } = props;
  const actions = [
    {
      icon: "eye",
      content: "View",
      as: Link,
      to: `/pieces/${id}`
    },
    {
      icon: "dollar",
      content: "Purchase",
      as: Link,
      to: `/pieces/${id}/purchase`
    }
  ];

  return (
    <Thing
      {...{
        title,
        image,
        top: accounting.formatMoney(top),
        bottom,
        content,
        actions
      }}
    />
  );
}

function PieceDetail({ id }) {
  const props = {
    id,
    fetchModel: API.fetchPiece,
    render: model => <PieceThing {...model} />
  };

  return <ModelDetail {...props} />;
}

export function PieceExplorer({
  match: {
    params: { id }
  }
}) {
  const props = {
    icon: config.ICON_SET[config.LINK_TYPES.PIECE],
    title: `Explore ${config.LINK_TYPES_TO_RESOURCES[config.LINK_TYPES.PIECE]}`,
    resource: config.LINK_TYPES_TO_RESOURCES[config.LINK_TYPES.PIECE],
    fetchModels: API.fetchPieces,
    cacheKey: config.PIECE_CACHE_KEY,
    cacheExpiration: config.PIECE_CACHE_EXPIRATION,
    renderItems: (models = []) =>
      models.map((model, index) => <PieceThing key={index} {...model} />),

    shouldRenderItems: !id,
    detailTitle: `Pictures`,
    fetchDetailModels: async () => ({
      page: [],
      totalPages: 1,
      totalModels: 0,
      perPage: 6
    }),
    renderDetail: id => <PieceDetail {...{ id }} />,
    renderDetailItems: (models = []) =>
      models.map((model, index) => {
        return <p key={index}>Derp</p>;
      })
  };

  return (
    <Aux>
      <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
        <ModelExplorer compact {...props} />
      </Responsive>
      <Responsive minWidth={Responsive.onlyComputer.minWidth}>
        <ModelExplorer {...props} />
      </Responsive>
    </Aux>
  );
}

export function PieceViewer({ verbiage }) {
  const props = {
    exploreService: API.fetchPieces,
    detailService: API.fetchPiece,
    uri: "/pieces",
    plural: "pieces",
    singular: "piece",
    icon: "puzzle",
    sorts: genericSorts,
    renderTile: renderGenericTile,
    renderItem: renderGenericItem,
    renderCard: renderGenericCard,
    renderDetail: ({ image, name, price, description, maker, location }) => {
      return (
        <Segment clearing>
          <Item.Group>
            <Item>
              <Item.Image size="medium" src={image} />
              <Item.Content>
                <Item.Header as="h3" content={name} />
                <Item.Meta>${price}</Item.Meta>
                <Item.Description content={description} />
                <Item.Extra content={`Made by ${maker}`} />
                <Item.Extra content={`Located at ${location}`} />
              </Item.Content>
            </Item>
          </Item.Group>
          <Button floated="right" primary>
            <Icon name="dollar" /> Purchase this piece
          </Button>
        </Segment>
      );
    }
  };

  return (
    <Container>
      <ScreenHeader
        icon={config.ICON_SET[config.LINK_TYPES.PIECE]}
        title={verbiage.ExplorePieces_title}
        description={verbiage.ExplorePieces_description}
      />
      <Divider hidden section />
      <ModelViewer {...props} />
      <Divider hidden section />
    </Container>
  );
}
