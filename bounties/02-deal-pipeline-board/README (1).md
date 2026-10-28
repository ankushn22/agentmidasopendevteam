# Bounty #2 — Deal Pipeline Board ($200)

Kanban-style deal tracker with drag-and-drop stages for Agent Midas.

## Features

- 6 pipeline stages: Lead → Qualified → Proposal → Negotiation → Closed Won / Closed Lost
- Drag-and-drop cards between columns
- Quick-move buttons on every card
- Add new deals with title, company, contact, value, stage
- Per-stage count + total value
- Weighted pipeline value (open deals × probability)
- Closed Won total
- Delete deals
- Agent Midas Black / Gold design (`#0A0A0A` + `#D4AF37`)
- Fully client-side, no external dependencies beyond React

## Quick Start

```tsx
import { DealPipelineBoard } from './DealPipelineBoard';

export default function Page() {
  return <DealPipelineBoard />;
}
```

## File Structure

```
bounties/02-deal-pipeline-board/
├── DealPipelineBoard.tsx
├── index.ts
└── README.md
```

## Design

- Background: `#0A0A0A`
- Accent: `#D4AF37`
- Cards & columns use subtle borders + dark surfaces
- Responsive horizontal scroll on smaller screens
