import { Client } from "discord.js";

declare global {
  var CLIENT: Client;
  var COMMANDS: Object;
  var VALID_LANGUAGES: array;

  var LANGUAGES: Object<any>;
  var EVENT_META: Object;
  var COMMAND_META: Object;
}
