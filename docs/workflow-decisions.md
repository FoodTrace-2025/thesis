# Development Workflow Decisions

**Created:** Session 29 (2025-11-26)
**Purpose:** Document agreed development workflow, testing approach, and QA guidelines for FoodTrace project.

---

## Core Development Procedure

```
1. SM (*draft)      → Creates SMALL story (2-4 hour scope) from Epic
2. [IF contract]    → QA (*risk) for risk assessment (optional but recommended)
3. Human            → Reviews and approves story
4. Dev (*develop)   → Implements with tests alongside code
5. Human            → Verifies functionality manually
6. [IF security]    → QA (*review) for quality gate
7. Git commit       → Conventional commit message (feat:, fix:, etc.)
8. REPEAT           → Next story from same or next epic
```

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                 FOODTRACE DEVELOPMENT CYCLE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SM (Bob)                                                       │
│    └─→ *draft creates story from Epic + Architecture            │
│              ↓                                                  │
│  [Contract stories only]                                        │
│    └─→ QA (Quinn) *risk assessment (recommended)                │
│              ↓                                                  │
│  HUMAN reviews story                                            │
│    └─→ Approve or request changes                               │
│              ↓                                                  │
│  Dev (James)                                                    │
│    └─→ *develop-story implements tasks + tests alongside        │
│              ↓                                                  │
│  HUMAN verifies                                                 │
│    └─→ Manual testing of feature                                │
│              ↓                                                  │
│  [Security/contract stories]                                    │
│    └─→ QA (Quinn) *review for quality gate                      │
│              ↓                                                  │
│  Git commit                                                     │
│    └─→ feat: description or fix: description                    │
│              ↓                                                  │
│  REPEAT from SM                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing Approach: Tests Alongside Code

**Decision:** We use "tests alongside code" - NOT strict TDD (test-first).

### Why Not Strict TDD?

1. **BMAD Dev agent limitation:** Default order is `Implement → Test → Validate`, not `Test → Implement`
2. **Learning curve:** Team is learning Solidity - strict TDD adds cognitive overhead
3. **Practical balance:** Tests alongside provides 80% of TDD benefits with less friction

### Testing Strategy by Code Type

| Code Type | Approach | Test Location | Framework |
|-----------|----------|---------------|-----------|
| **Smart Contracts** | Tests alongside each function | `test/*.test.ts` | Hardhat + Chai/Mocha |
| **API Routes** | Tests alongside each endpoint | `__tests__/api/*.test.ts` | Jest + Supertest |
| **React Components** | Tests after component works | `__tests__/components/*.test.tsx` | React Testing Library |
| **E2E Workflows** | Tests after features complete | `e2e/*.spec.ts` | Playwright |

### Task Structure for Contract Stories

Each contract task should explicitly include test subtasks:

```markdown
- [ ] Task 1: Implement registerProduct function (AC: 1, 2)
  - [ ] Create function signature with NatSpec comments
  - [ ] Write test: "should register product with valid data"
  - [ ] Write test: "should reject non-producer caller"
  - [ ] Write test: "should emit ProductRegistered event"
  - [ ] Implement function logic to pass tests
  - [ ] Run `npx hardhat test` - verify all pass
  - [ ] Check gas usage is within target (<100k gas)
```

### Task Structure for Frontend Stories

Frontend tasks can have tests after implementation:

```markdown
- [ ] Task 1: Create ProductCard component (AC: 3)
  - [ ] Create component file with props interface
  - [ ] Implement component UI with Chakra UI
  - [ ] Add responsive styles
  - [ ] Write test: "renders product name and origin"
  - [ ] Write test: "displays QR code when available"
  - [ ] Run `npm test` - verify all pass
```

---

## Story Sizing Guidelines

### Size Definitions

| Size | Hours | Scope | Example |
|------|-------|-------|---------|
| **XS** | 1-2 | Single config/file | Setup ESLint rules |
| **S** | 2-4 | Single component/function | Create contract skeleton |
| **M** | 4-8 | Feature with tests | Product registration flow |
| **L** | 8+ | **TOO BIG - SPLIT** | Never create L stories |

