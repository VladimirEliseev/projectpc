import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import './style/header.css'
import {Link} from 'react-router-dom'
import IconLogo from './iconLogo'
const Header=(props)=>{
  const {setItemsMenu, bgc, user, setUser}=props
  // localStorage.clear()
  const [userSave, setUserSave]=useState(JSON.parse(localStorage.getItem('user')))
  
  useEffect(() => {
    if(user!==null && user!==undefined){
      setUserSave(user[0])
    }
  }, [user])


  const exitInAccount=()=>{
    localStorage.setItem('user', null)
    setUserSave(null)
  }
  return(
    <header className='header'>
      <div className='blockTitleHeader'>
        <Link to='/'>
          <div className='titleHeader'>
            <IconLogo/>
            <div>Конфигуратор<br/><span>ПК</span></div>
          </div>
        </Link>
      </div>
      <div className='blockMenuHeader'>
        <div className='menuHeaderAuthReg'>
          {(userSave===null || userSave===undefined)?<Link to='/authentication'><button className='btnAuth'>Вход</button></Link>:
          <div className='currentUser'><div > Здравствуйте, <strong>{userSave.name}</strong></div>
          <Link to='/'><button className='btnExit' onClick={exitInAccount}>Выход</button></Link></div>
          }
            
          {(userSave===null || userSave===undefined)?<Link to='/registr'><button className='btnReg'>Регистрация</button></Link>:''}
         
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