import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 3000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '2mb' }));

const appState = {
  applications: [],
  banners: [],
  comments: [],
  bannedHandles: [],
  stats: {
    activeUsers: 0,
    hostAgencies: 0,
    totalHosts: 0,
    superAdmins: 0,
    admins: 0,
    bds: 0,
    shippingAgents: 0,
    hostAgents: 0,
    officialRegistrations: 0,
    quickRegistrations: 0,
    dailyActiveLogins: 0,
  },
  customCards: [],
  notifications: [],
  subAdmins: [],
  contactChannels: [],
  tickets: [],
  activities: [],
  attachCount: 0,
  isRatingsLocked: false,
  trashedApplications: [],
};

app.get('/api/state', (_req, res) => {
  res.json(appState);
});

app.post('/api/stats/login-hit', (_req, res) => {
  appState.attachCount += 1;
  appState.stats.dailyActiveLogins = (appState.stats.dailyActiveLogins || 0) + 1;
  res.json({ ok: true });
});

app.post('/api/applications', (req, res) => {
  appState.applications.unshift(req.body);
  res.status(201).json({ ok: true });
});

app.put('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const application = appState.applications.find((item) => item.id === id);
  if (!application) {
    res.status(404).json({ ok: false });
    return;
  }

  Object.assign(application, req.body);
  res.json({ ok: true });
});

app.delete('/api/applications/:id', (req, res) => {
  appState.applications = appState.applications.filter((item) => item.id !== req.params.id);
  res.json({ ok: true });
});

app.post('/api/applications/:id/trash', (req, res) => {
  const item = appState.applications.find((entry) => entry.id === req.params.id);
  if (!item) {
    res.status(404).json({ ok: false });
    return;
  }
  appState.trashedApplications.unshift({
    ...item,
    trashedAt: new Date().toISOString(),
    trashedReason: req.body.reason || 'Moved to trash',
    originalStatusBeforeTrash: item.status,
  });
  appState.applications = appState.applications.filter((entry) => entry.id !== req.params.id);
  res.json({ ok: true });
});

app.post('/api/applications/trash-inactive', (_req, res) => {
  const inactive = appState.applications.filter((entry) => ['rejected', 'waitlist', 'banned'].includes(entry.status));
  inactive.forEach((entry) => {
    appState.trashedApplications.unshift({
      ...entry,
      trashedAt: new Date().toISOString(),
      trashedReason: 'Auto-trashed inactive application',
      originalStatusBeforeTrash: entry.status,
    });
  });
  appState.applications = appState.applications.filter((entry) => !inactive.some((inactiveEntry) => inactiveEntry.id === entry.id));
  res.json({ ok: true, movedCount: inactive.length });
});

app.post('/api/trash/:id/restore', (req, res) => {
  const item = appState.trashedApplications.find((entry) => entry.id === req.params.id);
  if (!item) {
    res.status(404).json({ ok: false });
    return;
  }
  appState.applications.unshift({
    ...item,
    status: item.originalStatusBeforeTrash || 'pending',
  });
  appState.trashedApplications = appState.trashedApplications.filter((entry) => entry.id !== req.params.id);
  res.json({ ok: true });
});

app.post('/api/trash/restore-all', (_req, res) => {
  appState.applications.unshift(...appState.trashedApplications.map((entry) => ({
    ...entry,
    status: entry.originalStatusBeforeTrash || 'pending',
  })));
  appState.trashedApplications = [];
  res.json({ ok: true });
});

app.delete('/api/trash/:id', (req, res) => {
  appState.trashedApplications = appState.trashedApplications.filter((entry) => entry.id !== req.params.id);
  res.json({ ok: true });
});

app.delete('/api/trash', (_req, res) => {
  appState.trashedApplications = [];
  res.json({ ok: true });
});

app.post('/api/comments', (req, res) => {
  appState.comments.unshift(req.body);
  res.status(201).json({ ok: true });
});

app.delete('/api/comments/:id', (req, res) => {
  appState.comments = appState.comments.filter((item) => item.id !== req.params.id);
  res.json({ ok: true });
});

app.post('/api/comments/ban', (req, res) => {
  const { authorHandle } = req.body;
  if (authorHandle) appState.bannedHandles.push(String(authorHandle).toLowerCase());
  res.json({ ok: true });
});

app.post('/api/comments/unban', (req, res) => {
  const { authorHandle } = req.body;
  if (authorHandle) {
    appState.bannedHandles = appState.bannedHandles.filter((handle) => handle !== String(authorHandle).toLowerCase());
  }
  res.json({ ok: true });
});

app.post('/api/banners', (req, res) => {
  appState.banners.unshift(req.body);
  res.status(201).json({ ok: true });
});

app.put('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  const index = appState.banners.findIndex((banner) => banner.id === id);
  if (index === -1) {
    res.status(404).json({ ok: false });
    return;
  }
  appState.banners[index] = { ...appState.banners[index], ...req.body };
  res.json({ ok: true });
});

app.delete('/api/banners/:id', (req, res) => {
  appState.banners = appState.banners.filter((banner) => banner.id !== req.params.id);
  res.json({ ok: true });
});

app.put('/api/activities', (req, res) => {
  appState.activities = req.body.activities || [];
  res.json({ ok: true });
});

app.put('/api/stats', (req, res) => {
  appState.stats = { ...appState.stats, ...req.body.stats };
  res.json({ ok: true });
});

app.put('/api/custom-cards', (req, res) => {
  appState.customCards = req.body.customCards || [];
  res.json({ ok: true });
});

app.post('/api/sub-admins', (req, res) => {
  appState.subAdmins.unshift({ ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() });
  res.status(201).json({ ok: true });
});

app.delete('/api/sub-admins/:id', (req, res) => {
  appState.subAdmins = appState.subAdmins.filter((admin) => admin.id !== req.params.id);
  res.json({ ok: true });
});

app.post('/api/notifications', (req, res) => {
  appState.notifications.unshift(req.body);
  res.status(201).json({ ok: true });
});

app.delete('/api/notifications/:id', (req, res) => {
  appState.notifications = appState.notifications.filter((item) => item.id !== req.params.id);
  res.json({ ok: true });
});

app.put('/api/contact-channels', (req, res) => {
  appState.contactChannels = req.body.channels || [];
  res.json({ ok: true });
});

app.post('/api/tickets', (req, res) => {
  const ticket = {
    ...req.body,
    id: `tkt-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  appState.tickets.unshift(ticket);
  res.status(201).json({ ticket });
});

app.put('/api/tickets/:id', (req, res) => {
  const ticket = appState.tickets.find((item) => item.id === req.params.id);
  if (!ticket) {
    res.status(404).json({ ok: false });
    return;
  }
  Object.assign(ticket, req.body);
  res.json({ ok: true });
});

app.delete('/api/tickets/:id', (req, res) => {
  appState.tickets = appState.tickets.filter((ticket) => ticket.id !== req.params.id);
  res.json({ ok: true });
});

app.put('/api/ratings-lock', (req, res) => {
  appState.isRatingsLocked = Boolean(req.body.isRatingsLocked);
  res.json({ ok: true });
});

const isDev = !fs.existsSync(path.join(__dirname, 'dist'));

if (isDev) {
  const vite = await import('vite');
  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(viteServer.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Vibers V Global app running at http://localhost:${port}`);
});
