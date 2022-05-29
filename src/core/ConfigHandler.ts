import * as fs from "fs";
import * as path from "path";

export class ConfigHandler {
  private static readonly configPath = path.resolve(
    process.cwd(),
    "src/config"
  );

  public static createConfig<T>(fileName: string, json: T): void {
    fs.writeFileSync(
      path.resolve(this.configPath, `${fileName}.json`),
      JSON.stringify(json, null, 4)
    );
  }

  public static loadConfig<T>(fileName: string): T {
    return JSON.parse(
      fs.readFileSync(
        path.resolve(this.configPath, `${fileName}.json`),
        "utf-8"
      )
    );
  }
}
