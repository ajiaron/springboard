import React, {useState, useContext} from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import {AnimatePresence } from 'framer-motion'
import Landing from './components/Landing'
import Catalog from './components/Catalog';
import Cart from './components/Cart'
import Donate from './components/Donate';
import Profile from './components/Profile'
import Settings from './components/Settings';
import Donations from './components/Donations';
import Charity from './components/Charity';

import CharityItem from './components/CharityItem';

function AnimatedRoutes() {
    const location = useLocation()
    return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Landing />} />
            <Route path='/catalog' element={<Catalog/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/charity' element={<Charity/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/donations' element={<Donations/>}/>
            <Route path='/donate/:charityid/:charityname/:amount' element={<Donate/>}/>
        </Routes>
    </AnimatePresence>
    )
}

export default AnimatedRoutes