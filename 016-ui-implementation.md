# Project Handoff: NewsMind AI

## Project
Build a **production-ready Agentic AI News Intelligence Platform** that satisfies a Full Stack Agentic AI assignment.

### Name
**NewsMind AI**

### Tagline
**Read Less. Understand More.**

---

# Tech Stack

## Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS (Strictly utility classes)
- shadcn/ui (Modified to use `react-icons` instead of `lucide-react`)
- TanStack Query
- react-hook-form
- react-icons
- recharts

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- nodemon
- dotenv

## Authentication
- Google Login
- Better Auth with JWT

---

# Main Idea
This is NOT a CRUD news website. It is an **AI-powered News Intelligence Platform**.

Users can: Read news, Search news, Filter & sort news, Bookmark, Chat with AI, Generate AI summaries, Receive AI recommendations, View analytics.
Admins can: Manage articles, Manage users, View analytics.

---

# Core Pages
- **Public:** Home, Explore, Article Details, About, Contact, Login, Register
- **Protected:** Dashboard, Profile, Add Article, Manage Articles, Manage Users

---

# Agent Workflow
User ↓ Read/upload article ↓ Extract content ↓ Summarize ↓ Extract keywords ↓ Detect sentiment ↓ Generate tags ↓ Update recommendations ↓ Save results ↓ Display to user

---

# Important Guidance for the Coding AI (STRICT RULES)

Please follow these constraints meticulously:

1. **Package Manager:** 
   - Exclusively use `pnpm` for all dependency management and script executions. Do not use npm or yarn.

2. **Next.js Native Components:** 
   - **Links:** NEVER use standard HTML `<a>` tags. You MUST use Next.js `<Link href="...">` from `next/link`.
   - **Images:** NEVER use standard HTML `<img>` tags. You MUST use the Next.js `<Image>` component from `next/image` with correct sizing or fill properties.

3. **Styling (Strict Tailwind):** 
   - STRICTLY use Tailwind CSS utility classes. 
   - DO NOT write custom CSS using `<style>` tags anywhere in the project. 

4. **UI Component Strategy (shadcn/ui First):** 
   - Whenever a component is needed (e.g., Navbar, Card, Form, Dropdown, Button, Popup/Dialog), you MUST look it up in `shadcn/ui` first.
   - *Crucial Icon Override:* Replace `lucide-react` (shadcn's default) with `react-icons` in all generated shadcn components.
   - Only build a custom Tailwind component if a suitable `shadcn/ui` primitive does not exist.

5. **Development Practices:**
   - Build incrementally and complete one task before moving to the next.
   - Keep frontend and backend modular following clean architecture (SOLID principles).
   - Use `react-hook-form` for all form handling.
   - Ensure a responsive UI and avoid placeholder content.
   - Make the application production-ready.

---

# Recommended Build Order
- [x] 1. Project setup (with pnpm)
- [x] 2. Folder structure
- [x] 3. TypeScript configuration ✅
- [x] 4. MongoDB & Backend Setup (Express, nodemon, dotenv) ✅
- [x] 5. Authentication (Better Auth with JWT) ✅
- [x] 6. Database models ✅
- [x] 7. REST APIs ✅
- [x] 8. Landing page (Using shadcn/ui & react-icons) ✅
- [x] 9. Auth UI (login/register forms integrated) ✅
- [x] 10. Explore page (live search, filter tags, pagination) ✅
- [x] 11. Details page (Article Details view with nested comments, AI panel, sidebar) ✅
- [x] 12. Dashboard (Using recharts with 4 distinct chart types) ✅
- [x] 13. AI features (sentiment, summarizer, tags, chat assistant, recommendations) ✅
- [x] 14. Testing ✅
- [x] 15. Deployment ✅

End of handoff.