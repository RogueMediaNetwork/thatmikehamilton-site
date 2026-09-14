# Creation Engine Architecture

## Design Goal

A production orchestrator for audio/video creation that remains model-agnostic. Every external model or service sits behind an adapter so it can be replaced without rewriting the pipeline.

## System Stages

### 1. Creator Intelligence
Inputs:
- vidIQ rising keywords
- vidIQ outliers
- competitor videos
- channel analytics
- comment mining

Outputs:
- ranked topic candidates
- demand evidence
- outlier references
- packaging patterns
- adjacent-topic clusters

### 2. Research Agent
Inputs:
- selected topic
- web sources / documents / data

Outputs:
- sourced research dossier
- chronology
- key people / organizations
- numbers / claims requiring verification
- archive / visual asset list
- unresolved questions

### 3. Story / Script Agent
Rules:
- write for a complete stranger to the channel
- no throat-clearing intros
- opening structure: CHANGE/PROBLEM → STAKES → CURIOSITY → PROMISE → PROOF → STORY
- establish credibility early with evidence, effort, or result
- create 3–4 legitimate open loops in the first 45–60 seconds when appropriate
- add a meaningful retention reset every ~60–90 seconds
- pay off the title/thumbnail promise immediately
- include a scripted next-video handoff at the end

### 4. Packaging Agent
Before production, create at least three hypotheses:
- A: event/news framing
- B: question/mystery framing
- C: contrarian/consequence framing

Each hypothesis includes:
- title
- thumbnail text / visual idea
- viewer desire / fear / curiosity mechanism
- first-30-second script promise

Title and thumbnail must complement rather than repeat each other.

### 5. Voice / Audio Prep
Possible sources:
- Mike human VO for authority/personal-brand videos
- licensed/synthetic narration for faceless channels

Tasks:
- transcription
- cleanup
- breath/noise handling
- loudness normalization
- timing alignment
- optional pickups / corrections

### 6. Scene Manifest
The manifest is the control plane.

Recommended fields per scene:

```yaml
scene_id: DAI-001-014
start_time: 00:01:42.000
end_time: 00:01:50.000
duration_sec: 8
vo_text: "But there's another problem..."
scene_intent: "Texas transmission grid under growing AI demand"
asset_type: generated_video # real_asset | graphic | arroll | generated_image | generated_video
visual_description: "Texas transmission lines at dusk, documentary realism"
first_frame_ref: null
last_frame_ref: null
camera_motion: "slow aerial push"
model_preference: "h3"
quality_tier: "preview" # preview | production | premium
commercial_rights_required: true
source_citation: null
continuity_group: "grid-sequence-a"
status: queued
qc_score: null
human_approved: false
```

### 7. Asset Router
Choose among:
- real footage
- licensed/archive footage
- maps
- charts
- screenshots/documents
- motion graphics
- AI image
- AI video
- A-roll

Rule: generated imagery must not be presented as documentary evidence of a real event unless clearly identified as visualization/reconstruction.

### 8. Model Router
The engine stores a high-level `scene_intent`, then compiles it through a model-specific prompt adapter.

Example adapters:
- LTX
- MiniMax H3
- Hunyuan
- Seedance / hosted services where licensed and stable
- ComfyUI/local models
- future adapters

Do not store one generic final prompt as the canonical scene definition. Store intent first; compile per renderer.

### 9. Preview Render Stage
Goal: validate motion/composition cheaply.

Use:
- lower resolution
- distilled / fast models
- short test clips
- free or low-cost legitimate tiers

Reject failures before expensive production rendering.

### 10. Automated QC
Vision model checks each output against manifest requirements.

Suggested score dimensions (0–100):
- prompt adherence
- realism / style match
- motion quality
- composition
- continuity
- anatomy / machinery integrity
- text/logo artifacts
- temporal consistency
- source/brand safety

Decision rules:
- `>= 85`: auto-shortlist
- `70–84`: manual review or one rerender
- `< 70`: reject and rerender with revised prompt/seed/model

Thresholds should be configurable by channel and scene type.

### 11. Production Render
Only approved preview concepts proceed to high-cost rendering.

Possible actions:
- higher resolution
- higher inference steps
- premium model
- model swap
- image-to-video with locked first frame
- first-frame + last-frame conditioning
- character/reference consistency inputs

### 12. Enhancement
Only after content is correct:
- upscale
- frame interpolation
- denoise
- sharpening
- stabilization

Do not use enhancement to hide broken motion/physics/anatomy. A sharper bad clip is still a bad clip.

### 13. Timeline Assembly
Output targets:
- DaVinci Resolve-ready media folder + timeline data where possible
- FFmpeg assembly fallback
- captions
- lower thirds
- graphics
- music
- SFX
- chapter markers
- end-screen window

### 14. Derivative Shorts
Each long-form episode can produce 2–4 rewritten Shorts rather than arbitrary excerpts.

Short structure:
- 0–2 sec: startling proposition
- 2–10 sec: context
- 10–30 sec: reveal
- 30–45 sec: consequence
- final line: specific bridge to long-form

### 15. Publisher
Generate:
- title
- description
- chapters
- keywords/tags where useful
- playlist assignment
- next-video link
- pinned-comment destination
- end-screen destination

### 16. Analytics Feedback
Check at ~48 hours:
- impressions
- CTR
- first-30-second retention
- AVD
- average percentage viewed
- watch hours per 1,000 views
- Suggested / Related traffic
- Search traffic
- end-screen traffic
- subscriber gain
- Shorts-to-long conversion

Rules:
- low CTR → packaging problem
- good CTR + low retention → opening/story problem
- breakout topic (3–5x baseline) → immediately generate 3–5 adjacent concepts

## Suggested Repository / Service Layout

```text
creation-engine/
  apps/
    dashboard/
    worker/
  packages/
    manifest/
    orchestrator/
    research/
    script/
    packaging/
    assets/
    qc/
    timeline/
    publishing/
    analytics/
  adapters/
    text/
      qwen/
      deepseek/
      kimi/
    vision/
      qwen-vl/
    video/
      ltx/
      minimax-h3/
      hunyuan/
      comfyui/
    audio/
      whisper/
      minimax-speech/
  channels/
    dead-air-cinema/
    rogue-music/
    paper-trail/
    37flair/
    that-mike-hamilton/
  storage/
    manifests/
    renders/
    sources/
    transcripts/
```

## First Development Slice

Build one end-to-end vertical slice for Dead Air Cinema Episode 001:

1. Import approved Lake Peigneur script + VO.
2. Generate manifest.
3. Create 10 test scenes.
4. Route between real/archive assets and generated visuals.
5. Render previews through at least two adapters.
6. QC automatically.
7. Approve selected scenes.
8. Generate production versions.
9. Create a Resolve-ready package.

Do not attempt the entire automation stack before this vertical slice works.
