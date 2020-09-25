const Tele = require('node-telegram-bot-api');

// var chat_id = '-1001478146003'; // CHANNEL utama
const chat_id = '924568718'; // PC dev
const token = '1169639831:AAGrN3YjyPYcJidMoH4mlqmD-fzoj_SWJWo';
const bot = new Tele(token, {polling: true});

// time
const time = Date.now();

const Telegram = {
    
    sendInfo: async (content, accountLength) => {
        await bot.sendMessage(chat_id,"🔔[INFO!] " + content + accountLength);
    },
    
    sendDone: async () => {
        await bot.sendMessage(chat_id, "⚠️[DONE!] Success... | Time load: " + (Math.floor((Date.now() - time) / 1000)) + "s");
    },

    sendSuccess: async (content, email) => {
        await bot.sendMessage(chat_id, "✅" + content + email);
    },
    
    sendFailed: async (content, email) => {
        await bot.sendMessage(chat_id, "❌" + content + email);
    }   
}

module.exports = Telegram;