> [!NOTE]
> This repository represents a completed project stable since 2025. All subsequent commits are strictly limited to documentation updates and cosmetic formatting.

# Secure Svelte Frontend (SSDLC Reference)

The frontend single-page application (SPA) for an advanced task management application. It serves as an SSDLC reference implementation and was built to test a non-standard, custom UX approach for managing tasks.

## Tech Stack

- **Core:** Svelte, TypeScript, Vite
- **UI & Styling:** Skeleton UI, Tailwind CSS
- **Routing & State:** `svelte-spa-router`, Native Svelte stores (writable)
- **API Client:** Native fetch API (configured via Vite environment variables)

## Architecture & Security Hardening

- **Production Containerization:** Built as a lightweight, production-ready Docker image based on Nginx (Alpine) to minimize the attack surface. Nginx is configured to serve static assets and handle SPA client-side routing (fallback to `index.html`).
- **Session Security:** JWT authentication tokens are managed securely through reactive Svelte stores and isolated via browser storage.
- **Network & Ingress Architecture:**
  The frontend is deployed within a secure K3s cluster behind an edge infrastructure layout:

```text
  [ Public Web Traffic ] ──► Cloudflare WAF (DDoS/SSL) ──► Nginx VPS (Reverse Proxy)
                                                                 │
                                                            [ OpenVPN ]
                                                                 │
  [ Isolated Server VLAN ] ◄─── K3s NodePort Service ◄─── Edge Router/FW
```

## DevSecOps Pipeline (GitHub Actions)

The repository integrates into a fully automated Shift-Left CI/CD pipeline executing on self-hosted K3s runners:

```text
Code Change ➔ Git Commit ➔ GitHub Actions (Self-hosted K3s)
                                      │
    ┌─────────────────────────────────┴────────────────────────────────┐
    ▼                                                                  ▼
SCA (Dependabot CVE Scan)                                   SAST (CodeQL & Semgrep Job)
    │                                                                  │
    └─────────────────────────────────┬────────────────────────────────┘
                                      ▼
                             Kaniko (Daemonless Build)
                                      │
                                      ▼
                             K3s Deployment (Internal)
                                      │
                                      ▼
                             DAST (OWASP ZAP Job)
                                      │
                                      ▼
                        SARIF Export ➔ GitHub Security Dashboard
```

1. SAST & SCA: Static code analysis via Semgrep and CodeQL, combined with daily automated dependency vulnerability scans via GitHub Dependabot. Pipeline compilation terminates immediately upon detecting critical vulnerabilities.
2. Daemonless Container Builds: Uses Kaniko inside the K3s cluster to compile the production Svelte application into an Nginx image without requiring root or host Docker socket access.
3. Dynamic Security Audits (DAST): Automated OWASP ZAP scanning targeted directly at internal cluster routing endpoints post-deployment to evaluate raw client/routing application logic.

## Related Repositories

- [ssdlc-fastapi-backend](https://github.com/jarpex/ssdlc-fastapi-backend) — Secure FastAPI RESTful API backend featuring dynamic HashiCorp Vault secret injection and the same DevSecOps infrastructure.
