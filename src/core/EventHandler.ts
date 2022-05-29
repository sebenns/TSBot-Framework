import { FileLoader } from "../utils/FileLoader";
import * as path from "path";
import { TSCompiler } from "../utils/TSCompiler";
import * as glob from "glob";
import * as ts from "typescript";
import { PrideClient } from "./PrideClient";

export class EventHandler {
  private static eventLoader = new FileLoader();

  public static getEventList(): any {
    return this.eventLoader.getFileList();
  }

  public static loadEvents(recompile = false): void {
    console.info("[ >> Loading events from directory... ]");

    if (recompile) {
      const tsFiles: string[] = glob.sync(
        path.resolve(process.cwd(), "src/events/**/*.ts")
      );
      TSCompiler.compile(tsFiles, {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
      });
      FileLoader.clearRequireCache(
        tsFiles.map((e) => `${e.substr(0, e.lastIndexOf("."))}.js`)
      );
    }

    this.eventLoader.requireFiles(
      path.resolve(process.cwd(), "src/events/**/*.event.js")
    );

    console.info("[ >> Finished loading events. ]");
  }

  public static registerEvents(): void {
    const instances: any = Object.values(this.eventLoader.getFileList());

    for (const instance of instances) {
      PrideClient.getClient().on(instance.fn["eventName"], (...args) => {
        instance.fn["execute"](args.length > 1 ? args : args[0]);
      });
    }
  }

  public static unregisterEvents(): void {
    PrideClient.getClient().removeAllListeners();
  }
}
