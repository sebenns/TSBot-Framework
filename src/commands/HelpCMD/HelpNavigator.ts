import { CmdHandler } from "../../core/CmdHandler";

export class HelpNavigator {
  public currPage: number;
  public firstPage: number;
  public lastPage: number;
  public entriesPerPage: number;

  constructor(currPage: number, entriesPerPage: number) {
    this.entriesPerPage = entriesPerPage;
    this.firstPage = 1;
    this.lastPage = Math.ceil(
      Object.keys(CmdHandler.getCmdList()).length / this.entriesPerPage
    );
    this.currPage =
      currPage <= this.firstPage
        ? this.firstPage
        : currPage >= this.lastPage
        ? this.lastPage
        : currPage;
  }

  public getPreviousPage(): number {
    if (this.currPage - 1 < this.firstPage) return this.currPage;
    this.currPage--;
    return this.currPage;
  }

  public getFirstPage(): number {
    if (this.currPage === this.firstPage) return this.firstPage;
    this.currPage = this.firstPage;
    return this.currPage;
  }

  public getLastPage(): number {
    if (this.currPage === this.lastPage) return this.lastPage;
    this.currPage = this.lastPage;
    return this.currPage;
  }

  public getNextPage(): number {
    if (this.currPage + 1 > this.lastPage) return this.currPage;
    this.currPage++;
    return this.currPage;
  }
}
