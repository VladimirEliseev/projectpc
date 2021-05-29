import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from './header'
import {Link} from 'react-router-dom'
import './style/reg.css'
const Reg=(props)=>{
  const {setItemsMenu, bgc, setUser, user}=props
  const [login, setLogin]=useState('')
  const [password, setPassword]=useState('')
  const [name, setName]=useState('')
  const runRegistr=async()=>{
    if(login==='' || password==='' || name===''){
      alert('Введите логин, пароль и имя пользователя')
    }else if(password.length<6){
      alert('Пароль не может содержать меньше 6 символов')
    }else{
      const res=await fetch('/api/users/reg',{
        method: 'POST',
        headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
        body: JSON.stringify({
          login: login,
          password: password,
          name, name
        })
      })
      if(res.ok){
        setUser(await res.json())
      }
    }
  }

  useEffect(() => {
    if(user!==null){
      console.log(user)
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
      <Header bgc={bgc} user={user} setUser={()=>setUser(user)} setItemsMenu={(e)=>{setItemsMenu(e.target.id)}}/>
      <main className='mainAuth'>
        <h2>Регистрация</h2>
        <label htmlFor="inputAuthLogin">Логин</label>
        <input type="text" className='inputLogin' id='inputAuthLogin'
        onChange={(e)=>{setLogin(e.target.value)}}/>
        <label htmlFor="inputAuthPassword">Пароль</label>
        <input type="password" className='inputPassword' id='inputAuthPassword'
        onChange={(e)=>{setPassword(e.target.value)}}/>
         <label htmlFor="inputAuthName">Имя</label>
        <input type="text" className='inputName' id='inputAuthName'
        onChange={(e)=>{setName(e.target.value)}}/>
        <button className='btnReg' onClick={runRegistr}>Зарегистрироваться</button>
        
      </main>
    </div>
  )
}

export default Reg