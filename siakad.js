const puppeteer = require('puppeteer');
const Telegram = require('node-telegram-bot-api');
// const dbot = require('dbot-js')

var chat_id = '-1001478146003';
var token = '1169639831:AAGrN3YjyPYcJidMoH4mlqmD-fzoj_SWJWo';
// var telegramUrl = "https://api.telegram.org/bot" + token;

const bot = new Telegram(token, {polling: true});

const BASE_URL = 'https://siswa.smktelkom-mlg.sch.id';
const HADIR_URL = 'https://siswa.smktelkom-mlg.sch.id/presnow'
const LOGOUT_URL = 'https://siswa.smktelkom-mlg.sch.id/login/logout'

const siakad = {
    browser: null,
    page: null,

    initialize: async () => {
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

            // bot.sendMessage(chat_id, '✅[Login Berhasil] Email: ' + email);

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

            // await siakad.page.screenshot({path: 'success-'+email+'.png', fullPage: true});

            // const url = 'https://www.vhv.rs/dpng/d/356-3568543_check-icon-green-tick-hd-png-download.png';
            // bot.sendPhoto(chat_id, url);

            // await siakad.page.waitForTimeout(1000);

            bot.sendMessage(chat_id, '✅[Absen Berhasil] Email: ' + email);

            console.log("-- Absen Success");
        } catch(err){
            console.log("- Ga bisa Absen");
            console.log(err);
            
            // const path = "success-" + email + ".png"
            // await siakad.page.screenshot({path: path, fullPage: true});

            // const url = 'https://jumeirahroyal.com/wp-content/uploads/d7e50cb89c.png';
            // bot.sendPhoto(chat_id, url);

            // await siakad.page.waitForTimeout(1000);

            bot.sendMessage(chat_id, '❌[Absen Gagal] Email: ' + email);

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
        // process.exit();
        //  debugger;
    }
}

module.exports = siakad;