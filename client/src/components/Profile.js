import React, {useState, useEffect, useRef} from "react"
import './Profile.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";

import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'

import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DonationItem = ({name, type, index}) => {
    return (
    <div className={`profile-donation-item ${index===2?'donation-item-last':''}`}>
        <div className="profile-donation-item-info">
            <p className="profile-donation-item-title">
                {name}
            </p>
            <div className="profile-donation-text-wrapper">
                <AiOutlineClockCircle className="profile-clock-icon"/>
                <p className="profile-donation-item-text">
                    3 weeks ago
                </p>   
            </div>

            <div className={`profile-donation-item-type-wrapper profile-${type.toLowerCase()}`}>
                <p className="profile-donation-item-type-text">
                    {type==='Human'?'Human Rights & Services':
                    type==='Research'?'Research & Public Policy':
                    type==='Community'?'Community Development'
                :type}
                </p>
            </div>
        </div>
    </div>
    )
}
const FriendsItem = ({name, status}) => {
    return (
    <div className="profile-friends-item">
        <div className="profile-friends-image-container">
            <div className="profile-friends-image-wrapper">

            </div>
        </div>
        <div className="profile-friends-item-info">
            <p className="profile-friends-item-title">
                {name}
            </p>
            <div className="profile-friends-text-wrapper">
                <p className="profile-donation-item-text">
                    Follows you
                </p>   
            </div>
        </div>
    </div>
    )
}

const data = {
    labels: ['Red', 'Blue'],
    datasets: [
      {
        label: '# of Votes',
        data: [90,30,40],
        backgroundColor: [
          'rgba(218, 194, 85, 0.75)',
          'rgba(63, 118, 163, 0.75)',
          'rgba(76, 173, 115,.75)',
        ],
        borderColor: ['#252525bb','#252525bb'],
        borderWidth:0,
        spacing:5,
        hoverBackgroundColor: [
          'rgba(214, 72, 86, .95)',
          'rgba(53, 108, 153,.95)',
          'rgba(90, 187, 111,.95)',
        ],
        borderRadius: {
          outerEnd:20,
          innerEnd:20,
          outerStart:20,
          innerStart:20,
        },
      },
    ],
}
const barData = {
    labels: ['Overall', 'Healthcare', 'Large', 'California', 'Personal'],
    datasets: [
      {
          label: 'Dataset 2',
          data: [30, 55, 20, 38, 35],
          backgroundColor: 'rgba(60, 60, 60, .8)',
          // backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderColor: 'rgba(255, 99, 132, .8)',
          borderWidth: 0,
          borderRadius: {
              topLeft:20,
              topRight:20,
          },
          barPercentage:.4,
          categoryPercentage:1,
      },
      {
          label: 'Dataset 1',
          data: [50, 20, 30, 45, 25],
          backgroundColor: 'rgba(214, 72, 86, 0.8)',
          borderColor: 'rgba(214, 72, 86, 0.8)',
          borderWidth: 0,
          hoverBackgroundColor: [
            'rgba(234, 72, 86, .95)',
          ],
          borderRadius: {
              topLeft:20,
              topRight:20,
          },
          barPercentage:.4,
          categoryPercentage:1,
      },
    ],
};

