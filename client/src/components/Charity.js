import React, {useState, useEffect, useRef} from 'react'
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import './Charity.scss'
import {GoArrowRight} from 'react-icons/go'
import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { AiOutlineLink, AiOutlineEdit, AiOutlineClockCircle } from 'react-icons/ai'
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CharityDonation = ({name, location, index}) => {
  return (
  <div className={`profile-donation-item ${index===2?'donation-item-last':''}`}>
      <div className="profile-donation-item-info" style={{paddingLeft:'.125em'}}>
          <p className="profile-donation-item-title">
              {name}
          </p>
          <div className="profile-donation-text-wrapper">
              <AiOutlineClockCircle className="profile-clock-icon"/>
              <p className="profile-donation-item-text">
                  3 weeks ago
              </p>   
          </div>

          <div className={`profile-donation-item-type-wrapper profile-healthcare`}>
              <p className="profile-donation-item-type-text">
                {location}
              </p>
          </div>
      </div>
  </div>
  )
}
const InsightItem = ({name, value}) => {
  return (

      <div className="charity-stats-item-info">
          <p className="profile-friends-item-title">
              {name}
          </p>
          <div className="profile-friends-text-wrapper">
            {(name !== 'Affiliate Payments' && name !== 'Admin Exp. Ratio' && name !== 'Organization Focus' && name !== 'Location')?
              <p className={`profile-donation-item-text ${name==='Excess/Deficit'?value>=0?'excess-text':'deficit-text':''}`} style={{paddingTop:'.175em', paddingLeft:'.125em'}}>
                  {`${name==='Excess/Deficit'?(value>=0)?'+':'-':''}$${Math.abs(value).toLocaleString()}`}
              </p>  :
              <p className={`profile-donation-item-text ${name==='Excess/Deficit'?value>=0?'excess-text':'deficit-text':''}`} style={{paddingTop:'.175em', paddingLeft:'.125em'}}>
                {(name==='Admin Exp. Ratio')? parseFloat(value).toFixed(2): value}
              </p>
            }
          </div>
      </div>
  )
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

const data = {
    labels: ['Red', 'Blue'],
    datasets: [
      {
        label: '# of Votes',
        data: [90,10],
        backgroundColor: [
          'rgba(214, 72, 86, 0.75)',
          'rgba(88, 88, 88, 0.8)',
       //   'rgba(255, 99, 132, 0.15)',
        ],
        borderColor: ['#252525bb','#252525bb'],
        borderWidth:0,
        spacing:3,
        hoverBackgroundColor: [
          'rgba(214, 72, 86, .95)',
          'rgba(99, 92, 92, .75)',
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

const polarOptions = {
    scales: {
      r: {
        grid: {
        display:false,
          color: '#3a3a3a',  
        },
        ticks: {
          color: 'transparent',  
          backgroundColor:'#151515',
          stepSize:1.5,
          backdropColor: 'transparent',
        },
        pointLabels: {
          color: '#151515', 
          display: false,
          font: {
            size: 13,
          }
        }
      },
    },
    plugins: {
      legend: {
        display:false,
        labels: {
          color: '#151515'  
        }
      }
    }
  };

export default function Charity() {
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

  return (
    <div className="charity-page">
      <div className='header-blur'/>
        <Navbar route={'charity-page'}/>
        <div className="charity-page-container">
            <div className="charity-header-container">
                <div style={{display:"flex", justifyContent:"center", height:"fit-content", alignItems:"center", gap:"2em", width:"fit-content"}}>
                  <div className="profile-image-wrapper" style={{backgroundColor:'rgba(214, 72, 86, 0.7)'}}>
                      <p className="profile-image-text">
                          A
                      </p>
                  </div>
                  <div className="profile-header-wrapper">
                      <p className="profile-header-text">
                          {`American Heart Association`}
                      </p>
                      <div className="profile-link-container">
                          <AiOutlineLink className="link-icon"/>
                          <p className="profile-header-subtext">
                              link.springboard.app/american-heart-association
                          </p>
                      </div>
                  </div>
                </div>
                <div className='charity-page-donate-button'>
                    <Link className="donate-page-link-button" to={'#'}>
                        <p className="charity-confirm-checkout-text">
                            {
                              "Donate"
                            }
                        </p>
                    </Link>
                </div>
            </div>
            <div className="manage-profile-container">
                <div className="manage-header-container">
                    <p className="manage-header-text">
                        Organization Profile
                    </p>
                    <p className="manage-header-subtext">
                        Learn about the impact of this organization.
                    </p>
                </div>
            </div>
            <div className="charity-details-container">
                <div className="charity-page-donations-container">
                  {/*
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Contribution Statistics
                        </p>
                        <p className="donation-details-subtext">
                            See how this organization compares to others in the given category.
                        </p>
                    </div>
                  */}
                    <div className='charity-donations-wrapper'>
                      <div className='charity-insights-wrapper'>
                        <div className="charity-insight-container">
                            <div className="charity-chart-wrapper">
                              <div className='chart-container'>
                                  <Doughnut data={data} options={doughOptions} className='charity-chart'/>
                                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                      <p className="charity-insight-figure-score">
                                          97.4
                                      </p>
                                      <p className={`charity-chart-details-text`}>
                                        Overall
                                      </p>
                                  </div>
                                </div>
                              </div>
                            <div className='charity-insights-subcontent'>
                                <div style={{display:'flex', flexDirection:'column', width:'100%',gap:'.25em', alignItems:'flex-end', paddingBottom:'1.25em', borderBottom:'1px dashed #555555'}}>
                                    <p className='charity-insights-subcontent-header'>
                                        Financial Score
                                    </p>
                                    <p className='charity-insights-subcontent-text'>
                                        92.3
                                    </p>
                                </div>
                                <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'.25em', alignItems:'flex-end', paddingTop:'1.25em'}}>
                                    <p className='charity-insights-subcontent-header'>
                                        Accountability Score
                                    </p>
                                    <p className='charity-insights-subcontent-text'>
                                        98.7
                                    </p>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className='charity-statistics-wrapper'>
                        <div className='charity-context-wrapper'>
                            <div className='charity-donations-legend'>
                                <p className="chart-details-text">
                                    Total contributions vs. group average
                                </p>
                                <div className='charity-legend-item-wrapper'>
                                    <div className='charity-legend-item'>
                                        <p className='charity-legend-text'>
                                            Current Organization
                                        </p>
                                        <div className='charity-legend-color'/>
                                    </div>
                                    <div className='charity-legend-item'>
                                        <p className='charity-legend-text'>
                                            Average Contributions
                                        </p>
                                        <div className='charity-legend-color-avg'/>
                                    </div>
                                </div>
                            </div>
                            <div className='charity-donations-bar-wrapper'>
                                <Bar data={barData} options={barOptions} className="bar-chart" />
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            <div className="charity-details-container-low">
                <div className="account-donations-container">
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Recent Donations
                        </p>
                        <p className="donation-details-subtext">
                            View the latest donations made to American Heart Association.
                        </p>
                    </div>
                    <div className="account-donations-list" style={{paddingTop:'.2em'}}>
                      <div className="account-donations-list-content">
                          <CharityDonation name={'Henry Zheng'} location={'Riverside, CA'} index={0}/>
                          <CharityDonation name={'An Truong'} location={'Irvine, CA'} index={1}/>
                          <CharityDonation name={'Thompson Nguyen'} location={'San Francisco, CA'} index={2}/>
                      </div>
                   </div>
                </div>
                <div className='charity-stats-container'>
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Charity Information
                        </p>
                        <p className="donation-details-subtext">
                            See how this organization compares to other charities.
                        </p>
                    </div>
                    <div style={{display:"flex", flexDirection:"column"}}>
                      <div className='charity-stats'>
                        <div className='charity-stat-col'>
                          <InsightItem name={'Total Compensation'} value={693094040}/>          
                          <InsightItem name={'Program Expense'} value={653394727}/>  
                          <InsightItem name={'Fundraising Expense'} value={95811767}/>    
                        </div>
                        <div className='charity-stat-col'>
                          <InsightItem name={'Net Assets'} value={889410491}/>  
                          <InsightItem name={'Admin Expense'} value={62254399}/>     
                          <InsightItem name={'Admin Exp. Ratio'} value={0.09}/>              
                        </div>
                        <div className='charity-stat-col'>
                          <InsightItem name={'Excess/Deficit'} value={18344321}/>     
                          <InsightItem name={'Other Revenue'} value={107712293 }/>  
                          <InsightItem name={'Affiliate Payments'} value={0}/> 
                        </div>
                      </div>
                      <div style={{paddingTop:'2.125em', display:"flex", width:"70%",justifyContent:"space-between"}}>
                        <InsightItem name={'Organization Focus'} value={"Diseases, Disorders, and Disciplines"}/> 
                        <InsightItem name={'Location'} value={"Dallas TX, USA"}/> 
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
