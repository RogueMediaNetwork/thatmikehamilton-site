# Model Stack / Adapter Registry

This file records the working model/tool strategy for the creation engine. It is intentionally model-agnostic: providers can be replaced as better options appear.

## Text / Reasoning / Research

### Qwen
Good candidates for:
- coding
- multilingual work
- vision
- agents/tool use
- manifest conversion
- prompt compilation

Use case in engine:
- script → structured manifest
- scene intent → renderer-specific prompt
- metadata generation
- utility agents

### DeepSeek
Good candidates for:
- reasoning
- coding
- math
- research

Use case:
- research assistance
- data interpretation
- coding helpers

### Kimi / Moonshot
Good candidates for:
- long context
- coding
- productivity

Use case:
- long research dossiers
- large transcript/context synthesis

### Gemma / Phi / small Qwen
Use for inexpensive local tasks:
- classification
- metadata
- tagging
- simple routing
- offline helpers

## Vision / QC

### Qwen-VL
Primary proposed role:
- automated visual QC
- compare rendered clip to manifest
- identify malformed objects/anatomy/machinery
- detect unwanted text/logos
- continuity checks
- shortlist usable renders

Possible scene QC output:

```json
{
  "prompt_adherence": 91,
  "composition": 86,
  "artifact_integrity": 95,
  "continuity": 78,
  "usable": true,
  "notes": ["Good infrastructure scale", "Minor continuity drift in sky direction"]
}
```

## Video

### LTX
Role:
- high-volume / inexpensive video generation
- local or hosted rendering
- preview generation
- synchronized audio/video experimentation where useful
- image-to-video / keyframe workflows

Preferred engine role:
- default preview renderer
- possible production renderer for scenes where it performs well

### MiniMax H3
Role:
- premium/cinematic renderer
- difficult/high-value shots
- image/video/audio-conditioned generation
- local/open-weight experimentation where practical

Preferred engine role:
- production/premium adapter
- compare against LTX before paying for premium generations

### Tencent Hunyuan
Role:
- experimental alternate renderer
- model-scout/test-bench candidate
- potential local/open model path

### Seedance / other hosted models
Role:
- optional production adapter when economics, commercial terms, and output quality are favorable

Rule:
- no workflow may depend on circumventing free-tier limits, cycling accounts, VPN tricks, temporary emails, or watermark removal against platform terms.

## Audio / Speech

### Whisper
Role:
- narration transcription
- timing alignment
- captions
- scene segmentation

### MiniMax Speech
Potential role:
- faceless-channel narration
- pickups / corrections
- synthetic voice experiments

### Qwen audio-family models / other open speech models
Potential role:
- speech generation
- audio understanding
- utility processing

### Human Voice
For That Mike Hamilton:
- human Mike VO remains preferred for authenticity and personal-brand content.

For faceless channels:
- synthetic/licensed narration can be used if consistent and rights-compliant.

## Retrieval / RAG

### Embeddings
Candidates:
- BGE
- Jina Embeddings
- E5
- Nomic Embed

Use:
- search research dossiers
- retrieve prior scripts
- asset/transcript search
- channel knowledge
- source matching

### Rerankers
Candidates:
- BGE Reranker
- Jina Reranker
- Cohere Rerank

Use:
- improve retrieval precision before script generation or research synthesis

## Local / Open Model Principle

Use local/open models where they lower marginal cost or preserve privacy without creating unacceptable latency.

Use cloud models when:
- speed matters more than marginal cost
- local hardware is saturated
- quality is materially better
- the model is only available as a service

The orchestration layer decides based on:
- scene type
- quality target
- expected latency
- cost ceiling
- current queue depth
- model availability
- commercial-use constraints

## Render Tiers

### Tier 0 — Sandbox
- Hugging Face Spaces / demos / legitimate free tiers
- model discovery only
- never assume commercial rights or stability

### Tier 1 — Preview
- fastest / cheapest practical renderer
- reduced resolution or inference settings
- validate motion and composition

### Tier 2 — Production
- approved composition
- sensible quality/cost balance

### Tier 3 — Premium
- only for hero shots or difficult scenes
- highest-cost renderer/settings

### Tier 4 — Enhancement
- upscale / interpolation / cleanup after content is correct

## Model Router Requirements

Each adapter must expose a common interface similar to:

```ts
interface VideoRenderer {
  id: string;
  capabilities(): RendererCapabilities;
  estimate(job: SceneRenderRequest): Promise<CostEstimate>;
  render(job: SceneRenderRequest): Promise<RenderJob>;
  poll(jobId: string): Promise<RenderStatus>;
  cancel(jobId: string): Promise<void>;
}
```

The canonical scene record should store semantic intent, not provider-specific prompt syntax.

## Model Selection Heuristics

Examples:
- documentary wide infrastructure shot → LTX preview → H3 if preview fails or hero quality needed
- graphic/chart → no video model; motion graphics renderer
- actual historic location/event → prefer real/archive assets
- impossible visualization/reconstruction → generated video allowed with clear editorial framing
- close human face/dialogue → use best-performing model, stricter QC threshold
- fast background cutaway → inexpensive renderer

## Commercial / Rights Gate

Before a provider/model can be marked `production_allowed`, document:
- commercial-use license
- model license
- output ownership terms
- watermark rules
- data retention/training terms
- rate limits
- API stability

No tool enters production merely because a YouTube tutorial calls it "free" or "unlimited."
