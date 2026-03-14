# Fix: "No repositories found" / "An error occurred" when connecting GitHub to Render

This happens when Render’s GitHub app doesn’t have access to your account or org. Fix it on **GitHub**, then try again in Render.

---

## Step 1: Open GitHub’s Render app page

Go to this link (logged into GitHub):

**https://github.com/apps/render**

Click **“Configure”** (or **“Install”** if you never installed it).

---

## Step 2: Choose where to install

- If your repos are under your **personal account**: choose **your username**.
- If your repos are under an **organization**: choose **that organization**.

Then click **“Install”** or **“Save”**.

---

## Step 3: Grant access to repos

On the next screen, under **“Repository access”**:

- Choose **“All repositories”**, or  
- **“Only select repositories”** and pick the backend/frontend repos you want to deploy.

Then **“Save”** or **“Install”**.

---

## Step 4: If the repo is in an organization

- An **organization owner** may need to approve the app:  
  **GitHub → Your org → Settings → Third-party access** (or **Installed GitHub Apps**) → find **Render** → **Approve**.
- If the org uses **SAML SSO**: in the same place, click **“Authorize”** (or **“Grant”**) next to Render for SSO.

---

## Step 5: Try again in Render

1. In Render, go to the page where you connect a repo.
2. If you see **“Configure account”** or **“Reconnect”** next to GitHub, click it and go through the GitHub flow again.
3. Then choose **“Connect repository”** and pick your repo.

---

## If it still says “An error occurred”

- **Disconnect and reconnect**: In Render Dashboard → **Account Settings** (or **Workspace Settings**) → find the GitHub connection → **Disconnect**. Then connect GitHub again and authorize.
- **Different browser**: Try in an incognito/private window or another browser (no extensions).
- **Different GitHub account**: Make sure you’re logged into the GitHub account that actually owns (or has access to) the repo.
- **Wait a few minutes** after changing permissions on GitHub, then try again in Render.

---

## Quick checklist

| Step | What to do |
|------|------------|
| 1 | Open **https://github.com/apps/render** and click Configure. |
| 2 | Install/configure for **your user** or **your organization** (where the repo lives). |
| 3 | Set **Repository access** to “All” or select your backend/frontend repos. |
| 4 | If org: have an owner **approve** Render and **authorize SSO** if the org uses it. |
| 5 | In Render, use **Configure account** / **Reconnect** for GitHub, then connect the repo again. |

After this, “No repositories found” and “An error occurred” should stop and you can select your repo in Render.
