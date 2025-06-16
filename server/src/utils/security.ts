import crypto from "crypto";

export const generateRandomActivationCode = (): string => {
  return crypto.randomBytes(2).toString("hex");
};
