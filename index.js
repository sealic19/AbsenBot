const siakad = require('./siakad');
const account = require('./account.json');

(async () => {
    await siakad.initialize();

    const accountLength = Object.keys(account).length;

    for(let i = 0; i < accountLength; i++){
        await siakad.login(i+1, account[i].email, account[i].pass);

        await siakad.absen(account[i].email);

        await siakad.logout();
    }

    debugger;
})();