# How to run locally (no download, use what’s in the folder)

Nothing is downloaded from GitHub. The script uses the **backend** and **frontend** folders that are already in MiniProject.

---

## Unzip, then run

### 1. Unzip

Unzip **MiniProject** somewhere (e.g. Desktop). You should see a folder with `backend`, `frontend`, and `run-local.bat` (Windows) or `run-local.sh` (Linux/Mac) inside.

### 2. Go to that folder

**Linux / macOS:** Open a terminal and go into the unzipped folder:

```bash
cd path/to/MiniProject
```

(Replace `path/to/MiniProject` with the real path, e.g. `~/Desktop/MiniProject`.)

**Windows:** Open File Explorer and go into the unzipped **MiniProject** folder.

### 3. Run

**Linux / macOS:** In the terminal (in the MiniProject folder), run:

```bash
./run-local.sh
```

**Windows:** Double‑click **run-local.bat** (or in Command Prompt run `run-local.bat` from that folder). If Node.js/npm is missing, the script will auto-download a local portable Node.js into `.tools/node` and continue (no admin install needed). Keep the window open while it runs.

### 4. Open the app

When the frontend is up, open in your browser: **http://localhost:3000**

---

## Summary

| Do this | Where | Run what |
|--------|--------|----------|
| Unzip MiniProject | Anywhere (e.g. Desktop) | — |
| Open terminal (Linux/Mac) or folder (Windows) | **Inside** the unzipped MiniProject folder | **Linux/Mac:** `./run-local.sh` |
| | | **Windows:** double‑click `run-local.bat` |
| Open in browser | — | http://localhost:3000 |

You need **Python 3**. On Windows, **Node.js/npm can be auto-bootstrapped** by `run-local.bat` if missing. **PostgreSQL is optional:** if it is not installed or not running on port 5432, the script uses SQLite so the app still runs. To use PostgreSQL instead, see **backend/POSTGRES-SETUP.md**.
