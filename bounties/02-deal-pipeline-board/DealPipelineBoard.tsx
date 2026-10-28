'use client';

import React, { useMemo, useState } from 'react';

export type DealStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: DealStage;
  probability: number;
  createdAt: string;
}

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: 'lead', label: 'Lead', color: 'border-slate-500/40 bg-slate-500/10' },
  { id: 'qualified', label: 'Qualified', color: 'border-blue-500/40 bg-blue-500/10' },
  { id: 'proposal', label: 'Proposal', color: 'border-violet-500/40 bg-violet-500/10' },
  { id: 'negotiation', label: 'Negotiation', color: 'border-amber-500/40 bg-amber-500/10' },
  { id: 'won', label: 'Closed Won', color: 'border-emerald-500/40 bg-emerald-500/10' },
  { id: 'lost', label: 'Closed Lost', color: 'border-rose-500/40 bg-rose-500/10' },
];

const INITIAL_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Enterprise CRM Rollout',
    company: 'Northstar Systems',
    contact: 'Ava Patel',
    value: 48000,
    stage: 'negotiation',
    probability: 70,
    createdAt: '2026-10-12',
  },
  {
    id: 'd2',
    title: 'Sales Ops Automation',
    company: 'Cobalt Labs',
    contact: 'Marcus Reed',
    value: 18500,
    stage: 'proposal',
    probability: 45,
    createdAt: '2026-10-18',
  },
  {
    id: 'd3',
    title: 'Starter Workspace',
    company: 'Brightworks',
    contact: 'Lin Chen',
    value: 4200,
    stage: 'qualified',
    probability: 30,
    createdAt: '2026-10-20',
  },
  {
    id: 'd4',
    title: 'Annual Platform License',
    company: 'Apex Fintech',
    contact: 'Elena Rostova',
    value: 72000,
    stage: 'lead',
    probability: 15,
    createdAt: '2026-10-22',
  },
  {
    id: 'd5',
    title: 'Team Expansion Seats',
    company: 'CloudScale',
    contact: 'Marcus Vance',
    value: 9600,
    stage: 'won',
    probability: 100,
    createdAt: '2026-09-28',
  },
];

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function uid(): string {
  return `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function DealPipelineBoard() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // New deal form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<DealStage>('lead');

  const byStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = {
      lead: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: [],
    };
    for (const d of deals) {
      map[d.stage].push(d);
    }
    return map;
  }, [deals]);

  const totals = useMemo(() => {
    const result: Record<DealStage, { count: number; value: number }> = {
      lead: { count: 0, value: 0 },
      qualified: { count: 0, value: 0 },
      proposal: { count: 0, value: 0 },
      negotiation: { count: 0, value: 0 },
      won: { count: 0, value: 0 },
      lost: { count: 0, value: 0 },
    };
    for (const d of deals) {
      result[d.stage].count += 1;
      result[d.stage].value += d.value;
    }
    return result;
  }, [deals]);

  const pipelineValue = useMemo(
    () =>
      deals
        .filter((d) => d.stage !== 'won' && d.stage !== 'lost')
        .reduce((sum, d) => sum + d.value * (d.probability / 100), 0),
    [deals]
  );

  const wonValue = useMemo(
    () => deals.filter((d) => d.stage === 'won').reduce((sum, d) => sum + d.value, 0),
    [deals]
  );

  const moveDeal = (dealId: string, newStage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: newStage,
              probability:
                newStage === 'won' ? 100 : newStage === 'lost' ? 0 : d.probability,
            }
          : d
      )
    );
  };

  const handleDrop = (targetStage: DealStage) => {
    if (!draggingId) return;
    moveDeal(draggingId, targetStage);
    setDraggingId(null);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;
    const numValue = Number(value) || 0;
    const newDeal: Deal = {
      id: uid(),
      title: title.trim(),
      company: company.trim(),
      contact: contact.trim() || '—',
      value: Math.max(0, numValue),
      stage,
      probability: stage === 'won' ? 100 : stage === 'lost' ? 0 : 20,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setDeals((prev) => [newDeal, ...prev]);
    setTitle('');
    setCompany('');
    setContact('');
    setValue('');
    setStage('lead');
    setShowForm(false);
  };

  const deleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 p-4 sm:p-6 font-sans">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[#D4AF37]/30 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
              Agent Midas
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Deal Pipeline Board</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Kanban-style deal tracker with drag-and-drop stages
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-center">
              <div className="text-xs text-zinc-400">Weighted Pipeline</div>
              <div className="text-lg font-bold text-[#D4AF37]">{formatMoney(pipelineValue)}</div>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center">
              <div className="text-xs text-emerald-400/80">Closed Won</div>
              <div className="text-lg font-bold text-emerald-400">{formatMoney(wonValue)}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black hover:opacity-90"
            >
              {showForm ? 'Cancel' : '+ Add Deal'}
            </button>
          </div>
        </header>

        {/* Add Deal Form */}
        {showForm && (
          <form
            onSubmit={handleAddDeal}
            className="grid gap-3 rounded-xl border border-white/10 bg-[#121212] p-4 sm:grid-cols-2 lg:grid-cols-6"
          >
            <input
              required
              placeholder="Deal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
            <input
              required
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
            <input
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
            <input
              type="number"
              min={0}
              placeholder="Value ($)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black hover:opacity-90"
            >
              Save Deal
            </button>
          </form>
        )}

        {/* Kanban Board */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((s) => (
            <div
              key={s.id}
              className="flex w-72 shrink-0 flex-col rounded-xl border border-white/10 bg-[#121212]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(s.id)}
            >
              {/* Column header */}
              <div className={`border-b border-white/10 px-3 py-3 ${s.color}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{s.label}</h2>
                  <span className="rounded-full bg-black/40 px-2 py-0.5 text-xs text-zinc-300">
                    {totals[s.id].count}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  {formatMoney(totals[s.id].value)}
                </p>
              </div>

              {/* Cards */}
              <div className="flex flex-1 flex-col gap-2 p-2 min-h-[180px]">
                {byStage[s.id].map((deal) => (
                  <article
                    key={deal.id}
                    draggable
                    onDragStart={() => setDraggingId(deal.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={`cursor-grab rounded-lg border border-white/10 bg-[#0A0A0A] p-3 shadow transition hover:border-[#D4AF37]/40 active:cursor-grabbing ${
                      draggingId === deal.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug text-white">
                        {deal.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => deleteDeal(deal.id)}
                        className="text-xs text-zinc-500 hover:text-rose-400"
                        aria-label="Delete deal"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {deal.company} · {deal.contact}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#D4AF37]">
                        {formatMoney(deal.value)}
                      </span>
                      <span className="text-xs text-zinc-500">{deal.probability}%</span>
                    </div>

                    {/* Quick move buttons */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {STAGES.filter((st) => st.id !== deal.stage).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => moveDeal(deal.id, st.id)}
                          className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-white/10 hover:text-white"
                        >
                          → {st.label}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}

                {byStage[s.id].length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-zinc-600">
                    Drop deals here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center text-xs text-zinc-500">
          Drag cards between columns or use quick-move buttons. Weighted pipeline =
          open deals × probability.
        </footer>
      </div>
    </div>
  );
}

export default DealPipelineBoard;
