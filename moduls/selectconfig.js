const c = require('config')
const express=require('express')
const mysql=require('mysql2/promise')
const app=express()
const pool=mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'configurationpc',
  password: '1234',
})

let remainPrice=0

const cf={
  'game':{
    cpu: 0.20,
    gpu: 0.35,
    motherboard: 0.1,
    ram: 0.12,
    rom: 0.115,
    power: 0.05,
    case: 0.05,
    fun: 0.025
  },
  'work':{
    cpu: 0.28,
    gpu: 0.28,
    motherboard: 0.08,
    ram: 0.12,
    rom: 0.115,
    power: 0.05,
    case: 0.05,
    fun: 0.025
  },
  'media':{
    cpu: 0.33,
    motherboard: 0.16,
    ram: 0.15,
    rom: 0.12,
    power: 0.075,
    case: 0.075,
    fun: 0.05
  }
}
let config={
}

const selectCpu = async(params, purpose)=>{
  let maxPriceCpu
  if(remainPrice===0)
    maxPriceCpu=params.price.maxPrice*cf[purpose].cpu
  else
    maxPriceCpu=config.cpu[0].price+remainPrice
  let rowsCpu,rowsSpec
  if(config.cpu!==0){
    try{
      if(purpose==='media'){
        if(params.producerCpu==='Нет'){
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
          inner join specs on specsaccessories.idSpec=specs.idSpec inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceCpu} and accessories.type='CPU'
          and specs.name='Встроенная графика' and specsaccessories.value<>'Нет' order by totalvalue desc, price LIMIT 1`)
        }else{
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
          inner join specs on specsaccessories.idSpec=specs.idSpec inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceCpu} and accessories.type='CPU'
          and producer='${params.producerCpu}' and specs.name='Встроенная графика' and specsaccessories.value<>'Нет' order by totalvalue desc, price LIMIT 1`)
        }
      }else{
        if(params.producerCpu==='Нет'){
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceCpu} and accessories.type='CPU' and GetBenchTotalCPU(accessories.idAccessory)>300
          order by totalvalue desc, price LIMIT 1`)
        }else{
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceCpu} and accessories.type='CPU' and producer='${params.producerCpu}' and GetBenchTotalCPU(accessories.idAccessory)>300
          order by totalvalue desc, price LIMIT 1`)
        }
      }
      [rowsSpec]=await pool.execute(`select specs.name,value from accessories 
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.idAccessory=${rowsCpu[0].idAccessory} and (specs.name="Сокет" or specs.name="Потребляемая мощность" or specs.name="Тип оперативной памяти")`)
    }
    catch{
      return 0
    }
  }else{
    try{
      if(purpose==='media'){
        if(params.producerCpu==='Нет'){
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
          inner join specs on specsaccessories.idSpec=specs.idSpec inner join shops on accessoriesinshops.idShop=shops.idShop where price>0 and accessories.type='CPU'
          and specs.name='Встроенная графика' and specsaccessories.value<>'Нет' order by price LIMIT 1`);
        }else{
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
          inner join specs on specsaccessories.idSpec=specs.idSpec inner join shops on accessoriesinshops.idShop=shops.idShop where price>0 and accessories.type='CPU'
          and specs.name='Встроенная графика' and producer='${params.producerCpu}' and specsaccessories.value<>'Нет' order by price LIMIT 1`);
        }
      }else{
        if(params.producerCpu==='Нет'){
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price>0 and accessories.type='CPU' and GetBenchTotalCPU(accessories.idAccessory)>300
          order by price 
          LIMIT 1`);
        }else{
          [rowsCpu]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalCPU(accessories.idAccessory) as totalValue, image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price>0 and accessories.type='CPU' and producer='${params.producerCpu}' and GetBenchTotalCPU(accessories.idAccessory)>300
          order by price 
          LIMIT 1`);
        }
      }
      [rowsSpec]=await pool.execute(`select specs.name,value from accessories 
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.idAccessory=${rowsCpu[0].idAccessory} and (specs.name="Сокет" or specs.name="Потребляемая мощность" or specs.name="Тип оперативной памяти")`)
    }
    catch{}
  }
  return [rowsCpu[0], rowsSpec]
}

