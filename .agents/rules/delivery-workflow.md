---
description: AltruBiz SiteOS Delivery Workflow - temporary Branch Lifecycle (cleanup is part of merge) and mandatory Preview + Owner Approval before any merge to master.
always_on: true
---

# AltruBiz SiteOS: Delivery Workflow
## Branch Lifecycle & Preview + Owner Approval
### Version 1.0 - Governance Rule (Tier 1 Process Invariants)

This rule sits on top of, and never weakens, the existing publication governance, the review workflow (COMMENTS / DISCARD / PUBLISH) in [`article-ingestion-protocol.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/article-ingestion-protocol.md), and the release gate.

**End-to-end order for any batch of work:**
```
WORK BRANCH -> build + relevant tests -> PREVIEW DEPLOYMENT -> live URL + short summary
   -> STOP: ask the owner -> [explicit approval] -> release gate -> merge to master
   -> production verification -> BRANCH CLEANUP (local + GitHub + prune)
```
Merge is not complete until branch cleanup is complete.

---

## Part A. Branch Lifecycle

### A.1 Every work branch is temporary
Every branch created for a task (`content/review/<slug>`, `architecture/*`, `siteos/*`, `feature/*`, `fix/*`, or any other name) is **temporary** unless it is explicitly defined otherwise (A.4).

### A.2 Deletion trigger: all three conditions
A branch must be deleted once **all** of the following are true:
1. It has been **merged to `master`**.
2. It **passed the relevant tests** (the release gate, or the explicitly named subset for the change type).
3. The result was **verified after deployment** (production verification of the live URL).

No merged branch is kept "just in case".

### A.3 Cleanup procedure (part of the merge, not an optional follow-up)
1. **Confirm the branch is fully in `master`:** `git branch --merged master`, or `git merge-base --is-ancestor <branch> master`. For squash or rebase merges, confirm by the merged pull request state or `git cherry -v master <branch>` (no un-applied commits).
2. **Record the branch tip SHA** in the final report so the work stays recoverable.
3. **Delete locally:** `git branch -d <branch>`. Do not use `-D` merely to silence a refusal; investigate why Git considers it unmerged.
4. **Delete on GitHub:** `git push origin --delete <branch>`.
5. **Prune:** `git fetch --prune` (and `git worktree prune` if a worktree was used).
6. **Sweep:** list `git branch -a --merged master`. Delete any other fully merged, non-protected branch that this work created. Report (do not delete) any branch that is unmerged or of unknown origin.
7. **Report cleanup** in the post-merge summary: which local and remote branches were removed, and that `git branch -a` shows only protected branches plus any branch with unmerged work.

### A.4 Exceptions (the only branches that may remain)
- `master`.
- An **explicitly defined backup branch**.
- An **explicitly defined long-lived branch**.
- A branch **holding work that is not yet in `master`**.

"Explicitly defined" means named as such by the owner in chat or listed in the register below. Anything not listed is temporary.

**Protected Branch Register**
| Branch | Kind | Note |
| :--- | :--- | :--- |
| `master` | Production trunk | Never deleted, never force-pushed |
| `pre-branch-cleanup-2026-09-18` | Backup snapshot | Points at `153311d`; present at the time this rule was written; retained until the owner explicitly deletes it |

### A.5 DISCARD
An owner **DISCARD** decision is an explicit instruction to abandon the candidate branch: record the tip SHA, then delete it locally and on GitHub. Discarding never touches `master`.

---

## Part B. Preview & Owner Approval

### B.1 Required after every significant batch
1. **Build and run the relevant tests** (`npm run build`, `npm run test:geo`, and any validators or Playwright tests relevant to the change). Report failures faithfully.
2. **Upload a Preview Deployment:** push the work branch so the repository's Vercel integration builds a production-equivalent preview. Confirm it is **Ready** and that it serves the **exact commit** just tested.
3. **Return a live, direct URL** that shows the change (deep link to the affected page or state, with one line on where to look). Preview URLs are never canonical, are never listed in sitemaps or `llms.txt`, and must not be indexable.
4. **Give a short summary** of what changed, what was verified, and anything not verified.
5. **STOP before merge and ask the owner, verbatim:**
   > **האם לבצע merge ל-master, או שיש הערות / תיקונים?**

### B.2 Never merge before explicit approval
- Approval is a clear yes from the **owner in chat**. Silence, a reaction, or approval of a different batch is not approval.
- **Comments / corrections** -> revise on the **same** branch, re-run build and tests, redeploy, return the new URL and ask again.
- **Approval** -> run the release gate -> merge to `master` -> production verification -> branch cleanup (Part A).
- An owner may pre-authorize a defined scope in chat (for example, a named autonomous run). That covers only the named scope and never carries over to later work.

### B.3 What counts as a "significant batch"
Any change that alters user-visible behavior, content, routing, metadata or SEO surface, the data model, build or governance scripts, or shared components. Trivial single-line typo fixes still follow branch and merge hygiene, but the owner may waive the preview.

### B.4 Documentation-only batches
A batch that changes **only** governance or documentation files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.agents/**`) has **no live-visible change** for a Preview Deployment to show. In that case:
- state explicitly that no runtime change exists and why a preview URL would show nothing;
- run the validators that read those files (at minimum `npm run test:geo`, plus a build that includes the prebuild guards);
- give the diff summary and still **STOP and ask the B.1 question**. Every other step applies unchanged.

### B.5 Preview failure
If the Preview Deployment fails or cannot be produced, **do not merge**. Report the failure and its cause, and ask the owner how to proceed. Do not substitute a local screenshot unless the owner agrees.

### B.6 Relationship to the article review flow
The Capability-URL review workflow (`?review_token=...`, Review Cockpit) is the article-specific implementation of this same principle. Its outcomes map directly: **PUBLISH** is explicit approval, **COMMENTS** is revise-and-redeploy, **DISCARD** is Part A.5. Its token, production-immunity and ephemeral-URL rules are unchanged, and the closing question in B.1 is still asked when a review preview is delivered.

---

## Part C. Interaction with Other Governance (Nothing Is Weakened)
- `publicationStatus: 'review'` and `indexable: false` for new articles, and "never publish or index without explicit owner approval", are unchanged.
- The release gate must still pass **before** merge, never after.
- `content.published` and downstream distribution still fire only after owner approval, gate, deployment and live verification.
- Downstream distribution failures never roll back website publication.
