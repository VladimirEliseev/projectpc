import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Header from './header'
import './style/myconfigs.css'
import Delete from './resources/iconDelete.svg'

const MyConfigs=(props)=>{
  const {setItemsMenu, bgc, user, setUser}=props
  const [config, setConfig]=useState([])
  const [access, setAccess]=useState([])
  let currentUser=JSON.parse(localStorage.getItem('user'))

  const getConfig=async()=>{
    const res=await fetch('/api/config/myconfig',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        user: currentUser
      })
    })
    if(res.ok){
      setConfig(await res.json())
    }
    const resp=await fetch('/api/config/myconfig/access',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        user: currentUser
      })
    })
    if(resp.ok){
      setAccess(await resp.json())
    }
  }
const deleteConfig=async(e)=>{
  let conf=confirm('Вы действительно хотите удалить данную сборку?')
    if(conf){
    const res=await fetch('/api/config/delete',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        id: e.target.id,
      })
    })
    if(res.ok){
      getConfig()
    }
  }
}
  useEffect(()=>{
    getConfig()
  },[])
  return(
    <div className='wrapperMyConfigs'>
      <Header user={user} setUser={()=>setUser(user)} bgc={'headerMenuMyConfigs'} setItemsMenu={(e)=>{setItemsMenu(e.target.id)}}/>
      <main className='mainMyConfigs'>
       {config.map((item)=>{
         const {idConfig}=item
         let totalprice=0
         return(
          <div className='usersConfig' key={item.idConfig}>
              <div className='usersConfigName'>
                <div>{item.name} ({item.date.slice(0,10)})</div>
                <img className='logoDelete' src={Delete} id={item.idConfig} width='30px' onClick={deleteConfig} alt=""/>
              </div>
              <div className='usersConfigPurpose'>Предназначение: {item.purpose} </div>
              <div className='usersConfigPrice'>Бюджет: {item.price}</div>
              <div className='usersConfigMain'>
              {access.map((item)=>{
                if(item.type==='Case' && item.idConfig===idConfig)
                  return(
                    <img key={`${item.idAccessConf}img`} className='logoCase' src={`http://localhost:8881/${item.image}`} width='80px'/>
                  )
                }
              )}
              <div className='wrapperUsersConfigAccess'>
              {access.map((item)=>{
                if(item.idConfig===idConfig){
                  totalprice+=item.price
                  console.log()
                  if(item.type==='RAM' && item.count===2){
                    totalprice+=item.price
                    return(
                      <div className='usersConfigAccess' key={item.idAccessConf}>
                        <div>{item.producer} {item.name} X2</div> 
                        <a href={item.link}>{item.price} ₽</a>
                      </div>
                    )
                  }else{
                  return(
                    <div className='usersConfigAccess' key={item.idAccessConf}>
                      <div>{item.producer} {item.name}</div> 
                      <a href={item.link}>{item.price} ₽</a>
                    </div>
                  )
                  }
                }
                }
              )}
              <div className='myconfigsTotalPrice'>Итоговая стоимость: {totalprice} ₽</div>
              </div>
              </div>
          </div>
         )       
        })
      }
      </main>
      </div>
  )
}

export default MyConfigs