const selectMotherBoard = async(params, purpose)=>{
  let maxPriceMotherBoard
  if(remainPrice===0)
    maxPriceMotherBoard=params.price.maxPrice*cf[purpose].motherboard+remainPrice
  else
    maxPriceMotherBoard=config.motherboard[0].price+remainPrice
  let rowsSpec,rowsBoard
  if(config.motherboard!==0){
    try{
      [rowsBoard]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link, value from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Чипсет" and price<=${maxPriceMotherBoard} and accessories.idAccessory In
      (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="MotherBoard"
      and specs.name="Сокет" and specsaccessories.value='${config.cpu[1][0].value}') order by value desc, price limit 1`);
      [rowsSpec]=await pool.execute(`select specs.name,value from accessories 
    inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
    inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.idAccessory=${rowsBoard[0].idAccessory} and specs.name="Форм-фактор"`)

    }catch{
      if(remainPrice===0)
        return 0
      else{
        [rowsBoard]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
            specsaccessories.value, link, value from accessories inner join accessoriesinshops on
            accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
            inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
            inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Чипсет" and price>0 and accessories.idAccessory In
            (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
            inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="MotherBoard"
            and specs.name="Сокет" and specsaccessories.value='${config.cpu[1][0].value}') group by shops.name order by price limit 1`);    
            [rowsSpec]=await pool.execute(`select specs.name,value from accessories 
            inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
            inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.idAccessory=${rowsBoard[0].idAccessory} and specs.name="Форм-фактор"`)
            return [rowsBoard[0], rowsSpec]
      }
    } 
  }
  else{
    try{
    [rowsBoard]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
            specsaccessories.value, link, value from accessories inner join accessoriesinshops on
            accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
            inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
            inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Чипсет" and price>0 and accessories.idAccessory In
            (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
            inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="MotherBoard"
            and specs.name="Сокет" and specsaccessories.value='${config.cpu[1][0].value}') group by shops.name order by price limit 1`);    
    [rowsSpec]=await pool.execute(`select specs.name,value from accessories 
            inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
            inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.idAccessory=${rowsBoard[0].idAccessory} and specs.name="Форм-фактор"`) 
    }catch{
      return 0
    }
  }
  return [rowsBoard[0], rowsSpec]
}

const selectVideo = async(params, purpose)=>{
  let maxPriceVideo
  if(remainPrice===0)
    maxPriceVideo=params.price.maxPrice*cf[purpose].gpu
  else
    maxPriceVideo=config.gpu[0].price+remainPrice
  let rowsVideo,rowsSpec
  if(config.gpu!==0){
    try{
      if(purpose==='work'){
        if(params.producerGpu==='Нет'){
          [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceVideo}
          order by totalvalue desc, price 
          LIMIT 1`);
        }else{
          [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceVideo} and producer='${params.producerGpu}'
          order by totalvalue desc, price 
          LIMIT 1`);
        }
      }else{
        if(params.producerGpu==='Нет'){
          [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceVideo} and GetBenchTotalVideo(accessories.idAccessory)>270
          order by totalvalue desc, price 
          LIMIT 1`);
        }else{
          [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price<=${maxPriceVideo} and GetBenchTotalVideo(accessories.idAccessory)>270 and producer='${params.producerGpu}'
          order by totalvalue desc, price 
          LIMIT 1`);
        }
      }
      
      [rowsSpec]=await pool.execute(`select specs.name,value from accessories 
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.idAccessory=${rowsVideo[0].idAccessory} and (specs.name="Изготовитель" or specs.name="Потребляемая мощность")`)
    }
    catch{
      return 0
    }
  }else{
    try{
      if(purpose==='work'){
        if(params.producerGpu==='Нет'){
          [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
          FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
          accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price>0
          order by price LIMIT 1`);
        }else{
          [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
        FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
        accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price>0 and producer='${params.producerGpu}'
        order by price LIMIT 1`);
        }
      }else{
        if(params.producerGpu==='Нет'){
        [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
        FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
        accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price>0 and GetBenchTotalVideo(accessories.idAccessory)>270
        order by price LIMIT 1`)
        }else{
          [rowsVideo]=await pool.execute(`SELECT accessories.idAccessory,producer,type, accessories.name as name, price, shops.name as shop, GetBenchTotalVideo(accessories.idAccessory) as totalValue , image, link
        FROM resultsbench inner join accessories on resultsbench.idAccessory=accessories.idAccessory inner join accessoriesinshops on
        accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop where price>0 and GetBenchTotalVideo(accessories.idAccessory)>270 and producer='${params.producerGpu}'
        order by price LIMIT 1`)
        }
      }
      [rowsSpec]=await pool.execute(`select specs.name,value from accessories 
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.idAccessory=${rowsVideo[0].idAccessory} and (specs.name="Изготовитель" or specs.name="Потребляемая мощность")`)
    }
    catch{}
  }
  return [rowsVideo[0], rowsSpec]
}

