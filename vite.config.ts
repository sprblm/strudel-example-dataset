import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
import path from 'path';
import fs from 'node:fs';

const ensureDevMetaDir = (targetPath: string) => {
  const directory = path.dirname(targetPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const createDevPortWriterPlugin = (portFilePath: string) => ({
  name: 'write-active-dev-port',
  configureServer(server: import('vite').ViteDevServer) {
    const writePort = () => {
      const addressInfo = server.httpServer?.address();
      if (addressInfo && typeof addressInfo === 'object' && addressInfo.port) {
        ensureDevMetaDir(portFilePath);
        fs.writeFileSync(portFilePath, String(addressInfo.port), 'utf8');
      }
    };

    const cleanup = () => {
      if (fs.existsSync(portFilePath)) {
        fs.rmSync(portFilePath, { force: true });
      }
    };

    if (server.httpServer?.listening) {
      writePort();
    } else {
      server.httpServer?.once('listening', writePort);
    }

    server.httpServer?.once('close', cleanup);
    process.once('exit', cleanup);
  },
});

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd());
  const preferredPort = Number(env.VITE_DEV_SERVER_PORT) || 5175;
  const devPortFile = path.resolve(__dirname, '.temp/dev-server-port');

  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      createDevPortWriterPlugin(devPortFile),
    ],
    base: env.VITE_BASE_URL,
    server: {
      port: preferredPort,
      strictPort: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
