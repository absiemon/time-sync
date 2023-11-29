
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Space, message } from 'antd';
import userPng from "../assets/images/user.png";
import logoutPng from "../assets/images/logout.png";
import '../assets/styles/home.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStateContext } from '../contexts/ContextProvider';
import avaterImg from '../assets/images/avatar.png';



function ProfileMenu(){

  const { user } = useStateContext();
  const navigate = useNavigate();

  const handleClick = ()=>{
    navigate('/user/my_profile')
  }
  const logout = () => {
    try {
      axios.post("http://localhost:8000/api/auth/logout")
      localStorage.removeItem('user')
      window.location.reload();
    } catch (error) {
      message.error("cannot log out")
    }

  };

  const items = [
    {
      label: 
      <div className="flex justify-start text-primary" style={{gap:'20px', paddingBottom:'10px'}}>
        <Avatar  src={user?.emp_image ? `https://superdolphins.com/superdolphins.com/superdolphinsltd/${user?.emp_image}` : avaterImg} alt='icon' style={{height:'46px', width:'46px'}}/>
        <div >
          <div style={{fontSize:'16px'}}>{user?.emp_name}</div>
          <div className="text-secondary" style={{fontSize:'13px'}}>{user?.email}</div>
        </div>
      </div>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: 
      <div className="flex justify-start text-primary" style={{gap:'17px', padding:'12px 9px 17px 6px'}} role='button' onClick={handleClick}>
        <img src={userPng} style={{height:'25px', widows:'25px'}}/>
        <div style={{fontSize:'16px'}}>My profile</div>
      </div>,
      key: '1',
    },
    {
      label: 
      <div className="flex justify-start text-primary" style={{gap:'17px', padding:'12px 9px 17px 6px'}} role='button' onClick={logout}>
        <img src={logoutPng} style={{height:'25px', widows:'25px'}}/>
        <div style={{fontSize:'16px'}}>Logout</div>
      </div>,
      key: '3',
    },
  ];

  const menu = (
    <Menu>
      {items.map((item) =>
        item.type === 'divider' ? (
          <Menu.Divider key={item.key} />
        ) : (
          <Menu.Item key={item.key}>{item.label}</Menu.Item>
        )
      )}
    </Menu>
  );

  return(
  <Dropdown
    overlay={menu}
    trigger={['click']}
  >
    <div role="button" onClick={(e) => e.preventDefault()}>
      <Space>
      <div className="flex justify-start" style={{gap:'16px', }}>
        <div>
          <div className='text-primary' style={{fontSize:'16px'}}>{user?.emp_name}</div>
          <div className='text-secondary' style={{fontSize:'13px'}}>{user?.email}</div>
        </div>
        <Avatar  src={user?.emp_image ? `https://superdolphins.com/superdolphins.com/superdolphinsltd/${user?.emp_image}` : avaterImg} alt='icon' style={{height:'46px', width:'46px'}}/>
      </div>
      </Space>
    </div>
  </Dropdown>
);
}
export default ProfileMenu;




























// import { useState, useEffect } from "react";
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import Typography from '@mui/material/Typography';
// import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";

// function ProfileMenu({anchorEl, setAnchorEl, open, handleClick, handleClose}) {

 
//   return (
//     <>
//       <Menu
//         anchorEl={anchorEl}
//         id="account-menu"
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         sx={{left:'0px'}}
//         PaperProps={{
//           elevation: 0,
//           sx: {
//             overflow: "visible",
//             filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//             mt: 1.5,
//             "& .MuiAvatar-root": {
//               width: 32,
//               height: 32,
//               ml: -0.5,
//               mr: 1,
//             },
//             "&:before": {
//               content: '""',
//               display: "block",
//               position: "absolute",
//               top: 0,
//               right: 14,
//               width: 10,
//               height: 10,
//               bgcolor: "background.paper",
//               transform: "translateY(-50%) rotate(45deg)",
//               zIndex: 0,
//             },
//           },
//         }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         <MenuItem onClick={handleClose}>
//           <Avatar /> Profile
//         </MenuItem>
        
//         <MenuItem onClick={handleClose}>
//           <ListItemIcon>
//             <LogoutOutlined />
//           </ListItemIcon>
//           Logout
//         </MenuItem>
//       </Menu>
//     </>
//   );
// }

// export default ProfileMenu;
