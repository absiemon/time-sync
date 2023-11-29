import React from 'react'
import "./style.css";
import emptyBox from '../../assets/images/empty-box.png'

function NothingToShow() {
  return (
    <div className='board'>
        <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
            <img src={emptyBox} alt='icon' style={{height:'100px', width:'100px', marginBottom:'10px'}}/>
            <h3 style={{marginBottom:'-6px', color:'#c1bebe'}}>Please select a pipeline </h3>
            <h3 style={{color:'#c1bebe'}}>to see the data </h3>
        </div>
    </div>
  )
}

export default NothingToShow