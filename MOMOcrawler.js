const puppeteer = require('puppeteer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'item',
});

const name = "nike dunk";
const newName = name.replace(" ", "%20");
// i 為第幾頁 momo從1開始
// const i = 1;

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
};

async function main(newName, i) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const shopurl = "https://www.momoshop.com.tw/search/searchShop.jsp?keyword=" + newName + "&searchType=1&curPage=" + i + "&_isFuzzy=0&showType=chessboardType";

    await page.goto(shopurl, { waitUntil: 'networkidle2' });

    await delay(1000);
    // ...scraping code here...
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

    var dataList = await page.evaluate(() => {
        let result = [];
        // const $ = window.$;
        // let liList = document.querySelector("#BodyBase > div.bt_2_layout.searchbox.searchListArea.selectedtop > div.searchPrdListArea.bookList > div.listArea > ul > li");

        // document.querySelector("a > div.prdImgWrap.prdListSwiper.swiper-container.manyPics.swiper-container-initialized.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > img")

        for (let index = 1; index <= 30; index++) {

            let path = "#BodyBase > div.bt_2_layout.searchbox.searchListArea.selectedtop > div.searchPrdListArea.bookList > div.listArea > ul > li:nth-child(" + index + ")";
            var newItem = {
                url: document.querySelector(path + " > a").href,
                img: document.querySelector(path + " > a > div.prdImgWrap.prdListSwiper.swiper-container.manyPics.swiper-container-initialized.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > img").src,
                name: document.querySelector(path + " > a > div.prdInfoWrap > div.prdNameTitle > h3").innerText,
                price: document.querySelector(path + " > a > div.prdInfoWrap > p.money > span.price > b").innerText.replace(",", ""),
                source: "https://i.ibb.co/NpC2tpx/momoshop.png"
            };
            result.push(newItem);
        };

        return result;
    });
    await delay(3000);


    await browser.close();

    console.log(dataList);
    console.log(dataList.length);

    return dataList; // resolve the Promise with the scraped data
}

(async () => {
    for(let i = 1;i<6;i++){

        const dataList = await main(newName, i);
        dataList.forEach((element) => {
            connection.query(`INSERT INTO aa (url,img,name,price,source) VALUES("${element.url}","${element.img}","${element.name}","${element.price}","${element.source}")`, function (error, results, fields) {
                if (error) throw error;
                console.log(results);
            });
        });
    }
    connection.end();
})();
