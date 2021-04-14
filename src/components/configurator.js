import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Header from './header'
import './style/configuration.css'
import IconGame from './iconGame'
import IconWork from './iconWork'
import IconMedia from './iconMedia'
import iconIntel from './resources/iconIntel.svg'
import iconAmd from './resources/iconAmd.svg'
import iconNvidia from './resources/iconNvidia.svg'
import iconNotInt from './resources/iconNotIntrecting.svg'
import iconSsd from './resources/iconSsd.svg'
import iconHdd from './resources/iconHdd.svg'

const Configuration=()=>{
  const [purpose, setPurpose]=useState({choice:'Игры',colorsPurpose:['#fa9179', 'black', 'black']})
  const {colorsPurpose}=purpose
  const [producer, setProducer]=useState({choice:'Нет',colorsProducer:['#e9e3e3', '#e9e3e3', '#e9e3e3','#f7bfb2']})
  const {colorsProducer}=producer
  const [price, setPrice]=useState({minPrice:0,maxPrice:1000000})
  const {minPrice, maxPrice}=price;
  const [volumeMemory, setVolumeMemory]=useState({volumeHdd:'1тб',volumeSsd:'256гб'})
  const {volumeHdd, volumeSsd}=volumeMemory;
  // changeMinPrice=(event)=>{
  //   ()=>{this.setPrice({minPrice:event.value, ...price})}
    
  // }
  return(
    <div className='wrapperConfig'>
      <Header/>
      <main>
        <h1>Конфигуратор подбора</h1>
        <div className='formSelect'>
          <h2>Назначение</h2>
          <div className='blockPurpose'>
            <div className='blockGame'>
              <IconGame fill={colorsPurpose[0]} setColor={()=>setPurpose({choice:'Игры',colorsPurpose:['#fa9179', 'black', 'black']})}/>   
              <div style={{color:colorsPurpose[0]}}>Игры</div>
            </div>
            <div className='blockWork'>
              <IconWork fill={colorsPurpose[1]} setColor={()=>setPurpose({choice:'Игры',colorsPurpose:['black', '#fa9179', 'black']})}/>
              <div style={{color:colorsPurpose[1]}}>Работа</div>
            </div>
            <div className='blockMedia'>
              <IconMedia fill={colorsPurpose[2]} setColor={()=>setPurpose({choice:'Игры',colorsPurpose:['black', 'black', '#fa9179']})}/>
              <div style={{color:colorsPurpose[2]}}>Мультимедиа</div>
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
            <div id='blockAmd' className='blockAmd' style={{backgroundColor:colorsProducer[0]}}
            onClick={()=>setProducer({choice:'Амд',colorsProducer:['#f7bfb2', '#e9e3e3', '#e9e3e3','#e9e3e3']})}>
              <img src={iconAmd} alt="иконка амд"/>
            </div>
            <div id='blockIntel' className='blockIntel' style={{backgroundColor:colorsProducer[1]}}
            onClick={()=>setProducer({choice:' Интел',colorsProducer:['#e9e3e3', '#f7bfb2', '#e9e3e3','#e9e3e3']})}>
              <img src={iconIntel} alt="иконка интел"/>
            </div>
            <div id='blockNvidia' className='blockNvidia' style={{backgroundColor:colorsProducer[2]}}
            onClick={()=>setProducer({choice:'Нвидиа',colorsProducer:['#e9e3e3', '#e9e3e3', '#f7bfb2','#e9e3e3']})}>
              <img src={iconNvidia} alt="иконка нвидиа"/>
            </div>  
            <div id='blockNotInt' className='blockNotInt' style={{backgroundColor:colorsProducer[3]}}
            onClick={()=>setProducer({choice:'Нет',colorsProducer:['#e9e3e3', '#e9e3e3', '#e9e3e3','#f7bfb2']})}>
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