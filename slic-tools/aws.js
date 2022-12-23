'use strict'

const awsXray = require('aws-xray-sdk-core')
const coreAws = require('aws-sdk')
/* istanbul ignore next */
const AWS = process.env.IS_OFFLINE || process.env.SLIC_STAGE === 'test' ? coreAws : awsXray.captureAWS(coreAws) // TODO - Revisit this to enable XRay always

const defaultOptions = {
  // If this is not set, empty strings cause an error. This converts them automatically to NULL
  convertEmptyValues: true,
  // Prevent long-running retry loops caused by the default SDK DDB retry count of 10 with
  // exponential backoff with dealys up to 25 seconds
  maxRetries: 3
}

/*
 * Adapted from https://github.com/99xt/serverless-dynamodb-client/blob/master/index.js
 */

const localDynamoPort = process.env.DYNAMODB_LOCAL_PORT || 8000

const options = process.env.IS_OFFLINE
  ? {
      region: 'localhost',
      endpoint: `http://localhost:${localDynamoPort}`,
      ...defaultOptions
    }
  : defaultOptions

function dynamoDocClient () {
  return new AWS.DynamoDB.DocumentClient(options)
}

module.exports = {
  dynamoDocClient,
  AWS
}
