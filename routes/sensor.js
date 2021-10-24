const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

AWS.config.update({
  region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'medpass-api';

router.get('/', async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'sensorId': req.query.sensorId
    }
  }
  await dynamodb.get(params).promise().then(response => {
    res.json(response.Item);
  }, error => {
    console.error('Oh no.', error);
    res.status(500).send(error);
  })
})

router.get('/all', async (req, res) => {
  const params = {
    TableName: dynamodbTableName
  }
  try {
    const allData = await scanDynamoRecords(params, []);
    const body = {
      sensors: allData
    }
    res.json(body);
  } catch(error) {
    console.error('Oh no.', error);
    res.status(500).send(error);
  }
})

router.post('/', authenticateToken, async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Item: req.body
  }
  await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: req.body
    }
    res.json(body);
  }, error => {
    console.error('Oh no.', error);
    res.status(500).send(error);
  })
})

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    throw new Error(error);
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = router;