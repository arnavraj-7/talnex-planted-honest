# TinyTools

Small tools for everyday jobs. **This is a planted test app for TalNex: everything it claims below really works.** It is the "honest" case: TalNex should find every claim working, no red flags, and good scores.

## What it does

- **Guest sign-in:** press "Continue as guest" and start using the tools straight away. No account or email is needed.
- **Private tools:** the tools page only opens after you continue as a guest. Opening it without a session sends you back to the start page.
- **Currency converter:** convert an amount between US dollars, euros, pounds and Indian rupees. For example, 100 USD converts to about 8,320.00 INR.
- **Friendly errors in the converter:** an empty amount, text that is not a number, or a negative amount shows a clear message instead of a result or a crash.
- **Todo list:** add a todo, tick it off, delete it, and see how many items are left.
- **Todos are remembered:** your todo list is still there after you reload the page.
- **Empty todos are refused:** trying to add an empty todo shows a message and adds nothing.

## Run the tests

```
npm test
```

## Deploy

Static pages in `public/` and three small serverless functions in `api/`. It deploys to Vercel with no build step.
