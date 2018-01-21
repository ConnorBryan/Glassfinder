import React from "react";
import PropTypes from "prop-types";
import { Segment, Header, Icon } from "semantic-ui-react";
import styled from "styled-components";

import { fancy } from "../../styles/snippets";

const Styles = styled.div`
  .header {
    ${fancy};
  }
`;

function ScreenHeader({ icon, title, description }) {
  return (
    <Styles>
      <Segment attached="top">
        <Header as="h3">
          <Icon name={icon} /> {title}
        </Header>
      </Segment>
      <Segment attached="bottom">{description}</Segment>
    </Styles>
  );
}

ScreenHeader.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default ScreenHeader;
