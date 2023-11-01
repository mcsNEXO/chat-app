import { useState } from "react";
import "./SignUp.scss";
import { validate } from "../../helpers/validations";
import { apiClient } from "../../axios";
import { App } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

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
const SignUp = () => {
  const { message } = App.useApp();
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
  const navigate = useNavigate();
  const onChangeInput = (value: string, type: FormFieldType) => {
    const { error } = validate(form[type].rules, value, type);
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
      if (res.status === 200) {
        message.success("You was registered", 1);
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err: any) {
      message.error(
        `Something went wrong. ${
          err?.response?.data?.message &&
          `Error: ${err?.response?.data?.message}`
        }`
      );
    }
  };

  return (
    <div className="container-sign-up">
      <Link
        to="/"
        className="absolute flex justify-center items-center top-3 left-5 bg-slate-500 w-10 h-10 rounded-full text-slate-300 text-lg hover:text-blue-600 transition-colors hover:bg-neutral-700"
      >
        <ArrowLeftOutlined />
      </Link>
      <div className="box">
        <div className="title text-white">Sign up</div>
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
          <span className="text-center mt-1">
            You have account?{" "}
            <Link
              to={"/"}
              className="underline text-gray-300 hover:text-blue-600 cursor-pointer transition-colors"
            >
              Log in
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
