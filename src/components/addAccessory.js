import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import './style/addAccessory.css'

const AddAccessory=(props)=>{
  const {type, setAdd, chooseAccess, setEdit, isEdit}=props
  const [specs, setSpecs]=useState([])
  const [specsEdit, setSpecsEdit]=useState({})
  const listValueSpec={}
  const listValueLink={}
  const listValuePrice={}
  const [valueSpec, setValueSpec]=useState(listValueSpec)
  const [valuePrice, setValuePrice]=useState({Dns :null, NicePrice: null, Nix:null})
  const [editShop, setEditShop]=useState([])
  const [valueLink, setValueLink]=useState({Dns :null,NicePrice: null, Nix:null})
  const [valueAccess, setValueAccess]=useState({type: type, producer: '', name: ''})
  const [producer, setProducer]=useState()
  const [model, setModel]=useState()
  const formData=new FormData()
  let count=0
  let currentName, currentProducer, currentId
  const getSpec=async(type)=>{
    if(!isEdit){
      const res=await fetch("../api/spec",{
        method: 'POST',
        headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
        body: JSON.stringify({
          type: type
        })
      })
      if(res.ok){
        setSpecs(await res.json())
      }
    }else{
      const res=await fetch("../api/spec/"+chooseAccess,{
        method: 'POST',
        headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
        body: JSON.stringify({
          id: chooseAccess
        })
      })
      if(res.ok){
        setSpecs(await res.json())
      }
      const resp=await fetch("../api/spec/shop/"+chooseAccess,{
        method: 'POST',
        headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
        body: JSON.stringify({
          id: chooseAccess
        })
      })
      if(resp.ok){
        setEditShop(await resp.json())
      }
    }
  }

  const addImg=async()=>{
    try{
      formData.append('img',document.querySelector('#inputImg').files[0])
      const res=await fetch("/api/accessories/add/img",{
        method: 'POST',
        body: formData
      })
      if(res.ok){
        setAdd(false)
        setEdit(false)
      }
    }catch(e){
      setAdd(false)
      setEdit(false)
    }
  }

  const addNewAccessory=async(type)=>{
    if(!isEdit){
    const res=await fetch("/api/accessories/add",{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        valueSpec: valueSpec,
        valueAccess: valueAccess,
        link: valueLink,
        price: valuePrice
      })
    })
    if(res.ok){    
      addImg()
    }
    }else{
      await editAccessory()
      getSpec()
    }
  }

  const editAccessory=async(type)=>{
    const res=await fetch("/api/accessories/edit",{
      method: 'POST',
      headers: {"Accept": 'application/json',  "Content-Type": "application/json"},
      body: JSON.stringify({
        valueSpec: valueSpec,
        valueAccess: valueAccess,
        shop: editShop
      })
    })
    if(res.ok){
      addImg()
    }


    
  }
  useEffect(()=>{
    getSpec(type)
  },[])
  useEffect(()=>{
    setValueSpec(listValueSpec)
    setValueAccess({...valueAccess, producer: currentProducer, name: currentName, id:currentId })
  },[specs])
  return(
    <div className='addAccessoryForm'>
      <div>
        <label>Изображение</label>
        <input id='inputImg' type="file"/>
      </div>
      {!isEdit && 
      <div className='wrapperAddAndChangeForm'>
        <div>
          <label>Производитель</label>
          <input type="text" onChange={(e)=>{setValueAccess({...valueAccess, producer: e.target.value })}}/>
        </div>
        <div>
          <label>Название</label>
          <input type="text" onChange={(e)=>{setValueAccess({...valueAccess, name: e.target.value })}}/>
        </div>
        {specs.map((item)=>{
          const {idSpec, name, unit}=item
          listValueSpec[idSpec]=""
          return(
            <div key={idSpec}>
              <label htmlFor={idSpec}>{name}{unit!==null ? ",":" "} {unit}</label>
              <input id={idSpec} type="text" onChange={(e)=>{setValueSpec({...valueSpec, [idSpec]: e.target.value })}}/>
            </div>
          )
        })}
        <div className='blockShopLinkAndPrice' key='shopsPrice'>
          <div>
            <label htmlFor='inputDnsLink'>Ссылка на Dns</label>
            <input id='inputDnsLink' type="text" onChange={(e)=>{setValueLink({...valueLink, Dns: e.target.value })}}/>
          </div>
          <div>
            <label htmlFor='inputDnsPrice'>Текущая цена</label>
            <input id='inputDnsPrice' type="text" onChange={(e)=>{setValuePrice({...valuePrice, Dns: e.target.value })}}/>
          </div>    
          <div>
            <label htmlFor='inputNicePriceLink'>Ссылка на niceprice</label>
            <input id='inpuNicePriceLink' type="text" onChange={(e)=>{setValueLink({...valueLink, NicePrice: e.target.value })}}/>
          </div>    
          <div>
            <label htmlFor='inputNicePricePrice'>Текущая цена</label>
            <input id='inputNicePricePrice' type="text" onChange={(e)=>{setValuePrice({...valuePrice, NicePrice: e.target.value })}}/>
          </div>
          <div>
            <label htmlFor='inputNixLink'>Ссылка на Nix</label>
            <input id='inputNixLink' type="text" onChange={(e)=>{setValueLink({...valueLink, Nix: e.target.value })}}/>
          </div>
          <div>
            <label htmlFor='inputNixPrice'>Текущая цена</label>
            <input id='inputNixPrice' type="text" onChange={(e)=>{setValuePrice({...valuePrice, Nix: e.target.value })}}/>
          </div>    
        </div>
        
      </div>
      }
      {isEdit && 
      <div className='wrapperAddAndChangeForm'>
        {specs.map((item)=>{
          const {idAccess, idSpecAccessory,spec, mean, value, unit, nameAccess, producer}=item
          count++
          listValueSpec[spec]=value
          currentName=nameAccess
          currentProducer=producer
          currentId=idAccess
          if(count===1){
            return(
              <div key='blockProducerAndModel' className='blockProducerAndModel'>
                <div key='producer'>
                  <label>Производитель</label>
                  <input value={valueAccess.producer || ''} type="text" onChange={(e)=>{setValueAccess({...valueAccess, producer: e.target.value })}}/>
                </div>
                <div key='model'>
                  <label>Название</label>
                  <input value={valueAccess.name || ''} type="text" onChange={(e)=>{setValueAccess({...valueAccess, name: e.target.value })}}/>
                </div>
                <div key={idSpecAccessory} id='firstSpec'>
                  <label htmlFor={spec}>{mean}{unit!==null ? ",":" "} {unit}</label>
                  <input value={valueSpec[spec] || ''} id={spec} type="text" onChange={(e)=>{setValueSpec({...valueSpec, [spec]: e.target.value })}}/>
                </div>
              </div>
            )
          }
          return(
            <div key={idSpecAccessory}>
              <label htmlFor={spec}>{mean}{unit!==null ? ",":" "} {unit}</label>
              <input value={valueSpec[spec] || ''} id={spec} type="text" onChange={(e)=>{setValueSpec({...valueSpec, [spec]: e.target.value })}}/>
            </div>
          )
        })}
        
        <div className='blockShopLinkAndPrice' key='shopsPrice'>
        {editShop.map((item, i, array)=>{
          const {price, link}=item
            if(i===0){
              listValueLink['Dns']=link
              listValuePrice['Dns']=price
              return(
                <div key='Dns'>
                  <div>
                    <label htmlFor='inputDnsLink'>Ссылка на Dns</label>
                    <input id='inputDnsLink' value={editShop[0].link} type="text" onChange={(e)=>{setEditShop(prevstate=>{
                      const newState=[...prevstate]
                      newState[0].link=e.target.value
                      return newState
                    })}}/>
                  </div>
                  <div>
                    <label htmlFor='inputDnsPrice'>Текущая цена</label>
                    <input id='inputDnsPrice' value={editShop[0].price} type="text" onChange={(e)=>{setEditShop(prevstate=>{
                      const newState=[...prevstate]
                      newState[0].price=e.target.value
                      return newState
                    })}}/>
                  </div>    
                </div>
              )
            }else if(i===1){
              listValueLink['NicePrice']=link
              listValuePrice['NicePrice']=price
              return(
                <div key='NicePrice'>
                  <div>
                    <label htmlFor='inputNicePriceLink'>Ссылка на niceprice</label>
                    <input id='inpuNicePriceLink' value={editShop[1].link} type="text" onChange={(e)=>{setEditShop(prevstate=>{
                      const newState=[...prevstate]
                      newState[1].link=e.target.value
                      return newState
                    })}}/>
                  </div>    
                  <div>
                    <label htmlFor='inputNicePricePrice'>Текущая цена</label>
                    <input id='inputNicePricePrice' value={editShop[1].price} type="text" onChange={(e)=>{setEditShop(prevstate=>{
                      const newState=[...prevstate]
                      newState[1].price=e.target.value
                      return newState
                    })}}/>
                  </div>
                </div>
              )
            }else if(i===2){
              listValueLink['Nix']=link
              listValuePrice['Nix']=price
              return(
                <div key='Nix'>
                  <div>
                    <label htmlFor='inputNixLink'>Ссылка на Nix</label>
                    <input id='inputNixLink' type="text" value={editShop[2].link} onChange={(e)=>{setEditShop(prevstate=>{
                      const newState=[...prevstate]
                      newState[2].link=e.target.value
                      return newState
                    })}}/>
                  </div>
                  <div>
                    <label htmlFor='inputNixPrice'>Текущая цена</label>
                    <input id='inputNixPrice' type="text" value={editShop[2].price} onChange={(e)=>{setEditShop(prevstate=>{
                      const newState=[...prevstate]
                      newState[2].price=e.target.value
                      return newState
                    })}}/>
                  </div> 
                </div>
              )
            }
        })}
        </div>
      </div>
      }
      <button onClick={addNewAccessory}>Сохранить</button>
    </div>
  )
}

export default AddAccessory
