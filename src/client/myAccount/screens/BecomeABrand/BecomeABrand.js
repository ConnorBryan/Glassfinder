import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Yup from "yup";

import * as config from "../../../../config";
import API from "../../../services";
import * as Validators from "../../../validators";
import FormScreen from "../../../components/FormScreen";

const FIELDS = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter the name of your brand",
    value: "",
    validation: Yup.string().required("A brand name is required.")
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Tell the world about what your brand has to offer",
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
  },
  {
    name: "site",
    type: "text",
    label: "Site",
    placeholder: "Where can we find you on the web?",
    value: "",
    validation: Yup.string().matches(
      /[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/,
      "A brand website must be a valid URL."
    )
  }
];

function BecomeABrand({
  verbiage,
  account,
  updateAccount,
  updateAccountLink,
  history,
  displayNotification
}) {
  if (!account) return <Redirect to="/sign-in" />;

  const onSubmit = async values => {
    const updatedAccount = await API.becomeABrand(account.id, values);

    if (updatedAccount) {
      updateAccount("linked", true);

      history.push("/my-account");

      return displayNotification(config.LINK_REQUEST_SUCCESS_NOTIFICATION);
    }

    history.push("/my-account");

    return displayNotification(config.LINK_REQUEST_FAILURE_NOTIFICATION);
  };

  const screenHeader = {
    icon: config.ICON_SET[config.LINK_TYPES.BRAND],
    title: verbiage.BecomeABrand_title,
    description: verbiage.BecomeABrand_description
  };

  const abstractForm = {
    onSubmit,
    fields: FIELDS
  };

  return (
    <FormScreen
      withImage
      {...{ splash: config.BRAND_SPLASH, screenHeader, abstractForm }}
    />
  );
}

export default withRouter(BecomeABrand);
