// Serves static assets from the repo root via Workers Static Assets.
// On main: serves index.html, app.html, landscaper.html etc.
// On feature branches: serves the same + features/ subdirectories.
// Preview URL pattern: *-your-green-gardening-wizard.leanspirited.workers.dev

export default {
  fetch(request, env) {
    // Workers Static Assets handles all file serving automatically.
    // ASSETS binding is injected by the runtime when [assets] is configured.
    return env.ASSETS.fetch(request);
  }
};
