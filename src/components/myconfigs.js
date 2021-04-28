import React from 'react'
import ReactDOM from 'react-dom'
import Header from './header'

const MyConfigs=(props)=>{
  const {setItemsMenu, bgc}=props
  return(
    <div>
      <Header bgc={'headerMenuMyConfigs'} setItemsMenu={(e)=>{setItemsMenu(e.target.id)}}/>
      <main>
        Мои сборки
      </main>
      </div>
  )
}

export default MyConfigs