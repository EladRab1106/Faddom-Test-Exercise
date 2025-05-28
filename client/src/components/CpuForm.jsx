import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CpuForm({
  ip,
  setIp,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  interval,
  setInterval,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
  );
}

export default CpuForm;
