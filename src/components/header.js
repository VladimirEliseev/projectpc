import React from 'react'
import ReactDOM from 'react-dom'
import './style/header.css'
import {Link} from 'react-router-dom'
import IconLogo from './iconLogo'
const Header=(props)=>{
  const {setItemsMenu, bgc}=props

  return(
    <header className='header'>
      <div className='blockTitleHeader'>
        <div className='titleHeader'>
        <IconLogo/>
        <div>Конфигуратор<br/><span>ПК</span></div></div>
      </div>
      <div className='blockMenuHeader'>
        <div className='menuHeaderAuthReg'>
          <button className='btnAuth'>Вход</button>
          <button className='btnReg'>Регистрация</button>
        </div>
        <div className='menuHeaderMain'>
        <Link to='/'>
          <div id='headerMenuConfigurator' onClick={setItemsMenu} 
          style={{backgroundColor: bgc==='headerMenuConfigurator' ?'#fa9179':'#e9e3e3',
          color: bgc==='headerMenuConfigurator' ?'white':'black'}}>Конфигуратор
          </div>
        </Link>
        <Link to='/myConfigs'>
          <div id='headerMenuMyConfigs' onClick={setItemsMenu} 
          style={{backgroundColor: bgc==='headerMenuMyConfigs'?'#fa9179':'#e9e3e3',
          color: bgc==='headerMenuMyConfigs' ?'white':'black'}}>Мои сборки
          </div>
        </Link>
        <Link to='/accessories/CPU'>
          <div id='headerMenuAcces' onClick={setItemsMenu} 
          style={{backgroundColor: bgc==='headerMenuAcces'?'#fa9179':'#e9e3e3',
          color: bgc==='headerMenuAcces' ?'white':'black'}}>Комплектующие
          </div>
        </Link>
        </div>
      </div>
    </header>
  )
}

export default Header