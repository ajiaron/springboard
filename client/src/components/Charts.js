import React, {useState, useEffect, useRef} from 'react';
import './Charity.scss'
import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function MultiSeriesDoughnut() {
    const data1 = {
        labels: ['Red', 'Blue'],
        datasets: [
            {
                data: [300, 50],
                backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(255,99,132,0.2)'],
                borderColor: ['rgba(255,99,132,.6)', 'rgba(54,162,235,.2)'],
                borderWidth: 1,
            },
        ],
    };

    const data2 = {
        labels: ['Green', 'Purple'],
        datasets: [
            {
                data: [400, 150],
                backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(75,192,192,0.2)'],
                borderColor: ['rgba(75,192,192,.6)', 'rgba(153,102,255,.2)'],
                borderWidth: 1,
            },
        ],
    };

    const data3 = {
        labels: ['Black', 'White'],
        datasets: [
            {
                data: [300, 60],
                backgroundColor: ['rgba(89, 201, 151, 0.6)', 'rgba(89, 201, 151, 0.2)'],
                borderColor: ['rgba(89, 201, 151, 0.6)', 'rgba(89, 201, 151, 0.2)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        cutout: '50%', // this creates the doughnut shape by setting a cutout in the middle
    };
    const doughOptions = {
        cutout:'80%',
        plugins: {
            legend: {
              display:false,
              labels: {
                color: '#bbb'  // changes color of legend labels
              }
            }
          }
    }

    return (
        <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
            <Doughnut data={data1} options={doughOptions} />
            <div style={{ position: 'absolute', top: '14.75%', left: '8.5%', width: '70%', height: '70%' }}>
                <Doughnut data={data2} options={doughOptions} />
                <div style={{ position: 'absolute', top: '14.75%', left: '8.5%', width: '70%', height: '70%' }}>
                    <Doughnut data={data3} options={doughOptions} />
                </div>
            </div>
        </div>
    );
}

export default MultiSeriesDoughnut;
