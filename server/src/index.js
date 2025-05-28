const express = require('express');
const cors = require('cors');
require('dotenv').config();

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const ec2Routes = require('./routes/ec2Routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.get('/', (req, res) => res.send('Backend is up!'));
app.use('/', ec2Routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
