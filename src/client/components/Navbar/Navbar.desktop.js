import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Menu, Image, Button, Icon, Dropdown } from "semantic-ui-react";
import styled from "styled-components";
import Aux from "react-aux";

import * as config from "../../../config";

const Styles = styled.div`
  a,
  a > span,
  .fancy,
  .fancy > span {
    text-transform: uppercase !important;
    letter-spacing: 0.33rem !important;
    &.header.item:hover {
      background: inherit !important;
      color: inherit !important;
    }
  }
  .Navbar-container {
    background: white !important;
    margin: 0 !important;
    border-bottom: ${({ showBorder }) =>
      showBorder ? "1px solid rgb(212, 212, 212)" : "none"} !important;
  }
`;

function DesktopNavbar({
  showBorder,
  account,
  signout,
  location: { pathname }
}) {
  return (
    <Styles showBorder={showBorder}>
      <Menu className="Navbar-container" borderless secondary>
        <Menu.Item header as={Link} to="/">
          <Image size="small" src="/logo.png" />
        </Menu.Item>
        <Menu.Menu>
          {config.NAVIGATION_LINKS.map(({ to, content }, index) => (
            <Menu.Item
              key={index}
              as={Link}
              to={to}
              content={content}
              active={to === pathname}
            />
          ))}
          <Dropdown className="fancy" item text="Explore">
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to="/shops"
                content="Shops"
                icon={config.ICON_SET[config.LINK_TYPES.SHOP]}
              />
              <Dropdown.Item
                as={Link}
                to="/artists"
                content="Artists"
                icon={config.ICON_SET[config.LINK_TYPES.ARTIST]}
              />
              <Dropdown.Item
                as={Link}
                to="/brands"
                content="Brands"
                icon={config.ICON_SET[config.LINK_TYPES.BRAND]}
              />
              <Dropdown.Item
                as={Link}
                to="/pieces"
                content="Pieces"
                icon={config.ICON_SET[config.LINK_TYPES.PIECE]}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
        <Menu.Menu position="right">
          {account ? (
            <Aux>
              <Menu.Item>
                <Button className="fancy" onClick={signout} primary basic>
                  Sign out <Icon name="sign out" />
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button as={Link} to="/my-account" primary>
                  My account <Icon name="user" />
                </Button>
              </Menu.Item>
            </Aux>
          ) : (
            <Aux>
              <Menu.Item>
                <Button as={Link} to="/sign-in" primary basic>
                  Sign in <Icon name="sign in" />
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button as={Link} to="/sign-up" primary>
                  Sign up <Icon name="send" />
                </Button>
              </Menu.Item>
            </Aux>
          )}
        </Menu.Menu>
      </Menu>
    </Styles>
  );
}

export default withRouter(DesktopNavbar);