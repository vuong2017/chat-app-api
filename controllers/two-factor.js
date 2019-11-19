import jwt from "jsonwebtoken";
import Speakeasy from "speakeasy";


import User from "../models/user";
import { handleError } from "../helpers";

const turnOnTwoFactor = async (req, res) => {
  try {
    const { _id, secret, totp, isTwoFactorEnable } = req.body;
    const valid = Speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: totp,
    })
    if(valid) {
      const result = await User.findOneAndUpdate({_id},{ isTwoFactorEnable });
      if(result) {
          return res.status(200).json({
              status: true,
              message: 'ok'
          })
      } else {
          return res.status(404).json({
              status: false,
              message: 'khong tim thay'
          })
      }
    } else {
      return res.status(404).json({
        status: false,
        message: 'khong tim thay'
    })
    }
    
  } catch (error) {
    handleError(error, res);
  }
};

const totpValidate = async (req, res) => {
    try {
      const { _id, totp } = req.body;
      const findUser = await User.findOne({_id})
      if(findUser) {
        const { secret } = findUser;
        const valid = Speakeasy.totp.verify({
          secret,
          encoding: "base32",
          token: totp,
        })
        if(valid) {
          const token = findUser.createToken(true);
          return res.status(200).json({
            status: true,
            message: 'ok',
            data: {
              token
            }
          });
        } else {
          return res.status(403).json({
            status: false,
            message: 'khong dung'
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          message: 'khong tim thay'
        })
      }
    } catch (error) {
      handleError(error, res);
    }
  };


export default {
  turnOnTwoFactor,
  totpValidate
};
