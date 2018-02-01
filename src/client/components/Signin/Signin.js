import React from "react";
import { Redirect } from "react-router-dom";
import { Container, Segment } from "semantic-ui-react";

import * as Validators from "../../validators";
import FormScreen from "../FormScreen";

const FIELDS = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter email",
    value: "",
    validation: Validators.email
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter password",
    value: "",
    validation: Validators.password
  }
];

function Signin({ verbiage, account, history, signin }) {
  if (account) return <Redirect to="/my-account" />;

  const onSubmit = async ({ email, password }) => {
    const wasSuccessful = await signin(email, password);

    wasSuccessful && history.push("/my-account");
  };

  const actions = [
    {
      icon: "envelope",
      content: "Send new verification",
      onClick: () => history.push("/verification")
    }
  ];

  const screenHeader = {
    icon: "sign in",
    title: verbiage.Signin_title,
    description: verbiage.Signin_description
  };

  const abstractForm = {
    onSubmit,
    actions,
    fields: FIELDS
  };

  return <FormScreen {...{ screenHeader, abstractForm }} />;
}

export default Signin;