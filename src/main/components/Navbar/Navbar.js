import React from "react";
import { Container, Responsive } from "semantic-ui-react";

import MobileNavbar from "./Navbar.mobile";
import DesktopNavbar from "./Navbar.desktop";

function Navbar() {
  return (
    <Container>
      <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
        <MobileNavbar />
      </Responsive>
      <Responsive minWidth={Responsive.onlyTablet.maxWidth}>
        <DesktopNavbar />
      </Responsive>
    </Container>
  );
}

export default Navbar;