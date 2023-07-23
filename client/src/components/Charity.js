import React from 'react'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import { BsFileX, BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import './Charity.scss'
import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const months = ['January', 'February', 'March', 'April', 'May']
const barData = {
    labels: ['Overall', 'Healthcare', 'Large', 'California', 'Personal'],
    datasets: [
        {
            label: 'Dataset 2',
            data: [30, 55, 20, 38, 35],
            backgroundColor: 'rgba(60, 60, 60, .75)',
           // backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderColor: 'rgba(255, 99, 132, .75)',
            borderWidth: 0,
            borderRadius: {
                topLeft:20,
                topRight:20,
            },
            barPercentage:.4,
            //minBarLength:20,
            categoryPercentage:1,
            
        },

    {
        label: 'Dataset 1',

        data: [50, 20, 30, 45, 25],
        backgroundColor: 'rgba(214, 72, 86, 0.75)',
        borderColor: 'rgba(214, 72, 86, 0.75)',
        borderWidth: 0,
        borderRadius: {
            topLeft:20,
            topRight:20,
        },
        
        
        barPercentage:.4,
        categoryPercentage:1,
       // minBarLength:20,
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
const emptyData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.1)',
          'rgba(54, 162, 235, 0.1)',
          'rgba(255, 206, 86, 0.1)',
          'rgba(75, 192, 192, 0.1)',
          'rgba(153, 102, 255, 0.1)',
          'rgba(255, 159, 64, 0.1)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 0.0)',
            'rgba(54, 162, 235, 0.0)',
            'rgba(255, 206, 86, 0.0)',
            'rgba(75, 192, 192, 0.0)',
            'rgba(153, 102, 255, 0.0)',
            'rgba(255, 159, 64, 0.0)',
        ],
        borderWidth: 2,
      },
    ],
  };
const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 15, 4, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 0.0)',
            'rgba(54, 162, 235, 0.0)',
            'rgba(255, 206, 86, 0.0)',
            'rgba(75, 192, 192, 0.0)',
            'rgba(153, 102, 255, 0.0)',
            'rgba(255, 159, 64, 0.0)',
        ],
        borderWidth: 2,
      },
    ],
  };
const doughOptions = {
    cutout:'72.5%',
    plugins: {
        legend: {
          display:false,
          labels: {
            color: '#bbb'  // changes color of legend labels
          }
        }
      }
}
const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [6.6, 6.2, 5.6,6.8, 5.2, 4.2],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],

        borderColor: ['#151515','#151515','#151515','#151515','#151515','#151515'],
        borderWidth:10,
        barThickness:.5
      },
    ],
}

const options = {
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
  return (
    <div className="profile-page-container">
        <Navbar route={'profile'}/>
        <div className="profile-page-content">
            <div className="profile-header-container">
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
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Contribution Statistics
                        </p>
                        <p className="donation-details-subtext">
                            See how this organization compares to others in the given category.
                        </p>
                    </div>
                    <div className='charity-statistics-wrapper'>
                        <div className='charity-donations-wrapper'>

                        </div>
                        <div className='charity-donations-context-wrapper'>
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
                            <div className='charity-donations-wrapper-lower'>
       
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </div>
                       
                    </div>

                    {/* 
                    
                    <div className="charity-donations-wrapper">
                      {/* <PolarArea data={data} options={options} />
                      <div className='chart-container'>
                        <Doughnut data={doughnutData} options={doughOptions} className='charity-chart'/>
                      </div>
                      <PolarArea data={data} options={options} className='charity-polar-container'/>
                    </div>
                */}

                </div>
              </div>
        </div>
    </div>
  )
}
