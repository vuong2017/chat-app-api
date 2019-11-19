import { sendMail } from "./sendMail";

export const handleError = function(error, res) {
  if (error.name == "ValidationError") {
    const errors = {};
    for (const key in error.errors) {
      errors[key] = (error.errors[key] || {}).message;
    }
    console.log(error);
    res.status(403).json({ status: false, errors });
  } else {
    console.log(error);
    res
      .status(500)
      .json({ status: false, errors: { message: "An unknown error" } });
  }
};

export {
  sendMail
}

