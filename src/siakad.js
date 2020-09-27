// call library and module telegram
const puppeteer = require('puppeteer');
const Telegram = require('./sendToTelegram');
// time
const time = Date.now();
const timeObj = new Date(time);
// URL
const BASE_URL = 'https://siswa.smktelkom-mlg.sch.id';
const HADIR_URL = 'https://siswa.smktelkom-mlg.sch.id/presnow'
const LOGOUT_URL = 'https://siswa.smktelkom-mlg.sch.id/login/logout'
// Main Function
const siakad = {
    browser: null,
    page: null,
    // initialize browser and page
    initialize: async (accountLength) => {
        // for browser
        siakad.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        // for page
        siakad.page = await siakad.browser.newPage();
        // add user agent to handle 'Error: net::ERR_ABORTED'
        await siakad.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
        await siakad.page.setViewport({
            width: 1440,
            height: 880,
            deviceScaleFactor: 1,
          });
        // Send message to console and telegram
        console.log("BOT RUNNING!");
        await Telegram.sendInfo("Date: " + timeObj.getFullYear() + "/" + (timeObj.getMonth()+1) + "/" + timeObj.getDate() + " | Jumlah Account: ", accountLength);
    },
    // initialize login page 'siakad'
    login: async (no,email,pass) => {
        console.log("no." + no + "|email: " + email) // send message to console
        try{
            await siakad.page.goto(BASE_URL, {waitUntil: 'networkidle2'}); // open BASE_URL
            await siakad.page.waitForSelector('#form_login', {visible: true}); // wait until 'id=form_login' visible
            // type username and password
            await siakad.page.type('input[name="email"]', email, {delay: 5});
            await siakad.page.type('input[name="password"]', pass, {delay: 5});
            // initialize button with xpath
            let loginButton = await siakad.page.$x('//*[@id="masuk"]');
            await loginButton[0].click(); // click
            console.log("-- Berhasil Login") // send to console
        }catch(err){
            // throw error only
            console.log("- Gagal Login");
            console.log(err);
        }
    },
    absen: async (email) => {
        console.log("-- Absen Masuk"); // send to console
        try{
            await siakad.page.waitForTimeout(500); // wait for 0,5s
            await siakad.page.goto(HADIR_URL, {waitUntil: 'networkidle0'}); // goto HADIR_URL
            // select with xpath
            let hadirSelector = await siakad.page.$x('/html/body/section[2]/div/div[2]/div/div/form/table/tbody/tr[1]/td[2]/div/button/span[1]');
            await hadirSelector[0].click();
            await siakad.page.waitForTimeout(500);
            let hadirMasuk = await siakad.page.$x('/html/body/section[2]/div/div[2]/div/div/form/table/tbody/tr[1]/td[2]/div/div/ul/li[2]/a');
            await hadirMasuk[0].click();
            await siakad.page.waitForTimeout(500);
            let hadirButton = await siakad.page.$x('//*[@id="simpan"]');
            await hadirButton[0].click();
            await siakad.page.waitForNavigation({
                waitUntil: 'networkidle0'
            })
            // await siakad.page.screenshot({path: 'success-'+email+'.png', fullPage: true}); // take screenshoot
            // Send message to telegram and console
            await Telegram.sendSuccess("[Absen Berhasil] Email: ", email);
            console.log("-- Absen Success");
        } catch(err){
            // Send message to telegram and console eror only
            await Telegram.sendFailed("[Absen Gagal] Email: ", email);
            console.log("- Ga bisa Absen");
            console.log(err);
        }
    },
    logout: async () => {
        try{
            await siakad.page.goto(LOGOUT_URL, {waitUntil: 'networkidle2'}); // goto LOGOUT_URL
            console.log("-- Logout"); 
        }catch(err){
            // Send message to consoleeror only
            console.log("gagal logout");
            console.log(err);
        }
    }
}
module.exports = siakad; // export module 'siakad'