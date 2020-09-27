const siakad = require('./src/siakad');
const Telegram = require('./src/sendToTelegram');
const account = require('./src/account/account.json');
(async () => {
    const accountLength = Object.keys(account).length;
    await siakad.initialize(accountLength);
    try {
        for(let i = 0; i < accountLength; i++){
            await siakad.login(i+1, account[i].email, account[i].pass);
            await siakad.absen(account[i].email);
            await siakad.logout();
        }
    } catch(e) {
        console.log(e);
        process.exit();
    } finally {
        // send message to telegram
        await Telegram.sendDone();
        siakad.browser.close();
        process.exit();
    }
    // debugger;
})();