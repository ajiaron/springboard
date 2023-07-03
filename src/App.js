import React, {useState, useEffect} from "react"
import AnimatedRoutes from "./AnimatedRoutes"
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

export default function App() {
  return (
    <>
    <Router>
      <AnimatedRoutes />
    </Router>
    </>
  )
}

