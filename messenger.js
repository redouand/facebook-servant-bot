//-----MODULES
const login = require('fca-unofficial')
const puppeteer = require('puppeteer')
const translate = require('translate-google')
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
// const credentials = { email: 'hhpdmua_thurnsky_1606478026@tfbnw.net', password: '1t1bw29ru5i' }


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
                    translate(restStr, { from: 'en', to: args[1] }).then(res => {
                        api.sendMessage(res, yourID)
                        console.log(typeof res)
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