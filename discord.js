// Packages
const {
  Client,
  MessageEmbed,
  Collection
} = require('discord.js');
const client = new Client();
const {
  MessageButton,
  MessageActionRow
} = require('discord-buttons');
require('discord-buttons')(client);
const os = require('os');
const math = require('mathjs');
const fetch = require('node-fetch');
require('dotenv').config();
db = require('./database/mongo');

// Slash Commands
client.ws.on('INTERACTION_CREATE', async interaction => {
  let response;

  if (interaction.data.name === 'report') {
    let value = Object.values(interaction.data.options)[0];
    let results = await db.numbers.get(value.value);
    if (value.value.length === 10) {
      if (results === null) {
        db.numbers.add(value.value, '1', '10', 'Other', false);
      } else {
        let newReports = math.add(results.reports, 1);
        let newPercentage = math.add(results.percentage, 10);

        if (newPercentage > 100) {
          db.numbers.edit(
            value.value,
            newReports,
            newPercentage,
            'Other',
            true
          );
        } else {
          db.numbers.edit(
            value.value,
            newReports,
            newPercentage,
            'Other',
            results.verified
          );
        }
      }
      response = `thanks for reporting!`;
    } else {
      response = `you didn't specify a valid phone number!`;
    }
  }
  if (interaction.data.name === 'telegram') {
    response = `Sorry, we have killed our Telegram service as it was causing our other services to experience some perfomance issues!`;
  }
  if (interaction.data.name === 'discord') {
    response = `You can now invite ScamFinder to your server!\nhttps://discord.com/api/oauth2/authorize?client_id=845490678871228426&permissions=0&scope=applications.commands%20bot`;
  }
  if (interaction.data.name === 'vscode') {
    response = `We now have a VScode extension!\nhttps://marketplace.visualstudio.com/items?itemName=selectthegang.scamfinder`;
  }
  if (interaction.data.name === 'website') {
    response = `https://scamfinder.tk/`;
  }
  if (interaction.data.name === 'docs') {
    response = `Sorry, we are currently working on our API documentation right now.`;
  }
  if (interaction.data.name === 'check') {
    let value = Object.values(interaction.data.options)[0];
    let results = await db.numbers.get(value.value);
    if (value.value.length === 10) {
      if (results === null) {
        response = `the phone number you have specified has not been reported, there is a 25 percent chance of this being a scam call if this is a scam call please use the Report slash command!`;
      } else {
        if (results.verified === true) {
          response = `the phone number you have specified has ${
            results.reports
            } reports as a ${results.type}, this is definitely a scam caller`;
        } else {
          response = `the phone number you have specified has ${
            results.reports
            } reports as a ${results.type}, there is a ${
            results.percentage
            } percent chance of this being a scam call`;
        }
      }
    } else {
      response = `you didn't specify a valid phone number!`;
    }
  }
  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: {
        content: response
      }
    }
  });
});

// Regular Commands + Ready Function
client.on('ready', async () => {
  console.log(`Bot Online!`);
  client.user.setActivity('scamfinder.tk', {
    type: 'LISTENING'
  });
});

client.on('clickButton', async button => {
  if (button.id === 'delete') {
    button.message
      .delete()
      .then(() => {
        button.channel.send(`message has been deleted!`);
      })
      .catch(() => {
        button.channel.send(
          `there was a issue while trying to delete the message, please try again later!`
        );
      });
  }
});


