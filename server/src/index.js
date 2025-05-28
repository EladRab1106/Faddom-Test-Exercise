const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// הגדרת אזור AWS מתוך .env
AWS.config.update({ region: process.env.AWS_REGION });

// יצירת אובייקטים לשירותי AWS
const cloudwatch = new AWS.CloudWatch();
const ec2 = new AWS.EC2();

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

/**
 * קצה שמחזיר את רשימת כל ה-EC2 instances בסביבה
 */
app.get('/instances', async (req, res) => {
  try {
    const result = await ec2.describeInstances().promise();

    const instances = [];

    result.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        instances.push({
          instanceId: instance.InstanceId,
          ip: instance.PrivateIpAddress,
          state: instance.State.Name, // "running", "stopped", וכו'
        });
      });
    });

    res.json(instances);
  } catch (error) {
    console.error('Error listing instances:', error);
    res.status(500).json({ error: 'Failed to list EC2 instances' });
  }
});

/**
 * קצה שמחזיר נתוני CPU utilization לפי IP של מכונה וטווח זמן
 */
app.get('/cpu-usage', async (req, res) => {
  try {
    const { ip, startTime, endTime, interval } = req.query;

    if (!ip || !startTime || !endTime || !interval) {
      return res
        .status(400)
        .json({ error: 'Missing required query parameters' });
    }

    // שלב 1: מציאת ה-instance ID לפי כתובת ה-IP
    const ec2Data = await ec2
      .describeInstances({
        Filters: [
          {
            Name: 'private-ip-address',
            Values: [ip],
          },
        ],
      })
      .promise();

    const instance = ec2Data.Reservations?.[0]?.Instances?.[0];

    if (!instance) {
      return res
        .status(404)
        .json({ error: 'Instance not found for the given IP' });
    }

    const instanceId = instance.InstanceId;

    // שלב 2: שליפת נתוני CPUUtilization מה-CloudWatch
    const cwData = await cloudwatch
      .getMetricStatistics({
        Namespace: 'AWS/EC2',
        MetricName: 'CPUUtilization',
        Dimensions: [
          {
            Name: 'InstanceId',
            Value: instanceId,
          },
        ],
        StartTime: new Date(startTime),
        EndTime: new Date(endTime),
        Period: parseInt(interval) * 60,
        Statistics: ['Maximum'], // אפשר לשנות ל-Average במידת הצורך
        Unit: 'Percent',
      })
      .promise();

    console.log('Raw CloudWatch response:', JSON.stringify(cwData, null, 2));

    const results = cwData.Datapoints.map((dp) => ({
      time: dp.Timestamp,
      value: dp.Maximum,
    })).sort((a, b) => new Date(a.time) - new Date(b.time));

    res.json({ instanceId, data: results });
  } catch (error) {
    console.error('Error fetching CPU usage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
