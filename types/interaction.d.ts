import { ChatInputCommandInteraction } from "discord.js";

declare module "discord.js" {
  interface ChatInputCommandInteraction {
    dbGuild: Object<any>;
    translation: Object<any>;
  }
}
