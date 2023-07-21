import './SideBar.scss'
import {FiSettings} from 'react-icons/fi'
import {BsFillSuitHeartFill} from 'react-icons/bs'
import {HiSpeakerphone} from 'react-icons/hi'
import { Link, useParams } from "react-router-dom";

export default function SideBar({}) {
    return (
        <div 
        className={`side-navigation`}>
        <div className="navigation-item-container">
            <Link className="navigation-item" to={'/settings'}>
                <FiSettings className='settings-icon'/>
            </Link>
            <p className="navigation-item-text">
                Settings
            </p>

        </div>
        <div className="navigation-item-container">
            <Link className="navigation-item" to={'/cart'}>
                <BsFillSuitHeartFill className='archive-icon'/>
            </Link>
            <p className="navigation-item-text">
                Archive
            </p>
        </div>
        <div className="navigation-item-container">
            <span className="navigation-item" 
             onClick={(e)=>{
             window.location.href = 'mailto:aaronjiang3942@gmail.com';
             e.preventDefault();
             }}>
                <HiSpeakerphone className='feedback-icon'/>
            </span>
            <p className="navigation-item-text">
                Feedback
            </p>

        </div>
    </div>
    )
}