const selectRam = async(params, purpose)=>{
  let maxPriceRam
  if(remainPrice===0)
    maxPriceRam=params.price.maxPrice*cf[purpose].ram
  else
    maxPriceRam=config.ram[0].price+remainPrice
  let minVolume=8
  let rowsRamOne, rowsRamTwo
  if(purpose==='game' || purpose==='work')
    minVolume=16
  if(config.ram!==0){
  [rowsRamOne]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link, value from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and specsaccessories.value>=${minVolume/2} and price<=${maxPriceRam/2} and accessories.idAccessory In
      (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="RAM" and specsaccessories.value='${config.cpu[1][2].value}' and
      accessories.idAccessory in (select accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specsaccessories.value='1'))
      order by CAST(value AS SIGNED) desc, price limit 1`);
  [rowsRamTwo]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link, value from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and specsaccessories.value>=${minVolume} and price<=${maxPriceRam} and accessories.idAccessory In
      (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="RAM" and specsaccessories.value='${config.cpu[1][2].value}' and
      accessories.idAccessory in (select accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specsaccessories.value='2'))
      order by CAST(value AS SIGNED) desc, price limit 1`)
      if(rowsRamTwo.length===0 && rowsRamOne.length===0){
        return 0
      }
    }else{
      [rowsRamOne]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link, value from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and specsaccessories.value>=${minVolume/2} and price>0 and accessories.idAccessory In
      (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="RAM" and specsaccessories.value='${config.cpu[1][2].value}' and
      accessories.idAccessory in (select accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specsaccessories.value='1'))
      order by price limit 1`);
  [rowsRamTwo]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link, value from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and specsaccessories.value>=${minVolume} and price>0 and accessories.idAccessory In
      (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="RAM" and specsaccessories.value='${config.cpu[1][2].value}' and
      accessories.idAccessory in (select accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specsaccessories.value='2'))
      order by price limit 1`)
    }
      if(rowsRamOne.length===0){
        rowsRamTwo[0].count=1
        return rowsRamTwo
      }else if(rowsRamTwo.length===0){
        rowsRamOne[0].count=2
        rowsRamOne[0].price*=2
        return rowsRamOne
      }else if(rowsRamOne[0].price*2<rowsRamTwo[0].price){
        rowsRamOne[0].price*=2
        rowsRamOne[0].count=2
        return rowsRamOne
      }else{
        rowsRamTwo[0].count=1
        return rowsRamTwo
      }
}

