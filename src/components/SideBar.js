import './SideBar.scss'
import {FiSettings} from 'react-icons/fi'
import {BsFillSuitHeartFill} from 'react-icons/bs'
import {HiSpeakerphone} from 'react-icons/hi'

export default function SideBar() {
    return (
        <div className="side-navigation">
        <div className="navigation-item-container">
            <div className="navigation-item">
                <FiSettings className='settings-icon'/>
            </div>
            <p className="navigation-item-text">
                Settings
            </p>

        </div>
        <div className="navigation-item-container">
            <div className="navigation-item">
                <BsFillSuitHeartFill className='archive-icon'/>
            </div>
            <p className="navigation-item-text">
                Archive
            </p>

        </div>
        <div className="navigation-item-container">
            <div className="navigation-item">
                <HiSpeakerphone className='feedback-icon'/>
            </div>
            <p className="navigation-item-text">
                Feedback
            </p>

        </div>
    </div>
    )
}