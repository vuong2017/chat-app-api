import User from "../models/user";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
      const { token } = req.headers;
      const { _id, isTwoFactorCheck } = jwt.verify(token, "DUTBUOI");
      const findUser = await User.findOne({_id});
      if(findUser) {
        if(findUser.isTwoFactorEnable && !isTwoFactorCheck) {
            return res.status(401).json({
                status: false,
                message: 'khong co quyen truy cap',
            });
        }
        req.body._id = findUser._id;
        req.body.secret = findUser.secret;
        next();
      } else {
        return res.status(401).json({
            status: false,
            message: 'khong co quyen truy cap',
        });
      }
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'khong co quyen truy cap',
        }); 
    }
}

export const authMiddlewareTwoFactor = (req, res, next) => {
    try {
      const { token } = req.headers;
      const { _id } = jwt.verify(token, "DUTBUOI");
      req.body._id = _id;
      next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            status: false,
            message: 'khong co quyen truy cap',
        }); 
    }
}
