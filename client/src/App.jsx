import { useState } from 'react';
import CpuChart from './components/CpuChart';
import CpuForm from './components/CpuForm';
import { fetchCpuUsage } from './utils/api'; 

function App() {
  const now = new Date();
  const oneHourBack = new Date(now.getTime() - 60 * 60 * 1000);

  const [ip, setIp] = useState('172.31.88.161');
  const [startTime, setStartTime] = useState(oneHourBack);
  const [endTime, setEndTime] = useState(now);
  const [interval, setInterval] = useState('5');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchCpuUsage({ ip, startTime, endTime, interval });
      setChartData(data);
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

      <CpuForm
        ip={ip}
        setIp={setIp}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        interval={interval}
        setInterval={setInterval}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 20 }}>Loading...</p>
      ) : (
        <CpuChart data={chartData} />
      )}
    </div>
  );
}

export default App;
