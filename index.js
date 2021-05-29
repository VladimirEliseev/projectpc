const express=require('express')
const {Router}=require('express')
const mysql=require('mysql2')
const multer = require('multer')
const fs=require('fs')
const puppeteer=require('puppeteer')
const app=express()
const jsonParser = express.json()
var bodyParser = require("body-parser")
const {updatePriceDns, updatePriceNicePrice, updatePriceNix} = require('./moduls/parsingprice')
// const e = require('express')
const {selectConfig, config}=require('./moduls/selectconfig')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json({extended:true}))
const pool=mysql.createConnection({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'configurationpc',
  password: '1234',
})
let addId, addType;
let price;

// updatePriceNix()
// updatePriceDns()
// updatePriceNicePrice()
// setInterval(updatePrice, 180000)
// updatePrice()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/public/images/'+addType) 
  },
  filename: function (req, file, cb) {
      cb(null, addId+'.jpg')
  }
});
const upload=multer({storage})
const AccessoriesRouter=Router()
const ConfigRouter=Router()
const SpecRouter=Router()
const UserRouter=Router()
app.use('/api/users', UserRouter)
app.use('/api/accessories', AccessoriesRouter)
app.use('/api/spec', SpecRouter)
app.use('/api/config', ConfigRouter)
let configuration
let purpose

ConfigRouter.post('/',jsonParser,  function(req, res){
  purpose=req.body
  res.send('ok')

})

ConfigRouter.post('/get', jsonParser, async function(req, res){
  if(purpose!==undefined){
    configuration=await selectConfig(purpose)
    res.send(configuration)
  }
})

