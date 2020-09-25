const puppeteer = require('puppeteer');
const Telegram = require('./sendToTelegram');

// time
const time = Date.now();
const timeObj = new Date(time);

const BASE_URL = 'https://siswa.smktelkom-mlg.sch.id';
const HADIR_URL = 'https://siswa.smktelkom-mlg.sch.id/presnow'
const LOGOUT_URL = 'https://siswa.smktelkom-mlg.sch.id/login/logout'

const siakad = {
    browser: null,
    page: null,

    initialize: async (accountLength) => {
        siakad.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        siakad.page = await siakad.browser.newPage();
        await siakad.page.setViewport({
            width: 1440,
            height: 880,
            deviceScaleFactor: 1,
          });
        
        console.log("BOT RUNNING!");
        
        // Send message to telegram
        await Telegram.sendInfo("Date: " + timeObj.getFullYear() + "/" + (timeObj.getMonth()+1) + "/" + timeObj.getDate() + " | Jumlah Account: ", accountLength);
        
        await siakad.page.waitForTimeout(500);
    },

    login: async (no,email,pass) => {
        console.log("no." + no + "|email: " + email)
        try{
            await siakad.page.goto(BASE_URL, {waitUntil: 'networkidle2'});

            await siakad.page.waitForTimeout(500);

            // menulis username dan password
            await siakad.page.type('input[name="email"]', email, {delay: 5});
            await siakad.page.type('input[name="password"]', pass, {delay: 5});

            // inisiasi button dengan xpath
            let loginButton = await siakad.page.$x('//*[@id="masuk"]');
            await loginButton[0].click();

            console.log("-- Login Success");
        }catch(err){
            console.log("- Gagal Login");
            console.log(err);
        }
    },

    absen: async (email) => {
        console.log("-- Absen Masuk");
        try{
            await siakad.page.waitForTimeout(500);

            await siakad.page.goto(HADIR_URL, {waitUntil: 'networkidle2'});
            
            await siakad.page.waitForTimeout(500);

            let hadirSelector = await siakad.page.$x('/html/body/section[2]/div/div[2]/div/div/form/table/tbody/tr[1]/td[2]/div/button/span[1]');
            await hadirSelector[0].click();

            await siakad.page.waitForTimeout(500);

            let hadirMasuk = await siakad.page.$x('/html/body/section[2]/div/div[2]/div/div/form/table/tbody/tr[1]/td[2]/div/div/ul/li[2]/a');
            await hadirMasuk[0].click();
            
            await siakad.page.waitForTimeout(500);

            let hadirButton = await siakad.page.$x('//*[@id="simpan"]');
            await hadirButton[0].click();

            await siakad.page.waitForTimeout(500);

            await siakad.page.screenshot({path: 'success-'+email+'.png', fullPage: true});

            // Send message to telegram
            await Telegram.sendAbsenSukses("[Absen Berhasil] Email: ", email);

            console.log("-- Absen Success");
        } catch(err){

            // Send message to telegram
            await Telegram.sendFailed("[Absen Gagal] Email: ", email);

            console.log("- Ga bisa Absen");
            console.log(err);
        }
    },

    logout: async () => {
        try{
            await siakad.page.goto(LOGOUT_URL, {waitUntil: 'networkidle2'});

            await siakad.page.waitForTimeout(500);
            
            console.log("-- Logout");
        }catch(err){
            console.log("gagal logout");
            console.log(err);
        }
    }
}

module.exports = siakad;