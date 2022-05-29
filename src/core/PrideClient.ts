import { Client } from "discord.js";

export class PrideClient {
  private static readonly client = new Client();

  public static loginClient(token: string): void {
    this.client.login(token).catch((error) => {
      console.error(`An Error has occurred during login stage: ${error}`);
      process.exit(1);
    });
  }

  public static getClient(): Client {
    return this.client;
  }
}
