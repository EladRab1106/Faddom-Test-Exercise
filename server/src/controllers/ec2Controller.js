const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();
const cloudwatch = new AWS.CloudWatch();

exports.listInstances = async (req, res) => {
  try {
    const result = await ec2.describeInstances().promise();

    const instances = result.Reservations.flatMap((reservation) =>
      reservation.Instances.map((instance) => ({
        instanceId: instance.InstanceId,
        ip: instance.PrivateIpAddress,
        state: instance.State.Name,
      }))
    );

    res.json(instances);
  } catch (err) {
    console.error('Failed to fetch instances:', err);
    res.status(500).json({ error: 'Could not retrieve instances list' });
  }
};

exports.getCpuUsage = async (req, res) => {
  const { ip, startTime, endTime, interval } = req.query;

  if (!ip || !startTime || !endTime || !interval) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const describeRes = await ec2
      .describeInstances({
        Filters: [{ Name: 'private-ip-address', Values: [ip] }],
      })
      .promise();

    const instance = describeRes.Reservations?.[0]?.Instances?.[0];

    if (!instance) {
      return res.status(404).json({ error: 'No instance found for this IP' });
    }

    const instanceId = instance.InstanceId;

    const metricsRes = await cloudwatch
      .getMetricStatistics({
        Namespace: 'AWS/EC2',
        MetricName: 'CPUUtilization',
        Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
        StartTime: new Date(startTime),
        EndTime: new Date(endTime),
        Period: parseInt(interval) * 60,
        Statistics: ['Maximum'],
        Unit: 'Percent',
      })
      .promise();

    const datapoints = (metricsRes.Datapoints || [])
      .map((dp) => ({
        time: dp.Timestamp,
        value: dp.Maximum,
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));

    res.json({ instanceId, data: datapoints });
  } catch (err) {
    console.error('Error retrieving CPU data:', err);
    res.status(500).json({ error: 'Could not retrieve CPU usage data' });
  }
};
