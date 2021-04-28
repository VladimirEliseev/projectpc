import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import Header from './header'
import './style/accessories.css'
import Edit from './resources/iconEdit.svg'
import Delete from './resources/iconDelete.svg'
import AddAccessory from './addAccessory'

const Accessories=(props)=>{
  const [access, setAccessories]=useState([])
  const {setItemsMenu, bgc, itemId}=props
  const [isAdd, setAdd]=useState(false)
  const [isEdit, setEdit]=useState(false)
  const [chooseAccess, setChooseAccess]=useState()
  const [specAccessory, setSpecAccessory]=useState({type:itemId})
  const {type}=specAccessory
  const [price, setPrice]=useState([])
  const getAccessories=async()=>{
    const res=await fetch('/api/accessories',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        type: type
      })
    })
    
    if(res.ok){
      setAccessories(await res.json())
    }
    const resp=await fetch('/api/accessories/price',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        type: type
      })
    })
    
    if(resp.ok){
      setPrice(await resp.json())
    }
    
  }
  const getSpec=(producer, AccessName, array, i)=>{
    if(type==='VideoGraph'){
      return(
        <div className='nameAccessory'>
          <h2 className='titleNameAccessory'>{array[i].value} {producer} {AccessName} </h2>
          <div>{array[i+1].name}: {array[i+1].value} {array[i+1].unit}</div>
          <div>{array[i+2].name}: {array[i+2].value} {array[i+2].unit}</div>
          <div>{array[i+3].name}: {array[i+3].value} {array[i+3].unit}</div>
          <div>{array[i+4].name}: {array[i+4].value} {array[i+4].unit}</div>
          <div>{array[i+5].name}: {array[i+5].value} {array[i+5].unit}</div>
          <div>{array[i+6].name}: {array[i+6].value} {array[i+6].unit}</div>
        </div>
      )
    }else{
      return(
        <div className='nameAccessory'>
          <h2 className='titleNameAccessory'>{producer} {AccessName}</h2>
          <div>{array[i].name}: {array[i].value} {array[i].unit}</div>
          <div>{array[i+1].name}: {array[i+1].value} {array[i+1].unit}</div>
          <div>{array[i+2].name}: {array[i+2].value} {array[i+2].unit}</div>
          <div>{array[i+3].name}: {array[i+3].value} {array[i+3].unit}</div>
          <div>{array[i+4].name}: {array[i+4].value} {array[i+4].unit}</div>
          <div>{array[i+5].name}: {array[i+5].value} {array[i+5].unit}</div>
        </div>
      )
    }
    
  }

const getCurrent=async(idAccess)=>{
  
}
  const getPrice=(idAccess)=>{
    getCurrent(idAccess)
    price.map((item)=>{
      const {idAccessoryInShop, price,nameShop}=item
      console.log(item)
      return(
        <div key={idAccessoryInShop}>{nameShop} {price}</div>
      )

    })
  }
  const deleteAccess=async(e)=>{
    let conf=confirm('Вы действительно хотите удалить данную запись?')
    if(conf){
    const res=await fetch('/api/accessories/delete',{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        id: e.target.id,
        type: type
      })
    })
    if(res.ok){
      getAccessories()
    }
  }
  }
  useEffect(()=>{
    getAccessories()
  }, [specAccessory])
  
  useEffect(()=>{
    getAccessories()
  }, [isAdd])

  let idCurrentAccess, newAccess=false;
  let currentCountPrice=0, idAccessPrice;

  return(
    <div className='wrapperAccessories'>
      <Header bgc={'headerMenuAcces'} setItemsMenu={(e)=>{setItemsMenu(e.target.id)}}/>
      <button className='btnAddAccessory' onClick={()=>setAdd(!isAdd)}>Добавить</button>  
      <main className='mainAccessory'>
      <ul className='catalogAccessory'>
          <li style={{borderBottom:type==='CPU'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'CPU'}); setAdd(false); setEdit(false)}}>
            <Link to='/accessories/CPU/'>Процессоры</Link></li>
          <li style={{borderBottom:type==='VideoGraph'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'VideoGraph'}); setAdd(false); setEdit(false)}}>
            <Link to='/accessories/VideoGraph/'>Видеокарты</Link></li>
          <li style={{borderBottom:type==='MotherBoard'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'MotherBoard'}); setAdd(false); setEdit(false)}}>
            <Link to='/accessories/MotherBoard/'>Материнские платы</Link></li>
          <li style={{borderBottom:type==='RAM'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'RAM'}); setAdd(false); setEdit(false)}}>
            <Link to='/accessories/RAM/'>Оперативная память</Link></li>
          <li style={{borderBottom:type==='HDD'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'HDD'}); setAdd(false); setEdit(false)}}> 
            <Link to='/accessories/HDD/'>Жесткие диски</Link></li>
          <li style={{borderBottom:type==='SSD'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'SSD'}); setAdd(false); setEdit(false)}}>
            <Link to='/accessories/SSD/'>SSD</Link></li>
          <li style={{borderBottom:type==='PowerSupply'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'PowerSupply'}); setAdd(false); setEdit(false)}}> 
            <Link to='/accessories/PowerSupply/'>Блоки питания</Link></li>
          <li style={{borderBottom:type==='Case'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'Case'}); setAdd(false); setEdit(false)}}>
            <Link to='/accessories/Case/'>Корпуса</Link></li>
          <li style={{borderBottom:type==='Cooling'?'8px solid #fa9179':'3px solid #fa9179'}} 
          onClick={()=>{setSpecAccessory({type: 'Cooling'}); setAdd(false); setEdit(false)}}> 
            <Link to='/accessories/Cooling/'>Системы охлаждения</Link></li>
        </ul>
        
        {!isAdd && <div className='blockAccessories'>
            {access.map((item,i, array)=>{
              const {idAccess, producer, AccessName, image}=item
              if(idCurrentAccess!==idAccess){
                newAccess=true
                idCurrentAccess=idAccess           
              }else{
                newAccess=false;
              }
              return(newAccess &&
                <div className='blockAccessory' key={idAccess} >
                  <div className='blockImageAccessory'><img src={`http://localhost:8881/${image}`} width='100px' alt=""/></div>
                  <div className='blockInfoAccessory'>
                    {getSpec(producer, AccessName, array, i)}
                  </div>
                  <div className='blockPriceAndEdit'>
                    <div className='blockChange'>
                      <Link to='Edit'>
                        <img className='logoEdit' src={Edit} width='30px' onClick={(e)=>{setAdd(!isAdd)
                        setEdit(!isEdit)
                        setChooseAccess(idAccess)
                        }}/>
                      </Link>
                      <img className='logoDelete' id={idAccess} src={Delete} width='30px' onClick={deleteAccess} alt=""/>
                    </div>
                    <div className='blockPriceAccessory'>
                    {price.map((item, i, array)=>{
                      const {idAccessoryInShop,nameShop, currentPrice, idAccess, link}=item
                      if(idCurrentAccess===idAccess){
                        return(
                          <div key={idAccessoryInShop} className="tittlePrice">{nameShop}:
                            <a href={link}> {currentPrice!==null ? `${currentPrice} ₽`:'Нет в наличии'}</a>
                          </div>
                        )
                      }
                    })}
                      </div>
                      
                  </div>
                  
                </div>
                )
          })}
        </div>}
        {isAdd && <AddAccessory type={type} isEdit={isEdit} chooseAccess={chooseAccess} setAdd={setAdd} setEdit={setEdit}/>}
      </main>
      
    </div>
  )



}

export default Accessories

