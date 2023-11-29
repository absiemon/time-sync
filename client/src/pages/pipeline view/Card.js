import { Button } from 'antd'
import React from 'react'
import './card.css'
import './style.css'
import user from '../../assets/images/user.png'
import moment from 'moment'

function Card({ details }) {

  return (
    <div className="card">
      <div className='card-header'>
        <div className='avatar'>{details.lead_type_value.charAt(0)}</div>    {/* person/organization name ka avatar*/}
        <div style={{ paddingRight: '80px' }}>
          <div className=''>{details?.pip_name}</div>  {/* pipeline name */}
          <div style={{ color: '#38abb3' }}>{details?.title}</div>
        </div>
        {/* <div style={{ display: 'flex', gap: '10px', marginLeft: '14.5rem', position: 'absolute' }}>
          <img src={edit} alt="icon" className='user-icon' role="button" onClick={() => handleEdit(id)} />
          <img src={Delete} alt="icon" className='user-icon' role="button"
            onClick={() => handleDeleteDeal(id, details[index]?.deal_value)}
          />
        </div> */}
      </div>
      <div className='card-header'>
        <img src={user} alt='icon' className='user-icon' />
        <div style={{ color: '#38abb3' }}>{details?.lead_type_value}</div>   {/* person/organization name */}
      </div>
      <div className='card-header' style={{ justifyContent: 'space-between' }}>
        <div className=''>Activity</div>    {/* description */}
        <div className='activity'>{details?.activity}</div>  {/* sales value */}
      </div>
      <div className='card-header' style={{ justifyContent: 'space-between' }}>
        <div className=''>Deal value</div>    {/* description */}
        <div style={{ color: '#38abb3' }}>$ {details?.deal_value}</div>  {/* sales value */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap:'20px', alignItems:'center' }}>
        {details?.deal_status === 'won' ? 
          <div className='activity' role="button" >Woned</div>
          : 
          <div role="button" style={{
            backgroundColor:" red",
            padding: "2px 9px",
            color: "white",
            borderRadius:" 3px",
            fontWeight:" 600",
          }}>
            Lost
            </div>
        }
        <div className='footer'>Last Updated at: {moment(details?.time_stamp).format('MMM DD, YYYY')}</div>
      </div>
    </div>
  )
}

export default Card