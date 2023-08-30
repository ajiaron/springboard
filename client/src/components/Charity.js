import React, {useState, useEffect, useRef, useContext} from 'react'
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useParams, useLocation } from "react-router-dom";
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import './Charity.scss'
import {GoArrowRight} from 'react-icons/go'
import SideNavigation from './SideNavigation';
import UserContext from '../contexts/UserContext';
import Payment from './Payment';
import Axios from "axios";
import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { AiOutlineLink, AiOutlineEdit, AiOutlineClockCircle } from 'react-icons/ai'
import axios from 'axios';
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CharityDonation = ({name, location, category, index}) => {
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

          <div className={`profile-donation-item-type-wrapper profile-${category}`}>
              <p className={`profile-donation-item-type-text ${category==='education'?'donation-item-type-text-alt':''}`}>
                {location}
              </p>
          </div>
      </div>
  </div>
  )
}
const InsightItem = ({name, value}) => {
  return (

      <div className={`charity-stats-item-info ${name==='Location'?'location-insight-wrapper':''}`}>
          <p className="profile-friends-item-title">
              {name}
          </p>
          <div className="profile-friends-text-wrapper">
            {(name !== 'Affiliate Payments' && name !== 'Admin Exp. Ratio' && name !== 'Organization Focus' && name !== 'Location')?
              <p className={`profile-donation-item-text ${name==='Excess/Deficit'?value>=0?'excess-text':'deficit-text':''}`} style={{paddingTop:'.175em', paddingLeft:'.125em'}}>
                  {`${name==='Excess/Deficit'?(value>=0)?'+':'-':''}$${Math.abs(value).toLocaleString()}`}
              </p>  :
              <p className={`profile-donation-item-text ${name==='Excess/Deficit'?value>=0?'excess-text':'deficit-text':name==='Location'?'location-insight-text':''}`} style={{paddingTop:'.175em', paddingLeft:'.125em'}}>
                {(name==='Admin Exp. Ratio')? parseFloat(value).toFixed(2): value}
              </p>
            }
          </div>
      </div>
  )
}