### Splitting Large Stories

If a story exceeds 8 hours estimated:

1. Identify natural boundaries (contract vs API vs UI)
2. Split by acceptance criteria groups
3. Each sub-story should be independently testable
4. First story should establish foundation, later stories add features

**Example - Epic 5 (Product Registration) split:**

```
Original: "Implement product registration" (~20 hours)

Split into:
- Story 5.1: ProductRegistry contract skeleton + basic tests (S: 3h)
- Story 5.2: registerProduct function + security tests (M: 5h)
- Story 5.3: API route /api/products/register (S: 4h)
- Story 5.4: ProductRegistrationForm UI component (M: 6h)
- Story 5.5: Integration + E2E test for full flow (S: 3h)
```

### Estimation Notes

**For this thesis team (learning as they go):**
- Multiply estimates by 1.5-2x for unfamiliar technology
- First story in each epic takes longer (setup overhead)
- Contract stories typically take longer than frontend stories

---

## QA Agent Usage Guidelines

### When to Use QA (Quinn)

| Story Type | QA Commands | Required? | Rationale |
|------------|-------------|-----------|-----------|
| Smart contract logic | `*risk`, `*review` | **Recommended** | Immutable once deployed |
| Security features (auth, crypto) | `*risk`, `*nfr` | **Recommended** | Security-critical |
| Database schema changes | `*trace` | Optional | Data integrity |
| Complex integrations | `*review` | Optional | Multiple failure points |
| UI components | - | No | Low risk, easy to fix |
| Configuration/setup | - | No | Low risk |
| Documentation | - | No | Not code |

### Target QA Coverage

**~40% of stories** should have QA involvement, focused on:
- All of Epic 3 (Security Hardening)
- All of Epic 5-6 (Product Registration, Transfer Workflow)
- All of Epic 10 (Multi-party Verification)
- Selected stories from Epic 7-8 (complex tracking logic)

### QA Command Reference

| Command | When to Use | Output |
|---------|-------------|--------|
| `*risk` | Before dev starts on risky story | Risk assessment matrix |
| `*design` | Before dev on complex story | Test strategy document |
| `*trace` | During dev to check coverage | Requirements traceability |
| `*nfr` | During dev for quality attributes | NFR assessment |
| `*review` | After dev marks "Ready for Review" | Quality gate (PASS/CONCERNS/FAIL) |
| `*gate` | After fixing review issues | Updated gate status |

---

## Git Commit Guidelines

### Conventional Commits Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Commit Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add registerProduct contract function` |
| `fix` | Bug fix | `fix: prevent future harvest dates` |
| `test` | Adding tests | `test: add ProductRegistry security tests` |
| `refactor` | Code restructure | `refactor: extract validation logic` |
| `docs` | Documentation | `docs: update API endpoint documentation` |
| `chore` | Maintenance | `chore: update dependencies` |

### Commit Frequency

- Commit after each story completion (minimum)
- Commit after significant milestones within story (recommended)
- Never commit broken/failing tests
- Always run `npm test` before committing

---

## Epic 1 Story Breakdown

Based on workflow decisions, Epic 1 should be split into:

| Story | Title | Size | QA? |
|-------|-------|------|-----|
| 1.1 | External Service Account Setup | XS | No |
| 1.2 | Initialize Next.js + TypeScript Project | S | No |
| 1.3 | Configure Hardhat + Local Network | S | No |
| 1.4 | Configure Prisma + Supabase Connection | S | No |
| 1.5 | Configure Chakra UI + Base Layout | S | No |
| 1.6 | Deploy Hello World Contract to Sepolia | S | No |
| 1.7 | Team Environment Verification | XS | No |

**Note:** Epic 1 is setup/infrastructure - no QA needed.

---

## References

- BMAD User Guide: `.bmad-core/user-guide.md`
- Testing Strategy: `docs/architecture/testing-strategy.md`
- Story Template: `.bmad-core/templates/story-tmpl.yaml`
- Dev Agent: `.bmad-core/agents/dev.md`
- QA Agent: `.bmad-core/agents/qa.md`

---

**Last Updated:** 2025-11-26 (Session 29)
