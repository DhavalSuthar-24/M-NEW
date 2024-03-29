import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSidebar from "../Components/DashSidebar";
import Dashprofile from "../Components/Dashprofile";
import DashPost from "../Components/DashPost";
import DashUsers from "../Components/DashUsers";
import DashComments from "../Components/DashComments";
import DashboardComp from "../Components/DashboardComp";
import CouponGenerator from "../Components/CouponGenerator";

import Charts from "../Components/Charts";
const Dashboard = () => {
  const location = useLocation();
const[tab,settab] =useState('')

useEffect(()=>{
  const urlParams = new URLSearchParams(location.search)
  const tabFromUrl = urlParams.get('tab')
if(tabFromUrl){
  settab(tabFromUrl)
}

},[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
     
<div className="">

 <DashSidebar/>
</div>
{
  tab === 'profile' && <Dashprofile/>
}
{
  tab === 'posts' && <DashPost/>
}
{
  tab=== "users" && <DashUsers/>
}
{
  tab === 'comments' && <DashComments/>
}
{
  tab === 'dash' && <DashboardComp/>
}
{
  tab==='coupon' && <CouponGenerator/>
}
{
  tab === 'chart' && <Charts/>
}
    </div>
  )
}

export default Dashboard