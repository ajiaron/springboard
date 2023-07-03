import React, {useState, useContext} from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import {AnimatePresence } from 'framer-motion'
import Landing from './components/Landing'

function AnimatedRoutes() {
    const location = useLocation()
    return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Landing />} />
        </Routes>
    </AnimatePresence>
    )
}

export default AnimatedRoutes