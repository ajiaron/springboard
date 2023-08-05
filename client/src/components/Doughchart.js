import React from 'react'
import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const data = {
    labels: ['Education', 'Human Services', 'Environment'],
    datasets: [
      {
        label: '# of Votes',
        data: [90,40,50],
        backgroundColor: [
          'rgba(230, 184, 93, 0.8)',
          'rgba(73, 128, 173, 0.8)',
          'rgba(66, 160, 105, 0.8)',

        ],
        borderColor: ['#252525bb','#252525bb'],
        borderWidth:0,
        spacing:6,
        hoverBackgroundColor: [
          '#e6b85dff',
          'rgba(73, 128, 173, 0.95)',
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


export default function Doughchart() {
    const doughOptions = {
        cutout:'80%',
        rotation:'20',
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
 
    <div className='profile-chart-wrapper'>
        

        <div className='profile-chart-insights-wrapper'>
            <div className="charity-insight-container">
                <div className="charity-chart-wrapper">
                    <div className='chart-container'>
                        <Doughnut data={data} options={doughOptions} className='charity-chart'/>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <p className="charity-insight-figure-score" style={{transform:"translateY(-.05em)"}}>
                                14
                            </p>
                            <p className={`charity-chart-details-text`} style={{color:'#ccc', padding:0, transform:'translateY(-.1em)'}}>
                                Donations
                            </p>
                        </div>
                    </div>
                </div>

                <div className='profile-chart-legend'>

                    <div className='profile-chart-legend-wrapper'>
                     <div className='profile-chart-legend-item'>
                            <p className='charity-legend-text'>
                                Education
                            </p>
                            <div className='profile-chart-legend-color profile-chart-ed'/>
                        </div>
                        <div className='profile-chart-legend-item'>
                            <p className='charity-legend-text'>
                                Environment {'&'} Animals
                            </p>
                            <div className='profile-chart-legend-color  profile-chart-ev'/>
                        </div>
                        <div className='profile-chart-legend-item'>
                            <p className='charity-legend-text'>
                                Human Rights {'&'} Services
                            </p>
                            <div className='profile-chart-legend-color profile-chart-hr'/>
                        </div>
           
                      
                    </div>
                </div>

            </div>
        </div>
        
    </div>


  )
}
