import React, {useState, useEffect, useContext} from 'react'
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {AnimatePresence } from 'framer-motion'
import UserProvider from "./contexts/UserProvider";
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
import Confirmation from './components/Confirmation';
import Archive from './components/Archive';
import CreateCampaign from './components/CreateCampaign';
import Charity from './components/Charity';
import CharityItem from './components/CharityItem';
import Campaign from './components/Campaign'
import { Amplify, Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
Amplify.configure(awsmobile)
function ProtectedRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      Auth.currentAuthenticatedUser()
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false))
        .finally(() => setIsLoading(false));
    }, []);
    if (isLoading) return null; // or your loading state

    return <>{!isLoading && isAuthenticated ? children : <Navigate to='/'/>}</>

  }
  
function AnimatedRoutes() {
    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null)

    return (
    <AnimatePresence>
        <UserProvider>
            <ScrollToTop>
                <Routes location={location} key={location.pathname}>
                    <Route path='/' element={<Landing />} />
                    <Route path='/dashboard' element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/catalog' element={<Catalog/>}/>
                    <Route path='/profile/:username' element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/settings' element={
                        <ProtectedRoute>
                            <Settings/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/charity/:charityid/:charityname/:category' element={<Charity/>}/>
                    <Route path='/campaign/:campaignid' element={<Campaign/>}/>
                    <Route path='/cart' element={
                        <ProtectedRoute>
                            <Cart/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/feed' element={
                        <ProtectedRoute>
                            <Feed/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/friends' element={
                        <ProtectedRoute>
                            <Friends/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/archive' element={
                        <ProtectedRoute>
                            <Archive/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/donations'element={
                        <ProtectedRoute>
                            <Donations/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/createcampaign/:campaignid' element={
                        <ProtectedRoute>
                            <CreateCampaign/>
                        </ProtectedRoute>
                    }/>
                    <Route path='/donate/:groupid' element={
                        <ProtectedRoute>
                            <Donate/>
                        </ProtectedRoute>
                    }/>
                     <Route path='/confirmation/:groupid' element={
                        <ProtectedRoute>
                            <Confirmation/>
                        </ProtectedRoute>
                    }/>
                     <Route path='/:username' element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </ScrollToTop>
        </UserProvider>
    </AnimatePresence>
    )
}

export default AnimatedRoutes