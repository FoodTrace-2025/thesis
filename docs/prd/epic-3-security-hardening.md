### Epic 3: Security Hardening

**Priority:** 🔴 Must Have (Tier 1) + 🟡 Should Have (Tier 2)
**Estimated Time:** 4.5 hours (Tier 1) + 9 hours (Tier 2) + 3 hours (Tier 3) = 16.5 hours total
**Assigned:** TaiSheng (Lead, 10-13 hours), Sam (Support, 2-3 hours), YiLing (Process, 0 hours)
**Timeline:** Week 3-4 (parallel with Epic 1)
**Dependencies:** Epic 1 (Project Setup), Epic 0.5 (Company Management)

**Note:** This epic was created in Session 4 based on architecture risk assessment. See full specification earlier in this document (Epic 3: Security Hardening section with 3 tiers).

#### Epic Description (Summary)

Implement production-grade security controls to protect custodial wallets, prevent cross-tenant data leaks, and establish security best practices. Addresses three critical concerns: custodial wallet security, multi-tenant data isolation, and development process security.

#### Three-Tier Approach

**Tier 1: MUST HAVE (4.5 hours - CRITICAL):**

- Proven encryption library (AES-256-CBC) for wallet private keys
- Environment variable security (.env.local in .gitignore)
- Prisma tenant middleware (automatic companyId filtering)
- Component library early start (timing shift)
- Pair programming schedule (process change)

**Tier 2: SHOULD HAVE (9 hours - High Value):**

- Database RLS + audit logging
- Cross-tenant integration tests
- Input validation + SQL injection prevention
- Team component contributions (Sam/TaiSheng help YiLing)

**Tier 3: NICE TO HAVE (3 hours - Optional):**

- Key rotation strategy documentation
- Supabase Row Level Security policies
- Code review security checklist
- Chakra UI Pro ($49 option)

#### Acceptance Criteria (Epic Level)

- ✅ **Tier 1 Complete** - All MUST HAVE requirements implemented and tested
- ✅ **Wallet Security Verified** - Can encrypt/decrypt private keys, no keys in git
- ✅ **Tenant Isolation Verified** - Integration tests pass, Company A cannot see Company B data
- ✅ **Security Audit Passed** - Sam reviews TaiSheng's implementation
- ✅ **Documentation Complete** - docs/architecture/security.md exists
- ⚠️ **Tier 2 Recommended** - SHOULD HAVE items provide significant value
- ⚪ **Tier 3 Optional** - Only if time permits

#### Dependencies

**Requires:** Epic 1, Epic 2
**Blocks:** Epic 5 (Product Registration - cannot register products until wallet encryption working)

**For full details:** See earlier Epic 3 specification with code examples, mitigation strategies, and risk assessment.
