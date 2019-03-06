// Scalar Types
const ScalarTypes = ['String', 'Int']

// Object Type Parser
// ^\s*type\s+(\w+)\s+\{(\s*(\w+)\s*:\s*(String|Int)!?)+\s*\}
const objectTypeParser = inp => {
  let expr = /^\s*type\s+(\w+)\s+\{/
  let match = expr.exec(inp)

  if (match === null) {
    return null
  }

  let remInp = inp.slice(match[0].length)
  const name = match[1]
  const fields = {}

  expr = /^\s*(\w+)\s*:\s*(\w+)(!?)/
  match = expr.exec(remInp)

  while (match !== null) {
    fields[match[1]] = {
      name: match[1],
      type: match[2],
      requried: match[3] === '!'
    }
    // fields.push({
    //   name: match[1],
    //   type: match[2],
    //   requried: match[3] === '!'
    // })
    remInp = remInp.slice(match[0].length)
    match = expr.exec(remInp)
  }

  expr = /^\s*\}/
  match = expr.exec(remInp)

  if (match === null) {
    return null
  }

  return [{
    name: name,
    type: 'Object',
    fields: fields
  }, remInp.slice(match[0].length)]
}

const schemaDefinitionParser = inp => {
  let expr = /^\s*schema\s+\{/
  let match = expr.exec(inp)

  if (match === null) {
    return null
  }

  let remInp = inp.slice(match[0].length)
  const operations = {}

  expr = /^\s*(\w+)\s*:\s*(\w+)/
  match = expr.exec(remInp)

  while (match !== null) {
    operations[match[1]] = match[2]
    remInp = remInp.slice(match[0].length)
    match = expr.exec(remInp)
  }

  expr = /^\s*\}/
  match = expr.exec(remInp)

  if (match === null) {
    return null
  }

  return [{
    name: 'schema',
    type: 'Schema',
    operations: operations
  }, remInp.slice(match[0].length)]
}

//
const SchemaParser = inp => {
  const Schema = {}
  let remInp
  let match = objectTypeParser(inp)

  while (match !== null) {
    Schema[match[0].name] = match[0]
    remInp = match[1]
    match = objectTypeParser(remInp)
  }

  match = schemaDefinitionParser(remInp)

  if (match === null) {
    throw new Error('schema definition not found')
  }

  Schema['schema'] = match[0]

  return Schema
}

module.exports = SchemaParser
