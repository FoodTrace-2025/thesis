### Epic 4: Component Library

**Priority:** 🔴 Must Have
**Estimated Time:** 10-15 hours
**Assigned:** YiLing (Lead, 10-12h), Sam + TaiSheng (Support, 2-3h each)
**Timeline:** Week 3-4 (parallel with Epic 0.6 and Epic 1)
**Dependencies:** Epic 1 (Chakra UI setup)

#### Epic Description

Build reusable React component library using Chakra UI v2 to accelerate frontend development across all 4 user roles (Producer, Distributor, Retailer, Consumer). Component library must be 100% complete before Week 5 when intensive UI development begins, preventing duplicate work and ensuring consistent design system.

#### Business Value

- **Development Speed:** Reusable components save 20-30 hours in Weeks 5-7 (no rebuilding forms for each role)
- **Consistent UX:** Same look/feel across all interfaces builds user trust
- **Mobile-First:** Responsive components work on desktop, tablet, phone without rework
- **Accessibility:** WCAG-compliant components prevent late-stage accessibility fixes
- **Team Efficiency:** Sam/TaiSheng can integrate UI faster with ready-made components

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

**Documentation:**

- ✅ Component storybook or docs/components.md with usage examples
- ✅ Code snippets showing how to import and use each component
- ✅ Props documentation (what props each component accepts)

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

**Requires:** Epic 1 (Chakra UI installed)
**Blocks:** Epic 5, 7, 8, 9 (all frontend epics depend on component library)

#### Team Assignment

**YiLing (10-12 hours - Lead):**

- Core components (Button, Input, Card, Navigation) (4 hours)
- Responsive layout system (Grid, Flexbox, Containers) (3 hours)
- Form validation components (ValidationWrapper, error handling) (3 hours)
- Component documentation (usage examples, props) (2 hours)

**Sam (2 hours - Support, Epic 0.6 coordination):**

- Button variants (Primary, Secondary, Danger) (1 hour)
- Input field component (text, number, date) (1 hour)

**TaiSheng (2-3 hours - Support, Epic 0.6 coordination):**

- Form validation wrappers (client-side validation) (2 hours)
- Toast notification wrapper (success/error states) (1 hour)

**Note:** Sam and TaiSheng contributions are part of Epic 3 Tier 2 "Team Component Contributions" but create outputs used in Epic 4 component library.

#### Risks & Mitigations

| Risk                                  | Mitigation                                                           |
| ------------------------------------- | -------------------------------------------------------------------- |
| Component library not ready by Week 5 | Start Week 3 (not Week 4), prioritize core components first          |
| YiLing overwhelmed with 15h workload  | Sam/TaiSheng contribute 2h each (Week 3-4) reducing YiLing to 10-12h |
| Components not reusable enough        | Code review by Sam/TaiSheng before Week 5 starts                     |
| Missing components discovered late    | Create "component backlog" in Week 4, add as needed in Week 5-7      |
