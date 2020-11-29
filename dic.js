//-----global variables
const SEARCH_URL = (urlWord) => `https://dictionary.cambridge.org/dictionary/english/${urlWord}`


async function dicFunc(browser, page, term) {
    try {

        //-----STOP REQUESTS
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() == 'script') {
                req.abort();
            }
            else {
                req.continue();
            }
        });


        //-----GOTO SITE, SET DEFINITION
        await page.goto(SEARCH_URL(term))

        const def = await page.evaluate(() => {
            return document.querySelector('div[class="def ddef_d db"]').innerText
        })

        return `${def}`
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = dicFunc
