# Quick Setup Guide - GitHub & Netlify Login

## ⚡ Fastest Way to Deploy

### Option 1: Use the Automated Script (Recommended)

```bash
cd /home/user/agb_planner
./setup-github-netlify.sh
```

This script will:
1. ✓ Ask for your GitHub username
2. ✓ Ask for Netlify Site ID
3. ✓ Ask for Netlify Auth Token
4. ✓ Login to GitHub CLI
5. ✓ Add GitHub Secrets automatically
6. ✓ Push code to GitHub
7. ✓ Show you next steps

**Time: ~5 minutes**

---

## Step-by-Step Instructions

### Step 1: Get Netlify Credentials

First, get your Netlify credentials:

```bash
# Login to Netlify first (if not already)
npx netlify login

# Get your Site ID
npx netlify sites:list

# Copy the Site ID from the output
```

Example output:
```
┌─────────────────────────────────────────────────────────┐
│ Your Netlify Sites:                                   │
├─────────────────────────────────────────────────────────┤
│ AGB IT Planner                                        │
│ URL: https://agb-it-planner.netlify.app              │
│ Site ID: abc123def456                                │
└─────────────────────────────────────────────────────────┘
```

Create access token:

```bash
npx netlify api createAccessToken --description "GitHub Actions"
```

Copy the token that appears.

---

### Step 2: Run the Setup Script

```bash
cd /home/user/agb_planner
./setup-github-netlify.sh
```

When prompted:
- **GitHub username:** Your GitHub username (e.g., `agbitsolutions`)
- **Netlify Site ID:** Paste from Step 1
- **Netlify Auth Token:** Paste from Step 1

---

### Step 3: Complete GitHub Login

When prompted:
- Choose `GitHub.com`
- Choose `HTTPS`
- Authenticate with your GitHub credentials

---

### Step 4: Verify

Check that everything worked:

```bash
# Verify GitHub remote
git remote -v

# Should show:
# origin  https://github.com/YOUR-USERNAME/AGB_IT_Planner.git (fetch)
# origin  https://github.com/YOUR-USERNAME/AGB_IT_Planner.git (push)

# Check GitHub Secrets (go to your repo on GitHub.com)
# Settings → Secrets and variables → Actions
# Should see: NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN
```

---

## Manual Setup (If Script Doesn't Work)

### Step 1: GitHub CLI Login

```bash
gh auth login
```

Select:
- `GitHub.com`
- `HTTPS`
- Enter your credentials

### Step 2: Add Remote

```bash
cd /home/user/agb_planner
git remote add origin https://github.com/YOUR-USERNAME/AGB_IT_Planner.git
```

### Step 3: Add Secrets Manually

```bash
gh secret set NETLIFY_SITE_ID --body "your-site-id"
gh secret set NETLIFY_AUTH_TOKEN --body "your-auth-token"
```

### Step 4: Push Code

```bash
git push -u origin main
```

---

## Troubleshooting

### Error: "src refspec main does not match any"

This means the branch is wrong. It should be fixed now (renamed from master to main).

```bash
git branch -a
# Should show: * main
```

### Error: "fatal: remote origin already exists"

```bash
# Remove the old remote
git remote remove origin

# Add the correct one
git remote add origin https://github.com/YOUR-USERNAME/AGB_IT_Planner.git
```

### GitHub CLI Not Installed

```bash
gh --version
```

If not installed, it was installed automatically. Try:
```bash
gh auth login
```

### Netlify Credentials Wrong

Get them again:
```bash
npx netlify sites:list
npx netlify api createAccessToken --description "GitHub Actions"
```

---

## What Happens Next

1. ✅ Code pushed to GitHub
2. ✅ GitHub Actions runs automatically
3. ✅ Frontend tested
4. ✅ Deployed to Netlify
5. ✅ Your site is live at https://agb-it-planner.netlify.app

---

## Quick Commands Reference

```bash
# View git status
git status

# View remote
git remote -v

# Check GitHub login
gh auth status

# Verify Netlify
npx netlify sites:list

# View GitHub Secrets
gh secret list
```

---

**Ready? Run:** `./setup-github-netlify.sh` 🚀

