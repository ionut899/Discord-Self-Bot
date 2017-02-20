  // import the discord.js and npm modules
  const Discord = require("discord.js");
  const settings = require("./settings.json");
  const superagent = require('superagent');
  const cheerio = require('cheerio');
  const querystring = require('querystring');
  const client = new Discord.Client();
  const delimiter = settings.prefix;

  var moment = require('moment');
  var request = require("request");

  // Getting keys
  client.login(settings.token);
  googleapikey = settings.googleapikey;
  imageEngineKey = settings.imageEngineKey;
  searchEngineKey = settings.searchEngineKey;

  client.on("ready", () => {
      console.log("Hello Again!");
  });

  client.on("message", msg => {

      if (msg.author.id === "112001393140723712") {
          if (msg.content.startsWith(delimiter + "help")) {
              var helpEmbed = new Discord.RichEmbed();

              var commands = [`${delimiter}google <query>`, `${delimiter}userinfo <@User>`, `${delimiter}avatar`, "-----------------", `${delimiter}3dsguide`, `${delimiter}3dshardmodders`, `${delimiter}calc`, `${delimiter}embed`, "-----------------", `${delimiter}tvos`];

              var info = ["Find something on google based on a query", "Shows the userinfo of a mentioned user", "Show the avatar of a user", "-----------------", "The 3DS hacking guide to follow", "List of trusted 3DS hardmodders", "Make a calculation given required parameters", "Creates a customized richEmbed", "shows how to block OTA updates"];

              helpEmbed.setTitle("--My commands--");
              helpEmbed.addField("Command", commands, true);
              helpEmbed.addField("This does", info, true);
              helpEmbed.setColor("#c61530");
              helpEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");
              helpEmbed.setAuthor("PyrrhaBot", "https://i.imgur.com/qPuIzb2.png")
              msg.delete();
              msg.channel.sendEmbed(helpEmbed);
          }


          /**
           * Search Engine
           */

          //Google Regular Search
          if (msg.content.startsWith(delimiter + "google")) {
              let searchQuery = msg.content.slice(10);
              const key = googleapikey;
              const s = "246821351585742851";
              const safeSetting = s ? {
                  1: 'off',
                  2: 'medium',
                  3: 'high'
              }[parseInt(s.nsfw)] : 'medium';
              const safe = msg.channel.name.includes('hentai') || msg.channel.name.includes('lewd') ? 'off' : safeSetting;
              console.log('Search:', msg.guild.name, msg.guild.id, '|', searchQuery, '|', safe);
              msg.channel.sendMessage('`Searching...`').then((message) => {

                  return superagent.get(`https://www.googleapis.com/customsearch/v1?key=${key}&cx=${searchEngineKey}&safe=${safe}&q=${encodeURI(searchQuery)}`)
                      .then((res) => {
                          if (res.body.queries.request[0].totalResults === '0') return Promise.reject(new Error('NO RESULTS'));
                          return message.edit(res.body.items[0].link);
                          //msg.channel.sendMessage(res.body.items[0].link);
                      })
                      .catch(() => {
                          const SEARCH_URL = `https://www.google.com/search?safe=${safe}&q=${encodeURI(searchQuery)}`;
                          return superagent.get(SEARCH_URL).then((res) => {
                              const $ = cheerio.load(res.text);
                              let href = $('.r').first().find('a').first().attr('href');
                              if (!href) return Promise.reject(new Error('NO RESULTS'));
                              href = querystring.parse(href.replace('/url?', ''));
                              return message.edit(href.q);
                          })
                      })
                      .catch((err) => {
                          console.error(err);
                          message.edit('**No Results Found!**');
                      });
              });
          }
          // Userinfo of a user
          if (msg.content.startsWith(delimiter + "userinfo")) {
              userInfo(msg);
          }

          if (msg.content.startsWith(delimiter + "avatar")) {
              var mentionedUser = msg.mentions.users.first();
              if (!mentionedUser) {
                  mentionedUser = msg.author;
              }
              msg.channel.sendMessage(mentionedUser.avatarURL);
          }

          /**
           * Custom commands
           */

          if (msg.content.startsWith(delimiter + "3dsguide")) {
              msg.delete();
              msg.channel.sendMessage("For the one stop guide to hacking your 3DS up to firmware 11.2 go to, read, follow and learn from https://3ds.guide");
          }

          if (msg.content.startsWith(delimiter + "3dshardmodders")) {
              msg.delete();
              msg.channel.sendMessage("The 3DS scene has verified and trusted hardmodders globally! You can contact them through private messaging on GBAtemp. Find their names here: https://gbatemp.net/threads/list-of-hardmod-installers-by-region.414224/");
          }

          if (msg.content.startsWith(delimiter + "embed")) {
              embed(msg);
          }

          if (msg.content.startsWith(delimiter + "calc")) {
              calc(msg);
          }


          /**
           * Storage
           */

          if (msg.content.startsWith(delimiter + "tvos")) {
              msg.delete();
              msg.channel.sendMessage("If you want to block getting OTA updates on your iOS device install the tvOS beta profile. To download open this link in Safari: https://hikay.github.io/app/NOOTA.mobileconfig")
          }






          /**
           * Debugging
           */
          if (msg.content.startsWith(delimiter + "debug")) {
              debug(msg);
          }

          if (msg.content.startsWith(delimiter + "opinion")) {
              msg.delete();
              msg.channel.sendFile("./discordselfbot/images/opinion.gif");
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

  function userInfo(msg) {
      let userInfoEmbed = new Discord.RichEmbed;
      let user = msg.mentions.users.first();
      if (!user) {
          user = msg.author;
      }
      //Variables for the embed
      let userGuildMember = msg.guild.member(user);

      let userID = user.id;
      let userName = user.username;
      let userDiscriminator = user.discriminator;
      let userAvatar = user.avatarURL;

      let userNickname = userGuildMember.nickname;
      let userStatus = user.presence.status;
      let userRoles = userGuildMember.roles.map(r => r.name).slice(1);
      let userRoleColor = userGuildMember.highestRole.hexColor;

      let userCreateDate = moment(user.createdAt).format('MMMM Do YYYY')
      let userJoinedDate = moment(userGuildMember.joinedAt).format('MMMM Do YYYY')

      if (userNickname == null) {
          userNickname = "No Nickname";
      }

      //Adding data to rich embed
      userInfoEmbed.setAuthor(`${userName}` + "#" + `${userDiscriminator}`, `${userAvatar}`);
      userInfoEmbed.setColor("#58fc91");
      userInfoEmbed.setImage(userAvatar);
      userInfoEmbed.setFooter(`has ${userRoles.length} role(s)`, userAvatar);

      //First row
      userInfoEmbed.addField("ID", userID, true);
      userInfoEmbed.addField("Discriminator", userDiscriminator, true);
      userInfoEmbed.addField("Status", userStatus, true);

      //Second row
      userInfoEmbed.addField("Name", userName, true);
      userInfoEmbed.addField("Color", userRoleColor, true);
      userInfoEmbed.addField("Nickname", userNickname, true);


      //Third Row
      if (userRoles.length >= 1) {
          userInfoEmbed.addField("Roles", userRoles, true);
      } else {
          userInfoEmbed.addField("Roles", "No roles", true);
      }

      //Fourth row
      userInfoEmbed.addField("Created at", userCreateDate, true);
      userInfoEmbed.addField("Joined at", userJoinedDate, true);
      msg.channel.sendEmbed(userInfoEmbed);
  }