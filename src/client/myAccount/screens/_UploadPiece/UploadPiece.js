import React, { Component } from "react";
import { Formik, Field } from "formik";
import styled from "styled-components";
import { Dropdown, Loader } from "semantic-ui-react";

import API from "../../../services";
import ImageUpload from "../../../components/ImageUpload";

/** */
export class InputWithDropdown extends Component {
  render() {
    const { term, onChange, options } = this.props;

    return (
      <Dropdown
        placeholder={`Enter ${term}`}
        fluid
        search
        onChange={(event, data) => onChange(data.value)}
        noResultsMessage={`No ${term}s found. Enter the artist in in the input below.`}
        options={options}
      />
    );
  }
}

/** */

const Styles = styled.div`
  margin: 0 10vw;

  pre {
    color: white;
  }

  fieldset {
    border: none;

    label {
      display: block;
      color: white;
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
        touched[name] && errors[name] ? <span>{errors[name]}</span> : null
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

  next = values =>
    this.setState(prevState => ({
      page: Math.min(prevState.page + 1, this.props.children.length - 1),
      values
    }));

  previous = () =>
    this.setState(prevState => ({
      page: Math.max(prevState.page - 1, 0)
    }));

  validate = values => ({});

  handleSubmit = (values, bag) => {
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;
    const finalValues = {
      ...values,
      image: window.GLASSFINDER_GLOBAL_SHARE.imageUpload || values.image || ""
    };

    return isLastPage
      ? onSubmit(finalValues)
      : this.next(finalValues) || bag.setSubmitting(false);
  };

  render() {
    const { children } = this.props;
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    const isLastPage = page === React.Children.count(children) - 1;

    return (
      <Styles>
        <Formik
          className="Wizard"
          initialValues={values}
          enableReinitialize={false}
          validate={this.validate}
          onSubmit={this.handleSubmit}
          render={({ values, handleSubmit, isSubmitting, handleReset }) => (
            <form onSubmit={handleSubmit}>
              {activePage}
              <section className="buttons">
                {page > 0 && (
                  <button type="button" onClick={this.previous}>
                    Previous
                  </button>
                )}
                {!isLastPage && <button type="submit">Next</button>}
                {isLastPage && (
                  <button type="submit" disabled={isSubmitting}>
                    Finish
                  </button>
                )}
              </section>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </form>
          )}
        />
      </Styles>
    );
  }
}

export default class UploadPiece extends Component {
  state = {
    loading: true,
    originalArtists: [],
    artists: [],
    originalBrands: [],
    brands: []
  };

  componentDidMount() {
    this.fetchArtistsAndBrands();
  }

  fetchArtistsAndBrands = async () => {
    const [artists, brands] = await Promise.all([
      API.retrieveAllArtists(),
      API.retrieveAllBrands()
    ]);
    const formattedArtists = this.formatData(artists);
    const formattedBrands = this.formatData(brands);

    this.setState(
      {
        loading: false,
        artists: formattedArtists,
        originalArtists: formattedArtists,
        brands: formattedBrands,
        originalBrands: formattedBrands
      },
      () => console.log(this.state)
    );
  };

  formatData = data =>
    data.map(datum => ({
      key: datum.name,
      value: datum.id,
      text: datum.name
    }));

  render() {
    const { loading, artists, brands } = this.state;

    if (loading) return <Loader>Loading...</Loader>;

    return (
      <div className="UploadPiece">
        <Wizard
          initialValues={{
            name: "",
            description: "",
            maker: "",
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
              const { account: { id } } = this.props;
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
            <fieldset>
              <label>Name</label>
              <Field
                name="name"
                component="input"
                type="text"
                placeholder="Name"
                validate={required}
              />
            </fieldset>
            <fieldset>
              <label>Description</label>
              <Field
                name="description"
                component="textarea"
                placeholder="Description"
                validate={required}
              />
            </fieldset>
            <fieldset>
              <label>Maker</label>
              <Field
                name="maker"
                component="input"
                type="text"
                placeholder="Maker"
                validate={required}
              />
            </fieldset>
            <fieldset>
              <label>Price</label>
              <Field
                name="price"
                component="input"
                type="number"
                placeholder="13.37"
                validate={required}
              />
            </fieldset>
            <fieldset>
              <label>Location</label>
              <Field
                name="location"
                component="input"
                type="text"
                placeholder="Location"
                validate={required}
              />
            </fieldset>
          </Wizard.Page>
          {/* Page 2: Association */}
          <Wizard.Page>
            <fieldset>
              <label>Artist</label>
              <Field
                name="artist"
                render={renderProps => {
                  const onChange = artist =>
                    renderProps.form.setValues({
                      ...renderProps.form.values,
                      artist
                    });

                  return (
                    <InputWithDropdown
                      term="artist"
                      onChange={onChange}
                      options={artists}
                    />
                  );
                }}
              />
            </fieldset>
            <fieldset>
              <label>Artist Entry</label>
              <Field
                name="artistEntry"
                component="input"
                type="text"
                placeholder="Enter an artist..."
              />
            </fieldset>
            <fieldset>
              <label>Brand</label>
              <Field
                name="brand"
                render={renderProps => {
                  const onChange = brand =>
                    renderProps.form.setValues({
                      ...renderProps.form.values,
                      brand
                    });

                  return (
                    <InputWithDropdown
                      term="brand"
                      onChange={onChange}
                      options={brands}
                    />
                  );
                }}
              />
            </fieldset>
            <fieldset>
              <label>Brand Entry</label>
              <Field
                name="brandEntry"
                component="input"
                type="text"
                placeholder="Enter a brand..."
              />
            </fieldset>
          </Wizard.Page>
          {/* Page 3: Association */}
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
    );
  }
}