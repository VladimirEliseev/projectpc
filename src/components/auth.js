import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from './header'
import {Link} from 'react-router-dom'
import './style/auth.css'
const Auth=(props)=>{
  const {setItemsMenu, bgc, setUser, user}=props
  const [login, setLogin]=useState('')
  const [password, setPassword]=useState('')
  const checkDataAuth=async()=>{
    if(login==='' || password===''){
      alert('Введите логин и пароль')
    }else{
      const res=await fetch('/api/users/auth',{
        method: 'POST',
        headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
        body: JSON.stringify({
          login: login,
          password: password
        })
      })
      if(res.ok){
        setUser(await res.json())
      }
    }
  }

  useEffect(() => {
    if(user!==null){
      if(user.length!==0){
      localStorage.setItem('user', JSON.stringify(user[0]))
      document.location.href='../'
      }else{
        alert('Неверный логин или пароль')
      }
    }

  }, [user])

  return(
    <div>
      <Header bgc={bgc}  user={user} setUser={()=>setUser(user)} setItemsMenu={(e)=>{setItemsMenu(e.target.id)}}/>
      <main className='mainAuth'>
        <h2>Авторизация</h2>
        <label htmlFor="inputAuthLogin">Логин</label>
        <input type="text" className='inputLogin' id='inputAuthLogin'
        onChange={(e)=>{setLogin(e.target.value)}}/>
        <label htmlFor="inputAuthPassword">Пароль</label>
        <input type="password" className='inputPassword' id='inputAuthPassword'
        onChange={(e)=>{setPassword(e.target.value)}}/>
        <button className='btnAuth' onClick={checkDataAuth}>Войти</button>
        
      </main>
    </div>
  )
}

export default Auth