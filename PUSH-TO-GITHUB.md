# Push MiniProject to your GitHub

Nested git repos (backend, frontend, workflow) are removed. One repo at root is ready.

## 1. Create a new repo on GitHub

On GitHub: **New repository** → choose a name (e.g. `MiniProject` or `SE-CodeCrafters-MiniProject`) → **Create repository** (do not add README, .gitignore, or license).

## 2. Add remote and push

In a terminal, from the MiniProject folder:

```bash
cd ~/Desktop/MiniProject

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and the repo name you created.

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

After this, the whole project (backend, frontend, workflow, scripts, docs) will be on your GitHub.
