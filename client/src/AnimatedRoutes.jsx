import React, {useState, useContext} from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import {AnimatePresence } from 'framer-motion'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import Cart from './components/Cart'
import Feed from './components/Feed'
import Donate from './components/Donate';
import Profile from './components/Profile'
import Settings from './components/Settings';
import Donations from './components/Donations';
import Friends from './components/Friends'
import ScrollToTop from "./components/ScrollToTop";
import Archive from './components/Archive';
import Charity from './components/Charity';
import CharityItem from './components/CharityItem';

function AnimatedRoutes() {
    const location = useLocation()
    return (
    <AnimatePresence>
        <ScrollToTop>
            <Routes location={location} key={location.pathname}>
                <Route path='/' element={<Landing />} />
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/catalog' element={<Catalog/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/settings' element={<Settings/>}/>
                <Route path='/charity/:charityid/:charityname/:category' element={<Charity/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/feed' element={<Feed/>}/>
                <Route path='/friends' element={<Friends/>}/>
                <Route path='/archive' element={<Archive/>}/>
                <Route path='/donations' element={<Donations/>}/>
                <Route path='/donate/:charityid/:charityname/:amount' element={<Donate/>}/>
            </Routes>
        </ScrollToTop>
    </AnimatePresence>
    )
}

export default AnimatedRoutes