import React, {useState}  from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route}  from 'react-router-dom'
import Configuration from './configurator'
import Header from './header'
import Accessories from './acessories'
import MyConfigs from './myconfigs'




const app=()=>{
  const [itemsMenu, setItemsMenu]=useState('headerMenuConfigurator')

  return (
    <div className='wrapperConfig'>
      <Router>
        <Route exact path="/" render={()=><Configuration bgc={itemsMenu} setItemsMenu={setItemsMenu}/>}/>
        <Route path="/accessories/:type" render={({match})=>{const id=match.params.type;
        return <Accessories bgc={itemsMenu} setItemsMenu={setItemsMenu} itemId={id}/>}}/>
        <Route path="/myConfigs" render={()=><MyConfigs bgc={itemsMenu} setItemsMenu={setItemsMenu}/>}/>
      </Router>
    </div>
  )
}
export default app