# Mike / Rogue Creation Engine

## Purpose

Build a model-agnostic creation engine that can research, script, package, generate, assemble, QC, publish, and learn from long-form and short-form content across multiple YouTube channels.

This is not an LTX system, an H3 system, or a single-model app. The engine is an orchestrator with replaceable adapters for research, text, image, video, audio, QC, editing, publishing, and analytics.

## Primary Near-Term Goal

Use the engine to accelerate monetization of a small portfolio of YouTube channels before the January 2027 internal deadline.

Current priority order:

1. Dead Air Cinema — strange true stories / survival / disasters / engineering catastrophes.
2. Rogue Music — music countdowns, rankings, and story-driven Top 10 content.
3. Paper Trail — money/business curiosity and 'follow the money' explainers.
4. 37Flair — original cinematic AI fiction.
5. That Mike Hamilton — authority/personal brand focused on AI, Texas, infrastructure, money, jobs, and consequences.

Existing monetization strategy is stored at:

`docs/strategy/youtube/operation-monetized-by-jan-15-2027.md`

## Core Workflow

Topic / research request
→ Creator Intelligence / vidIQ outlier research
→ research dossier
→ story/script agent
→ title + thumbnail packaging hypotheses
→ human approval
→ voiceover / narration
→ scene manifest
→ asset routing
→ model routing
→ low-cost preview renders
→ automated QC
→ selective production rerenders
→ audio mix / cleanup
→ timeline assembly
→ human final review
→ publish
→ 48-hour analytics review
→ feed results back into Creator Intelligence

## Key Principle

Automate the production machinery, not the creative identity.

Each channel must have distinct editorial positioning, writing voice, visual grammar, title language, thumbnail system, and audience promise. The system must avoid repetitive/template output that could jeopardize YouTube monetization.

## Development Priorities

### MVP 1 — Manifest + Render Queue
- Input: script + narration audio.
- Align narration to scenes.
- Produce a structured scene manifest.
- Route each scene to: real asset, graphic, A-roll, or generated media.
- Generate model-specific prompts.
- Queue preview renders.
- Track render status and approval.

### MVP 2 — Model Adapters
- LTX adapter.
- MiniMax H3 adapter.
- Hunyuan adapter.
- Stable hosted/cloud adapter interface.
- Local ComfyUI adapter.

### MVP 3 — Automated QC
- Vision model scores prompt adherence, artifacts, composition, continuity, text problems, malformed anatomy/mechanics, and general usability.
- Reject / rerender below threshold.
- Human review only for shortlisted outputs.

### MVP 4 — Timeline Assembly
- Build Resolve/FFmpeg-ready timeline package.
- Add captions, music, SFX, chapter markers, lower thirds, and motion graphics.
- Output finished long-form plus derivative Shorts.

### MVP 5 — Publishing + Feedback
- Generate title/description/chapters/tags.
- Attach playlists, end screens, pinned-comment destination, and next-video CTA.
- Track CTR, first-30-second retention, AVD, APV, Suggested, Search, end-screen traffic, and subscriber conversion.
- Feed performance back into topic selection and packaging.

## Human Approval Gates

Human approval should remain mandatory at:

1. Research accuracy / sourcing.
2. Final script.
3. Packaging (title + thumbnail hypothesis).
4. Final cut.

The engine can recommend, generate, and rerender around these gates.

## Desktop Kickoff

When development starts on PC, begin with the scene-manifest schema and render-queue service. Do not begin by hard-wiring one video provider. Build the adapter interface first so models can be swapped as the market changes.
