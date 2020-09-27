const Telegram = require('./src/sendToTelegram');
const account = require('./src/account/account.json');
const time = Date.now();
const timeObj = new Date(time);
(async () => {
    const accountLength = Object.keys(account).length;
    try {
        await Telegram.sendInfo("Date: " + timeObj.getFullYear() + "/" + (timeObj.getMonth()+1) + "/" + timeObj.getDate() + " | Registered Account: ", accountLength);
        for(let i = 0; i < accountLength; i++){
            await Telegram.sendSuccess("[Registered] Email: ", account[i].email);
        }
    } catch(e) {
        console.log(e);
        process.exit();
    } finally {
        // send message to telegram
        await Telegram.sendDone();
        process.exit();
    }
    // debugger;
})();