export function validateEmail(text: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(text);
}

export function validatePhoneNumber(value: string) {
  const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{8,14}$/g;
  return re.test(value);
}

type RuleType = {
  [key: string]: (value: string, rule: any, type: string) => string;
};

const availableRules: RuleType = {
  required(value: string, {}, type: string) {
    return value
      ? ""
      : `${type[0]
          .toUpperCase()
          .concat(type.slice(1, type.length))} is required!`;
  },
  min(value: string, rule: { number: number }, type: string) {
    return value.length >= rule.number
      ? ""
      : `${type[0]
          .toUpperCase()
          .concat(type.slice(1, type.length))} must have at least ${
          rule.number
        } characters!`;
  },
  email(value: string) {
    return validateEmail(value) ? "" : "Email is invalid!";
  },
  phoneNumber(value: string) {
    return validatePhoneNumber(value) ? "" : "Phone number is invalid";
  },
};

export function validate(
  rules: Array<string | { rule: keyof typeof availableRules; number?: number }>,
  value: string,
  type: string
) {
  let error = "";
  rules.forEach((rule) => {
    if (typeof rule === "string") {
      const errorMessage = availableRules[rule](value, {}, type);
      if (errorMessage) {
        error = errorMessage;
      }
    } else {
      const errorMessage = availableRules[rule.rule](value, rule, type);
      if (errorMessage) {
        error = errorMessage;
      }
    }
  });
  return { error, typeError: error };
}