export default function Profile() {
  const [nickname, setNickname] = useState('')
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [screenHeight, setScreenHeight] = useState(window.innerHeight)
  const doughOptions = {
    cutout:'80%',
    responsive:true,
    plugins: {
        legend: {
          display:false,
          labels: {
            color: '#bbb'  // changes color of legend labels
          }
        },
        tooltip: {
          enabled:false
        }
      }
}
const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        offset:false,
        stacked: false,
        grid: {
            display:false,
            color: function(context) {
                return context.tick.value === 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(0, 0, 0, 0)';
            },
       
            borderColor: 'rgba(255, 99, 132, 0.6)', // sets color of axis line
        },
        ticks: {
            color:'#151515',
            padding:0,
            stepSize:5,
            display:false,
            position:'right',
            backdropPadding:0
          },
      },
      x: {
        offset:true,
        beginAtZero:true,
        stacked: true,
        grid: {
            display:true,
            color:'transparent',
            borderColor:'transparent'
   
          },
        ticks: {
            padding:2,
            color:"#aaa",
            backgroundColor:'#151515',
            backdropColor: 'transparent',
          },
      },
    },
    responsive:true,
    plugins: {
        legend: {
          display:false,
          labels: {
            color: '#151515'  // changes color of legend labels
          }
        }
      }
  };
  function handleTest() {
      console.log('W:', screenWidth, 'H:',screenHeight)
  }
  return (
    <div className="profile-page-container">
        <Navbar route={'profile'}/>
        <div className="profile-page-content">
            <div className="profile-header-container">
                <div className="profile-image-wrapper">
                    <p className="profile-image-text">
                        A
                    </p>
                </div>
                <div className="profile-header-wrapper">
                    <p className="profile-header-text">
                        {`Aaron Jiang`}
                    </p>
                    <div className="profile-link-container">
                        <AiOutlineLink className="link-icon"/>
                        <p className="profile-header-subtext">
                            link.springboard.app/aaronjiang
                        </p>
                    </div>
                </div>
            </div>

            <div className="manage-profile-container">
                <div className="manage-header-container">
                    <p className="manage-header-text">
                        Manage profile
                    </p>
                    <p className="manage-header-subtext">
                        Update your account preferences here.
                    </p>
                </div>
            </div>
            {/*
            <div className="profile-chart-container">
                <div className='profile-chart-wrapper'>
                    
    
                    <div className='profile-chart-insights-wrapper'>
                        <div className="charity-insight-container">
                            <div className="charity-chart-wrapper">
                                <div className='chart-container'>
                                    <Doughnut data={data} options={doughOptions} className='charity-chart'/>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                        <p className="charity-insight-figure-score">
                                            14
                                        </p>
                                        <p className={`charity-chart-details-text`}>
                                            Donations
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='profile-chart-legend'>
                                <p className="profile-chart-details-text">
                                    Cause Distribution
                                </p>
                                <div className='profile-chart-legend-wrapper'>
                                    <div className='profile-chart-legend-item'>
                                        <p className='charity-legend-text'>
                                            Environment
                                        </p>
                                        <div className='profile-chart-legend-color  profile-chart-ev'/>
                                    </div>
                                    <div className='profile-chart-legend-item'>
                                        <p className='charity-legend-text'>
                                            Human Rights {'&'} Services
                                        </p>
                                        <div className='profile-chart-legend-color profile-chart-hr'/>
                                    </div>
                                    <div className='profile-chart-legend-item'>
                                        <p className='charity-legend-text'>
                                            Education
                                        </p>
                                        <div className='profile-chart-legend-color profile-chart-ed'/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    
                </div>

            </div>
            
  */}
            <div className="profile-favorites-wrapper">
                 <div className="donation-details-container">
                        <p className="donation-details-text">
                            Favorite Charities
                        </p>
                        <p className="donation-details-subtext">
                            Your collection of charities to be displayed on your profile.
                        </p>
                </div>
                <div className="profile-favorites-container">
                    <Favorites/>
                </div>
            </div>
       
            <div className="account-container">
                <div className="account-donations-container">
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Recent Donations
                        </p>
                        <p className="donation-details-subtext">
                            View your latest donations and pledges here.
                        </p>
                    </div>

                    <div className="account-donations-list">
                        <div className="account-donations-list-content">
                            <DonationItem name={'American Heart Association'} type={'Healthcare'} index={0}/>
                            <DonationItem name={'Nevada Conservation Fund'} type={'Environment'} index={1}/>
                            <DonationItem name={'Open Source Foundation'} type={'Research'} index={2}/>
                        </div>
                    </div>
                </div>
                <div className="account-friends-container">
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Friends List
                        </p>
                        <p className="donation-details-subtext">
                            View your active friends and pending requests here.
                        </p>
                    </div>
                    <div className="account-friends-list">
                        <div className="account-friends-list-content">
                            <FriendsItem name={'Henry Zheng'} status={'approved'}/>
                            <FriendsItem name={'An Truong'} status={'approved'}/>
                            <FriendsItem name={'Thompson Nguyen'} status={'approved'}/>
                            <FriendsItem name={'Jason Damasco'} status={'approved'}/>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer route={'profile'}/>
        </div>
    </div>
  )
}
