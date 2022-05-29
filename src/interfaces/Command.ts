import { Token } from "../utils/Tokenizer";
import { Message } from "discord.js";

export interface Command {
  command: string | string[];
  arguments?: string | string[];
  switchable?: boolean;
  description?: string;
  usage?: string[] | string;
  permissions(msg: Message, tokens: Token[]): boolean;
  execute(msg: Message, tokens: Token[]): void;
}
