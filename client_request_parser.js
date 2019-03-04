const nameExpr = /[_A-Za-z][_0-9A-Za-z]*/

const fieldParser = inp => {
  let expr = /^\s*([_A-Za-z][_0-9A-Za-z]*)/
  let match = expr.exec(inp)

  if (match === null) {
    return null
  }

  const field = match[1]
  let remInp = inp.slice(match[0].length)
  match = fieldsParser(remInp)

  if (match === null) {
    return [
      { [field]: null },
      remInp
    ]
  }

  return [
    { [field]: match[0] },
    match[1]
  ]
}

const fieldsParser = inp => {
  let expr = /^\s*\{/
  let match = expr.exec(inp)

  if (match === null) {
    return null
  }

  let remInp = inp.slice(match[0].length)
  const fields = {}
  match = fieldParser(remInp)
  while (match !== null) {
    Object.assign(fields, match[0])
    remInp = match[1]
    match = fieldParser(remInp)
  }

  expr = /^\s*\}/
  match = expr.exec(remInp)

  if (match === null) {
    return null
  }

  return [fields, remInp.slice(match[0].length)]
}

const operationDefinitionParser = inp => {
  let expr = /^\s*(query)\s+/
  let match = expr.exec(inp)

  if (match === null) {
    return null
  }

  const opType = match[1]
  const opName = match[1]
  let remInp = inp.slice(match[0].length)
  match = fieldsParser(remInp)

  if (match === null) {
    throw new Error('Invalid OperationDefinition')
  }

  return {
    [opType]: {
      name: opName,
      fields: match[0]
    }
  }
}

module.exports = operationDefinitionParser
