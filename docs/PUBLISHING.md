# Publish ShipDeadline on GitHub Pages

## One-time account setup

1. In Geoapify MyProjects, create or choose a dedicated production browser key. Restrict it to your deployed site, `https://sarah-voss.github.io` (origin) or the appropriate full site pattern in the HTTP-referrer restriction control. Check Geoapify's documented matching rules and test the final request. Do not use the CORS setting as the access restriction. Keep localhost development on a separate key.
2. In GitHub, open this repository's **Settings → Secrets and variables → Actions → New repository secret**. Name it `GEOAPIFY_API_KEY` and enter the restricted production key there, not in a commit or chat. Browser keys are still visible in the deployed JavaScript; restrictions protect their intended use.
3. Open **Settings → Pages** and choose **GitHub Actions** as the source.
4. Push the tested release changes to `main`. Open **Actions → Publish ShipDeadline** and watch the build and deploy jobs. The workflow also supports **Run workflow** on `main`.
5. Open the URL reported by the deployment. Do not announce the launch until the public site passes the checks below.

No paid service or custom domain is required for this public-repository Pages setup. Review account quotas and provider terms in your own accounts.

## Final public-site checks

- A fresh visit loads both Calculator and Fiscal Deadlines without a missing-module error.
- Search Italy / Milan and Germany / Berlin. Select November 2026 and Standard Truck, then calculate. At the current defaults the latest departure is 26 November and the planning window starts 20 November.
- Edit a valid city: Next disables immediately until a suggestion is chosen.
- Save a fiscal closing date, reload, and confirm it is retained. Do not clear real settings for testing.
- Review a narrow mobile layout and keyboard selection.
- Confirm the production key restrictions allow the site, and that unexpected usage is not appearing in Geoapify statistics.
- Update the README's deployment-target line to a verified Live demo link after the site works.

## Commands

The website is still static HTML/CSS/JavaScript. No runtime package dependencies are required.

```sh
npm test
```

For a local production packaging check, set `GEOAPIFY_API_KEY` through your shell's environment and run `npm run build`. Do not put an actual key in shared command history, documentation or screenshots. `_site/` is ignored and contains the public site only. The GitHub workflow supplies the key automatically from the repository secret.

## Scope of version 1

Full-load road planning between supported European locations only. Other scenarios are labelled as unavailable. Estimates use approximate distances, fixed speeds/allowances and weekends. They do not promise delivery or implement regulatory compliance.

The full-page screenshot is in `docs/screenshot-result.jpg`. It uses fictional example planning data and the real application interface.
