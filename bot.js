const botSettings = require("./app.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const cMsg = new Discord.RichEmbed();

var moment = require('moment');
moment().format();

bot.on("ready", () => {
	console.log("I am ready!");

	bot.generateInvite(['SEND_MESSAGES', 'READ_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	});
});

bot.on("message", message => {
	msg = message.content;



	if (msg.charAt(0) == botSettings.prefix) {

		var phrases = msg.toUpperCase().split(' ');

		
		if (phrases[0] == botSettings.prefix + "HELP") {
			message.reply(" use #confess {msg} in #confessions to post an anonymous confession (i.e.: #confess I'm gay)");
		} else if (phrases[0] == botSettings.prefix + "CONFESS") {
			var confession = new Discord.RichEmbed()
				.setAuthor(" ")
				.setDescription(" ")
				.addField("\:eyes: Anonymous Confession :eyes:", msg.replace('#confess ',''), false)
				.addField("Sent:", message.createdAt, true)
				.setColor("#FF0000")
				.setFooter(("Want to send an anonymous confession? DM \`#confess\` to @ConfessionBot"));

			message.delete();
			
			message.guild.channels.find(c => c.name === "confessions").sendEmbed(confession);
			message.guild.channels.find(c => c.name === "threebot-logs").send(message.author.tag + "( `" + message.author.id + "`) sent a confesstion at " + message.createdAt);

		} else if (phrases[0] == botSettings.prefix + "NOTIFY") {
			var readyMsg = new Discord.RichEmbed()
				.setAuthor(" ")
				.setDescription(" ")
				.addField("\:eyes: Random Reminder :eyes:", "You can send anonymous confessions to #confessions using `#confess {msg}`. Type `#help` for additional info.", false)
				.setColor("#FFFFFF")
				.setFooter(("ConfessionBot | v0.0.1"));
			message.guild.channels.find(c => c.name === "general").sendEmbed(readyMsg);
		} else {
			message.reply(" that's an unknown command! Please use `" + botSettings.prefix + "help`");
		}
	} else {
		return;
	}
});


function myFunc(arg) {
	console.log(`arg was => ${arg}`);
}

setTimeout(myFunc, 1500000, 'funky');

bot.on("presenceUpdate", (oldMember, newMember) => {
	pState = newMember.presence.status
	indicator = " (unknown)"

	if(pState == "online") {
		indicator = ""
	} else if(pState == "idle") {
		indicator = " (I)"
	} else {
		indicator == " (DND)"
	}

	if(oldMember.presence.status == "offline") {
		if(newMember.presence.status != "offline") {
			console.log(moment().format('LTS') + " [" + moment().subtract(10, 'days').calendar() + "] " + oldMember.displayName + " is now online" + indicator)
		}
	} else {
		if(newMember.presence.status == "offline") {
			console.log(moment().format('LTS') + " [" + moment().subtract(10, 'days').calendar() + "] " + oldMember.displayName + " is now offline")
		}
	}
});

bot.on("voiceStateUpdate", (oldMember, newMember) => {
	state = "unknown";
	vcName = "unknown";

	if(newMember.voiceChannelID == null) {
		state = " has left ";
		vcName = oldMember.voiceChannel.name;
	} else if (oldMember.voiceChannelID == null) {
		if(newMember.deaf == true) {
			state = " has joined (M & D) "
		} else if(newMember.mute == true) {
			state = " has joined (M) "
		} else {
			state = " has joined "
		}
		vcName = newMember.voiceChannel.name;
	} else {
		if(newMember.voiceChannelID !== oldMember.voiceChannelID) {
			state = " switched to "
			vcName = newMember.voiceChannel.name + " from " + oldMember.voiceChannel.name;
		} else {
			vcName = newMember.voiceChannel.name;

			if((oldMember.deaf === false) && (newMember.deaf === true)) {
				state = " now `deafened` in "
			} else if((newMember.deaf === false) && (oldMember.deaf === true)) {
				if(newMember.mute === true) {
					state = " now `undeafened` but still `muted` in "
				} else {
					state = " now `undeafened` in "
				}
			} else if((oldMember.mute === false) && (newMember.mute === true)) {
				state = " now `muted` in "
			} else if((newMember.mute === false) && (oldMember.mute === true)) {
				state = " now `unmuted` in "
			}
		}
	}
	console.log(moment().format('LTS') + " [" + moment().subtract(10, 'days').calendar() + "] " + newMember.displayName + state + vcName);
});



bot.login(process.env.BOT_TOKEN);