const selectRom = async(params, purpose)=>{
  let ratioHdd=params.volumeMemory.volumeHdd*0.5
  let ratioSsd=params.volumeMemory.volumeSsd*2
  let rowsHdd, rowsSsd
  if(ratioHdd<ratioSsd){
    ratioSsd=ratioSsd/ratioHdd
    ratioHdd=1
  }
  else if(ratioHdd>ratioSsd){  
    ratioHdd=ratioHdd/ratioSsd
    ratioSsd=1
  }
  else{
    ratioSsd=1
    ratioHdd=1
  }
  let maxPriceSsd
  let maxPriceHdd
  console.log(remainPrice)
  if(remainPrice===0){
    maxPriceSsd=params.price.maxPrice*cf[purpose].rom/2*ratioSsd
    maxPriceHdd=params.price.maxPrice*cf[purpose].rom/2*ratioHdd
  }else{
    maxPriceSsd=config.rom[1].price+remainPrice
    maxPriceHdd=params.price.maxPrice*cf[purpose].rom/2*ratioHdd
  }
    
  if(config.rom!==0){
    if(remainPrice!==0){
      [rowsSsd]=await pool.execute(`select accessories.type,accessories.idAccessory,producer, accessories.name as name, price, shops.name as shop, image,link, value 
      from accessories inner join accessoriesinshops on accessories.idAccessory=accessoriesinshops.idAccessory 
      inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Скорость чтения" and accessories.idAccessory in 
      (select accessories.idAccessory from accessories inner join accessoriesinshops on
        accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
        inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
        inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and price<=${maxPriceSsd} and value BETWEEN ${params.volumeMemory.volumeSsd-40} AND ${+params.volumeMemory.volumeSsd+40} and 
        accessories.idAccessory in (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
        inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="Ssd" and specs.name='Скорость чтения' order by CAST(value AS SIGNED) desc)
        group by accessories.idAccessory order by CAST(value AS SIGNED) desc)
        order by CAST(value AS SIGNED) desc, price limit 1`)
      return [config.rom[0],rowsSsd[0]]
    }
    [rowsHdd]=await pool.execute(`select accessories.type,accessories.idAccessory,producer, accessories.name as name, price, shops.name as shop, image,link, value 
    from accessories inner join accessoriesinshops on accessories.idAccessory=accessoriesinshops.idAccessory 
	  inner join shops on accessoriesinshops.idShop=shops.idShop
	  inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
	  inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Скорость чтения" and accessories.idAccessory in 
    (select accessories.idAccessory from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and price<=${maxPriceHdd} and value BETWEEN ${params.volumeMemory.volumeHdd-100} AND ${+params.volumeMemory.volumeHdd+100} and 
      accessories.idAccessory in (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="HDD" and specs.name='Скорость чтения' order by CAST(value AS SIGNED) desc)
      group by accessories.idAccessory order by CAST(value AS SIGNED) desc)
      order by CAST(value AS SIGNED) desc, price limit 1`);
      [rowsSsd]=await pool.execute(`select accessories.type,accessories.idAccessory,producer, accessories.name as name, price, shops.name as shop, image,link, value 
      from accessories inner join accessoriesinshops on accessories.idAccessory=accessoriesinshops.idAccessory 
      inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Скорость чтения" and accessories.idAccessory in 
      (select accessories.idAccessory from accessories inner join accessoriesinshops on
        accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
        inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
        inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and price<=${maxPriceSsd} and value BETWEEN ${params.volumeMemory.volumeSsd-40} AND ${+params.volumeMemory.volumeSsd+40} and 
        accessories.idAccessory in (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
        inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="Ssd" and specs.name='Скорость чтения' order by CAST(value AS SIGNED) desc)
        group by accessories.idAccessory order by CAST(value AS SIGNED) desc)
        order by CAST(value AS SIGNED) desc, price limit 1`)
      if(rowsHdd.length===0 || rowsSsd.length===0){
        return 0
    }
    }else{
      [rowsHdd]=await pool.execute(`select accessories.type,accessories.idAccessory,producer, accessories.name as name, price, shops.name as shop, image,link, value 
    from accessories inner join accessoriesinshops on accessories.idAccessory=accessoriesinshops.idAccessory 
	  inner join shops on accessoriesinshops.idShop=shops.idShop
	  inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
	  inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Скорость чтения" and accessories.idAccessory in 
    (select accessories.idAccessory from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and price>0 and value BETWEEN ${params.volumeMemory.volumeHdd-100} AND ${+params.volumeMemory.volumeHdd+100} and 
      accessories.idAccessory in (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="HDD" and specs.name='Скорость чтения' order by CAST(value AS SIGNED) desc)
      group by accessories.idAccessory order by CAST(value AS SIGNED) desc)
      order by CAST(value AS SIGNED) desc, price limit 1`);
      [rowsSsd]=await pool.execute(`select accessories.type,accessories.idAccessory,producer, accessories.name as name, price, shops.name as shop, image,link, value 
      from accessories inner join accessoriesinshops on accessories.idAccessory=accessoriesinshops.idAccessory 
      inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Скорость чтения" and accessories.idAccessory in 
      (select accessories.idAccessory from accessories inner join accessoriesinshops on
        accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
        inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
        inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Объем" and price>0 and value BETWEEN ${params.volumeMemory.volumeSsd-40} AND ${+params.volumeMemory.volumeSsd+40} and 
        accessories.idAccessory in (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
        inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="Ssd" and specs.name='Скорость чтения' order by CAST(value AS SIGNED) desc)
        group by accessories.idAccessory order by CAST(value AS SIGNED) desc)
        order by CAST(value AS SIGNED) desc, price limit 1`)
    }
  return [rowsHdd[0], rowsSsd[0]]
}

