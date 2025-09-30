export type MCPServerType = 'serena' | 'playwright' | 'github';

export interface MCPServerConnectionDefinition {
  /** Identifies the MCP server integration type. */
  type: MCPServerType;
  /** Human friendly name surfaced in dashboards and logs. */
  name: string;
  /** Resolved endpoint URI used when establishing the MCP link. */
  endpoint: string;
  /** Allows disabling connections without removing configuration. */
  enabled: boolean;
}

export interface MCPAgentConnection {
  /** Stable identifier that maps to the consuming agent. */
  agentId: string;
  /** Display label surfaced to coordination tooling. */
  displayName: string;
  /** Optional description for documentation surfaces. */
  description?: string;
  /** MCP server connections the agent should establish. */
  servers: MCPServerConnectionDefinition[];
}

const boolFromEnv = (value: string | boolean | undefined, fallback = true) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() !== 'false' && value !== '0';
  }
  return fallback;
};

const serenaEndpoint =
  (import.meta.env.VITE_MCP_SERVER_SERENA_ENDPOINT as string | undefined) ||
  'http://localhost:4100';
const playwrightEndpoint =
  (import.meta.env.VITE_MCP_SERVER_PLAYWRIGHT_ENDPOINT as string | undefined) ||
  'http://localhost:4200';
const githubEndpoint =
  (import.meta.env.VITE_MCP_SERVER_GITHUB_ENDPOINT as string | undefined) ||
  'https://api.github.com';

const serenaEnabled = boolFromEnv(
  import.meta.env.VITE_MCP_SERVER_SERENA_ENABLED,
  true
);
const playwrightEnabled = boolFromEnv(
  import.meta.env.VITE_MCP_SERVER_PLAYWRIGHT_ENABLED,
  true
);
const githubEnabled = boolFromEnv(
  import.meta.env.VITE_MCP_SERVER_GITHUB_ENABLED,
  true
);

const baseServers: MCPServerConnectionDefinition[] = [
  {
    type: 'serena',
    name: 'Serena MCP Server',
    endpoint: serenaEndpoint,
    enabled: serenaEnabled,
  },
  {
    type: 'playwright',
    name: 'Playwright MCP Server',
    endpoint: playwrightEndpoint,
    enabled: playwrightEnabled,
  },
  {
    type: 'github',
    name: 'GitHub MCP Server',
    endpoint: githubEndpoint,
    enabled: githubEnabled,
  },
];

const agentDefinitions: Array<{
  agentId: string;
  displayName: string;
  description?: string;
}> = [
  { agentId: 'claude', displayName: 'Claude' },
  { agentId: 'gemini', displayName: 'Gemini' },
  { agentId: 'quinn', displayName: 'Quinn' },
  { agentId: 'opencode', displayName: 'OpenCode' },
  { agentId: 'crush', displayName: 'Crush' },
  { agentId: 'coding', displayName: 'Coding Agents' },
];

const cloneAndFilterServers = () =>
  baseServers
    .filter((server) => server.enabled)
    .map((server) => ({ ...server }));

export const mcpAgentConnections: MCPAgentConnection[] = agentDefinitions.map(
  ({ agentId, displayName, description }) => ({
    agentId,
    displayName,
    description,
    servers: cloneAndFilterServers(),
  })
);

export const getMCPAgentConnection = (agentId: string) =>
  mcpAgentConnections.find((agent) => agent.agentId === agentId);

export const listEnabledMCPServers = () => cloneAndFilterServers();
