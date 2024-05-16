const config = {
    tokenString  : "6471422980:AAHQP-13dn8OC_P2KNTEKsHoLc0IrLhSXcI",
    botName: "your_bot",
    serverAddress: "",
    serverPort: "",
    storage: {
      db: "./db"
    }
}

//deps
const TelegramBot = require('node-telegram-bot-api')
const tanos = require('tanos-v2')
const levelup = require('levelup')
const memdown = require('memdown')
const encode = require('encoding-down')

//instances
const db = require("./db.js")(config);
const privateChat = require('./private-chat.js')
const groupChat = require('./group-chat.js')
const bot = new TelegramBot(config.tokenString, { polling: true })


const privateConfig = {
  bot: bot,
  db: db,
  app: privateChat.app(config),
  layout: privateChat.layout,
  serverAddress: config.serverAddress,
  serverPort: config.serverPort,
  botName: config.botName,
  types: ['private']
};

tanos(privateConfig, (err)=> { console.log(err) })
/*
const groupConfig = {
    bot: bot,
    db: db,
    app: groupChat.app(config),
    layout: groupChat.layout,
    serverAddress: config.serverAddress,
    serverPort: config.serverPort,
    botName: config.botName,
    types: ['group', 'supergroup', 'channel'],
    inputCommands: ['/ping']
};

tanos(groupConfig, (err)=> { console.log(err) })
*/