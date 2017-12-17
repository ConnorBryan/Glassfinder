import React from "react";
import { Item, Segment } from "semantic-ui-react";

import config from "../../config";
import withPageHeader from "../../atomic/withPageHeader";

function TermsAndConditions(props) {
  return (
    <div>Terms and Conditions</div>
  );
}

TermsAndConditions.propTypes = {};

export default withPageHeader(config.pageHeaders.termsAndConditions, TermsAndConditions);
