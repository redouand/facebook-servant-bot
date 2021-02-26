//-----MODULES
const login = require('fca-unofficial')
const puppeteer = require('puppeteer')
const translatte = require('translatte')
const cleverbot = require("cleverbot-free");
const fs = require('fs')

require('./db/config')



//-----FILE IMPORT
const dicFunc = require('./dic')
const imageSearch = require('./image-search')
const servantCon = require('./db/model')


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
// const credentials = { email: 'hhpdmua_thurnsky_1606478026@tfbnw.net', password: '9cnzlh696gs' }
const credentials = { email: 'redlovesmoviesYO@gmail.com', password: 'newlife47' }


//----Variabls
const PREFIX = '!'



//-----LOGIN
//{ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }
login(credentials, (err, api) => {
    if (err) return console.error(err);

    api.listen(async (err, message) => {
        if (err) return console.error(err.message);
        if (message.type == 'message') {
            const yourID = message.threadID
            api.getUserInfo(yourID, async (err, info) => {
                const name = info[yourID].name.replace(/ /g, '-')
                const body = message.body


                const user = await servantCon.findOne({ name })



                if (user) {
                    try {
                        //------------Clever Bot-----------
                        if (user.clever) {
                            let keyword = body.charAt(0)
                            if (keyword !== '!') {
                                api.sendTypingIndicator(yourID)
                                setTimeout(() => {
                                    cleverbot(body).then(res => {
                                        api.sendMessage(res, yourID)
                                    }).catch(err => console.log(err.message))
                                }, 3500);
                            }
                        }






                        let args = body.substring(PREFIX.length).split(' ')
                        let restStr = args.slice(1).join(' ')
                        switch (args[0]) {
                            case 'def':
                                api.markAsRead(yourID)
                                api.sendTypingIndicator(yourID)
                                setTimeout(async () => {
                                    api.sendMessage(await dicFunc(browser, page, args[1]), yourID)
                                }, 3500);
                                break;







                            case 'google':
                                api.sendTypingIndicator(yourID)
                                await imageSearch(browser, restStr)
                                const msg = { attachment: fs.createReadStream(__dirname + `/${restStr}.png`) }
                                api.sendMessage(msg, yourID);
                                fs.unlink(__dirname + `/${restStr}.png`, (err) => {
                                    if (err) throw err
                                })
                                break;






                            case 'config':
                                if (user.admin) {
                                    api.sendTypingIndicator(yourID)


                                    const newAdmin = await new servantCon({
                                        name: (args[args.length - 2] == 'true' || args[args.length - 2] == 'false') ? args.slice(1, args.length - 2).join('-') : args.slice(1).join('-').replace(/-true|-false/g, ''),
                                        admin: (args[args.length - 2] == 'true' || args[args.length - 2] == 'false') ? args[args.length - 2] : undefined,
                                        clever: (args[args.length - 1] == 'true' || args[args.length - 1] == 'false') ? args[args.length - 1] : undefined
                                    }).save()

                                    setTimeout(() => {
                                        api.sendMessage(`
*You have added ${args[1].toUpperCase()} to the Database.*
----------------------------------------
name: ${newAdmin.name}.
admin: ${newAdmin.admin}.
clever-Bot: ${newAdmin.clever}.
----------------------------------------
                                                    `, yourID);
                                    }, 3500);
                                }
                                else {
                                    api.sendTypingIndicator(yourID)
                                    setTimeout(() => {
                                        api.sendMessage(`you can't perform this action because you're not an admin..`, yourID);
                                    }, 3500);
                                }
                                break;









                            case 'translate':
                                api.sendTypingIndicator(yourID)
                                translatte(restStr, { to: args[1] }).then(res => {
                                    setTimeout(() => {
                                        //split(' ').slice(1).join(' ')
                                        api.sendMessage(res.text, yourID)
                                    }, 3000);
                                }).catch(err => {
                                    setTimeout(() => {
                                        api.sendMessage('something went wrong, sorry...')
                                    }, 3500);
                                })
                            default:
                                break;
                        }
                    } catch (err) {
                        setTimeout(() => {
                            api.sendMessage('something went wrong, sorry...    ' + err)
                        }, 3500);
                    }
                }
            })
        }
        return null
    });

})
