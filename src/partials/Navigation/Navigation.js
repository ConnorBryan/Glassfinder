import React from "react";
import { connect } from "react-redux";
import { Responsive, Menu, Icon } from "semantic-ui-react";
import styled from "styled-components";

import config from "../../config";
import { getIdFromPath } from "../../util";
import { showSidebar, hideSidebar } from "../../redux/actions";
import NavigationItem from "../../components/NavigationItem";

function Navigation(props) {
  const { sidebar, showSidebar, hideSidebar, activePathname } = props;

  return (
    <Menu attached="top" compact color={config.color}>
      <NavigationItem
        fancy
        active={activePathname === "/"}
        id="home"
        to="/"
        title={config.appName}
      />
      {config.socialMedia.map(({ to, icon }) => (
        <Menu.Item key={icon} as="a" href={to} icon={icon} />
      ))}
      <Responsive
        as={Menu.Menu}
        maxWidth={Responsive.onlyMobile.maxWidth}
        position="right"
      >
        <Menu.Item
          as={SemiFancy}
          active={sidebar}
          onClick={sidebar ? hideSidebar : showSidebar}
        >
          <Icon name="bars" />
        </Menu.Item>
      </Responsive>
      <Responsive
        as={Menu.Menu}
        minWidth={Responsive.onlyMobile.maxWidth}
        position="right"
      >
        {config.navigation.map(item => (
          <NavigationItem
            key={item.key}
            id={getIdFromPath(item.to)}
            active={activePathname === item.to}
            {...item}
          />
        ))}
      </Responsive>
    </Menu>
  );
}

export default connect(
  state => ({
    sidebar: state.sidebar,
    activePathname: state.router.location.pathname
  }),
  dispatch => ({
    showSidebar: () => dispatch(showSidebar()),
    hideSidebar: () => dispatch(hideSidebar())
  })
)(Navigation);

/* Styling */

const SemiFancy = styled.div`letter-spacing: 0.1rem;`;
