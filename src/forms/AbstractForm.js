import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import Yup from "yup";
import styled from "styled-components";
import {
  Form,
  Container,
  Header,
  Segment,
  Button,
  Icon,
  Message,
  Dropdown
} from "semantic-ui-react";

const Aux = ({ children }) => children;

const i = "!important";

const Fancy = styled.div`
  text-transform: uppercase ${i};
  letter-spacing: 0.33rem ${i};
`;

const FancyButton = props => <Button as={Fancy} {...props} />;

function AbstractForm(props) {
  const { icon, header, description, fields, onSubmit } = props;

  const initialValues = fields.reduce(
    (values, field) => ({ ...values, [field.name]: field.value }),
    {}
  );

  const validationSchema = Yup.object().shape(
    fields.reduce(
      (schema, field) => ({ ...schema, [field.name]: field.validation }),
      {}
    )
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      render={({
        values,
        errors,
        touched,
        setFieldValue,
        handleChange,
        handleSubmit,
        handleReset,
        isSubmitting
      }) => (
        <Form as={Container}>
          <Segment.Group stacked>
            {fields.map(field => {
              const inputProps = {
                ...field,
                error: !!(touched[field.name] && errors[field.name]),
                value: values[field.name],
                onChange: handleChange
              };

              const handleSelect = (event, { value }) =>
                setFieldValue(inputProps.name, value);

              const inputTypes = {
                textarea: () => (
                  <Form.Field control="textarea" {...inputProps} />
                ),
                select: () => (
                  <Form.Field>
                    <label>{inputProps.label}</label>
                    <Dropdown
                      placeholder={inputProps.placeholder}
                      search
                      selection
                      options={inputProps.options}
                      onChange={handleSelect}
                    />
                  </Form.Field>
                )
              };

              return (
                <Aux key={field.name}>
                  <Segment attached="bottom" key={field.name}>
                    {inputTypes[field.type] ? (
                      inputTypes[field.type]()
                    ) : (
                      <Form.Input {...inputProps} />
                    )}
                    {touched[field.name] &&
                    errors[field.name] && (
                      <Message
                        icon="warning sign"
                        header={errors[field.name]}
                        negative
                      />
                    )}
                  </Segment>
                </Aux>
              );
            })}
            <Segment attached="bottom">
              <Button.Group fluid>
                <FancyButton
                  onClick={handleReset}
                  content="Reset"
                  disabled={isSubmitting}
                  negative
                />
                <Button.Or />
                <FancyButton
                  onClick={handleSubmit}
                  content="Send"
                  disabled={isSubmitting}
                  positive
                />
              </Button.Group>
            </Segment>
          </Segment.Group>
        </Form>
      )}
    />
  );
}

AbstractForm.propTypes = {
  icon: PropTypes.string,
  header: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.object),
  validate: PropTypes.func,
  onSubmit: PropTypes.func
};

AbstractForm.defaultProps = {
  icon: "",
  header: "",
  description: "",
  fields: [],
  validate: values => true,
  onSubmit: values => alert(JSON.stringify(values, null, 2))
};

export default AbstractForm;