export default function Charity() {
  const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const connection = process.env.REACT_APP_API_URL
  const [firstRender, setFirstRender] = useState(true)
  const [isActive, setIsActive] = useState(true)  // background is active
  const [loading, setLoading] = useState(true)
  const [paymentActive, setPaymentActive] = useState(null)
  const [charityInfo, setCharityInfo] = useState(null)
  const [shouldArchive, setShouldArchive] = useState()
  const { charityid, charityname, category: categoryColor } = useParams();
  const themeColors = {
    healthcare: 'rgba(214, 72, 86, ',
    environment: 'rgba(66, 160, 110, ',
    education: 'rgba(230, 184, 93, ',
    human: 'rgba(73, 128, 173, ',
    research: 'rgba(78, 142, 138, ',
    animals: 'rgba(122, 188, 69, ',
    community: 'rgba(154, 129, 106, '
  }
  const [theme, setTheme] = useState(themeColors[categoryColor] || 'rgba(90,90,90,0.75)');
  
  const barData = {
    labels: ['Overall', 
    `${charityInfo?charityInfo[0].type1==='Human'?'H. Services':charityInfo[0].type1:'Loading..'}`,
     'Location',
     `${charityInfo&&charityInfo[0].size}-sized`,
      'Personal'],
    datasets: [
      {
          label: 'Dataset 2',
          data: [30, 55, 20, 38, 35],
          backgroundColor: 'rgba(62, 62, 62, .75)',
          // backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderColor: 'rgba(255, 99, 132, .75)',
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
          backgroundColor: `${theme}${categoryColor==='healthcare'||categoryColor==='education'||categoryColor==='animals'?'0.75)':'.8)'}`,
          borderColor: `${theme}0.75)`,
          borderWidth: 0,
          hoverBackgroundColor: [
            `${theme}.95)`,
          ],
          borderRadius: {
              topLeft:20,
              topRight:20,
          },
          barPercentage:.4,
          categoryPercentage:1,
      },
    ],
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
                return context.tick.value === 0 ? 'rgba(214, 72, 86, 0.6)' : 'rgba(0, 0, 0, 0)';
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
  }
  const data = {
      labels: ['Red', 'Blue'],
      datasets: [
        {
          label: '# of Votes',
          data: [charityInfo?parseFloat(charityInfo[0].overall_score).toFixed(1):0,
          charityInfo?charityInfo[0].overall_score < 100?
          102-parseFloat(charityInfo[0].overall_score).toFixed(1):
          100-parseFloat(charityInfo[0].overall_score).toFixed(1):0.0],
          backgroundColor: [
            `${theme}${categoryColor==='healthcare'||categoryColor==='education'||categoryColor==='animals'?'0.75)':'.8)'}`,
            'rgba(92, 92, 92, 0.8)',
        //   'rgba(255, 99, 132, 0.15)',
          ],
          borderColor: ['#252525bb','#252525bb'],
          borderWidth:0,
          spacing:charityInfo?charityInfo[0].overall_score<100?3:0:3,
          hoverBackgroundColor: [
            `${theme}0.95)`,
            'rgba(92, 92, 92, .75)',
          ],
          borderRadius: {
            outerEnd:charityInfo?charityInfo[0].overall_score<100?20:0:20,
            innerEnd:charityInfo?charityInfo[0].overall_score<100?20:0:20,
            outerStart:charityInfo?charityInfo[0].overall_score<100?20:0:20,
            innerStart:charityInfo?charityInfo[0].overall_score<100?20:0:20,
          },
        },
      ],
  }
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
  const handleBlur = () => {
    setIsActive(true)
  }
  const handlePayment = () => {
    setFirstRender(false)
    setPaymentActive(charityid)
    setIsActive(false)
}
  const onClosePayment = () => {
    setPaymentActive(null)
  }
  function handleTest() {
    console.log(charityInfo)
  }
  const handleArchive = () => {
    if (!shouldArchive) {
      axios.post(`${connection}/api/addarchive`, {userid:userid, charityid:charityid})
      .then(()=>{
        setShouldArchive(true)
      })
      .catch((e)=>console.log(e))
    }
    else {
      axios.delete(`${connection}/api/removearchiveitem`, {
        data:{
          userid:userid,
          charityid:charityid
        }
      })
      .then(()=>{
        setShouldArchive(false)
      })
      .catch((e)=>console.log(e))
    }
   
  }
  useEffect(()=> {
    const loadCharity = async() => {
      setLoading(true)
      try {
        const url = `${connection}/api/getcharitypage`;
        const res = await Axios.get(url, {
          params: {
              charityid:charityid,
              userid:userid
          }
        })
        setCharityInfo(res.data)
        setShouldArchive(res.data[0].archived)
      }
      catch(e) {
        console.log(e)
      }
    }
    loadCharity()
    setLoading(false)
  },[])
  useEffect(()=>{
    if (paymentActive !== null) {
        document.body.style.overflow='hidden'
    }
    else {
        document.body.style.overflow='auto'
    }
  }, [paymentActive])
  return (
    <div className={`charity-page`}>
      {
          (paymentActive!==null)&&<Payment charityid={paymentActive} edit={null} onClose={onClosePayment} onBlur={handleBlur}/>
      }
      <div className={`header-blur blur-${categoryColor}`}/>
        <SideNavigation route={'charity'}/>
        <div className={`charity-page-container ${!isActive?(!firstRender)?'inactive-landing-container':'dim-landing-container':(!firstRender)?'active-container':''}`}>
            <div className="charity-header-container">
                <div style={{display:"flex", justifyContent:"center", height:"fit-content", alignItems:"center", gap:"2em", width:"fit-content"}}>
                  <span className="profile-image-wrapper" style={{backgroundColor:`${theme}0.7)`}} onClick={()=>handleTest()}>
                      <p className="profile-image-text">
                      {`${charityname?charityname.charAt(0).toUpperCase():'P'}`}
                      </p>
                  </span>
                  <div className="profile-header-wrapper">
                      <p className="profile-header-text">
                          {`${charityname?charityname:'No Charity Info'}`}
                      </p>
                      <div className="profile-link-container">
                          <AiOutlineLink className="link-icon"/>
                          <p className="profile-header-subtext">
                              link.springboard.app/{charityname?charityname.replace(/\s+/g, '-').toLowerCase():''}
                          </p>
                      </div>
                  </div>
                </div>
            </div>
            <div className="manage-charity-container">
                <div className="manage-charity-header-container">
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <p className="manage-header-text">
                            Organization Profile
                        </p>
                        <p className="manage-header-subtext">
                            Learn about the impact of this organization.
                        </p>
                    </div>
                    <div className='charity-page-donate-subcontainer'>
                      <span className={`${(shouldArchive)?'charity-page-like-icon-wrapper-alt':'charity-page-like-icon-wrapper'}`}
                      onClick={()=>handleArchive()}>
                        <AiFillHeart className="charity-page-like-icon"/>
                      </span>
                      <span className='charity-page-donate-button' onClick={()=>handlePayment(charityid)}>
                        <div className="donate-page-link-button">
                            <p className="charity-confirm-checkout-text">
                                {
                                  "Donate"
                                }
                            </p>
                        </div>
                      </span>
                    </div>
                </div>
            </div>
            {(loading)?    
            <div className='loading-text-container' onClick={()=>handleTest()}>
                <p className="loading-text"> {`${(loading)?'Loading...':`Showing all matching results`}`} </p>
            </div>:
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
                      <div className='charity-insights-wrapper '>
                        <div className="charity-insight-container ">
                            <div className="charity-chart-wrapper">
                              <div className='chart-container'>
                                  <Doughnut data={data} options={doughOptions} className='charity-chart'/>
                                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                      <p className="charity-insight-figure-score">
                                          {charityInfo?parseFloat(charityInfo[0].overall_score).toFixed(1):0.0}
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
                                    {charityInfo?parseFloat(charityInfo[0].financial_score).toFixed(1):0.0}
                                    </p>
                                </div>
                                <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'.25em', alignItems:'flex-end', paddingTop:'1.25em'}}>
                                    <p className='charity-insights-subcontent-header'>
                                        Accountability Score
                                    </p>
                                    <p className='charity-insights-subcontent-text'>
                                    {charityInfo?parseFloat(charityInfo[0].accountability_score).toFixed(1):0.0}
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
                                        <div className={`charity-legend-color charity-legend-${categoryColor}`}/>
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
            }
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
                          <CharityDonation name={'Henry Zheng'} location={'Riverside, CA'} category={categoryColor} index={0}/>
                          <CharityDonation name={'An Truong'} location={'Irvine, CA'} category={categoryColor} index={1}/>
                          <CharityDonation name={'Thompson Nguyen'} location={'San Francisco, CA'} category={categoryColor} index={2}/>
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
                          <InsightItem name={'Total Compensation'} value={charityInfo?charityInfo[0].total_contributions:0}/>          
                          <InsightItem name={'Program Expense'} value={charityInfo?charityInfo[0].program_expenses:0}/>  
                          <InsightItem name={'Fundraising Expense'} value={charityInfo?charityInfo[0].fundraising_expenses:0}/>    
                        </div>
                        <div className='charity-stat-col'>
                          <InsightItem name={'Net Assets'} value={charityInfo?charityInfo[0].net_assets:0}/>  
                          <InsightItem name={'Admin Expense'} value={charityInfo?charityInfo[0].administrative_expenses:0}/>     
                          <InsightItem name={'Admin Exp. Ratio'} value={charityInfo?charityInfo[0].admin_expense_ratio:0}/>              
                        </div>
                        <div className='charity-stat-col'>
                          <InsightItem name={'Excess/Deficit'} value={charityInfo?charityInfo[0].excess:0}/>     
                          <InsightItem name={'Other Revenue'} value={charityInfo?charityInfo[0].other_revenue:0 }/>  
                          <InsightItem name={'Affiliate Payments'} value={charityInfo?charityInfo[0].payments_to_affiliates:0}/> 
                        </div>
                      </div>
                      <div style={{paddingTop:'2.125em', display:"flex", width:"70%",justifyContent:"space-between"}}>
                        <InsightItem name={'Organization Focus'} value={charityInfo?charityInfo[0].type2:"n/a"}/> 
                        <InsightItem name={'Location'} value={charityInfo?`${charityInfo[0].city} ${charityInfo[0].state}, USA`:"n/a"}/> 
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
