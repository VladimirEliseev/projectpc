const puppeteer=require('puppeteer')
const express=require('express')
const mysql=require('mysql2')

const pool=mysql.createConnection({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'configurationpc',
  password: '1234',
})

async function updatePriceDns(){
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  }
  );
  let pageURL,page
  pool.query("Select * from accessoriesinshops where idShop=1",async function(err, data){
    if(err) return console.log(err)
      for(let i=0;i<data.length;i++){
        page = await browser.newPage()
        if(data[i].link!==null){
        try{
          pageURL=data[i].link
          await page.goto(pageURL)
          await page.waitForSelector('.product-buy__price, .product-unavailable_inited')
        }catch{}
        try{
          price=await page.$eval('.product-buy__price', el =>el.innerHTML.toString().substr(0, el.innerHTML.length-2))
          price=price.replace(" ", "")
          await console.log(price)
          pool.query(`update accessoriesinshops set price=${price} where idShop=${1} and idAccessory=${data[i].idAccessory}`,async function(err, data){
            console.log(data)
          })
        }
        catch{
          pool.query(`update accessoriesinshops set price=${null} where idShop=${1} and idAccessory=${data[i].idAccessory}`,async function(err, data){
            console.log(data)
          })
        console.log('нет в наличии')
      }
    }
    page.close()
    }
    await browser.close();
  })  
};


async function updatePriceNicePrice(){
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  }
  );
  let pageURL,page
  pool.query("Select * from accessoriesinshops where idShop=2",async function(err, data){
    if(err) return console.log(err)
      for(let i=0;i<data.length;i++){
          page = await browser.newPage()
          if(data[i].link!==null){
          try{
            pageURL=data[i].link
            await page.goto(pageURL)
            await page.waitForSelector('.shop-open-price, .shop-open-noprice')
          }catch{
          }
          try{
            price=await page.$eval('.shop-open-price>span', el =>el.innerHTML.toString().substr(0, el.innerHTML.length-2))
            price=price.replace(" ", "")
            await console.log(price)
            pool.query(`update accessoriesinshops set price=${price} where idShop=${2} and idAccessory=${data[i].idAccessory}`,async function(err, data){
              console.log(data)
            })
          }
          catch{
            pool.query(`update accessoriesinshops set price=${null} where idShop=${2} and idAccessory=${data[i].idAccessory}`,async function(err, data){
              console.log(data)
            })
          console.log('нет в наличии')
        }
      }
      await page.close()
    }
    await browser.close();
  })  
};
async function updatePriceNix(){
  const browser = await puppeteer.launch({
    headless: true,
    devtools: true
  }
  );
  let pageURL,page
  pool.query("Select * from accessoriesinshops where idShop=3",async function(err, data){
    if(err) return console.log(err)
      for(let i=0;i<data.length;i++){
          page = await browser.newPage()
          if(data[i].link!==null){
          try{
            pageURL=data[i].link
            await page.goto(pageURL)
            await page.waitForSelector('.CanBeSold, .ui-dialog')
          }catch{
          }
          try{
            price=await page.$eval('.price>span', el =>el.innerHTML.toString().substr(0, el.innerHTML.length-4))
            price=price.replace(/&nbsp;/gi, '');
            await console.log(price)
            pool.query(`update accessoriesinshops set price=${price} where idShop=${3} and idAccessory=${data[i].idAccessory}`,async function(err, data){
              console.log(data)
            })
          }
          catch{
            pool.query(`update accessoriesinshops set price=${null} where idShop=${3} and idAccessory=${data[i].idAccessory}`,async function(err, data){
              console.log(data)
            })
          console.log('нет в наличии')
        }
      }
      await page.close()
    }
    await browser.close();
  })  
};
module.exports.updatePriceDns=updatePriceDns
module.exports.updatePriceNicePrice=updatePriceNicePrice
module.exports.updatePriceNix=updatePriceNix