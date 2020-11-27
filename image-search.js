

async function imageSearch(browser, query) {
    const url = `https://www.google.com/search?tbm=isch&q=${query}`
    const googleImg = await browser.newPage()
    await googleImg.setViewport({ width: 1366, height: 768 });
    await googleImg.goto(url)

    await googleImg.evaluate(x => {
        document.querySelector(`header[id="kO001e"]`).remove()
        window.scrollBy(0, 200);
    })

    await googleImg.screenshot({ path: `${query}.png` });
    await googleImg.close()
}

module.exports = imageSearch