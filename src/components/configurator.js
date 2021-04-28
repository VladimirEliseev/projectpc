import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
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

const Configuration=(props)=>{
  const [purpose, setPurpose]=useState('Игры')
  const [producer, setProducer]=useState('Нет')
  const [price, setPrice]=useState({minPrice:0,maxPrice:1000000})
  const [volumeMemory, setVolumeMemory]=useState({volumeHdd:'1тб',volumeSsd:'256гб'})
  const {setItemsMenu, bgc}=props;
  return(
    <div>
      <Header bgc={bgc} setItemsMenu={(e)=>{setItemsMenu(e.target.id)}}/>
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
          <h2>Производитель</h2>
          <div className='blockProducer'>
            <div id='blockAmd' className='blockAmd' style={{backgroundColor:producer==='Amd'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducer('Amd')}>
              <img src={iconAmd} alt="иконка амд"/>
            </div>
            <div id='blockIntel' className='blockIntel' style={{backgroundColor:producer==='Intel'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducer('Intel')}>
              <img src={iconIntel} alt="иконка интел"/>
            </div>
            <div id='blockNvidia' className='blockNvidia' style={{backgroundColor:producer==='Nvidia'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducer('Nvidia')}>
              <img src={iconNvidia} alt="иконка нвидиа"/>
            </div>  
            <div id='blockNotInt' className='blockNotInt' style={{backgroundColor:producer==='Нет'?'#f7bfb2':'#e9e3e3'}}
            onClick={()=>setProducer('Нет')}>
              <img src={iconNotInt} alt="не имеет значения"/>
            </div>  
          </div>
          <h2>Объем памяти</h2>
          <div className='blockMemory'>
            <div className='blockHdd'>
              <img src={iconHdd} alt="иконка жесткого диска"/>
              <select className='selectHdd' defaultValue='1тб' 
              onChange={(e)=>{setVolumeMemory({...volumeMemory, volumeHdd: e.target.value})}}>
                <option>250гб</option>
                <option>500гб</option>
                <option>1тб</option>
                <option>2тб</option>
                <option>4тб</option>
                <option>8тб</option>
              </select>
            </div>
            <div className='blockSsd'>
              <img src={iconSsd} alt="иконка ссд"/>
              <select className='selectSsd' defaultValue='256гб'
              onChange={(e)=>{setVolumeMemory({...volumeMemory, volumeSsd: e.target.value})}}>
                <option>64гб</option>
                <option>128гб</option>
                <option defaultValue>256гб</option>
                <option>512гб</option>
                <option>1тб</option>
                <option>2тб</option>
              </select>
            </div>
          </div>
          <button className='btnSelect'>Подобрать</button>
        </div>
      </main>
    </div>
  )
}
export default Configuration