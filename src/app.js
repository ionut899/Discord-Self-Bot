  // import the discord.js and npm modules
  const Discord = require("discord.js");
  const settings = require("./settings.json");
  const client = new Discord.Client();

  const delimiter = settings.prefix;

  // Login for the Populous client
  client.login(settings.token);

  client.on("ready", () => {
      console.log("Hello Again!");
  });

  client.on("message", msg => {
      if (msg.content.startsWith(delimiter + "help")) {
          var helpEmbed = new Discord.RichEmbed();

          var commands = ["3dsguide", "3dshardmodders"];
          var info = ["The 3DS hacking guide to follow", "List of trusted 3DS hardmodders"];
          helpEmbed.setTitle("--My commands--");
          helpEmbed.addField("Command", commands, true);
          helpEmbed.addField("This does", info, true);
          helpEmbed.setColor("#c61530");
          helpEmbed.setFooter("A selfbot by Favna");
          helpEmbed.setAuthor("PyrrhaBot", "https://i.imgur.com/qPuIzb2.png")
          helpEmbed.setThumbnail("https://i.imgur.com/Ylv4Hdz.jpg")
          msg.delete();
          msg.channel.sendEmbed(helpEmbed);
      }

      if (msg.content.startsWith(delimiter + "3dsguide")) {
          msg.delete();
          msg.channel.sendMessage("For the one stop guide to hacking your 3DS up to firmware 11.2 go to, read, follow and learn from https://3ds.guide");
      }

      if (msg.content.startsWith(delimiter + "3dshardmodders")) {
          msg.delete();
          msg.channel.sendMessage("The 3DS scene has verified and trusted hardmodders globally! You can contact them through private messaging on GBAtemp. Find their names here: https://gbatemp.net/threads/list-of-hardmod-installers-by-region.414224/");
      }

      /**
       * Deleting X amount of messages up to a Discord set maximum of 100
       */
      if (msg.content.startsWith(delimiter + "purge")) {
          var amount = parseInt(msg.content.slice(7));
          msg.channel.bulkDelete(amount + 1);
          msg.channel.sendMessage(`\`deleted ${amount} messages\``)
              .then(m => m.delete(1000));
      }

      /**
       * Debugging
       */
      if (msg.content.startsWith(delimiter + "debug")) {
          var debugarg = msg.content.slice(7);
          if (debugarg === "listchannels") {
              var channelsDebugEmbed = new Discord.RichEmbed();
              var channelNames = msg.guild.channels.map(cn => cn.name);
              var channelIDs = msg.guild.channels.map(cid => cid.id);
              channelsDebugEmbed.setTitle("The channels on this server are as follows");
              channelsDebugEmbed.addField("Channel name", channelNames, true);
              channelsDebugEmbed.addField("\u200b", "\u200b", true);
              channelsDebugEmbed.addField("channel ID", channelIDs, true);
              channelsDebugEmbed.setColor("#00e5ee");
              msg.delete();
              msg.channel.sendEmbed(channelsDebugEmbed);
          }

          if (debugarg === "listroles") {
              var rolesDebugEmbed = new Discord.RichEmbed();
              var roleIDs = msg.guild.roles.map(rid => rid.id);
              var roleNames = msg.guild.roles.map(rn => rn.name)
                  .slice(1);
              roleNames.unshift("Everyone");
              rolesDebugEmbed.setTitle("The roles on this server are as follows");
              rolesDebugEmbed.addField("Role name", roleNames, true);
              rolesDebugEmbed.addField("\u200b", "\u200b", true);
              rolesDebugEmbed.addField("Role ID", roleIDs, true);
              rolesDebugEmbed.setColor("#d82f2f");
              msg.delete();
              msg.channel.sendEmbed(rolesDebugEmbed);
          }
      }

  });
