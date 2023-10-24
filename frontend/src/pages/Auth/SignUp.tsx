import { useState } from "react";
import "./SignUp.scss";
import { validate } from "../../helpers/validations";
import { apiClient } from "../../axios";

interface FormField {
  value: string;
  error: string;
  rules: Array<string | { rule: string; number?: number }>;
}

interface FormFields {
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
  firstName: FormField;
  lastName: FormField;
}
type FormFieldType = keyof FormFields;
export const SignUp = () => {
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<FormFields>({
    email: {
      value: "",
      error: "",
      rules: [{ rule: "min", number: 5 }, "required", "email"],
    },
    password: {
      value: "",
      error: "",
      rules: ["required", { rule: "min", number: 6 }],
    },
    confirmPassword: {
      value: "",
      error: "",
      rules: ["required"],
    },
    firstName: {
      value: "",
      error: "",
      rules: ["required"],
    },
    lastName: {
      value: "",
      error: "",
      rules: ["required"],
    },
  });

  const onChangeInput = (value: string, type: FormFieldType) => {
    const { error } = validate(form[type].rules, value, type);
    console.log(error);
    setForm({
      ...form,
      [type]: {
        ...form[type],
        value,
        error: error,
        setError: setError(error),
      },
    });
  };

  const registerUser = async () => {
    try {
      const res = await apiClient.sendRequest({
        url: "auth/register",
        method: "post",
        data: {
          email: form.email.value,
          password: form.password.value,
          confirmPassword: form.confirmPassword.value,
          firstName: form.firstName.value,
          lastName: form.lastName.value,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-sign-up">
      <div className="box">
        <div className="title">Sign up</div>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="inp"
            onChange={(e) => onChangeInput(e.target.value, "email")}
          />
          <span className="error">
            {form.email.error ? form.email.error : null}
          </span>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => onChangeInput(e.target.value, "password")}
          />
          <span className="error">
            {form.password.error ? form.password.error : null}
          </span>
          <input
            type="password"
            placeholder="Confirm password"
            onChange={(e) => onChangeInput(e.target.value, "confirmPassword")}
          />
          <span className="error">
            {form.confirmPassword.error ? form.confirmPassword.error : null}
          </span>
          <input
            type="text"
            placeholder="First name"
            onChange={(e) => onChangeInput(e.target.value, "firstName")}
          />
          <span className="error">
            {form.firstName.error ? form.firstName.error : null}
          </span>
          <input
            type="text"
            placeholder="Last name"
            onChange={(e) => onChangeInput(e.target.value, "lastName")}
          />
          <span className="error">
            {form.lastName.error ? form.lastName.error : null}
          </span>
          <button type="button" onClick={registerUser}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};