/// <reference types="@pylonbot/runtime" />
/// <reference types="@pylonbot/runtime-discord" />
const commands = new discord.command.CommandGroup({ defaultPrefix: "," });
commands.raw("n", async (message) => {
  message.reply("i love notsosuper");
  throw new Error("test");
});
