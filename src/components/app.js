import React, {useState}  from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route}  from 'react-router-dom'
import Configurator from './configurator'
import Header from './header'
import Accessories from './acessories'
import MyConfigs from './myconfigs'
import Configuration from './configuration'
import Auth from './auth'
import Reg from './reg'



const app=()=>{
  const [itemsMenu, setItemsMenu]=useState('headerMenuConfigurator')
  const [user, setUser]=useState(null)
  return (
    <div className='wrapperConfig'>
      <Router>
        <Route exact path="/" render={()=><Configurator user={user} setUser={setUser} bgc={itemsMenu} setItemsMenu={setItemsMenu}/>}/>
        <Route path="/accessories/:type" render={({match})=>{const id=match.params.type;
        return <Accessories bgc={itemsMenu} user={user} setUser={setUser} setItemsMenu={setItemsMenu} itemId={id}/>}}/>
        <Route path="/myConfigs" render={()=><MyConfigs bgc={itemsMenu} user={user} setUser={setUser} setItemsMenu={setItemsMenu}/>}/>
        <Route path="/config" render={()=><Configuration user={user} setUser={setUser}/>}/>
        <Route path="/authentication" render={()=><Auth user={user} setUser={setUser} bgc={itemsMenu} setItemsMenu={setItemsMenu}/>}/>
        <Route path="/registr" render={()=><Reg user={user} setUser={setUser} bgc={itemsMenu} setItemsMenu={setItemsMenu}/>}/>
      </Router>
    </div>
  )
}
export default app