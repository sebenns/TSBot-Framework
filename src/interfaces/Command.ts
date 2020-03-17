import * as Discord from 'discord.js';
import {Token} from "../utils/Tokenizer";

/**
 * Implement this interface if you want to create your own command.
 *
 * Filename: `Example.cmd.ts` in `commands/*`
 * ```typescript
 * // Typings
 * import * as Discord from 'discord.js';
 *
 * export class ExampleCmd implements Command
 * {
 *      public command: ['example', 'exp'];
 *
 *      // Tokenizer will return --argument && --argument <word>
 *      public arguments: ['--argument(\\s\\w+)?'];
 *
 *      public description: 'Just an example command';
 *
 *      public usage: ['!example --argument word', '!exp --argument word'];
 *
 *      public permissions(msg, tokens): boolean
 *      {
 *          // Handle permissions here, you can use PermissionHandler if you want to.
 *          // permissions has to return true, otherwise command execution will stop here.
 *          return true;
 *      }
 *
 *      public execute(msg, tokens): void
 *      {
 *          // Execute your command here.
 *          // tokens: Token[] => [{token: '--argument', type: 'arguments', position: 0}]
 *      }
 * }
 * ```
 * @category General
 */
export interface Command
{
    /** This will be your command, with possibly alternatives/aliases */
    command: string | string[];

    /** Define arguments for this command, you can use regular expressions */
    arguments?: string | string[];

    /** Define here if command is switchable (optional, default = true) */
    switchable?: boolean;

    /** (Optional) describe your command here */
    description?: string;

    /** (Optional) describe command usage here */
    usage?: string[]|string;

    /** Here you can create some permission checks */
    permissions(msg: Discord.Message, tokens: Token[]): boolean;

    /** Pride will check on command syntax and afterwards just call this method. */
    execute(msg: Discord.Message, tokens: Token[]): void;
}
