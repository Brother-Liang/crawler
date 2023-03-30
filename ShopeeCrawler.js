const puppeteer = require('puppeteer');
//搜尋的關鍵字
var name  = "nike dunk";
//將空白改成%20
var newName = name.replace(" ","%20");
async function main(newName) {
    //是否要背景執行 flase 
    const browser = await puppeteer.launch({ headless: false });
    // 叫puppeteer(操偶師)開啟一個瀏覽器介面
    const page = await browser.newPage();
    // 設定視窗大小   
    await page.setViewport({ width: 1920, height: 1080 });
    //設定網址
    let shopurl = "https://shopee.tw/search?keyword=";
    
    //去蝦皮網站並加上要搜尋的關鍵字
    await page.goto(shopurl + newName, { waitUntil: 'networkidle2' });

    await delay(1000);
    const elem = await page.$('div');
    const boundingBox = await elem.boundingBox();
    //設定滑鼠移動到中央
    await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
    );
    //滑鼠滾輪下滑1000
    
    await page.mouse.wheel({ deltaY: 1000 });
    var i = 0;
    //滑鼠滾輪下滑4次模仿使用者瀏覽頁面,讓商品加載出來
    
    while (i < 4) {

        await page.mouse.wheel({ deltaY: 1000 });
        await delay(5000);
        i++;
    };
    // await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

    var dataList = await page.evaluate(() => {
        let result = [];
        const $ = window.$;
        // let result__items = document.querySelector(" ");
        for (let i = 1; i <= 50; i++) {

            let url = "#main > div > div.dYFPlI > div > div > div.sdzgsX > div.shopee-search-item-result > div.row.shopee-search-item-result__items > div:nth-child(" + i + ") > a ";
            if (!document.querySelector(url + "div.KMyn8J > div.dpiR4u > div.FDn--\\+ > div").innerText.match("客訂")) {
                var newsItem = {

                    url:document.querySelector(url).href,
                    img: document.querySelector(url + "> div > div > div:nth-child(1) > div > img").src,
                    name: document.querySelector(url + "> div > div > div.KMyn8J > div.dpiR4u > div.FDn--\\+ > div").innerText,
                    peice: document.querySelector(url + "> div > div > div.KMyn8J > div.hpDKMN > div > span:nth-child(2)").innerText,
                };
                result.push(newsItem);

            }
        }

        return result;
    });
    await browser.close();

    console.log(dataList);
    console.log(dataList.length);




}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

main(newName);