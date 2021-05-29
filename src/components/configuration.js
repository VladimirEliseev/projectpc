import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import Header from './header'
import './style/configuration.css'


const Configuration=()=>{
  const [config, setConfig]=useState({})
  const getConfig=async()=>{
    const res=await fetch('/api/config/get',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
    
  })
    if(res.ok){
      setConfig(await res.json())
    }
  
  }
  const saveConfig=async()=>{
    let user=JSON.parse(localStorage.getItem('user'))
    if(user!==null && user!==undefined){
    let name = prompt('Введите название сборки?', `Сборка до ${config.params.price.maxPrice}₽`)
    const res=await fetch('/api/config/save',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        config: config,
        user: user,
        name: name
      })
    })
    if(res.ok){
      document.location.href='/myConfigs'
    }
  }else{
    document.location.href='/authentication'
  }
  }
  useEffect(()=>{
    getConfig()
  },[])


  return(
    <div className='componentConfiguration'>   
      <Header/>
      <div className='config'>
      {Object.keys(config).map(item => {
        if(item!=='totalPrice' && item!=='params' && item!=='rom' && item!=='ram' && item!=='done')
          return(
          <div key={config[item][0].idAccessory} className='configAccess'>
            <div className='blockImageAccessory'>
              <img className='imgAcessoryConfig' src={`http://localhost:8881/${config[item][0].image}`}/>
            </div>
            <div className='blockAccessInfo'>
              <div className='accessInfoName'>{config[item][0].producer} {config[item][0].name} </div>
              <div className='accessInfoPrice'>{config[item][0].shop}
              <a className="linkShop" href={config[item][0].link}>{config[item][0].price}₽</a>
              </div>
            </div>
          </div>
          )
          else if(item==='ram'){
            return(
              <div key={config[item][0].idAccessory} className='configAccess'>
                <div className='blockImageAccessory'>
                  <img className='imgAcessoryConfig' src={`http://localhost:8881/${config[item][0].image}`}/>
                </div>
                <div className='blockAccessInfo'>
                  <div className='accessInfoName'>{config[item][0].producer} {config[item][0].name} <span>{config[item][0].count===1?'': config[item][0].count}</span></div>
                  <div className='accessInfoPrice'>{config[item][0].shop}
                    <a className="linkShop" href={config[item][0].link}>{config[item][0].price}₽</a>
                  </div>
                </div>
              </div>
              )
          }
          else if(item==='rom'){
            return(
            config.rom.map(item=>{
              return(
              <div key={item.idAccessory} className='configAccess'>
                <div className='blockImageAccessory'>
                  <img className='imgAcessoryConfig' src={`http://localhost:8881/${item.image}`}/>
                </div>
                <div className='blockAccessInfo'>
                  <div className='accessInfoName'>{item.producer} {item.name}</div>
                  <div className='accessInfoPrice'>{item.shop}
                    <a className="linkShop" href={item.link}>{item.price}₽</a>
                  </div>
                </div>
              </div>
              )
            }))
          }
          else if(item==='done'){
            if(config.done===false){
              return(
                <div key='done' className='paramsConfig'>
                  <h2>Конфигурация не может быть подобрана в данной бюджете</h2>
                  <div>Минимальный стоимость подбора по данным критериям {config.totalPrice}₽</div>
                </div>
              )
            }
          }
        else if(item==='params'){
          return(
          <div key='params' className='paramsConfig'>
            <h2>Сборка до {config.params.price.maxPrice}</h2>
            <div>Предназначение: {config.params.purpose}</div>
            <div>Объем памяти: HDD{config.params.volumeMemory.volumeHdd}GB SSD: {config.params.volumeMemory.volumeSsd}GB </div>
          </div>
          )
          }
        }
          )}
        <div className='totalPrice'><span>Итоговая цена:</span> {config.totalPrice}₽</div>
        <div className='wrapperbtnSaveConfig'>
          <button className='btnSaveConfig' onClick={saveConfig}>Сохранить</button>
        </div>
      </div>
    </div>
   
  )
}
export default Configuration