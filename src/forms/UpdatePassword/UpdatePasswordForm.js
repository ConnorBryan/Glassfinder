import React from "react";
import Yup from "yup";

import * as Validators from "../../validators";
import AbstractForm from "../AbstractForm";

const props = {
  icon: "lock",
  header: "Update password",
  description: "Good for you for making sure your information stays safe.",
  fields: [
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Enter password",
      value: "",
      validation: Validators.password
    },
    {
      name: "passwordAgain",
      type: "password",
      label: "Password, again",
      placeholder: "Enter password again",
      value: "",
      validation: Validators.passwordAgain
    }
  ],
  onSubmit: values => {
    alert(`Updating password with ${JSON.stringify(values, null, 2)}`);
  }
};

export default function UpdatePasswordForm() {
  return <AbstractForm {...props} />;
}
