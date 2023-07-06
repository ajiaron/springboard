import React, {useState, useContext} from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import {AnimatePresence } from 'framer-motion'
import Landing from './components/Landing'
import Catalog from './components/Catalog';
import CharityItem from './components/CharityItem';

function AnimatedRoutes() {
    const location = useLocation()
    return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Landing />} />
            <Route path='/catalog' element={<Catalog/>}/>
        </Routes>
    </AnimatePresence>
    )
}

export default AnimatedRoutes