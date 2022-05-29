import { ConfigHandler } from "./ConfigHandler";
import { Config } from "../interfaces/Config";
import {
  BitFieldResolvable,
  Message,
  Permissions,
  PermissionString,
} from "discord.js";

export class PermHandler {
  public static isPrideOwner(msg: Message): boolean {
    const cfg: Config = ConfigHandler.loadConfig<Config>("config");
    return cfg.owner === msg.author.id;
  }

  public static isOwner(msg: Message): boolean {
    return msg.guild.ownerID === msg.author.id;
  }

  public static isAdministrator(msg: Message): boolean {
    if (!msg.member) return false;
    return (
      msg.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) ||
      this.isOwner(msg) ||
      this.isPrideOwner(msg)
    );
  }

  public static hasPrivilege(
    msg: Message,
    flag:
      | BitFieldResolvable<PermissionString>
      | BitFieldResolvable<PermissionString>[]
  ): boolean {
    if (!msg.member) return false;
    return msg.member.hasPermission(flag);
  }
}
