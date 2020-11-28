//-----MODULES
const login = require('fca-unofficial')
const puppeteer = require('puppeteer')
const translatte = require('translatte')
const cleverbot = require("cleverbot-free");
const fs = require('fs')



//-----FILE IMPORT
const dicFunc = require('./dic')
const imageSearch = require('./image-search')


//---BROWSER INIT.
let browser = null
let page = null;
async function launch() {
    try {
        browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--no-sandbox'] })
        page = await browser.newPage()
    } catch (error) {
        console.log(error.message);
    }
}
launch()


// var credentials = { email: "theomurf47@gmail.com", password: "forceLogin" };
// const credentials = { email: 'hhpdmua_thurnsky_1606478026@tfbnw.net', password: 'qc7oos5s38p' }


//----Variabls
const PREFIX = '!'



//-----LOGIN
login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
    if (err) return console.error(err);

    api.listen(async (err, message) => {
        if (err) return console.error(err.message);
        if (message.type == 'message') {
            const body = message.body
            const yourID = message.threadID

            let args = body.substring(PREFIX.length).split(' ')
            let restStr = args.slice(1).join(' ')
            let keyword = body.charAt(0)

            if (keyword !== '!') {
                api.sendTypingIndicator(yourID)
                cleverbot(body).then(res => {
                    console.log(res);
                    api.sendMessage(res, yourID)
                }).catch(err => console.log(err.message))
            }


            switch (args[0]) {
                case 'dic':
                    api.markAsRead(yourID)
                    api.sendTypingIndicator(yourID)
                    api.sendMessage(await dicFunc(browser, page, args[1]), yourID)
                    break;


                case 'google':
                    api.sendTypingIndicator(yourID)
                    await imageSearch(browser, restStr)
                    const msg = {
                        attachment: fs.createReadStream(__dirname + `/${restStr}.png`)
                    }
                    api.sendMessage(msg, yourID);
                    fs.unlink(__dirname + `/${restStr}.png`, (err) => {
                        if (err) throw err
                        console.log('deleted succusfully!');
                    })
                    console.log(`on it's way!...`);
                    break;

                case 'translate':
                    api.sendTypingIndicator(yourID)
                    translatte(restStr, { to: args[1] }).then(res => {
                        api.sendMessage(res.text, yourID)
                        console.log(typeof res.text)
                    }).catch(err => {
                        console.error(err)
                        api.sendMessage('something went wrong, sorry...')
                    })
                default:
                    break;
            }

        }
        return null
    });

})