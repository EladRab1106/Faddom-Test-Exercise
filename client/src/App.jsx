import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CpuChart from './CpuChart';

function App() {
  const now = new Date();
  const oneHourBack = new Date(now.getTime() - 60 * 60 * 1000);

  const [ip, setIp] = useState('172.31.88.161');
  const [startTime, setStartTime] = useState(oneHourBack);
  const [endTime, setEndTime] = useState(now);
  const [interval, setInterval] = useState('5');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCpuData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.get('http://localhost:3001/cpu-usage', {
        params: {
          ip,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          interval,
        },
      });

      setChartData(res.data.data);
    } catch (err) {
      console.error('Failed to load CPU data:', err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>AWS CPU Usage Viewer</h1>

      <form onSubmit={fetchCpuData} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Instance IP"
        />

        <label>Start Time:</label>
        <DatePicker
          selected={startTime}
          onChange={(date) => setStartTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={5}
          dateFormat="Pp"
        />

        <label>End Time:</label>
        <DatePicker
          selected={endTime}
          onChange={(date) => setEndTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={5}
          dateFormat="Pp"
        />

        <label>Interval (minutes):</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          min="1"
        />

        <button type="submit">Fetch Data</button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 20 }}>Loading...</p>
      ) : (
        <CpuChart data={chartData} />
      )}
    </div>
  );
}

export default App;
