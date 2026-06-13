# Custom Domain Deployment Guide: lukasfiller.com

This guide outlines how to link your GoDaddy domain `lukasfiller.com` to the GitHub Pages dashboard.

## 1. GoDaddy DNS Configuration
Log in to your GoDaddy DNS Management panel and add/update the following records.

### A Records (Root Domain)
Point the main domain (`@`) to GitHub's servers by adding **four** A records:

| Type | Name | Value |
| :--- | :--- | :--- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

### CNAME Record (WWW Subdomain)
Ensure `www.lukasfiller.com` also points to your dashboard:

| Type | Name | Value |
| :--- | :--- | :--- |
| CNAME | www | loni415.github.io. |

---

## 2. GitHub Pages Settings
Once DNS records are saved at GoDaddy:

1.  Open [GitHub Repository Settings](https://github.com/loni415/castles_1/settings/pages).
2.  **Custom Domain:** Verify `lukasfiller.com` is entered and saved. (The `CNAME` file is already in your repo).
3.  **DNS Check:** GitHub will check your DNS records. This can take 15 minutes to 24 hours.
4.  **Enforce HTTPS:** Once the DNS check passes, check the **Enforce HTTPS** box.

---

## 3. Local Development & Testing
To preview the dashboard locally:
```bash
python3 -m http.server 8080
```
Then visit: `http://localhost:8080`
