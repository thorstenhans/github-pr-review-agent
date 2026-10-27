import * as variables from '@spinframework/spin-variables';
import { Context, MiddlewareHandler, Next } from 'hono';
import { createMiddleware } from 'hono/factory'

export interface Config {
  webhookSecret: string
}

export function loadConfig(): Config | undefined {
  const webhookSecret = variables.get("webhook_secret");
  if (!webhookSecret) {
    return undefined;
  }
  return { webhookSecret } as Config;
}

export const loadConfigMiddleware: MiddlewareHandler = createMiddleware<{
  Variables: {
    config: Config
  }
}>(async (c: Context, next: Next) => {
  const cfg = loadConfig();
  if (!cfg) {
    c.status(500);
    return c.text("Invalid Application Configuration");
  }
  c.set('config', cfg);
  return await next();
})
