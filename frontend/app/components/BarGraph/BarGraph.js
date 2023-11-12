import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const BarChart = ({expenses}) => {
  const labels = expenses.map((expense) => Object.keys(expense)[0]);
  const dataValues = expenses.map((expense) => Object.values(expense)[0]);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Expenditures",
        backgroundColor: "rgb(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132, 1)",
        data: dataValues,
      },
    ],
  };

// Function to determine if the system prefers a dark color scheme
const prefersDarkMode = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Get the system's background color preference
const isDarkMode = prefersDarkMode();

// Set the grid line color based on the background preference
const gridLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        beginAtZero: true,
        grid: {
          display: true,
          //color: 'rgba(255, 255, 0, 0.1)',
          color: gridLineColor,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          //color: 'rgba(255, 255, 0, 0.1)',
          color: gridLineColor,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Expenses by Category',
      },
      legend: {
        display: false,
      },
    },
    animation: {
        onComplete: (animation) => {
          //console.log(animation);
        },
        onProgress: (animation) => {
          //console.log(animation);
        },
        duration: 3000, // Set the duration of the animation in milliseconds
        easing: 'easeInOutQuad', // Set the easing function for the animation
        axis: 'x',
      },
  };

  return (
    <div style={{ height: '400px', width: '600px' }}>
      <Bar data={data} options={chartOptions}/>
    </div>
  );
};

export default BarChart;
