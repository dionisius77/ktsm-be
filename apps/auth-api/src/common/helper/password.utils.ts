import { randomBytes, scrypt } from "crypto";
import _ from "lodash";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const PasswordUtils = {
  hashPassword: async (password: string) => {
    const salt = randomBytes(8).toString("hex");
    const buf = await scryptAsync(password, salt, 64);

    return `${buf.toString()}.${salt}`;
  },
  compare: async (storedPassword: string, suppliedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = await scryptAsync(suppliedPassword, salt, 64);

    return buf.toString() === hashedPassword;
  },
  generateOtp: () => {
    switch (process.env.NODE_ENV) {
      case "test":
      case "development":
        return "0000";
      default:
        return `${_.random(9)}${_.random(9)}${_.random(9)}${_.random(9)}`;
    }
  },
};

export { PasswordUtils };
