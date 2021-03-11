import {LangHandler} from "../../core/LangHandler";
import {CollectorFilter, Message, MessageEmbed, MessageReaction, User} from "discord.js";
import {CmdHandler} from "../../core/CmdHandler";
import * as util from "util";
import {PrideClient} from "../../core/PrideClient";
import {HelpNavigator} from "./HelpNavigator";


export class HelpHandler
{
    private static lang = LangHandler.getLanguage(__dirname);
    private static reactions = {first: '\u23EE', prev: '\u25C0', next: '\u25B6', last: '\u23ED'};

    // Sends help message and collect reactions to load next or previous help list pages (due to max. 2k chars in one msg)
    public static sendHelpList(page: number, entriesPerPage: number, msg: Message): void
    {
        const helpNavigator = new HelpNavigator(page, entriesPerPage);

        // Define embed, set page in token, create commandList
        const embed = new MessageEmbed().setColor(this.lang.color.blue).setAuthor(this.lang.help.title);
        const list: string = this.prepareMessage(helpNavigator.currPage, helpNavigator.entriesPerPage);

        // Send message into channel and wait for reactions to proceed
        msg.channel.send(embed
            .setDescription(`${this.lang.help.desc}${list}`)
            .setFooter(util.format(this.lang.help.footer, helpNavigator.currPage, helpNavigator.lastPage))
        ).then((botMsg: Message) =>
        {
            // Skip reactions if there is no need for that.
            if (helpNavigator.firstPage === helpNavigator.lastPage) return;

            const reactionValues: string[] = Object.values(this.reactions);
            reactionValues.forEach((reaction: string) => botMsg.react(reaction));

            // Create filter and reactionCollector, filter applies previous defined reactions
            const filter: CollectorFilter = (reaction: MessageReaction, user: User) =>
                reactionValues.includes(reaction.emoji.name) && user.id !== PrideClient.getClient().user.id;
            const collector = botMsg.createReactionCollector(filter, {time: 60 * 2000, dispose: true});

            // Event handling for reactions
            const listener: (reaction: MessageReaction) => void = (reaction: MessageReaction) =>
            {
                const list: string = this.handleReaction(reaction, helpNavigator);
                if (!list) return;

                botMsg.edit(embed
                    .setDescription(`${this.lang.help.desc}${list}`)
                    .setFooter(util.format(this.lang.help.footer, helpNavigator.currPage, helpNavigator.lastPage))
                );
            };

            collector.on('collect', listener);
            collector.on('remove', listener);
            collector.on('end', () => botMsg.delete());
        });
    }

    // Sends usage for provided command stored in token
    public static sendUsage(token: string, msg: Message): void
    {
        const embed = new MessageEmbed().setColor(this.lang.color.blue).setAuthor(util.format(this.lang.usage.title, token));
        const instances: any = Object.values(CmdHandler.getCmdList());

        for (const instance of instances)
        {
            const command = instance.fn['command'];

            if ((!Array.isArray(command) && command.toLocaleLowerCase() === token.toLocaleLowerCase()) ||
                (Array.isArray(command) && command.some(e => e.toLocaleLowerCase() === token.toLocaleLowerCase())))
            {
                const description: string = instance.fn['description'] ? instance.fn['description'] : '';
                const usage: string | string[] = instance.fn['usage'] ? instance.fn['usage'] : '';

                let concCmd = '```';

                if (usage && Array.isArray(usage))
                {
                    usage.forEach(use => concCmd += `${use}\n`);
                }
                else
                {
                    concCmd += usage;
                }

                concCmd += '```';

                msg.channel.send(embed.setDescription(util.format(this.lang.usage.desc, description, concCmd)));
                return;
            }
        }
    }

    // Listener for collected and removed reactions in helpList message
    private static handleReaction(reaction: MessageReaction, helpNavigator: HelpNavigator): string
    {
        switch (reaction.emoji.name)
        {
            case (this.reactions.first):
                return this.prepareMessage(helpNavigator.getFirstPage(), helpNavigator.entriesPerPage);
            case (this.reactions.prev):
                return this.prepareMessage(helpNavigator.getPreviousPage(), helpNavigator.entriesPerPage);
            case (this.reactions.next):
                return this.prepareMessage(helpNavigator.getNextPage(), helpNavigator.entriesPerPage);
            case (this.reactions.last):
                return this.prepareMessage(helpNavigator.getLastPage(), helpNavigator.entriesPerPage);
            default:
                return;
        }
    }

    // Creates a string out of a list of commands
    private static prepareMessage(page: number, entriesPerPage: number): string
    {
        const commands: any = Object.values(CmdHandler.getCmdList());
        const minEntries = (page - 1) * entriesPerPage, maxEntries = page * entriesPerPage;
        let message = '', entry = 0;

        for (const instance of commands)
        {
            entry++;
            if (entry <= minEntries) continue;
            if (entry > maxEntries) break;

            message += `${CmdHandler.cmdPrefix}${Array.isArray(instance.fn['command']) ?
                instance.fn['command'].join(', ') : instance.fn['command']}\n`;

        }

        return message;
    }
}
