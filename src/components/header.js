import React from 'react'
import ReactDOM from 'react-dom'
import './style/header.css'
import IconLogo from './iconLogo'
const Header=()=>{
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
          <div>Конфигуратор</div>
          <div>Мои сборки</div>
          <div>Комплектующие</div>
        </div>
      </div>
    </header>
  )
}

export default Header