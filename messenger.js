//-----MODULES
const login = require('fca-unofficial')
const puppeteer = require('puppeteer')
const fs = require('fs')



//-----FILE IMPORT
const dicFunc = require('./dic')
const imageSearch = require('./image-search')


//---BROWSER INIT.
let browser = null
let page = null;
async function launch() {
    try {
        browser = await puppeteer.launch({ headless: true, defaultViewport: null })
        page = await browser.newPage()
    } catch (error) {
        console.log(error.message);
    }
}
launch()


// var credentials = { email: "theomurf47@gmail.com", password: "forceLogin" };


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



            switch (args[0]) {
                case 'dic':
                    api.markAsRead(yourID)
                    api.sendTypingIndicator(yourID)
                    api.sendMessage(await dicFunc(browser, page, args[1]), yourID)
                    break;


                case 'google':
                    await imageSearch(browser, args[1])
                    const msg = {
                        attachment: fs.createReadStream(__dirname + `/${args[1]}.png`)
                    }
                    api.sendTypingIndicator(yourID)
                    api.sendMessage(msg, yourID);
                    fs.unlink(__dirname + `/${args[1]}.png`, (err) => {
                        if (err) throw err
                        console.log('deleted succusfully!');
                    })
                    console.log(`on it's way!...`);
                    break;
                default:
                    break;
            }

        }
        return null
    });

})