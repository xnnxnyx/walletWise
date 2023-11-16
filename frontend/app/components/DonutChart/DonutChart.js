// components/DonutChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DonutChart = ({ budget, expenses, category }) => {
    const spent = expenses;
    const remaining = budget - spent;
    const data = {
    labels: [
        'Spent',
        remaining < 0 ? 'Overflow' : 'Remaining'
    ],
    datasets: [{
        label: category,
        data: [spent, remaining],
        backgroundColor: [
        'rgb(255, 99, 132,  0.5)',
        // 'rgb(54, 162, 235,  0.5)'
        remaining < 0 ? 'rgb(255, 0, 0, 0.5)' : 'rgb(54, 162, 235, 0.5)',
        ],
        hoverOffset: 4
     }],
    };

    const chartOptions = {
        plugins: {
          title: {
            display: true,
            text: category,
          },
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const labelIndex = context.dataIndex;
                const dataset = context.dataset;
                const label = dataset.label;
                const value = dataset.data[labelIndex];
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(2) + '%';
                return `${label}: ${value} (${percentage})`;
              },
            },
          },
          animation: {
            animateRotate: true,
            duration: 3000,
            rotate: 90,
          },
        }
      };

    return (
    <div style={{ height: '400px', width: '600px' }}>
      <Doughnut data={data} options={chartOptions}/>
    </div>
  );
}

export default DonutChart;
