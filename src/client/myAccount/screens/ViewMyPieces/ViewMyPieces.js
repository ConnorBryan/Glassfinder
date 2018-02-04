import React from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Button,
  Segment,
  Icon,
  Item,
  Menu
} from "semantic-ui-react";
import { partial } from "lodash";
import styled from "styled-components";

import * as config from "../../../../config";
import API from "../../../services";
import {
  genericSorts,
  renderGenericTile,
  renderGenericItem,
  renderGenericCard
} from "../../../features/common";
import ModelViewer from "../../../components/ModelViewer";
import ScreenHeader from "../../../components/ScreenHeader";

export default function MyPiecesViewer({ verbiage, account, history }) {
  if (!account) return <Redirect to="/sign-in" />;

  const props = {
    exploreService: partial(API.fetchPiecesForId, account.id),
    detailService: partial(API.fetchModel, "piece", "pieces"),
    uri: "/my-account/view-my-pieces",
    cacheTerm: "myPieces",
    plural: "pieces",
    singular: "pieces",
    icon: "puzzle",
    sorts: genericSorts,
    renderTile: renderGenericTile,
    renderItem: renderGenericItem,
    renderCard: renderGenericCard,
    renderDetail: piece => {
      const Styles = styled.div`
        .image:hover {
          cursor: pointer !important;
        }
        .fancy {
          text-transform: uppercase !important;
          letter-spacing: 0.33rem !important;
        }
        .icon {
          position: absolute !important;
          left: 1rem !important;
        }
      `;

      const { id, image, name, description, maker, location, price } = piece;
      const linkRoot = `/my-account/view-my-pieces/${id}`;
      const uploadImageLink = `${linkRoot}/upload-image`;
      const onUploadImageClick = () => history.push(uploadImageLink, { piece });
      const updateInformationLink = `${linkRoot}/update-information`;
      const onUpdateInformationClick = () =>
        history.push(updateInformationLink, { piece });
      const removePiece = async () => {
        const removeConfirmed = window.confirm(
          verbiage.ViewMyPieces_confirmRemoval
        );

        if (removeConfirmed) {
          const wasSuccessful = await API.removePiece(id);

          wasSuccessful
            ? history.push("/my-account/view-my-pieces")
            : alert(verbiage.ViewMyPieces_unableToRemove);
        }
      };

      return (
        <Styles>
          <Container>
            <Segment>
              <ScreenHeader
                icon={config.ICON_SET[config.LINK_TYPES.PIECE]}
                title={verbiage.ViewMyPieces_title}
                description={verbiage.ViewMyPieces_description}
              />
              <Segment attached="top">
                <Item.Group>
                  <Item>
                    <Item.Image
                      size="medium"
                      src={image}
                      onClick={onUploadImageClick}
                    />
                    <Item.Content>
                      <Item.Header as="h3" content={name} />
                      <Item.Meta>${price}</Item.Meta>
                      <Item.Description content={description} />
                      <Item.Extra
                        content={`${verbiage.ViewMyPieces_madeBy} ${maker}`}
                      />
                      <Item.Extra
                        content={`${verbiage.ViewMyPieces_locatedAt} ${location}`}
                      />
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Segment>
              <Menu attached="bottom" widths={2} stackable>
                <Menu.Item className="fancy" onClick={onUpdateInformationClick}>
                  <Icon name="pencil" /> {verbiage.ViewMyPieces_editPiece}
                </Menu.Item>
                <Menu.Item
                  as={Button}
                  className="fancy"
                  negative
                  onClick={removePiece}
                >
                  <Icon name="trash outline" />{" "}
                  {verbiage.ViewMyPieces_removePiece}
                </Menu.Item>
              </Menu>
            </Segment>
          </Container>
        </Styles>
      );
    }
  };

  return <ModelViewer {...props} />;
}