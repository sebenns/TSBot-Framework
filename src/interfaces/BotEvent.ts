export interface BotEvent {
  eventName: string;
  execute(...args: any | any[]): void;
}
