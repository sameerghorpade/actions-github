GitHub Actions — Quick Revision Cheatsheet

# Workflows & Events
- Workflow file: `.github/workflows/<name>.yml` — defines CI/CD pipeline.
- Trigger (`on:`): `push`, `pull_request`, `workflow_dispatch` (manual), `issues`, etc.
- Event payload available via `github` context (e.g., `github.event_name`).

# Jobs & Steps
- Job: `jobs.<id>` runs on a runner (`runs-on: ubuntu-latest`). Use `needs:` to depend on other jobs.
- Step: ordered commands within a job; either `uses:` (action) or `run:` (shell).
- Use `id:` on steps to reference outputs: `${{ steps.<id>.outputs.<name> }}`.

# What to put where (cheat)
- Workflow-level: `on:`, `concurrency:`, top-level `env:`, `permissions:`.
- Job-level: `runs-on:`, `needs:`, `strategy:`, `env:`, `outputs:`.
- Step-level: `uses: ...`, `with:`, `run: ...`, step `env:`.

# Cancelling & Skipping
- Cancel older runs (concurrency):
```yaml
concurrency:
  group: ${{ github.ref }}
  cancel-in-progress: true
```
- Skip by paths: `paths` / `paths-ignore` under `on: push`/`pull_request`.
- Skip by commit message: use `if: "!contains(github.event.head_commit.message, '[skip ci]')"` on job/step.
- Conditional skip: use `if:` expressions on jobs/steps.

# Artifacts (upload/download)
- Upload (required `path`):
```yaml
- uses: actions/upload-artifact@v5
  with:
    name: build-artifact
    path: dist
```
- Download:
```yaml
- uses: actions/download-artifact@v5
  with:
    name: build-artifact
    path: dist
```
- Artifacts are tied to a workflow run; set `retention-days` if needed.

# NPM caching & reuse
- Fast option: `setup-node` with cache:
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: 18
    cache: 'npm'
- run: npm ci
```
- Custom cache using `actions/cache` keyed on `package-lock.json`:
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-
- run: npm ci
```
- To share exact `node_modules` between jobs, upload as artifact (heavier) and download in consumer job.

# Running local binaries (vite, webpack) in CI
- If `vite` is a devDependency, ensure devDeps are installed in each job that builds:
```yaml
- run: npm ci --include=dev
```
- Run local binary reliably:
```yaml
- run: npm exec vite -- build
# or
- run: npx vite build
```

# Job outputs -> use in another job
- Producer job sets step output via `GITHUB_OUTPUT` and declares job output:
```yaml
jobs:
  produce:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.set_version.outputs.version }}
    steps:
      - id: set_version
        run: |
          echo "version=1.2.3" >> $GITHUB_OUTPUT
```
- Consumer job reads with `needs`:
```yaml
jobs:
  consume:
    needs: produce
    runs-on: ubuntu-latest
    steps:
      - run: echo "Version: ${{ needs.produce.outputs.version }}"
```

# Env variables — types & use
- Scopes: workflow-level `env`, job-level `env`, step-level `env`, and `secrets`.
- Persist during run: write to `$GITHUB_ENV` in a step:
```bash
echo "MY_VAR=hello" >> $GITHUB_ENV
```
- Set step output: write to `$GITHUB_OUTPUT`:
```bash
echo "result=ok" >> $GITHUB_OUTPUT
```
- Access: `${{ env.MY_VAR }}`, `${{ secrets.MY_SECRET }}` in expressions; `$MY_VAR` in shell.
- Use secrets for credentials; env for config; outputs for job-to-job values.

# Quick exam-memory checklist
- Workflow: `.github/workflows/*.yml` — `on:`, `jobs:`.
- Jobs: `runs-on`, `needs`, `steps`.
- Artifacts need `path` to upload; download by `name`.
- Use `npm exec` / `npx` to run local tools.
- Cache npm with `setup-node` `cache: 'npm'` or `actions/cache` keyed on lockfile.
- Pass values between jobs with job `outputs` + `needs`.

# Quick conversion commands (create PDF locally)
- Using pandoc (if installed):
```bash
pandoc docs/gh-actions-cheatsheet.md -o docs/gh-actions-cheatsheet.pdf
```
- Using Chrome / Chromium (headless):
```bash
# open docs/gh-actions-cheatsheet.html in browser and Print -> Save as PDF
# or use headless chrome via puppeteer or wkhtmltopdf
```

---
Generated on: 30 Nov 2025
