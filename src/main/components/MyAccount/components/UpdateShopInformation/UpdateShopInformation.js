import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { Container, Segment } from "semantic-ui-react";
import Yup from "yup";

import { LINK_TYPES, ICON_SET, STATES } from "../../../../config";
import { removeFromCache } from "../../../../util";
import API from "../../../../services";
import * as Validators from "../../../../validators";
import ScreenHeader from "../../../ScreenHeader";
import AbstractForm from "../../../AbstractForm";

const FIELDS = [
  {
    name: "name",
    type: "text",
    label: "Business name",
    placeholder: "Enter the name of your establishment",
    value: "",
    validation: Yup.string().required("A business name is required.")
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Tell the world about what your business has to offer",
    value: "",
    validation: Validators.description
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter email",
    value: "",
    validation: Validators.email
  },
  {
    name: "phone",
    type: "text",
    label: "Phone number",
    placeholder: "Enter the business phone number",
    value: "",
    validation: Validators.phone
  },
  {
    name: "street",
    type: "text",
    label: "Street",
    placeholder: "Enter the street address of the business",
    value: "",
    validation: Yup.string().required("A street address is required.")
  },
  {
    name: "city",
    type: "text",
    label: "City",
    placeholder: "Enter the city of the business",
    value: "",
    validation: Yup.string().required("A city is required.")
  },
  {
    name: "state",
    type: "select",
    label: "State",
    placeholder: "Select a state",
    value: "",
    options: [
      { key: "select", value: "", text: "Select a state" },
      STATES.map(state => ({
        key: state,
        value: state,
        text: state
      }))
    ],
    validation: Yup.string().required("A state must be selected.")
  },
  {
    name: "zip",
    type: "string",
    label: "ZIP",
    placeholder: "Enter the ZIP code of the business",
    value: "",
    validation: Yup.string()
      .matches(/^\d{5}(?:[-\s]\d{4})?$/, "A valid ZIP is required.")
      .required("A valid ZIP is required.")
  }
];

function UpdateShopInformation({
  verbiage,
  account,
  updateAccountLink,
  history
}) {
  if (!account) return <Redirect to="/sign-in" />;

  const fields = FIELDS.map(prop => ({
    ...prop,
    value: account.link[prop.name] || prop.value
  }));

  const onSubmit = async values => {
    const { street, city, state, zip } = values;
    const address = window.encodeURIComponent(
      `${street}, ${city}, ${state} ${zip}`
    );
    const coordinates = await API.transformAddressToCoordinates(address);

    if (coordinates) {
      const { lat, lng } = coordinates;

      values.lat = lat;
      values.lng = lng;

      const link = await API.updateInformation(account.id, values);

      if (link) updateAccountLink(link);

      removeFromCache("shops", "shopsById");
    } else {
      alert("That address doesn't seem to be a real place.\nPlease try again.");
    }

    history.push("/my-account");
  };

  return (
    <Container as={Segment}>
      <ScreenHeader
        icon={ICON_SET[LINK_TYPES.SHOP]}
        title={verbiage.UpdateShopInformation_title}
        description={verbiage.UpdateShopInformation_description}
      />
      <AbstractForm onSubmit={onSubmit} fields={fields} />
    </Container>
  );
}

export default withRouter(UpdateShopInformation);
