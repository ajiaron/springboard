import React, {useState, useEffect, useRef} from "react"
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
export default function DonationItem({type, value, name, size, date}) {
  return (
    <div className={`personal-donation-item-container ${type.toLowerCase()}-item`}>
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
</div>
  )
}
