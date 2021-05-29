import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import Header from './header'
import './style/configurator.css'
import IconGame from './iconGame'
import IconWork from './iconWork'
import IconMedia from './iconMedia'
import iconIntel from './resources/iconIntel.svg'
import iconAmd from './resources/iconAmd.svg'
import iconNvidia from './resources/iconNvidia.svg'
import iconNotInt from './resources/iconNotIntrecting.svg'
import iconSsd from './resources/iconSsd.svg'
import iconHdd from './resources/iconHdd.svg'

const Configurator=(props)=>{
  const [purpose, setPurpose]=useState('Игры')
  const [producerCpu, setProducerCpu]=useState('Нет')
  const [producerGpu, setProducerGpu]=useState('Нет')
  const [price, setPrice]=useState({minPrice:0,maxPrice:1000000})
  const [volumeMemory, setVolumeMemory]=useState({volumeHdd:'1000',volumeSsd:'256'})
  const {setItemsMenu, bgc, user, setUser}=props

  const runConfiguration=async()=>{
    const res=await fetch("/api/config",{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        purpose: purpose,
        producerCpu: producerCpu,
        producerGpu: producerGpu,
        price: price,
        volumeMemory: volumeMemory
      })
    })
    if(res.ok){
    }
  }
  return(
    <div>
      <Header bgc={bgc} user={user} setUser={()=>setUser(user)} setItemsMenu={(e)=>{setItemsMenu(e.target.id)}}/>
      <main>
        <h1>Конфигуратор подбора</h1>
        <div className='formSelect'>
          <h2>Назначение</h2>
          <div className='blockPurpose'>
            <div className='blockGame'>
              <IconGame fill={purpose==='Игры'?'#fa9179':'black'} setColor={()=>setPurpose('Игры')}/>   
              <div style={{color:purpose==='Игры'?'#fa9179':'black'}}>Игры</div>
            </div>
            <div className='blockWork'>
              <IconWork fill={purpose==='Работа'?'#fa9179':'black'} setColor={()=>setPurpose('Работа')}/>
              <div style={{color:purpose==='Работа'?'#fa9179':'black'}}>Работа</div>
            </div>
            <div className='blockMedia'>
              <IconMedia fill={purpose==='Мультимедиа'?'#fa9179':'black'} setColor={()=>setPurpose('Мультимедиа')}/>
              <div style={{color:purpose==='Мультимедиа'?'#fa9179':'black'}}>Мультимедиа</div>
            </div>
          </div>
          <h2>Цена (руб.)</h2>
          <div className='blockPrice'>
            <label htmlFor="minPriceInput">От</label>
            <input placeholder='0' id='minPriceInput' type="text" onChange={(e)=>{setPrice({...price, minPrice:Number(e.target.value)})}}/>
            <label htmlFor="maxPriceInput">До</label>
            <input placeholder='1 000 000' id='maxPriceInput' type="text" onChange={(e)=>{setPrice({...price, maxPrice:Number(e.target.value)})}}/>
          </div>
          <h2>Производитель процессора</h2>
          <div className='blockProducerCpu'>
            <div id='blockAmd' className='blockAmd' style={{backgroundColor:producerCpu==='Amd'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducerCpu('Amd')}>
              <img src={iconAmd} alt="иконка амд"/>
            </div>
            <div id='blockIntel' className='blockIntel' style={{backgroundColor:producerCpu==='Intel'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducerCpu('Intel')}>
              <img src={iconIntel} alt="иконка интел"/>
            </div> 
            <div id='blockNotInt' className='blockNotInt' style={{backgroundColor:producerCpu==='Нет'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducerCpu('Нет')}>
              <img src={iconNotInt} alt="не имеет значения"/>
            </div>  
          </div>
          <h2>Производитель видеокарты</h2>
          <div className='blockProducerGpu'>
            <div id='blockAmd' className='blockAmd' style={{backgroundColor:producerGpu==='Amd'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducerGpu('Amd')}>
              <img src={iconAmd} alt="иконка амд"/>
            </div>
            <div id='blockNvidia' className='blockNvidia' style={{backgroundColor:producerGpu==='Nvidia'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducerGpu('Nvidia')}>
              <img src={iconNvidia} alt="иконка нвидиа"/>
            </div>  
            <div id='blockNotInt' className='blockNotInt' style={{backgroundColor:producerGpu==='Нет'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducerGpu('Нет')}>
              <img src={iconNotInt} alt="не имеет значения"/>
            </div>  
          </div>
          <h2>Объем памяти</h2>
          <div className='blockMemory'>
            <div className='blockHdd'>
              <img src={iconHdd} alt="иконка жесткого диска"/>
              <select className='selectHdd' defaultValue='1000гб' 
              onChange={(e)=>{setVolumeMemory({...volumeMemory, volumeHdd: e.target.value.slice(0,-2)})}}>
                <option>500гб</option>
                <option defaultValue>1000гб</option>
                <option>2000гб</option>
                <option>4000гб</option>
                <option>8000гб</option>
              </select>
            </div>
            <div className='blockSsd'>
              <img src={iconSsd} alt="иконка ссд"/>
              <select className='selectSsd' defaultValue='256гб'
              onChange={(e)=>{setVolumeMemory({...volumeMemory, volumeSsd: e.target.value.slice(0,-2)})}}>
                <option>128гб</option>
                <option defaultValue>256гб</option>
                <option>512гб</option>
                <option>1000гб</option>
                <option>2000гб</option>
              </select>
            </div>
          </div>
          <Link to='/config'>
            <button className='btnSelect' onClick={runConfiguration}>Подобрать</button>
          </Link>
        </div>
      </main>
    </div>
  )
}
export default Configurator