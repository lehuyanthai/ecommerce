import './side-bar.scss'

import React from 'react'
import {Link} from 'react-router-dom'

export interface ISideBar {
  name: string;
  link:string;
}

interface ISideBarProps {
    sideBarData: ISideBar[];
}

const SideBar = ({sideBarData}:ISideBarProps) => {
  return (
    <div className='sidebar'>
        {sideBarData.map((item,index)=>(<div key={index} className="sidebar__item"><Link to={item.link}>{item.name}</Link></div>))}
    </div>
  )
}

export default SideBar