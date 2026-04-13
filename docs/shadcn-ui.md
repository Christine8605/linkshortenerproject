# shadcn/ui Component Standards

This document defines the standards for using shadcn/ui components in this Link Shortener project. **All UI elements must use shadcn/ui components. Custom components are not permitted.**

---

## Core Requirement

- **All UI elements use shadcn/ui exclusively**
- Do not create custom HTML/CSS components
- Do not mix shadcn/ui with unstyled elements
- Leverage Tailwind CSS utilities within shadcn/ui props for consistent styling

---

## Component Usage Patterns

### Built-in Components

Always use shadcn/ui components for common UI patterns:

| Use Case | shadcn/ui Component |
|----------|-------------------|
| Interactive buttons | `<Button />` |
| Text input fields | `<Input />` |
| Forms & validation | `<Form />` with react-hook-form |
| Modals/dialogs | `<Dialog />` |
| Navigation menus | `<DropdownMenu />` |
| Status feedback | `<Toast />` |
| Data tables | `<DataTable />` |
| Page layout | `<Card />`, `<Tabs />` |

### Installation

Add new shadcn/ui components with:

```bash
npx shadcn-ui@latest add [component-name]
```

---

## Best Practices

### Composition

Compose complex UIs from shadcn/ui building blocks:

```typescript
// ✅ Good: Composed from shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField } from '@/components/ui/form';

export function LinkForm() {
  return (
    <Form>
      <FormField name="url" render={({ field }) => (
        <Input {...field} placeholder="Enter URL" />
      )} />
      <Button type="submit">Create Link</Button>
    </Form>
  );
}

// ❌ Bad: Custom component
export function LinkForm() {
  return (
    <form className="custom-form">
      <input className="custom-input" />
      <button className="custom-button">Create</button>
    </form>
  );
}
```

### Styling

- Use Tailwind utilities in the `className` prop
- Leverage shadcn/ui's built-in Tailwind integration
- Don't create custom CSS files for ui elements

```typescript
// ✅ Good: Tailwind utilities on shadcn component
<Button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-900">
  Create Link
</Button>

// ❌ Bad: Custom CSS
<button className="link-button">Create</button>
```

### Variant Props

Use shadcn/ui component variants for semantic styling:

```typescript
// ✅ Good: Use variant props
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="sm">Help</Button>

// ❌ Bad: Custom variants
<button className="btn btn-outline">Cancel</button>
```

---

## Common Components Reference

### Button
```typescript
import { Button } from '@/components/ui/button';

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button disabled>Disabled</Button>
```

### Input
```typescript
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Enter text" />
<Input type="email" placeholder="Email address" />
<Input disabled placeholder="Disabled input" />
```

### Form
```typescript
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

<Form {...form}>
  <FormField name="email" render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <Input {...field} type="email" />
      <FormMessage />
    </FormItem>
  )} />
</Form>
```

### Dialog/Modal
```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Card
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
</Card>
```

---

## When to Create a Domain Component

Domain-specific components (located in `/components/[domain]/`) may **wrap** shadcn/ui components but must not replace them:

```typescript
// ✅ Good: Wraps shadcn/ui
interface LinkCardProps {
  linkId: string;
  shortCode: string;
}

export function LinkCard({ linkId, shortCode }: LinkCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg">
      <CardContent className="pt-6">
        <p className="text-sm text-gray-600">Short Code</p>
        <p className="font-mono text-lg">{shortCode}</p>
      </CardContent>
    </Card>
  );
}
```

---

## Accessibility

shadcn/ui components include built-in accessibility features (ARIA labels, semantic HTML, keyboard navigation). Always:

- Use semantic shadcn/ui wrappers (`<Dialog />` not `<div role="dialog">`)
- Supply necessary props (labels, descriptions, aria-labels)
- Test keyboard navigation and screen reader support

```typescript
// ✅ Good: Semantic shadcn/ui with labels
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Settings</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>User Settings</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

## Exception Handling

If a specific UI pattern **is not available** in shadcn/ui:

1. Check the [shadcn/ui component library](https://ui.shadcn.com) for new releases
2. Search for community-contributed components
3. If truly unavailable, request approval before creating a custom component

---

## Enforcement

- All UI code reviews must verify shadcn/ui usage
- Custom HTML/CSS UI components will be rejected
- Domain components must wrap, not replace, shadcn/ui components

---

**Last Updated**: April 2026
