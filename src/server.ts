import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { execSync } from 'child_process';

// 在服务器启动时加载 Coze 环境变量
function loadCozeEnvVars() {
	if (process.env.COZE_SUPABASE_URL && process.env.COZE_SUPABASE_ANON_KEY) {
		console.log('[Server] Coze env vars already loaded');
		return;
	}

	try {
		const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;

		const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
			encoding: 'utf-8',
			timeout: 10000,
			stdio: ['pipe', 'pipe', 'pipe'],
		});

		const lines = output.trim().split('\n');
		for (const line of lines) {
			if (line.startsWith('#')) continue;
			const eqIndex = line.indexOf('=');
			if (eqIndex > 0) {
				const key = line.substring(0, eqIndex);
				let value = line.substring(eqIndex + 1);
				if (
					(value.startsWith("'") && value.endsWith("'")) ||
					(value.startsWith('"') && value.endsWith('"'))
				) {
					value = value.slice(1, -1);
				}
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
		}
		console.log('[Server] Coze env vars loaded successfully');
	} catch (e) {
		console.error('[Server] Failed to load Coze env vars:', e);
	}
}

// 立即加载环境变量
loadCozeEnvVars();

const dev = process.env.COZE_PROJECT_ENV !== 'PROD';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '5000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });
  server.once('error', err => {
    console.error(err);
    process.exit(1);
  });
  server.listen(port, () => {
    console.log(
      `> Server listening at http://${hostname}:${port} as ${
        dev ? 'development' : process.env.COZE_PROJECT_ENV
      }`,
    );
  });
});
