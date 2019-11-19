import jwt from "jsonwebtoken";
import Speakeasy from "speakeasy";
import QRCode from 'qrcode';


import User from "../models/user";
import { handleError } from "../helpers";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    //required
    if (!username || !password) {
      const errors = {};
      if (!username) errors.username = "Username is required!";
      if (!password) errors.password = "Password is required!";
      return res.status(403).json({
        status: false,
        errors
      });
    }
    // pass required
    const findUser = await User.findOne({ username });
    if (!findUser || !findUser.checkUser(password)) {
      // username and password incorrect
      return res.status(401).json({
        status: false,
        errors: { message: "Account or password is incorrect" }
      });
    } else {
      const token = findUser.createToken();
      const { _id, email, username, phone, address, isTwoFactorEnable, secret } = findUser;
      res.status(200).json({
        status: true,
        message: "Login success!",
        data: { _id, username, email, phone, address, token, isTwoFactorEnable }
      });
    }
  } catch (error) {
    handleError(error, res);
  }
};

const register = async (req, res) => {
  try {
    const { username, password, email, phone, address } = req.body;
    const secretOtp = Speakeasy.generateSecret({ length: 10 });
    const dataUrl = await QRCode.toDataURL(secretOtp.otpauth_url);
    const createNewUser = new User({
      username,
      password,
      email,
      phone,
      address,
      secret: secretOtp.base32,
      qrCodeUrl: dataUrl
    });
    const user = await createNewUser.save();
    const token = createNewUser.createToken();
    res.status(200).json({
      status: true,
      message: "Create user success!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token: token,
        updatedPassword: user.updatedPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        qrCodeUrl: user.qrCodeUrl
      }
    });

  } catch (error) {
    handleError(error, res);
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.headers;
    const createNewToken = new Token({ token });
    await createNewToken.save();
    res.status(200).json({
      status: true,
      message: "Logout success!"
    });
  } catch (error) {
    handleError(error, res);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, domain } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({
        status: false,
        message: "email ko tim thay"
      });
    }
    const result = await findUser.sendMailForgotPassword(domain);
    res.status(200).json({
      status: true,
      message: "vui long kiem tra mail " + findUser.email + " de lay ``lai mat khau"
    })

  } catch (error) {
    handleError(error, res);
  }
};

const checkTokenResetPassword = async (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, process.env.PRIVATEKEY, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'khong dung'
        });
      }
      return res.status(200).json({
        status: true,
        message: 'ok'
      });
    });

  } catch (error) {
    handleError(error, res);
  }
};


const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  jwt.verify(token, process.env.PRIVATEKEY, async function (err, decoded) {
    try {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'khong dung'
        });
      }
      const findUser = await User.findOne({ _id: decoded._id });
      if (findUser) {
        findUser.password = password;
        await findUser.save();
        return res.status(200).json({
          status: false,
          message: 'cap nhat mat khau thanh cong'
        });
      } else {
        return res.status(401).json({
          status: false,
          message: 'khong dung'
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  });
};

const getMe = async (req, res) => {
  try {
    const { _id } = req.body;
    const findUser = await User.findOne({ _id });
    return res.status(200).json({
      status: true,
      message: "Get me success!",
      data: {
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
        phone: findUser.phone,
        address: findUser.address,
        updatedPassword: findUser.updatedPassword,
        isTwoFactorEnable: findUser.isTwoFactorEnable,
        secret: findUser.secret,
        qrCodeUrl: findUser.qrCodeUrl,
        createdAt: findUser.createdAt,
        updatedAt: findUser.updatedAt,
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};

const get = async (req, res) => {
  try {
    const { _id } = req.body;
    const users = await User.find();
    return res.status(200).json({
      status: true,
      message: "Get users success!",
      data: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        updatedPassword: user.updatedPassword,
        isTwoFactorEnable: user.isTwoFactorEnable,
        secret: user.secret,
        qrCodeUrl: user.qrCodeUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    });
  } catch (error) {
    handleError(error, res);
  }
};


export default {
  get,
  login,
  register,
  logout,
  forgotPassword,
  checkTokenResetPassword,
  resetPassword,
  getMe,
};
