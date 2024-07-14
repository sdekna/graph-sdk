import { graphql_call_internal } from "./graphql_call";
import { graph_utils } from "./graph_utils";


export type CombinedQueryResult = {
  query: string;
  variables: { [key: string]: any };
};

export type QueryObject = {
  query: string;
  variables: { [key: string]: any };
  alias?: string,
  type: any;
} | null;

export function combine_graphql_queries(queries: QueryObject[]): CombinedQueryResult {
  let combinedQueryParts: string[] = [];
  let combinedVariables: { [key: string]: any } = {};
  let variableCounter = 1;
  let globalVariableTypes: { [key: string]: string } = {};

  for (const query of queries) {
    if (!query) continue;
    const currentVariables = query.variables;
    let currentQuery = query.query;

    // Extract the variable types from the query
    const variableTypeMatches = [...currentQuery.matchAll(/\$(\w+):\s*([\w!\[\]]+)/g)];
    let localVariableTypes: { [key: string]: string } = {};
    for (const match of variableTypeMatches) {
      localVariableTypes[match[1]] = match[2];
    }

    // Extract and rename variables in the current query
    let newVariableNames: { [key: string]: string } = {};

    for (const varName in currentVariables) {
      const newVarName = `var${variableCounter}`;
      combinedVariables[newVarName] = currentVariables[varName];
      newVariableNames[varName] = newVarName;
      globalVariableTypes[newVarName] = localVariableTypes[varName];
      variableCounter += 1;
    }

    // Update the query with the new variable names
    for (const oldVarName in newVariableNames) {
      const newVarName = newVariableNames[oldVarName];
      currentQuery = currentQuery.replace(new RegExp(`\\$${oldVarName}`, 'g'), `$${newVarName}`);
      currentQuery = currentQuery.replace(new RegExp(`${oldVarName}:`, 'g'), `${newVarName}:`);
    }
    const queryAlias = query.alias ?? graph_utils.random_string()
    combinedQueryParts.push(currentQuery.replace(/query\s*\(\$.*?\)\s*{/, `${queryAlias}: `).replace(/query\s*{/, `${queryAlias}: `).replace(/}$/, '') + ' ')
  }

  const combinedVariablesKeys = Object.keys(combinedVariables)
  // Create the final combined query
  const variableDeclarations = combinedVariablesKeys
    .map(varName => `$${varName}: ${globalVariableTypes[varName]}`)
    .join(', ');

  const combinedQuery = `query ${combinedVariablesKeys.length > 0 ? `(${variableDeclarations})` : ''} {\n  ${combinedQueryParts.join('\n  ')}\n}`;

  return { query: combinedQuery, variables: combinedVariables };
}


export function combine_graphql_mutations(mutations: QueryObject[]): CombinedQueryResult {
  let combinedQueryParts: string[] = [];
  let combinedVariables: { [key: string]: any } = {};
  let variableCounter = 1;
  let globalVariableTypes: { [key: string]: string } = {};

  for (const mutation of mutations) {
    if (!mutation) continue;
    const currentVariables = mutation.variables;
    let currentQuery = mutation.query;

    // Extract the variable types from the query
    const variableTypeMatches = [...currentQuery.matchAll(/\$(\w+):\s*([\w!\[\]]+)/g)];
    let localVariableTypes: { [key: string]: string } = {};
    for (const match of variableTypeMatches) {
      localVariableTypes[match[1]] = match[2];
    }

    // Extract and rename variables in the current mutation
    let newVariableNames: { [key: string]: string } = {};

    for (const varName in currentVariables) {
      const newVarName = `var${variableCounter}`;
      combinedVariables[newVarName] = currentVariables[varName];
      newVariableNames[varName] = newVarName;
      globalVariableTypes[newVarName] = localVariableTypes[varName];
      variableCounter += 1;
    }

    // Update the query with the new variable names
    for (const oldVarName in newVariableNames) {
      const newVarName = newVariableNames[oldVarName];
      currentQuery = currentQuery.replace(new RegExp(`\\$${oldVarName}`, 'g'), `$${newVarName}`);
      currentQuery = currentQuery.replace(new RegExp(`${oldVarName}:`, 'g'), `${newVarName}:`);
    }
    const mutationAlias = mutation.alias

    combinedQueryParts.push(currentQuery.replace(/^mutation\s*\(.*?\)\s*{/, `${mutationAlias}: `).replace(/}$/, '').trim());
  }

  // Create the final combined query
  const variableDeclarations = Object.keys(combinedVariables)
    .map(varName => `$${varName}: ${globalVariableTypes[varName]}`)
    .join(', ');

  const combinedQuery = `mutation (${variableDeclarations}) {\n  ${combinedQueryParts.join('\n  ')}\n}`;

  return { query: combinedQuery, variables: combinedVariables };
}



type ExtractType<T> = T extends { type: infer U } ? U : never;

export async function batch_queries<T extends QueryObject[]>(operations: T): Promise<{ [K in keyof T]: ExtractType<T[K]> } | null> {
  if (!graph_utils.is_array_valid(operations)) return null;
  const { query, variables } = combine_graphql_queries(operations);

  const final_op = await graphql_call_internal({ query, variables });
  const results = Object.values(final_op as any);

  if (!graph_utils.is_array_valid(results)) return null;

  // Map over the results and assert their types based on the corresponding operation's type
  const results_tmp = results.reduce((acc, result, index) => {
    const operationType = operations[index]?.type;
    if (operationType !== undefined) {
      (acc as any)[index] = result as ExtractType<typeof operationType>;
    }
    return acc;
  }, {})
  return Object.values(results_tmp as any[]) as { [K in keyof T]: ExtractType<T[K]> };

}

export async function batch_mutations<T extends QueryObject[]>(operations: T): Promise<{ [K in keyof T]: ExtractType<T[K]> } | null> {
  if (!graph_utils.is_array_valid(operations)) return null
  const { query, variables } = combine_graphql_mutations(operations)

  const final_op = await graphql_call_internal({ query, variables })
  const results = Object.values(final_op as any)

  if (!graph_utils.is_array_valid(results)) return null
  const results_tmp = results.reduce((acc, result, index) => {
    const operationType = operations[index]?.type;
    if (operationType !== undefined) {
      (acc as any)[index] = result as ExtractType<typeof operationType>;
    }
    return acc;
  }, {})

  return Object.values(results_tmp as any[]) as { [K in keyof T]: ExtractType<T[K]> };
}
