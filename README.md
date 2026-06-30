# Trello Clone Frontend

React frontend for a Trello-like Kanban application. It connects to the Express backend and provides board management, drag and drop, card details, archive/restore workflows, authentication, password reset, S3-backed uploads, and VNPAY sandbox payment UI for private boards.

## Tech Stack

- React 19
- Vite
- TypeScript
- Material UI
- TanStack Query
- Jotai
- React Router
- React Hook Form and Zod
- DnD Kit
- Wretch API client
- React Toastify

## Main Features

- Login, register, and sign out
- Forgot password and reset password with OTP
- Board list and board detail pages
- Search boards from the app bar
- Public board viewing and private board access control
- Invite members and accept board invitations
- Owner indicator and owner-only invite controls
- Drag and drop columns and cards
- Optimistic UI with rollback for board mutations
- Card modal with title, description, labels, dates, checklist, comments, attachments, cover, and activity
- Archive and restore board, column, and card
- Import board from Excel template
- Upload avatar and card attachments through backend S3 APIs
- Upgrade public board to private through VNPAY sandbox
- Light and dark mode support across auth pages and app UI
- Responsive layout for desktop, tablet, and mobile views

## Project Structure

```text
src
  apis             API client and domain API services
  assets           Static frontend assets
  atoms            Jotai global state
  components       Shared components such as AppBar and ProtectedRoute
  customLibraries  Local library wrappers or custom helpers
  hooks            Reusable custom hooks
  pages            Route-level pages and feature modules
  types            Shared TypeScript domain types
  untils           Shared utilities, constants, formatters, validators
```

## Requirements

- Node.js 18 or newer
- Backend API running locally or deployed

## Demo Account

Use this section to provide a test account for reviewers or interviewers.

- Owner account
```text
Email: owner@gmail.com
Password: 123456
```

- member account
```text
Email: member@gmail.com
Password: 123456
```

## Environment Variables

Create a `.env` file in the frontend root.

```env
VITE_API_ROOT=http://localhost:8017/v1
```

For production, point it to the deployed backend:

```env
VITE_API_ROOT=https://your-backend-domain.onrender.com/v1
```

Vite only exposes environment variables prefixed with `VITE_`.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app usually runs at:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

Build output is written to `dist`.

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Important Frontend Flows

### Authentication

1. Login calls the backend auth API.
2. Access token and user data are stored in Jotai state.
3. Protected routes use auth state to allow or block private pages.
4. Sign out clears query cache and auth atoms.

### Forgot Password

1. User enters email.
2. Frontend calls the forgot password API.
3. Backend sends an OTP email.
4. User enters email, OTP, and new password on the reset password page.
5. Frontend calls the reset password API.

### Board Loading

1. Board detail page reads `boardId` from the URL.
2. `useBoardData` fetches board details.
3. Board data is synced into `boardDataAtom`.
4. Board bar, columns, and cards render from the shared board state.

### Drag and Drop

The board updates the UI optimistically during drag and drop, then calls backend APIs to persist the new order.

If the backend request fails, the UI restores the previous board snapshot and invalidates board queries.

### Archive and Restore

Archive actions use confirmation dialogs.

Restore actions are available from:

- Archived boards section on the boards page
- Archived items dialog on the board bar

### Private Board Payment

1. Owner clicks `Make private` on a public board.
2. Frontend asks the backend to create a private upgrade payment.
3. Backend returns a VNPAY sandbox payment URL.
4. Frontend redirects the browser to VNPAY.
5. Backend verifies payment and redirects back to the board page.
6. Frontend reads the `payment` query param and shows a toast.

The frontend does not update `board.type` directly. The backend is the source of truth after payment verification.

## Deployment Notes

Recommended setup:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- File storage: AWS S3

For Vercel:

```text
Build Command: npm run build
Output Directory: dist
```

Set this environment variable on Vercel:

```env
VITE_API_ROOT=https://your-backend-domain.onrender.com/v1
```

Also add the frontend production URL to backend CORS:

```env
WHITELIST_DOMAINS=https://your-frontend-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Development Notes

- Keep API calls in `src/apis/services`.
- Keep feature-specific hooks close to the feature that uses them.
- Prefer typed props and request/response interfaces.
- Avoid mutating props directly.
- Use shared mutation helpers from `src/untils/mutations.ts` for board query invalidation.
- Keep large UI surfaces split into smaller components.
