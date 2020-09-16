const siakad = require('./siakad');
const account = require('./account.json');

(async () => {
    await siakad.initialize();

    const accountLength = Object.keys(account).length;

    try {
        for(let i = 0; i < accountLength; i++){
            await siakad.login(i+1, account[i].email, account[i].pass);
    
            await siakad.absen(account[i].email);
    
            await siakad.logout();
        }
    } catch(e) {
        console.log(e);
        process.exit();
    }
    finally {
        siakad.browser.close();
    }

    // debugger;
})();