import crypto from "node:crypto";
import { env } from "../config/env.js";

const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const signature = (value) =>
  crypto
    .createHmac("sha256", env.auth.secret)
    .update(value)
    .digest("base64url");

export const createAccessToken = (user) => {
  const encoded = encode({
    sub: user.id,
    exp:
      Math.floor(Date.now() / 1000) +
      env.auth.tokenTtlHours * 3600,
  });

  return `${encoded}.${signature(encoded)}`;
};

export const verifyAccessToken = (token) => {
  const [encoded, signed] = token.split(".");

  if (!encoded || !signed) {
    return null;
  }

  const expected = signature(encoded);

  if (
    signed.length !== expected.length ||
    !crypto.timingSafeEqual(
      Buffer.from(signed),
      Buffer.from(expected)
    )
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    );

    if (
      !Number.isSafeInteger(payload.sub) ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};