const selectPower= async(params, purpose)=>{
  let maxPricePower
  if(remainPrice===0)
    maxPricePower=params.price.maxPrice*cf[purpose].power
  else
    maxPricePower=config.power[0].price+remainPrice
  let totalPower,rowsPower
  try{
    totalPower=Number(config.cpu[1][1].value)+Number(config.gpu[1][1].value || 0)+250
  }catch{
    totalPower=Number(config.cpu[1][1].value)+250
  }
  if(config.power!==0){
      [rowsPower]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link, value from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where price<=${maxPricePower} and specs.name='Эффективность' and 
      accessories.idAccessory in 
      (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="PowerSupply" and specs.name='Мощность' and value between ${totalPower} and ${totalPower+350}
      order by CAST(value AS SIGNED) desc) order by CAST(value AS SIGNED) desc,price limit 1`)
      if(rowsPower.length===0)
        return 0
    }else{
    [rowsPower]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link, value from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where specs.name="Эффективность" and price>0 and 
      accessories.idAccessory in 
      (SELECT accessories.idAccessory FROM accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="PowerSupply" and specs.name='Мощность' and value between ${totalPower} and ${totalPower+150}
      order by CAST(value AS SIGNED) desc) order by price limit 1`)
    }
  return rowsPower
}

const selectCase= async(params, purpose)=>{
  let maxPriceCase
  if(remainPrice===0)
    maxPriceCase=params.price.maxPrice*cf[purpose].case
  else
    maxPriceCase=config.case[0].price+remainPrice
  let rowsCase
  if(config.case!==0){
      [rowsCase]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="Case" and specs.name="Типоразмер" and price<=${maxPriceCase} and value='${config.motherboard[1][0].value}'
      order by price desc limit 1`)
      if(rowsCase.length===0)
      return 0
  }else{
    [rowsCase]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
      specsaccessories.value, link from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="Case" and specs.name="Типоразмер" and price>0 and  value='${config.motherboard[1][0].value}'
      order by price limit 1`)
  }
  return rowsCase
}

