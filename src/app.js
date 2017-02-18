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

      if (msg.author.id === "112001393140723712") {
          if (msg.content.startsWith(delimiter + "help")) {
              var helpEmbed = new Discord.RichEmbed();

              var commands = [`${delimiter}avatar`, `${delimiter}3dsguide`, `${delimiter}3dshardmodders`, `${delimiter}calc`, `${delimiter}tvos`, `${delimiter}embed`];
              var info = ["Avatar of a user", "The 3DS hacking guide to follow", "List of trusted 3DS hardmodders", "Make a calculation given required parameters", "shows how to block OTA updates", "Creates a customized richEmbed"];
              helpEmbed.setTitle("--My commands--");
              helpEmbed.addField("Command", commands, true);
              helpEmbed.addField("This does", info, true);
              helpEmbed.setColor("#c61530");
              helpEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");
              helpEmbed.setAuthor("PyrrhaBot", "https://i.imgur.com/qPuIzb2.png")
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

          if (msg.content.startsWith(delimiter + "tvos")) {
              msg.delete();
              msg.channel.sendMessage("If you want to block getting OTA updates on your iOS device install the tvOS beta profile. To download open this link in Safari: https://hikay.github.io/app/NOOTA.mobileconfig")
          }

          if (msg.content.startsWith(delimiter + "setonline")) {
              msg.delete():
                  client.user.setStatus("online");
          }

          if (msg.content.startsWith(delimiter + "setidle")) {
              msg.delete():
                  client.user.setStatus("idle");
          }

          if (msg.content.startsWith(delimiter + "setdnd")) {
              msg.delete():
                  client.user.setStatus("dnd");
          }

          if (msg.content.startsWith(delimiter + "setinvis")) {
              msg.delete():
                  client.user.setStatus("invisible");
          }

          if (msg.content.startsWith(delimiter + "avatar")) {
              var mentionedUser = msg.mentions.users.first();
              if (!mentionedUser) {
                  mentionedUser = msg.author;
              }
              msg.channel.sendMessage(mentionedUser.avatarURL);
          }

          if (msg.content.startsWith(delimiter + "embed")) {
              embed(msg);
          }

          if (msg.content.startsWith(delimiter + "calc")) {
              calc(msg);
          }

          /**
           * Debugging
           */
          if (msg.content.startsWith(delimiter + "debug")) {
              debug(msg);
          }
      }
  });

  function embed(msg) {
      let paramString = msg.content.slice(9);
      let customEmbed = new Discord.RichEmbed();

      msg.delete();
      let fields = paramString.split(',');
      fields.forEach(field => {
          let chunks = field.split(':');
          let header = chunks[0];
          let values = chunks[1].split(';');
          customEmbed.addField(header, values.join('\n'), true);
      });

      customEmbed.setColor("#e52431");
      customEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");
      customEmbed.setAuthor("PyrrhaBot", "https://i.imgur.com/qPuIzb2.png")
      msg.channel.sendEmbed(customEmbed);
  }


  function calc(msg) {
      let operator = msg.content.split(" ")[2];
      let firstNum = parseInt(msg.content.split(" ")[1]);
      let secondNum = parseInt(msg.content.split(" ")[3]);
      var result = 0;
      msg.delete();
      switch (operator) {
          case "*":
              result = firstNum * secondNum;
              break;
          case "+":
              result = firstNum + secondNum;
              break;
          case "-":
              result = firstNum - secondNum;
              break;
          case "/":
              result = firstNum / secondNum;
              break;
          default:
              msg.reply("someting went wrong!");
              return;
      }
      msg.channel.sendMessage(`The answer to \`${firstNum} ${operator} ${secondNum}\` is \`${result}\``);
  }

  function debug(msg) {
      var debugarg = msg.content.slice(9);
      console.log(debugarg);
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
