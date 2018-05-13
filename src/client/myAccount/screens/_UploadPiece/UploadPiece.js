import React, { Component } from "react";
import { Formik, Field } from "formik";
import styled from "styled-components";
import {
  Form,
  Container,
  Segment,
  Dropdown,
  Loader,
  Menu
} from "semantic-ui-react";
import Yup from "yup";
import accounting from "accounting";
import _ from "lodash";

import API from "../../../services";
import { fancy, evenBiggerText } from "../../../styles/snippets";
import ImageUpload from "../../../components/ImageUpload";
import InputDropdown from "../../../components/InputDropdown";

const Styles = styled.div`
  border: 1px solid #555 !important;
  background: #1b1c1d !important;
  margin: 0 10vw;

  @media (max-width: 450px) {
    margin: 0 !important;
  }

  .error {
    display: block;
    color: indianred;
    margin-top: 0.66rem;
  }

  .title {
    ${fancy} font-size: 1.7rem;
    color: white !important;
  }

  .description {
    font-size: 1.2rem;
    color: white !important;
  }

  .menu-nav {
    margin-top: 3rem !important;

    .item {
      ${fancy} &:hover {
        cursor: pointer;
      }
      border: 1px solid #555 !important;
      border-left: none !important;
      border-right: none !important;
    }
  }

  .segment {
    border: none !important;
    color: white !important;

    label {
      display: block;
      ${fancy};
      ${evenBiggerText};
      margin-bottom: 1.5rem !important;
    }

    input,
    textarea {
      border: 1px solid #555 !important;
      background-color: transparent !important;
      border: 1px solid #555 !important;
      color: white !important;

      &:focus {
        border: 1px solid #555 !important;
      }
    }
  }
`;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const required = value => (value ? undefined : "Required");

function Error({ name }) {
  return (
    <Field
      {...{ name }}
      render={({ form: { touched, errors } }) =>
        touched[name] && errors[name] ? (
          <span className="error">{errors[name]}</span>
        ) : null
      }
    />
  );
}

window.GLASSFINDER_GLOBAL_SHARE = {
  imageUpload: null
};

class Wizard extends Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues
    };
  }

  next = values => {
    this.setState(prevState => ({
      page: Math.min(prevState.page + 1, this.props.children.length - 1),
      values
    }));
  };

  previous = e =>
    e.preventDefault() ||
    this.setState(prevState => ({
      page: Math.max(prevState.page - 1, 0)
    }));

  validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(100, "Piece names must be fewer than 100 characters.")
      .required("A piece must have a name."),
    description: Yup.string()
      .max(500, "Piece descriptions must be fewer than 500 characters.")
      .required("A piece must have a description."),
    price: Yup.number()
      .positive("A piece cannot have a negative price.")
      .min(1.0, "A piece cannot be listed for free.")
      .max(1000000.0, "A piece cannot cost more than a million bucks.")
      .required("A piece must have a price."),
    location: Yup.string()
      .max(1, "A piece's location must be fewer than 100 characters.")
      .required("A piece must have a location.")
  });

  handleSubmit = ({ values, errors, setTouched, setSubmitting }) => {
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;
    const finalValues = {
      ...values,
      image: window.GLASSFINDER_GLOBAL_SHARE.imageUpload || values.image || ""
    };

    // Don't allow progress past first page if any values are missing,
    for (const field of [
      values.name,
      values.description,
      values.price,
      values.location
    ]) {
      if (!field) {
        setTouched({
          name: true,
          description: true,
          price: true,
          location: true
        });

        return window.scrollTo({ top: 0 });
      }
    }

    if (isLastPage) {
      onSubmit(finalValues);
    } else {
      this.next(finalValues);
      setSubmitting(false);
    }
  };

  render() {
    const { children } = this.props;
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    const isLastPage = page === React.Children.count(children) - 1;
    const menuWidth = page === 0 ? 1 : 2;

    return (
      <Styles>
        <Formik
          className="Wizard"
          initialValues={values}
          enableReinitialize={false}
          validationSchema={this.validationSchema}
          onSubmit={this.handleSubmit}
          render={props => (
            <Form
              onSubmit={e => e.preventDefault() || this.handleSubmit(props)}
            >
              <Segment inverted>
                <h2 className="title">Upload a piece</h2>
                <p className="description">
                  Fill out the information on these three pages to add a piece
                  to your collection. When users visit your page, they will be
                  able to see the piece you have added.
                </p>
              </Segment>

              {activePage}

              <Menu
                className="menu-nav"
                size="large"
                widths={menuWidth}
                inverted
                fluid
              >
                {page > 0 && (
                  <Menu.Item as="button" onClick={this.previous}>
                    Previous
                  </Menu.Item>
                )}
                {!isLastPage && (
                  <Menu.Item as="button" type="submit">
                    Next
                  </Menu.Item>
                )}
                {isLastPage && (
                  <Menu.Item
                    as="button"
                    type="submit"
                    disabled={props.isSubmitting}
                  >
                    Finish
                  </Menu.Item>
                )}
              </Menu>
              <pre>{JSON.stringify(props.values, null, 2)}</pre>
            </Form>
          )}
        />
      </Styles>
    );
  }
}

