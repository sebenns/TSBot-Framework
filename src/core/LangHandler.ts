import { FileLoader } from "../utils/FileLoader";

export class LangHandler {
  private static langLoader = new FileLoader();

  public static getLanguage(dir: string): any {
    this.langLoader.requireFiles(`${dir}/language.json`);
    const fileList = this.langLoader.getFileList();
    return fileList["language.json"] ? fileList["language.json"].contents : {};
  }
}
