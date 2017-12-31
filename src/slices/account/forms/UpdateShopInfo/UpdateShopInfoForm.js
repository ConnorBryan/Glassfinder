import React from "react";
import { connect } from "react-redux";
import Yup from "yup";

import config from "../../../../config";
import * as Validators from "../../../../validators";
import AbstractForm from "../../../../abstracts/AbstractForm";
import { attemptUpdateInfo } from "../../redux/actions";

const formProps = {
  icon: config.iconSet.shop,
  fields: [
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
        ...config.states.map(state => ({
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
  ]
};

function UpdateShopInfoForm({ link, attemptUpdateInfo }) {
  if (!link) return null;

  const props = {
    ...formProps,
    fields: formProps.fields.map(prop => ({
      ...prop,
      value: link[prop.name] || prop.value
    }))
  };

  const onSubmit = values => attemptUpdateInfo(values);

  return <AbstractForm onSubmit={onSubmit} {...props} />;
}

export default connect(
  state => ({
    link: state.account ? state.account.link : null
  }),
  dispatch => ({
    attemptUpdateInfo: values => dispatch(attemptUpdateInfo(values))
  })
)(UpdateShopInfoForm);
