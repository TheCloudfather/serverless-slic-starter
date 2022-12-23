const params = {
  TableName: 'checklists',
  KeyConditionExpression: 'userId = :userId', // a string representing a constraint on the attribute
  ExpressionAttributeValues: {
    // a map of substitutions for all attribute values
    // ':userId': 'eoin'
    ':userId': 'offlineContext_cognitoIdentityId'
  }
}
docClient.query(params, function (err, data) {
  if (err) ppJson(err)
  // an error occurred
  else ppJson(data) // successful response
})
