import { Hono } from 'hono';
import { fire } from 'hono/service-worker';
import type { Context, Next } from 'hono';
import { logger } from 'hono/logger';
import { Config, loadConfigMiddleware } from './config';


let app = new Hono();
app.use(loadConfigMiddleware);
app.use(logger());

app.post("/webhooks/pr", async (c: Context) => {
  const config: Config = c.var.config;

  // housekeeping
  const contentType = c.req.header("content-type");
  if (!contentType || contentType !== "application/json") {
    c.status(415);
    return c.text("Unsupported MediaType");
  }
  c.status(200);
  return c.text("Ok");
})

fire(app, { fetch: undefined });

