const puppeteer = require('puppeteer');
var name = "nike dunk";
var newName = name.replace(" ", "%20");
// console.log(newName);
//i 是要爬的頁數第1頁、第2頁....
var i =1;
var finish = true;
async function main(newName, i) {
    finish=false;
    console.log(finish);
    //是否要背景執行 flase 
    const browser = await puppeteer.launch({ headless: false });
    // 叫puppeteer(操偶師)開啟一個瀏覽器介面
    const page = await browser.newPage();
    // 設定視窗大小   
    // await page.setViewport({ width: 1920, height: 1080 });
    //去某某網站
    let shopurl = "https://www.momoshop.com.tw/search/searchShop.jsp?keyword=" + newName + "&searchType=1&curPage=" + i + "&_isFuzzy=0&showType=chessboardType";

    await page.goto(shopurl, { waitUntil: 'networkidle2' });

    await delay(1000);
    const elem = await page.$('div');
    const boundingBox = await elem.boundingBox();
    await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
    );
    await page.mouse.wheel({ deltaY: 1000 });
    var i = 0;
    while (i < 3) {

        await page.mouse.wheel({ deltaY: 200 });
        await delay(1000);
        i++;
    };
    await delay(3000);
    // await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

    var dataList = await page.evaluate(() => {
        let result = [];
        // const $ = window.$;
        let liList = document.querySelector("#BodyBase > div.bt_2_layout.searchbox.searchListArea.selectedtop > div.searchPrdListArea.bookList > div.listArea > ul > li");

        // document.querySelector("a > div.prdImgWrap.prdListSwiper.swiper-container.manyPics.swiper-container-initialized.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > img")

        for (let index = 1; index <= 30; index++) {

            let path = "#BodyBase > div.bt_2_layout.searchbox.searchListArea.selectedtop > div.searchPrdListArea.bookList > div.listArea > ul > li:nth-child(" + index + ")";
            var newItem = {
                url: document.querySelector(path + " > a").href,
                img: document.querySelector(path + " > a > div.prdImgWrap.prdListSwiper.swiper-container.manyPics.swiper-container-initialized.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > img").src,
                name: document.querySelector(path + " > a > div.prdInfoWrap > div.prdNameTitle > h3").innerText,
                peice: document.querySelector(path + " > a > div.prdInfoWrap > p.money > span.price > b").innerText
            };
            result.push(newItem);
        };

        return result;
    });
    await browser.close();

    console.log(dataList);
    console.log(dataList.length);
    finish = true;
    console.log(finish);
    

}
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
};

main(newName, i);