const selectFun= async(params, purpose)=>{
  let maxPriceFun
  if(remainPrice===0)
    maxPriceFun=params.price.maxPrice*cf[purpose].fun
  else
    maxPriceFun=config.fun[0].price+remainPrice
  let rowsFun
  if(config.fun!==0){
    [rowsFun]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
    specsaccessories.value, link from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="Cooling" and specs.name="Максимальная рассеиваемая мощность" and price<=${maxPriceFun}
      and value between ${config.cpu[1][1].value} and ${+config.cpu[1][1].value+70} order by CAST(value AS SIGNED) desc,price desc limit 1`)
    if(rowsFun.length===0)
      return 0
  }else{
    [rowsFun]=await pool.execute(`select accessories.idAccessory,producer,accessories.type, accessories.name as name, price, shops.name as shop, image,
    specsaccessories.value, link from accessories inner join accessoriesinshops on
      accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
      inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
      inner join specs on specsaccessories.idSpec=specs.idSpec where accessories.type="Cooling" and specs.name="Максимальная рассеиваемая мощность" and price>0
      and value between ${config.cpu[1][1].value} and ${+config.cpu[1][1].value+100} order by price limit 1`)
  }
  return rowsFun
}
const selectConfig=async(params)=>{
  console.log(params)
  config={}, remainPrice=0
  let purpose
  if(params.purpose==='Игры')
    purpose='game'
  else if(params.purpose==='Работа')
    purpose='work'
  else
    purpose='media'
  config.params=params
  config.done=false
 
  config.cpu=await selectCpu(params, purpose)
  if(config.cpu===0)
    config.cpu=await selectCpu(params, purpose)
  config.motherboard=await selectMotherBoard(params, purpose)
  if(config.motherboard===0)
    config.motherboard=await selectMotherBoard(params, purpose)
  if(purpose!=='media'){
    config.gpu=await selectVideo(params, purpose)
    if(config.gpu===0)
      config.gpu=await selectVideo(params, purpose)
  }
  config.ram=await selectRam(params, purpose)
  if(config.ram===0)
    config.ram=await selectRam(params, purpose)
  config.rom=await selectRom(params, purpose)
  if(config.rom===0)
    config.rom=await selectRom(params, purpose)
  config.power=await selectPower(params, purpose)
  if(config.power===0)
    config.power=await selectPower(params, purpose)
  config.case=await selectCase(params, purpose)
  if(config.case===0)
    config.case=await selectCase(params, purpose) 
  config.fun=await selectFun(params, purpose)
  if(config.fun===0)  
    config.fun=await selectFun(params, purpose)

    let totalPrice
    if(purpose==='media'){
      totalPrice=config.cpu[0].price+config.motherboard[0].price+
      config.ram[0].price+config.rom[0].price+config.rom[1].price+config.power[0].price+config.case[0].price+config.fun[0].price
      config.totalPrice=totalPrice
    }
    else{
      totalPrice=config.cpu[0].price+config.gpu[0].price+config.motherboard[0].price+
      config.ram[0].price+config.rom[0].price+config.rom[1].price+config.power[0].price+config.case[0].price+config.fun[0].price
      config.totalPrice=totalPrice
    }
    
    if(totalPrice<(params.price.maxPrice+params.price.maxPrice*0.03)){
      config.done=true
      remainPrice=params.price.maxPrice-totalPrice
      await selectToTotalPrice(params,purpose)
    }
  return config
}

const calcRemainPrice=(params)=>{
  config.totalPrice=config.cpu[0].price+config.gpu[0].price+config.motherboard[0].price+
  config.ram[0].price+config.rom[0].price+config.rom[1].price+config.power[0].price+config.case[0].price+config.fun[0].price
  remainPrice=params.price.maxPrice-config.totalPrice
}
const calcRemainPriceMedia=(params)=>{
  config.totalPrice=config.cpu[0].price+config.motherboard[0].price+
  config.ram[0].price+config.rom[0].price+config.rom[1].price+config.power[0].price+config.case[0].price+config.fun[0].price
  remainPrice=params.price.maxPrice-config.totalPrice
}

const selectToTotalPrice=async(params,purpose)=>{
  switch(purpose){
    case 'game':
      config.gpu=await selectVideo(params, purpose)
      calcRemainPrice(params)
      config.cpu=await selectCpu(params, purpose)
      calcRemainPrice(params)
      config.motherboard=await selectMotherBoard(params, purpose)
      calcRemainPrice(params)
      if(remainPrice>0){
        config.ram=await selectRam(params, purpose)
        calcRemainPrice(params)
        break;
    }
      if(remainPrice>0){
        config.rom=await selectRom(params, purpose)
        calcRemainPrice(params)
        break;
      }
      config.power=await selectPower(params, purpose)
      calcRemainPrice(params)
      config.fun=await selectFun(params, purpose)
      calcRemainPrice(params)
      config.case=await selectCase(params, purpose)
      calcRemainPrice(params)
      break
    case 'work':
      config.cpu=await selectCpu(params, purpose)
      calcRemainPrice(params)
      config.motherboard=await selectMotherBoard(params, purpose)
      calcRemainPrice(params)
      config.gpu=await selectVideo(params, purpose)
      calcRemainPrice(params)
      if(remainPrice>0){
        config.ram=await selectRam(params, purpose)
        calcRemainPrice(params)
        break;
      }
      if(remainPrice>0){
        config.rom=await selectRom(params, purpose)
        calcRemainPrice(params)
        break;
      }
      
      config.power=await selectPower(params, purpose)
      calcRemainPrice(params)
      config.fun=await selectFun(params, purpose)
      calcRemainPrice(params)
      config.case=await selectCase(params, purpose)
      calcRemainPrice(params)
      break
    case 'media':
      config.cpu=await selectCpu(params, purpose)
      calcRemainPriceMedia(params)
      config.motherboard=await selectMotherBoard(params, purpose)
      calcRemainPriceMedia(params)
      if(remainPrice>0){
        config.rom=await selectRom(params, purpose)
        calcRemainPriceMedia(params)
        break;
      }
      if(remainPrice>0){
        config.ram=await selectRam(params, purpose)
        calcRemainPriceMedia(params)
        break;
    }
      config.power=await selectPower(params, purpose)
      calcRemainPriceMedia(params)
      config.fun=await selectFun(params, purpose)
      calcRemainPriceMedia(params)
      config.case=await selectCase(params, purpose)
      calcRemainPriceMedia(params)
      break
  }
}
module.exports.selectConfig=selectConfig
module.exports.config=config