import { sign, verify } from "../utils/token.util.js";

//token creating utility
export const generateToken = async (payload, expiresIn, secret) => {
  let token = await sign(payload, expiresIn, secret);
  return token;
};

//verify refresh token
export const verifyToken = async (token, secret) => {
  let check = await verify(token, secret);
  return check;
};