ConfigRouter.post('/myconfig', jsonParser, async function(req, res){
  const user=req.body.user.idUser
  pool.query(`select * from configs where idUser=${user}`, function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
})

ConfigRouter.post('/delete', jsonParser, async function(req, res){
  const id=req.body.id
  pool.query(`delete from configs where idConfig=${id}`, function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
})


ConfigRouter.post('/myconfig/access', jsonParser, async function(req, res){
  const user=req.body.user.idUser
  pool.query(`SELECT  accessories.idAccessory,accessoriesinshops.price as price, shops.name, producer, accessoriesinshops.link ,accessories.name as name,image, configs.idConfig,count, accessoriesinconfigs.idAccessoryInConfig, type FROM accessories 
  inner join accessoriesinconfigs on accessories.idAccessory=accessoriesinconfigs.idAccessory inner join configs on configs.idConfig=accessoriesinconfigs.idConfig
  inner join accessoriesinshops on
        accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on accessoriesinshops.idShop=shops.idShop
   where configs.idUser=${user} and accessoriesinshops.price>0
    order by idConfig, idAccessory, accessoriesinshops.price`, function(err, data){
    if(err) return console.log(err)
        let idAccess=0
        let array=[]
        
        for(let i=0;i<data.length;i++){
          let isNew=true
          if(data[i].idAccessory===idAccess){
            isNew=false
          }else{
            idAccess=data[i].idAccessory
            array.push(data[i])
          }
        }
        res.send(array)
  })
})

ConfigRouter.post('/save', jsonParser, async function(req, res){
  const config=req.body.config
  const user=req.body.user
  const name=req.body.name
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0')
  let yyyy = today.getFullYear()
  today = yyyy + '-' + mm + '-' + dd
  pool.query(`insert into configs (idUser, name, purpose, price, date) values (${user.idUser}, '${name}', '${config.params.purpose}','${config.params.price.maxPrice}', '${today}')`, function(err, data){
    if(err) return console.log(err)
    for( let key in config){
      if(key!=='done' && key!=='params' && key!=='totalPrice'){
        if(key==='ram'){
          pool.query(`insert into accessoriesinconfigs (idAccessory, idConfig, count) values (${config[key][0].idAccessory}, ${data.insertId}, ${config[key][0].count})`, function(err, data){
            if(err) return console.log(err)
          })
        }else{
          pool.query(`insert into accessoriesinconfigs (idAccessory, idConfig, count) values (${config[key][0].idAccessory}, ${data.insertId}, 1)`, function(err, data){
            if(err) return console.log(err)
          })
        }
      }
    }
    res.send(data)
  })
})




UserRouter.post("/auth",jsonParser, async function(req, res){
  const login=req.body.login
  const password=req.body.password
  pool.query(`SELECT * FROM users where login='${login}' and password='${password}'`, function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
})
UserRouter.post("/reg",jsonParser, async function(req, res){
  const login=req.body.login
  const password=req.body.password
  const name=req.body.name
  pool.query(`insert into users (login, password, name, typeUser) values ('${login}','${password}','${name}','user')`, function(err, data){
    if(err) return console.log(err)
    pool.query(`SELECT * FROM users where idUser=${data.insertId}`, function(err, data){
      if(err) return console.log(err)
      res.send(data)
    })
  })
})
AccessoriesRouter.post("/",jsonParser, async function(req, res){
  const type=req.body.type
  let search
  if(req.body.search==undefined || req.body.search===''){
  pool.query("select image, accessories.idAccessory as idAccess,accessories.name as AccessName,"+
  "accessories.producer as producer, idSpecAccessory, specs.name as name,"+
  "value,unit, accessories.type from accessories inner join specsaccessories on accessories.idAccessory="+
  "specsaccessories.idAccessory inner join specs on specsaccessories.idSpec"+
  "=specs.idSpec where accessories.type=?", [type], function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
  }else{
    search=req.body.search
    pool.query(`select image, accessories.idAccessory as idAccess,accessories.name as AccessName,
    accessories.producer as producer, idSpecAccessory, specs.name as name,
    value,unit, accessories.type from accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
    inner join specs on specsaccessories.idSpec=specs.idSpec
    where accessories.type=? and (accessories.producer LIKE '%${search}%' or accessories.name LIKE '%${search}%')`, [type], function(err, data){
    if(err) return console.log(err)
    if(data.length===0){
      let prod=search.split(' ')[0]
      let name=search.split(' ')[1]
      pool.query(`select image, accessories.idAccessory as idAccess,accessories.name as AccessName,
    accessories.producer as producer, idSpecAccessory, specs.name as name,
    value,unit, accessories.type from accessories inner join specsaccessories on accessories.idAccessory=specsaccessories.idAccessory
    inner join specs on specsaccessories.idSpec=specs.idSpec
    where accessories.type=? and (accessories.producer LIKE '%${prod}%' and accessories.name LIKE '%${name}%')`, [type], function(err, data){
    if(err) return console.log(err)
      res.send(data)
  })
    }else{
    res.send(data)
    }
  })
  }
})
AccessoriesRouter.post("/add/img",upload.single('img'), async function(req, res){
  const type=req.body.typ   
  res.send('done')
})

AccessoriesRouter.post("/price",jsonParser, async function(req, res){
  const type=req.body.type;
  pool.query("select price as currentPrice,idAccessoryInShop,link, shops.idShop,shops.name as nameShop, accessories.idAccessory as idAccess from accessories inner join accessoriesinshops on"+
    " accessories.idAccessory=accessoriesinshops.idAccessory inner join shops on shops.idShop=accessoriesInShops.idShop where accessories.type=? order by idAccess", [type], function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })

})

AccessoriesRouter.get("/:id", jsonParser, async function(req, res){
  const id=req.params.id;
  pool.query("select accessories.idAccessory as idAccess, idSpecAccessory, specs.name as name,"+
  "value,unit from accessories inner join specsaccessories on accessories.idAccessory="+
  "specsaccessories.idAccessory inner join specs on specsaccessories.idSpec"+
  "=specs.idSpec where accessories.idAccessory=?",[id], function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
})


SpecRouter.post("/",jsonParser, async function(req, res){
  const type=req.body.type
  pool.query("select * from specs where type=?", [type], function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
})


SpecRouter.post("/shop/:id",jsonParser, async function(req, res){
  const id=req.body.id
  pool.query("select * from accessoriesinshops where idAccessory=?", [id], function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
})

SpecRouter.post("/bench/:id",jsonParser, async function(req, res){
  const id=req.body.id
  pool.query("select * from resultsbench where idAccessory=?", [id], function(err, data){
    if(err) return console.log(err)
    res.send(data)
  })
})
SpecRouter.post("/:id",jsonParser, async function(req, res){
  const id=req.body.id
  pool.query("select idSpecAccessory, producer, accessories.idAccessory as idAccess,specs.idSpec as spec, specs.name as mean, accessories.name as nameAccess, value, image from specsaccessories inner join accessories on"+
  " specsaccessories.idAccessory=accessories.idAccessory inner join specs on specsaccessories.idSpec=specs.idSpec where specsaccessories.idAccessory=?", [id], function(err, data){
    if(err) return console.log(err)
    res.send(data)
    
  })
})

AccessoriesRouter.post("/add",jsonParser, async function(req, res){
  const spec=req.body.valueSpec
  const access=req.body.valueAccess
  const link=req.body.link
  const price=req.body.price
  const benchCpu=req.body.benchCpu
  const benchGpu=req.body.benchGpu
  pool.query("insert into accessories (producer, name, type) values (?,?,?)", [access.producer,access.name, access.type], function(err, data){
    if(err) return console.log(err)
    addId=data.insertId
    addType=access.type
    const path=`images/${addType}/${addId}.jpg`
    pool.query(`update accessories set image='${path}' where idAccessory=${addId}`, function(err, data){
      if(err) return console.log(err)
      pool.query("insert into accessoriesinshops (idShop, idAccessory, price, link) values (?, ?, ?, ?)",[1, addId, price.Dns, link.Dns] , async function(err, data){
        if(err) return console.log(err)
      })
      pool.query("insert into accessoriesinshops (idShop, idAccessory, price, link) values (?, ?, ?, ?)",[2, addId, price.NicePrice, link.NicePrice] , async function(err, data){
        if(err) return console.log(err)
      })
      pool.query("insert into accessoriesinshops (idShop, idAccessory, price, link) values (?, ?, ?, ?)",[3, addId, price.Nix, link.Nix] ,async function(err, data){
        if(err) return console.log(err)
      })
      if(addType==='VideoGraph'){
        pool.query("insert into specsaccessories (idSpec, idAccessory, value) values (?, ?, ?)",[25, addId, spec['25']] , function(err, data){
          if(err) return console.log(err)
        })
        pool.query("insert into resultsbench (idAccessory,idBenchmark, value) values (?, ?, ?)",[addId, 4, benchGpu.Heaven] , function(err, data){
          if(err) return console.log(err)
        })
        pool.query("insert into resultsbench (idAccessory,idBenchmark, value) values (?, ?, ?)",[addId, 5, benchGpu['3Dmark']] , function(err, data){
          if(err) return console.log(err)
        })
        pool.query("insert into resultsbench (idAccessory,idBenchmark, value) values (?, ?, ?)",[addId, 6, benchGpu.FutureMark] , function(err, data){
          if(err) return console.log(err)
        })
        for(let key in spec){
          if(key!==25){
            pool.query("insert into specsaccessories (idSpec, idAccessory, value) values (?, ?, ?)",[key, addId, spec[key]] , function(err, data){
              if(err) return console.log(err)
            })
          }
        }
      }else{
        if(addType==='CPU'){
          pool.query("insert into resultsbench (idAccessory,idBenchmark, value) values (?, ?, ?)",[addId, 1, benchCpu.x265] , function(err, data){
            if(err) return console.log(err)
          })
          pool.query("insert into resultsbench (idAccessory,idBenchmark, value) values (?, ?, ?)",[addId, 2, benchCpu['3Dmark']] , function(err, data){
            if(err) return console.log(err)
          })
          pool.query("insert into resultsbench (idAccessory,idBenchmark, value) values (?, ?, ?)",[addId, 3, benchCpu.Cinebench] , function(err, data){
            if(err) return console.log(err)
          })
        }
        for(let key in spec){
          pool.query("insert into specsaccessories (idSpec, idAccessory, value) values (?, ?, ?)",[key, addId, spec[key]] , function(err, data){
            if(err) return console.log(err)
          })
        }
      }
      res.send(data)
    })
  })
})

AccessoriesRouter.post("/edit",jsonParser, async function(req, res){
  const spec=req.body.valueSpec
  const access=req.body.valueAccess
  const shop=req.body.shop
  const bench=req.body.bench
  addId=access.id
  addType=access.type
  pool.query(`update accessories set producer='${access.producer}', name='${access.name}'
    where idAccessory=${access.id}`, async function(err, data){
      for(let key in spec){
        pool.query(`update specsaccessories set value='${spec[key]}'
          where idSpec=${key} and idAccessory=${access.id}`,async function(err, data){
        })
      }
      for(let i=0;i<shop.length;i++){
        pool.query(`update accessoriesinshops set price=${shop[i].price}, link='${shop[i].link}'
          where idAccessory=${addId} and idShop=${shop[i].idShop}`,async function(err, data){
        })
      }
      for(let i=0;i<bench.length;i++){
        pool.query(`update resultsbench set value=${bench[i].value}
          where idAccessory=${addId} and idBenchmark=${bench[i].idBenchmark}`,async function(err, data){
        })
      }
      res.send('done')
  })
})

AccessoriesRouter.post("/delete",jsonParser, async function(req, res){
  const id=req.body.id
  const type=req.body.type
  pool.query(`delete from accessories where idAccessory=${id}`, async function(err, data){
      fs.unlinkSync(__dirname + '/public/images/'+type+"/"+id+'.jpg')
      res.send('done')
  })
})


app.listen(8881, function(){
  console.log('ожидание подключения')
}
)