export default class UploadPiece extends Component {
  formatData = data =>
    data.map(datum => ({
      key: datum.name,
      value: datum.id,
      text: datum.name
    }));

  render() {
    return (
      <Container>
        <div className="UploadPiece">
          <Wizard
            initialValues={{
              name: "",
              description: "",
              price: "",
              location: "",
              artist: "",
              artistEntry: "",
              brand: "",
              brandEntry: "",
              image: ""
            }}
            onSubmit={values => {
              sleep(300).then(() => {
                const {
                  account: { id }
                } = this.props;
                const finalValues = { ...values, id };
                // window.alert(JSON.stringify(values, null, 2));
                // actions.setSubmitting(false);
                API.uploadPiece(finalValues)
                  .then(() => console.log("Done!"))
                  .catch(err => console.error(err));
              });
            }}
          >
            {/* Page 1: Basic Information */}
            <Wizard.Page>
              <Segment.Group>
                <Segment inverted>
                  <label>Name</label>
                  <Field
                    name="name"
                    component="input"
                    type="text"
                    placeholder="Name"
                  />
                  <Error name="name" />
                </Segment>
                <Segment inverted>
                  <label>Description</label>
                  <Field
                    name="description"
                    component="textarea"
                    placeholder="Description"
                  />
                  <Error name="description" />
                </Segment>
                <Segment inverted>
                  <label>Price</label>
                  <Field
                    name="price"
                    type="number"
                    placeholder="13.37"
                    render={({
                      field,
                      field: { value },
                      form: { setFieldValue }
                    }) => (
                      <input
                        type="number"
                        {...field}
                        step="0.01"
                        onBlur={() =>
                          setFieldValue(
                            "price",
                            accounting.toFixed(
                              _.clamp(value, 1.0, 1000000.0),
                              2
                            )
                          )
                        }
                      />
                    )}
                  />
                  <Error name="price" />
                </Segment>
                <Segment inverted>
                  <label>Location</label>
                  <Field
                    name="location"
                    component="input"
                    type="text"
                    placeholder="Location"
                  />
                  <Error name="location" />
                </Segment>
              </Segment.Group>
            </Wizard.Page>
            {/* Page 2: Association */}
            <Wizard.Page>
              <Segment className="form-segment" inverted>
                <Field
                  name="artist"
                  render={renderProps => {
                    const handleSubmit = artist =>
                      renderProps.form.setValues({
                        ...renderProps.form.values,
                        artist,
                        artistEntry: ""
                      });
                    const handleNoMatchSubmit = artistEntry =>
                      renderProps.form.setValues({
                        ...renderProps.form.values,
                        artist: "",
                        artistEntry
                      });
                    const additionalClearButtonFunctionality = () =>
                      renderProps.form.setValues({
                        ...renderProps.form.values,
                        artist: "",
                        artistEntry: ""
                      });

                    return (
                      <InputDropdown
                        inputLabel="Artist"
                        inputDescription="Select an artist with a Glassfinder account to provide credit and to have the piece show up on their profile. If they do not have a Glassfinder account, simply enter their name and press <Enter>."
                        placeholder="Select an artist."
                        service={API.retrieveAllArtists}
                        onSubmit={handleSubmit}
                        onNoMatchSubmit={handleNoMatchSubmit}
                        additionalClearButtonFunctionality={
                          additionalClearButtonFunctionality
                        }
                      />
                    );
                  }}
                />
              </Segment>
              <Segment className="form-segment" inverted>
                <Field
                  name="brand"
                  render={renderProps => {
                    const handleSubmit = brand =>
                      renderProps.form.setValues({
                        ...renderProps.form.values,
                        brand,
                        brandEntry: ""
                      });
                    const handleNoMatchSubmit = brandEntry =>
                      renderProps.form.setValues({
                        ...renderProps.form.values,
                        brand: "",
                        brandEntry
                      });
                    const additionalClearButtonFunctionality = () =>
                      renderProps.form.setValues({
                        ...renderProps.form.values,
                        brand: "",
                        brandEntry: ""
                      });

                    return (
                      <InputDropdown
                        inputLabel="Brand"
                        inputDescription="Select a brand with a Glassfinder account to provide further information for users. If the brand does not have a Glassfinder account, simply enter their name and press <Enter>."
                        placeholder="Select a brand."
                        service={API.retrieveAllBrands}
                        onSubmit={handleSubmit}
                        onNoMatchSubmit={handleNoMatchSubmit}
                        additionalClearButtonFunctionality={
                          additionalClearButtonFunctionality
                        }
                      />
                    );
                  }}
                />
              </Segment>
            </Wizard.Page>
            {/* Page 3: Image Upload */}
            <Wizard.Page>
              <ImageUpload
                onSubmit={image =>
                  (window.GLASSFINDER_GLOBAL_SHARE.imageUpload = image)
                }
                initialImage="https://placehold.it/300x300"
              />
            </Wizard.Page>
          </Wizard>
        </div>
      </Container>
    );
  }
}
