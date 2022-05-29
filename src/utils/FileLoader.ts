import * as glob from "glob";
import * as path from "path";

export class FileLoader {
  private fileList: any = {};
  private cfgList: any = {};

  public getCfgList(): any {
    return this.cfgList;
  }

  public getFileList(): any {
    return this.fileList;
  }

  public getPathList(): string[] {
    const pathList: string[] = [];

    for (const file of this.fileList) {
      pathList.push(file.path);
    }

    return pathList;
  }

  public requireFiles(filePattern: string, cfg?: any): void {
    const files: string[] = glob.sync(filePattern);
    const fileList = {},
      cfgList = {};

    for (const file of files) {
      delete require.cache[require.resolve(file)];
      const instance = require(path.resolve(file));
      const instanceVal = Object.values(instance)[0];
      const identifier: string =
        typeof instanceVal === "function"
          ? Object.keys(instance)[0]
          : path.posix.basename(file);

      if (instanceVal === undefined) continue;

      cfgList[identifier] =
        cfg && cfg[identifier] !== undefined ? cfg[identifier] : true;

      if (cfgList[identifier]) {
        fileList[identifier] = {};
        fileList[identifier].path = file;

        if (typeof instanceVal === "function") {
          fileList[identifier].fn = new (Object.values(instance)[0] as any)();
          console.info(`+ ${identifier} has been initialized`);
        } else fileList[identifier].contents = instance;
      }
    }

    this.cfgList = cfgList;
    this.fileList = fileList;
  }

  public static clearRequireCache(fileList: string[]): void {
    for (const file of fileList) {
      delete require.cache[path.resolve(file)];
    }
  }
}
