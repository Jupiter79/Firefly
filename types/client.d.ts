import { Client, Collection } from "discord.js";

declare module "discord.js" {
  interface Client {
    events: Collection;
    commands: Collection;
  }
}
