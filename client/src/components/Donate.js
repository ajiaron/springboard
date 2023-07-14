import React, {useState, useEffect, useRef, useCallback} from "react"
import './Donate.scss'
import Navbar from "./Navbar";
import Payment from "./Payment";
import {BsSearch} from 'react-icons/bs'
import SideBar from "./SideBar";
import Footer from "./Footer";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import { FiMail } from "react-icons/fi";

export default function Donate() {
    const params = useParams()
    const [loading, setLoading] = useState(true)
    function handleTest() {
        console.log(params)
    }

    return (
        <div className="donate-page">
            <Navbar/>
            {/* 
            <span onClick={()=>handleTest()}>
                <p className="test-text">
                    Debug
                </p>
            </span>
            */}
            <Payment charityid={params.charityid}/>
        </div>
    )
}
