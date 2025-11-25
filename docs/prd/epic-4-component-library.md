### Epic 4: Component Library

**Priority:** 🔴 Must Have
**Estimated Time:** 10-15 hours
**Assigned:** YiLing (Lead, 10-12h), Sam + TaiSheng (Support, 2-3h each)
**Timeline:** Week 3-4 (parallel with Epic 3 Security Hardening)
**Dependencies:** Epic 1 (Chakra UI setup), Epic 3 Tier 2 (Sam/TaiSheng component contributions)

#### Epic Description

Build reusable React component library using Chakra UI v2 to accelerate frontend development across all 4 user roles (Producer, Distributor, Retailer, Consumer). Component library must be 100% complete before Week 5 when intensive UI development begins, preventing duplicate work and ensuring consistent design system.

#### Business Value

- **Development Speed:** Reusable components save 20-30 hours in Weeks 5-7 (no rebuilding forms for each role)
- **Consistent UX:** Same look/feel across all interfaces builds user trust
- **Mobile-First:** Responsive components work on desktop, tablet, phone without rework
- **Accessibility:** WCAG-compliant components prevent late-stage accessibility fixes
- **Team Efficiency:** Sam/TaiSheng can integrate UI faster with ready-made components

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic depends on Epic 1 Chakra UI installation. Verify package.json contains:

```json
{
  "dependencies": {
    "@chakra-ui/react": "^2.8.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"
  }
}
```

**Team Decision Required (15 minutes together - BEFORE starting Epic 4):**

- ✅ **Chakra UI Pro Decision** ($49 one-time purchase):
  - **Option A (Recommended for MVP):** Free Chakra UI v2 - Sufficient for thesis POC, no budget needed
  - **Option B:** Chakra UI Pro - Advanced components (data tables, date pickers), saves 3-5 hours development time
  - Decision: Document in CLAUDE.md which option chosen and rationale
- ✅ **Component Documentation Approach**:
  - **Option A (Recommended):** Inline JSDoc comments + docs/components.md - Simple, no extra tooling, faster for 3-person team
  - **Option B:** Storybook - Professional component explorer, requires 2-3h setup + learning curve
  - Decision: Use inline JSDoc + docs/components.md (faster for thesis timeline)
- ✅ **Component Testing Decision**:
  - **Option A (Recommended for Week 3-4):** Manual testing only - Faster development, acceptable for MVP
  - **Option B (Deferred to Week 8):** React Testing Library component tests - Add during testing phase if time permits

**Developer Setup (After Prerequisites):**

- No additional external accounts needed (uses Epic 1 npm dependencies)
- Chakra UI v2 theme customization (optional - can use defaults)

#### User Stories (High-Level)

- As a **frontend developer**, I want **reusable form components** so I don't rebuild inputs for each page
- As a **frontend developer**, I want **responsive layout system** so mobile works without extra CSS
- As a **frontend developer**, I want **validation components** so forms have consistent error handling
- As a **team member**, I want **component documentation** so I know which components exist and how to use them

#### Acceptance Criteria (Epic Level)

**Core Components (Week 3):**

- ✅ Button variants (Primary, Secondary, Danger, Ghost)
- ✅ Input fields (Text, Number, Date, TextArea, Select)
- ✅ Form validation wrappers (client-side validation, error messages)
- ✅ Card layouts (Product card, Company card, Trace record card)
- ✅ Navigation components (Header, Sidebar, Breadcrumbs)
- ✅ Loading states (Spinner, Skeleton, Progress bar)
- ✅ Toast notifications (Success, Error, Warning, Info)

**Advanced Components (Week 4):**

- ✅ Modal dialogs (Confirmation, Form modal, Info modal)
- ✅ Table components (Sortable, Filterable, Pagination)
- ✅ Timeline component (for product journey visualization)
- ✅ Chart wrappers (Temperature chart, Activity chart)
- ✅ QR code display component (react-qr-code integration)
- ✅ File upload component (Image upload with preview, drag-and-drop)

**Responsive Layout System:**

- ✅ Mobile-first breakpoints (sm: 480px, md: 768px, lg: 1024px, xl: 1280px)
- ✅ Grid system (1-12 columns, auto-responsive)
- ✅ Flexbox utilities (justify, align, gap, wrap)
- ✅ Container components (Page container, Section container, Content container)

**Documentation (docs/components.md with inline JSDoc):**

- ✅ docs/components.md created with all component usage examples
- ✅ Inline JSDoc comments for each component (describing props, usage, examples)
- ✅ Code snippets showing how to import and use each component
- ✅ Props documentation table (prop name, type, default value, description)
- ✅ Mobile responsiveness examples for each component

