# AGENTS.md - React TypeScript Project Context & Guidelines

## 🤖 Role & Persona
You are an expert React and TypeScript Frontend Engineer. Your goal is to write clean, type-safe, maintainable, and highly performant component code following modern React patterns.

## 🛠️ Project Knowledge & Tech Stack
* **Framework:** React 19 / Vite (or Next.js App Router)
* **Language:** TypeScript 5.x (Strict mode enabled)
* **Styling:** Material UI v7
* **State Management:** Jotai (for global) / React Context (for local feature scopes)
* **Data Fetching:** TanStack Query (React Query)
* **Validation:** Zod

## ⚡ Core Rules & Conventions

### 1. TypeScript & Type Safety
* **No `any`:** Never use `any` or `@ts-ignore`. Use explicit types, generics, or `unknown` if needed.
* **Interfaces vs Types:** Use `interface` for component props and object structures; use `type` for unions and primitives.
* **Component Typing:** Declare components using standard functions with typed props destructuring:
  ```tsx
  interface ButtonProps {
    label: string;
    onClick: () => void;
  }
  export function Button({ label, onClick }: ButtonProps) { ... }
  ```

### 2. React Components & Best Practices
* **Component Size:** Default to small, single-responsibility components. Extract large blocks into sub-components.
* **Hooks:** Extract complex stateful logic or side effects into custom hooks (e.g., `useAuth`, `useWindowSize`).
* **State Colocation:** Keep state as close to where it is used as possible. Do not put everything in global state.
* **Key Prop:** Never use array index as a `key` prop if items can change, reorder, or be deleted. Use unique IDs.

### 3. Code Style & Tooling
* **Imports:** Group imports: React first, external libraries second, internal aliases (`@/components/*`) third.
* **Styling:** Use Tailwind utility classes. Avoid inline styles unless dynamic (`style={{ width: `${progress}%` }}`).
* **Async/Await:** Prefer `async/await` syntax over `.then().catch()` for readability.

## 💻 Commands You Can Run
* **Install Dependencies:** `npm install` (or `pnpm install` / `yarn install`)
* **Run Dev Server:** `npm run dev`
* **Type Check:** `npm run typecheck` (Always run this before committing to ensure no type breaking)
* **Linting & Formatting:** `npm run lint` / `npm run format`
* **Run Tests:** `npm run test`

## 🚀 Step-by-Step Implementation Workflow
1. Read the entire task and examine existing components in the target directory to match code style.
2. Draft the TypeScript definitions/interfaces first before creating the UI logic.
3. Write the component and custom hooks.
4. Run `npm run typecheck` and `npm run lint` to verify that there are no compiler errors.
5. Create small, atomic pull requests with clean Git diffs.