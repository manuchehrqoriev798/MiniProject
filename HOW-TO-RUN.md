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

**Windows:** Double‑click **run-local.bat** (or in Command Prompt run `run-local.bat` from that folder). It starts the backend in a new window, then the frontend. Keep the **Backend** window open. If you see “ERR_CONNECTION_REFUSED” when logging in, the backend is not running: leave the Backend window open and try again.

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

You need **Python 3** and **Node.js** (and npm) installed. No Git needed.
