import React from "react";

import {
  Field,
  Form,
  Formik,
  FieldProps,
  FormikConfig,
  FormikValues,
} from "formik";
import * as Yup from "yup";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  return (
    <>
      <input {...props} placeholder={props.placeholder} />
    </>
  );
};

interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {}

const FormikStep: React.FC<FormikStepProps> = ({ children }) => {
  return <>{children}</>;
};

type Props = FormikConfig<FormikValues>;

const FormikStepper: React.FC<Props> = (props) => {
  const { children } = props;

  const childrenArray = React.Children.toArray(children) as React.ReactElement<
    FormikStepProps
  >[];

  const [step, setStep] = React.useState(0);

  const currentChild = childrenArray[step] as React.ReactElement<
    FormikStepProps
  >;

  const isLastStep = () => {
    return step === childrenArray.length - 1;
  };

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          // last step
          await props.onSubmit(values, helpers);
        } else {
          setStep((prevState) => prevState + 1);
        }
      }}
    >
      <Form autoComplete="off">
        {currentChild}

        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((prevState) => prevState - 1)}
          >
            back
          </button>
        ) : null}

        <button type="submit">{isLastStep() ? "submit" : "next"}</button>
      </Form>
    </Formik>
  );
};

function App() {
  return (
    <div>
      <h4> Form step with validation </h4>

      <FormikStepper
        initialValues={{
          firstName: "",
          lastName: "",
          address: "",
          email: "",
          password: "",
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <FormikStep>
          <Field name="firstName">
            {(props: FieldProps) => (
              <>
                <Input placeholder="firstName" {...props.field} />

                {props.meta.touched && props.meta.error && props.meta.error}
              </>
            )}
          </Field>
          <Field name="lastName">
            {(props: FieldProps) => (
              <>
                <Input placeholder="lastName" {...props.field} />

                {props.meta.touched && props.meta.error && props.meta.error}
              </>
            )}
          </Field>
        </FormikStep>

        <FormikStep
          validationSchema={Yup.object().shape({
            email: Yup.string()
            .required("email is required."),
          })}
        >
          <Field name="email">
            {(props: FieldProps) => (
              <>
                <Input placeholder="email" {...props.field} />

                {props.meta.touched && props.meta.error && props.meta.error}
              </>
            )}
          </Field>
          <Field name="password">
            {(props: FieldProps) => (
              <>
                <Input placeholder="password" {...props.field} />

                {props.meta.touched && props.meta.error && props.meta.error}
              </>
            )}
          </Field>
        </FormikStep>

        <FormikStep>
          <Field name="address">
            {(props: FieldProps) => (
              <>
                <Input placeholder="address" {...props.field} />

                {props.meta.touched && props.meta.error && props.meta.error}
              </>
            )}
          </Field>
        </FormikStep>
      </FormikStepper>
    </div>
  );
}

export default App;
