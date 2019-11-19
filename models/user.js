import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import Speakeasy from "speakeasy";


import { sendMail } from "../helpers";

const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
      minlength: [6, "Username must be more than 6 characters!"],
      maxlength: [30, "Username must not exceed 30 characters!"]
    },
    password: { 
      type: String, 
      required: [true, "Password is required!"],
      minlength: [6, "password must be more than 6 characters!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true
    },
    phone: { type: Number },
    address: { type: String },
    updatedPassword: { type: String },
    secret: { type: String },
    isTwoFactorEnable: { type: Boolean, default: false },
    qrCodeUrl: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

UserSchema.pre("save", function(next) {
  this.password = bcryptjs.hashSync(this.password, +process.env.SALTROUNDS);
  this.updatedPassword = new Date(this.createdAt).toISOString();
  next();
});

UserSchema.methods.createToken = function(isTwoFactorCheck = false) {
  const token = jwt.sign(
    { _id: mongoose.Types.ObjectId(this._id), isTwoFactorCheck},
    process.env.PRIVATEKEY,
    { expiresIn: +process.env.EXPIRESIN }
  );
  return token;
};

UserSchema.methods.createTokenResetPassword = function() {
  const token = jwt.sign(
    { _id: mongoose.Types.ObjectId(this._id)},
    process.env.PRIVATEKEY,
    { expiresIn: '1m' }
  );
  return token;
};

UserSchema.methods.checkUser = function(password) {
  return bcryptjs.compareSync(password, this.password);
};

UserSchema.methods.sendMailForgotPassword = async function(host) {
  const url = `${host}/reset_password/${this.createTokenResetPassword()}`
  const mailOptions = {
    from: 'youremail@gmail.com',
    to: this.email,
    subject: 'Lấy lại mật khẩu',
    text: url
  };
  const transporter = {
    service: 'gmail',
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL
    }
  }
  return sendMail({transporter, mailOptions});
};

UserSchema.methods.sendMailTotp = async function(secret) {
  const text = Speakeasy.totp({
    secret,
    encoding: "base32",
    window : 10
  });
  const mailOptions = {
    from: 'youremail@gmail.com',
    to: this.email,
    subject: 'Lấy lại mật khẩu',
    text
  };
  const transporter = {
    service: 'gmail',
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL
    }
  }
  return sendMail({transporter, mailOptions});
};

UserSchema.plugin(uniqueValidator);

export default mongoose.model("user", UserSchema);
