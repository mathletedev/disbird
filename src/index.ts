import axios from "axios";
import "dotenv-safe/config.js";
import { Client, TextChannel } from "eris";
import { JSDOM } from "jsdom";

const bot = new Client(process.env.BOT_TOKEN!);

bot.editStatus("idle", {
	type: 2,
	name: "bird calls"
});

bot.on("ready", () => console.log("Bot is online!"));

bot.on("messageCreate", async (message) => {
	if (
		message.content.toLowerCase() !== "disbird" ||
		!message.guildID ||
		message.author.bot
	)
		return;

	// try {
	const res = await axios("https://www.bestrandoms.com/random-bird-generator");
	console.log(res.data);
	const document = new JSDOM(res.data).window.document;

	const bird = "#main .container div:nth-child(2) .content ul li";

	(message.channel as TextChannel).createMessage({
		embed: {
			title: `|| ${
				document.querySelector(`${bird} p:nth-child(2) b span`)?.innerHTML
			} || 🕊️`,
			image: {
				url: `https://www.bestrandoms.com${
					(document.querySelector(`${bird} p img`) as HTMLImageElement).src
				}`
			},
			footer: {
				text: "Click to reveal the name of this bird!",
				icon_url: message.author.dynamicAvatarURL("png")
			},
			color: 0x0080ff
		},
		messageReference: { messageID: message.id }
	});
	// } catch (e) {
	// 	(message.channel as TextChannel).createMessage({
	// 		content: `❌ Unable to fetch a bird...\`\`\`${e}\`\`\``,
	// 		messageReference: { messageID: message.id }
	// 	});
	// }
});

bot.connect();
