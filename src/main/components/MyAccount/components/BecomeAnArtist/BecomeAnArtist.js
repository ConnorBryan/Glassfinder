import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Yup from "yup";

import API from "../../../../services";
import * as Validators from "../../../../validators";
import AbstractForm from "../../../AbstractForm";

const FIELDS = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "What do you prefer to go by?",
    value: "",
    validation: Yup.string().required("An artist name is required.")
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Tell the world about what you have to offer",
    value: "",
    validation: Validators.description
  },
  {
    name: "from",
    type: "text",
    label: "From",
    placeholder: "Where are you based out of?",
    value: "",
    validation: Yup.string().required(
      "A 'from' location is required. You don't have to get too specific."
    )
  }
];

function BecomeAnArtist({
  account,
  updateAccount,
  updateAccountLink,
  history
}) {
  if (!account) return <Redirect to="/sign-in" />;

  const onSubmit = async values => {
    const updatedAccount = await API.becomeAnArtist(account.id, values);

    if (updatedAccount) {
      updateAccount("linked", true);
      updateAccount("type", updatedAccount.type);
      updateAccountLink(updatedAccount.link);

      history.push("/my-account/upload-image");
    } else {
      history.push("/my-account");
    }
  };

  return (
    <Container>
      <AbstractForm onSubmit={onSubmit} fields={FIELDS} />
    </Container>
  );
}

export default withRouter(BecomeAnArtist);
