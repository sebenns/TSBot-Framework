import { Snowflake } from "discord.js";

export interface Config {
  owner: Snowflake;
  prefix: string;
  token: string;
}

export const ConfigExample: Config = {
  owner: "UserID here.",
  prefix: "!",
  token: "Your Token here.",
};
