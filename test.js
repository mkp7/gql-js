const fs = require('fs')
const Server = require('../turbo-http2')
const GraphQL = require('./main')

const options = {
  key: fs.readFileSync('../localhost-key.pem'),
  cert: fs.readFileSync('../localhost.pem')
}

const app = new Server()

app.static('/public')

// GraphQL config
// Parse GraphQL Schema
const RawSchema = fs.readFileSync('schema.graphql', { encoding: 'utf8' })
const Schema = GraphQL.SchemaParser(RawSchema)
console.log(Schema)

// Test GraphQL OperationDefinition parser
const RawOperation = fs.readFileSync('test_query.txt', { encoding: 'utf8' })
const Operation = GraphQL.operationDefinitionParser(RawOperation)
console.log(Operation)

app.get('/', (req, res) => {
  res.body = 'Hello World, from GeekSkool.'

  return res
})

app.post('/graphql-api', (req, res) => {
  console.log(req.body.toString('utf8'))

  res.body = 'pong'

  return res
})

app.listen(3100, options)
