import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img className='logo' src= "https://static.vecteezy.com/system/resources/previews/000/656/608/original/vector-restaurant-badge-and-logo-good-for-print.jpg" alt="" style={{height:"80px",
              width:"80px"}}/>
      {/* <img className='logo' src= alt="" /> */}
      <img className='profile' src={assets.profile_image} alt="" />

      
    </div>
  )
}

export default Navbar
