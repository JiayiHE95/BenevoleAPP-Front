import React from 'react'
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';

const Infos = () => {
 return (
  <div>
   <NavBar/>
   <h1>Infos</h1>
   <Sidebar dataName="poste" />
  </div>
 )
}
export default Infos