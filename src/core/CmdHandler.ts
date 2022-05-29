import { ConfigHandler } from "./ConfigHandler";
import { FileLoader } from "../utils/FileLoader";
import * as path from "path";
import { Token, TokenExpr, Tokenizer } from "../utils/Tokenizer";
import { TSCompiler } from "../utils/TSCompiler";
import * as glob from "glob";
import * as ts from "typescript";
import { Message } from "discord.js";

export class CmdHandler {
  private static cmdLoader = new FileLoader();

  public static cmdPrefix: string;

  public static loadConfig(): any {
    try {
      return ConfigHandler.loadConfig<any>("commands");
    } catch (error) {
      console.info(
        '![CmdHandler] Configuration file for "Commands" does not exist.'
      );
      return;
    }
  }

  public static createConfig(config: any): void {
    ConfigHandler.createConfig<any>("commands", config);
  }

  public static getCmdList(): any {
    return this.cmdLoader.getFileList();
  }

  public static loadCmdList(recompile = false): void {
    console.info("[ >> Loading commands from directory... ]");

    if (recompile) {
      const tsFiles: string[] = glob.sync(
        path.resolve(process.cwd(), "src/commands/**/*.ts")
      );
      TSCompiler.compile(tsFiles, {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
      });
      FileLoader.clearRequireCache(
        tsFiles.map((e) => `${e.substr(0, e.lastIndexOf("."))}.js`)
      );
    }

    this.cmdLoader.requireFiles(
      path.resolve(process.cwd(), "src/commands/**/*.cmd.js"),
      this.loadConfig()
    );
    this.createConfig(this.cmdLoader.getCfgList());

    console.info("[ >> Finished loading commands. ]");
  }

  public static executeCmd(msg: Message): void {
    const instances: any = Object.values(this.cmdLoader.getFileList());
    const execCmd: string = msg.content
      .substring(this.cmdPrefix.length)
      .toLocaleLowerCase()
      .split(" ")[0];

    for (const instance of instances) {
      const command: string | string[] = instance.fn["command"];
      if (!command) continue;

      if (
        (!Array.isArray(command) && command.toLocaleLowerCase() === execCmd) ||
        (Array.isArray(command) &&
          command.some((e) => e.toLocaleLowerCase() === execCmd))
      ) {
        const argExprs: TokenExpr[] = [];
        const args: string | string[] = instance.fn["arguments"];

        if (args !== undefined) {
          if (!Array.isArray(args)) {
            argExprs.push({ regExpr: new RegExp(args), type: "arguments" });
          }

          if (Array.isArray(args)) {
            for (const arg of args) {
              argExprs.push({ regExpr: new RegExp(arg), type: "arguments" });
            }
          }
        }

        const msgContent: string = msg.content.substring(
          this.cmdPrefix.length + execCmd.length
        );
        const tokenList: Token[] =
          argExprs.length > 0
            ? Tokenizer.tokenize(msgContent, argExprs).filter(
                (el: Token) => el.type === "arguments"
              )
            : [];

        if (instance.fn["permissions"](msg, tokenList)) {
          instance.fn["execute"](msg, tokenList);
        }
      }
    }
  }
}
