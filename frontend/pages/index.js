import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import { useState } from 'react';
import Link from 'next/link';
import "moment/locale/bg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { snmpApi } from '../config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
);

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
  animation: false,

  scales: {
    xAxis: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10
      }
    }
  }
};

moment.locale("bg");

export async function getServerSideProps(context) {
  let { deviceId, startDate, endDate } = context.query;
  if (!deviceId) {
    deviceId = 1;
  }
  if (!startDate) {
    startDate = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'); //one week back
  }
  if (!endDate) {
    endDate = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  // Fetch data from external API
  const measurementsResponse = await fetch(`${snmpApi}/measurements?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`)
  const measurements = await measurementsResponse.json()

  const deviceResponse = await fetch(`${snmpApi}/device?id=${deviceId}`)
  const { device } = await deviceResponse.json();

  // Pass measurements to the page via props
  return { props: { measurements, device } }
}


export default function HomePage({ measurements, device }) {
  const [startDate, handleStartDate] = useState(new Date());
  const [endDate, handleEndDate] = useState(new Date());
  const [apiData, setApiData] = useState(null)
  
  const measurementsData = apiData || measurements;

  const chartData = {
    labels: measurementsData.measures.map((measurement) => moment(measurement.timestamp).format('dddd, MMMM Do YYYY, HH:mm:ss')),
    datasets: [
      {
        label: '??????????????????????',
        data: measurementsData.measures.map(({ raw_measurement: x }) => eval(device.expression)),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  }

  chartOptions.plugins.title.text = device.expressionName;

  return (
    <div>
      <style jsx>{`
        .date-range-filter {
          display: flex;
          justify-content: space-between;
          width: 470px;
          margin-bottom: 15px;
        }
        .links {
          margin-bottom: 15px;
        }
        .links > a {
          margin-right: 15px;
          text-decoration: none;
        }
      `}</style>
      <div className='links'>
        <Link href="/devices"><a>????????????????????</a></Link>
        <Link href="/expressions"><a>????????????</a></Link>
      </div>
      <div className='date-range-filter'>
        <Datetime value={startDate} onChange={handleStartDate} />
        <Datetime value={endDate} onChange={handleEndDate} />
        <button onClick={async () => {
          const res = await fetch(`/api/getMeasurementsByDate?startDate=${moment(startDate).format('YYYY-MM-DD HH:mm:ss')}&endDate=${moment(endDate).format('YYYY-MM-DD HH:mm:ss')}&deviceId=${device.id}`);
          const data = await res.json()
          setApiData(data);
        }}>Submit</button>
      </div>
      <div>
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  )
}
