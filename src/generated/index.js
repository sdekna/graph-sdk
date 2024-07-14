
import {
  createClient as createClientOriginal,
  assertSameVersion,
  generateGraphqlOperation,
} from '@gqlts/runtime'
var typeMap = linkTypeMap(types)
// export * from './guards.esm'

export var version = "3.2.20-beta.228"
assertSameVersion(version)

export var createClient =
  function (options) {
    options = options || {}
    var optionsCopy = {
      url: "https://graphendpoint.test/v1/graphql",
      // queryRoot: typeMap.Query,
      // mutationRoot: typeMap.Mutation,
      // subscriptionRoot: typeMap.Subscription,
    }
    for (var name in options) {
      optionsCopy[name] = options[name];
    }
    return createClientOriginal(optionsCopy)
  }


export var generateQueryOp = function (fields) {
  return generateGraphqlOperation('query', typeMap.Query, fields)
}
export var generateMutationOp = function (fields) {
  return generateGraphqlOperation('mutation', typeMap.Mutation, fields)
}
export var generateSubscriptionOp = function (fields) {
  return generateGraphqlOperation('subscription', typeMap.Subscription, fields)
}
export var everything = {
  __scalar: true
}
