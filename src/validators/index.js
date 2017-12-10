import Yup from "yup";

export const email = Yup.string()
  .email("Invalid email address")
  .required("Email is required.");

export const password = Yup.string()
  .min(6, "Password must be at least 6 characters.")
  .max(128, "Password cannot exceed 128 characters.")
  .required("Password is required.");

export const passwordAgain = Yup.mixed().test(
  "match",
  "Passwords must match",
  function(password) {
    return password === this.options.parent.password;
  }
);
