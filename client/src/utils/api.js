import axios from 'axios';

export const fetchCpuUsage = async ({ ip, startTime, endTime, interval }) => {
  const response = await axios.get('http://localhost:3001/cpu-usage', {
    params: {
      ip,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      interval,
    },
  });
  return response.data.data;
};
