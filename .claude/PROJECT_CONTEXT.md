# Project Context - Bank Dhofar Open Banking

> **PURPOSE**: Read this FIRST when starting a new session.

## Quick Status

| Item | Value |
|------|-------|
| **Last Updated** | 2026-01-22 |
| **Current Phase** | Phase 1 - Documentation & Design Complete |
| **Active Branch** | main |
| **Blocking Issues** | None |
| **Next Action** | Begin implementation of Consent Service |

## Current Session State

### Last Completed Work
- Created consolidated API Specification Guide PDF
- Analyzed OBIE v4.0 OpenAPI specifications
- Created Consent Service Technical Design document
- Created API Mapping document (Bank Dhofar → OBIE)
- Researched CBO vs FAPI vs OBIE security requirements
- Added India (Account Aggregator) and Turkey to market comparison

### Uncommitted Changes
- `api-catalog/docs/consent-service-design.md` - Full technical design
- `api-catalog/docs/api-mapping-obie.md` - API endpoint mapping
- `obie-specs/` - Cloned OBIE OpenAPI specifications from GitHub

### Pending Tasks
- [ ] Implementation Phase 1: Consent Service Core
- [ ] Implementation Phase 2: AIS Adapter Layer
- [ ] Implementation Phase 3: PIS Adapter Layer
- [ ] Implementation Phase 4: Production & Compliance

## Key Decisions Made

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-22 | Use FAPI 2.0 + OBIE specs | FAPI for security, OBIE for API specification |
| 2026-01-22 | Adapter pattern for integration | Transform existing APIs to OBIE format |
| 2026-01-22 | Integrate consent with DEH mobile | Existing mobile app for customer authorization |
| 2026-01-22 | 180-day consent expiry (CBO) | More lenient than OBIE's 90 days |

## Critical File Locations

| Purpose | File |
|---------|------|
| API Specification Guide HTML | `/vagrant/git/open-banking/api-catalog/api-specification-guide.html` |
| CSS Styles | `/vagrant/git/open-banking/api-catalog/assets/styles.css` |
| Generated PDF | `/vagrant/git/open-banking/Bank_Dhofar_API_Specification_Guide_V1.3.pdf` |
| Consent Service Design | `/vagrant/git/open-banking/api-catalog/docs/consent-service-design.md` |
| API Mapping Document | `/vagrant/git/open-banking/api-catalog/docs/api-mapping-obie.md` |
| OBIE Specs (cloned) | `/vagrant/git/open-banking/obie-specs/` |

## Open Questions

1. Finacle integration timeline for standing orders / scheduled payments
2. DEH mobile app team availability for consent screen development
3. CBO formal approval process for Open Banking certification

## Technical Stack

| Component | Technology |
|-----------|------------|
| API Gateway | Istio/Envoy (existing) |
| Auth Server | Keycloak (FAPI 2.0 capable) |
| Mobile App | DEH (Infosys) |
| Core Banking | Finacle |
| E-Mandate | CBO/ProgressSoft |
| Consent DB | PostgreSQL (new) |

## Security Profile Summary

```
FAPI 2.0 Profile:
├── OAuth 2.0 with PKCE (S256)
├── mTLS for client authentication
├── Signed JWTs (PS256)
├── Pushed Authorization Requests (PAR)
└── Token binding via certificate thumbprint

CBO Additional Requirements:
├── Arabic language support (bilingual)
├── Data residency within Oman
├── 24-hour incident reporting
└── 99.5% API availability SLA
```