client.on('message', async message => {
  let deletemessage = new MessageButton()
    .setLabel('Delete Message')
    .setStyle('blurple')
    .setID('delete');

  let website = new MessageButton()
    .setLabel("ScamFinder Website")
    .setStyle("url")
    .setURL("https://scamfinder.tk/");

  const btn = new MessageActionRow()
    .addComponent(deletemessage)
    .addComponent(website);

  let prefix = process.env.PREFIX;
  const args = message.content.slice(prefix.length).split(/ +/g);
  const command = args.shift().toLowerCase();

  if (message.content.startsWith(`${prefix}help`)) {
    let i = new MessageEmbed()
      .setTitle(`HELP:`)
      .setColor(`RANDOM`)
      .addField(
        `${prefix}search {phone number}`,
        `returns how much reports that phone number has recieved`,
        true
      )
      .addField(`${prefix}report {phone number}`, `report a phone number`, true)
      .addField(
        `${prefix}guilds`,
        `returns a number of how much guilds/servers that this bot is in`,
        true
      )
      .addField(`${prefix}ping`, `returns the latency of bot`, true)
      .addField(`EXAMPLE PHONE NUMBER:`, `6035761811`, true)
      .setDescription(`this bot's prefix is ${prefix}`);


    message.channel.send({
      component: btn,
      embed: i
    });
  }
  if (message.content.startsWith(`${prefix}guilds`)) {
    let msg = new MessageEmbed()
      .setTitle(`this bot is in ${client.guilds.cache.size} servers/guilds`)
      .setColor('RANDOM');

    message.channel.send({
      component: btn,
      embed: msg
    });
  }
  if (message.content.startsWith(`${prefix}ping`)) {
    let msg = new MessageEmbed()
      .setTitle('PONG!')
      .setColor('RANDOM')
      .addField(
        `🏓 Latency`,
        `${Date.now() - message.createdTimestamp}ms`,
        true
      )
      .addField(`API Latency`, `${Math.round(client.ws.ping)}ms`);

    message.channel.send({
      component: btn,
      embed: msg
    });
  }
  if (message.content.startsWith(`${prefix}report`)) {
    let results = await db.numbers.get(args[0]);
    if (args[0].length === 10) {
      if (results === null) {
        db.numbers.add(value.value, '1', '10', 'Other', false);
      } else {
        let newReports = math.add(results.reports, 1);
        let newPercentage = math.add(results.percentage, 10);

        if (newPercentage > 100) {
          db.numbers.edit(args[0], newReports, newPercentage, 'Other', true);
        } else {
          db.numbers.edit(
            args[0],
            newReports,
            newPercentage,
            'Other',
            results.verified
          );
        }
      }
      response = `thanks for reporting!`;
    } else {
      response = `you didn't specify a valid phone number!`;
    }

    message.channel.send(response, {
      component: btn
    });
  }
  if (message.content.startsWith(`${prefix}search`)) {
    if (args[0].length === 10) {
      let results = await db.numbers.get(args[0]);
      let msg;

      if (results === null) {
        msg = new MessageEmbed()
          .setTitle('Results:')
          .setDescription(
            `the phone number you have specified has not been reported, there is a 25 percent chance of this being a scam call if this is a scam call please go to https://scamfinder.tk/report`
          )
          .setColor('RANDOM');

        message.channel.send({
          component: btn,
          embed: msg
        });
      } else {
        if (results.verified === true) {
          msg = new MessageEmbed()
            .setTitle('Results:')
            .setDescription(
              `the phone number you have specified has ${
              results.reports
              } reports as a ${results.type}, this is definitely a scam caller`
            )
            .setColor('RANDOM');
          message.channel.send({
            component: btn,
            embed: msg
          });
        } else {
          msg = new MessageEmbed()
            .setTitle('Results:')
            .setDescription(
              `the phone number you have specified has ${
              results.reports
              } reports as a ${results.type}, there is a ${
              results.percentage
              } percent chance of this being a scam call`
            )
            .setColor('RANDOM');

          message.channel.send({
            component: btn,
            embed: msg
          });
        }
      }
    } else {
      msg = new MessageEmbed()
        .setTitle(`ERROR:`)
        .setColor('RANDOM')
        .addField(
          'MISSING ARGUEMENTS',
          'THERE WAS NO PHONE NUMBER SPECIFIED...',
          true
        );

      message.channel.send({
        component: btn,
        embed: msg
      });
    }
  }
});

// Start Client
client.login(process.env.DISCORD);