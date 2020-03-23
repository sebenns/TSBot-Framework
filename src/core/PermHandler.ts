import {ConfigHandler} from './ConfigHandler';
import {Config} from '../interfaces/Config';
import {BitFieldResolvable, Message, Permissions, PermissionString} from 'discord.js';

/**
 * Permission Handler:
 *  <ul>
 *      <li>Allows you to check on permission privileges, groups and identity
 *      <li>Allows to simply configure your command permissions
 * </ul>
 * @category Core
 */
export class PermHandler
{
    /**
     * Checks if author of provided message is prideOwner (specified in configuration file)
     * @param {Message} msg Discord message object
     * @returns {boolean}
     */
    public static isPrideOwner(msg: Message): boolean
    {
        const cfg: Config = ConfigHandler.loadConfig<Config>('config');
        return cfg.owner === msg.author.id;
    }

    /**
     * Checks if author of provided message is guild owner
     * @param {Message} msg Discord message object
     * @returns {boolean}
     */
    public static isOwner(msg: Message): boolean
    {
        return msg.guild.ownerID === msg.author.id;
    }

    /**
     * Checks if author of provided message has administrator privileges (administrator || owner)
     * @param {Message} msg Discord message object
     * @returns {boolean}
     */
    public static isAdministrator(msg: Message): boolean
    {
        if (!msg.member) return false;
        return msg.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) || this.isOwner(msg) || this.isPrideOwner(msg);
    }

    /**
     * Checks if author of provided message has provided privilege(s)
     * @param {Message} msg Discord message object
     * @param {BitFieldResolvable<PermissionString> | BitFieldResolvable<PermissionString>[]} flag Permission flag, see https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable
     * @returns {boolean}
     */
    public static hasPrivilege(msg: Message, flag: BitFieldResolvable<PermissionString> | BitFieldResolvable<PermissionString>[]): boolean
    {
        if (!msg.member) return false;
        return msg.member.hasPermission(flag);
    }
}
