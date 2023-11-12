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
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: dataValues,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
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
