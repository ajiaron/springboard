import React, {useState, useEffect, useRef} from "react"
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import axios from "axios"
import { Link } from "react-router-dom";
export default function DonationItem({type, value, name, size, date}) {
    const [loading, setLoading] = useState(true)
    const [charityid, setCharityid] = useState(null)
    useEffect(()=> {
        const loadCharity = async() => {
            setLoading(true)
            try {
            const url = `http://localhost:3000/archive/getcharityid/${name}`;
            const res = await axios.get(url, {
                params: {
                    name:name
                }
            })
            console.log(res.data[0].charityid)
            setCharityid(res.data[0].charityid)
            }
            catch(e) {
            console.log(e)
            }
        }
        loadCharity()
        setLoading(false)
        },[name])
    return (
        <Link className={`personal-donation-item-container ${type.toLowerCase()}-item`} 
        to={(!loading && charityid)&&`/charity/${charityid&&charityid}/${name}/${type==='Health'?'healthcare':type.toLowerCase()}`}>
            <div className="profile-favorite-item-category">
                <p className={`category-favorite-text ${type.toLowerCase()}-text`}>
                {`${type==='Human'?'Human Rights & Services':type==='Research'?'Research & Public Policy':
                type==='Community'?'Community Development':type}`}
                </p>
                <AiFillHeart className="profile-favorite-icon"/>
            </div>
            <div className="personal-donation-item-figure">
                <p className="personal-donation-figure-text">
                    {`$${parseFloat(value).toFixed(2)}`}
                </p>

            </div>
            <div className="personal-donation-item-name">
                <p className="profile-favorite-name-text">
                    {name}
                </p>
            </div>
            <div className="personal-donation-type-container">
                <div className="personal-donation-item-type-wrapper">
                    <p className="personal-donation-item-type-text">
                        {date}
                    </p>
                </div> 
            </div>
        </Link>
    )
}