#### Technical Approach

**Component Structure:**

```
src/components/
├── ui/                    # Core UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
├── forms/                 # Form-specific components
│   ├── ProductForm.tsx
│   ├── TraceRecordForm.tsx
│   ├── ValidationWrapper.tsx
│   └── ...
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Container.tsx
│   └── ...
└── visualization/         # Charts and timeline
    ├── Timeline.tsx
    ├── TemperatureChart.tsx
    └── ...
```

**Example Component (Button):**

```typescript
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

export const Button = ({ variant = "primary", ...props }: ButtonProps) => {
  const variantStyles = {
    primary: { bg: "blue.500", color: "white", _hover: { bg: "blue.600" } },
    secondary: {
      bg: "gray.200",
      color: "gray.800",
      _hover: { bg: "gray.300" },
    },
    danger: { bg: "red.500", color: "white", _hover: { bg: "red.600" } },
  };

  return <ChakraButton {...variantStyles[variant]} {...props} />;
};
```

**Form Validation Wrapper:**

```typescript
export const ValidatedInput = ({ name, label, validation, ...props }) => {
  const [error, setError] = useState("");

  const handleBlur = (e) => {
    const value = e.target.value;
    if (validation.required && !value) {
      setError(`${label} is required`);
    } else if (validation.pattern && !validation.pattern.test(value)) {
      setError(validation.message || "Invalid format");
    } else {
      setError("");
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input {...props} onBlur={handleBlur} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
```

#### Dependencies

**Requires:** Epic 1 (Chakra UI installed and configured)
**Blocks:** Epic 5 (Product Registration UI), Epic 6 (Product Transfer UI), Epic 7 (Supply Chain Tracking UI), Epic 8 (IoT Simulator UI), Epic 9 (Consumer Query UI), Epic 10 (Multi-Party Verification UI), Epic 12 (Data Visualization UI)
**Parallel:** Epic 3 (Security Hardening - YiLing works on Epic 4 while Sam/TaiSheng work on Epic 3)

**Note:** Epic 4 blocks ALL UI-focused epics (5-12 except Epic 11). Component library MUST be complete before Week 5 UI development.

#### Team Assignment

**YiLing (10-12 hours - Lead):**

- Core components (Button, Input, Card, Navigation) (4 hours)
- Responsive layout system (Grid, Flexbox, Containers) (3 hours)
- Form validation components (ValidationWrapper, error handling) (3 hours)
- Component documentation (usage examples, props) (2 hours)

**Sam (2 hours - Support, Epic 3 Tier 2 coordination):**

- Button variants (Primary, Secondary, Danger) (1 hour)
  - Implement 4 button variants using Chakra UI styling
  - Add hover states and accessibility (ARIA labels)
- Input field component (text, number, date) (1 hour)
  - Create reusable Input wrapper with validation props
  - Add error state styling

**TaiSheng (2-3 hours - Support, Epic 3 Tier 2 coordination):**

- Form validation wrappers (client-side validation) (2 hours)
  - Implement ValidatedInput component with error handling
  - Add validation rules (required, pattern, custom validators)
- Toast notification wrapper (success/error states) (1 hour)
  - Create useToast hook wrapper for Chakra UI toast
  - Standardize success/error/warning/info toast styling

**Note:** Sam and TaiSheng contributions are part of Epic 3 Tier 2 "Team Component Contributions" and happen during Epic 3 implementation. YiLing integrates these into Epic 4 component library.

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Component library not ready by Week 5 | Start Week 3 in parallel with Epic 3, prioritize core components (Button, Input, Card) first |
| YiLing overwhelmed with 15h workload | Sam/TaiSheng contribute 2h each during Epic 3 Tier 2, reducing YiLing to 10-12h solo work |
| Components not reusable enough | Code review by Sam/TaiSheng before Week 5 starts, refactor if components too specific |
| Missing components discovered in Week 5-7 | Create "component backlog" in Week 4, add missing components as needed during UI development |
| Chakra UI Pro not purchased, advanced components missing | Use free Chakra UI v2 with custom implementations for data tables/date pickers (acceptable for MVP) |
| Documentation approach unclear (Storybook vs docs) | Team decision: Use inline JSDoc + docs/components.md (faster, no tooling setup) |
| Sam/TaiSheng unavailable for contributions | YiLing implements all components solo (15h total, acceptable if Epic 3 reduced to Tier 1 only) |
| Component library delays Epic 5-12 | Epic 4 runs in parallel with Epic 3, ensuring Week 5 start on schedule |
