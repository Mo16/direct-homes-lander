"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowDown01Icon, Calendar03Icon, Csv01Icon, Download04Icon, FileDownloadIcon, Pdf01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { Column } from "./ui";
import { cn } from "@/lib/utils";

/*
 * Tax, shown as three pieces of the real app (webapp Finance): the Add expense form with its HMRC category hints,
 * the Profit and loss report on Reports, and Download a tax year on Export with the Making Tax Digital summary.
 * Copy, labels and hints are the app's own; amounts are the demo portfolio's tax year 2026/27.
 */

/** Each piece is drawn at this size and scaled to its box, like a screenshot. */
const DW = 560;
const DH = 470;

function useFit() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / DW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [box, scale] as const;
}

function Shot({ title, text, wash, children }: { title: string; text: string; wash?: string; children: ReactNode }) {
  const [box, scale] = useFit();
  return (
    <figure>
      <div ref={box} className={cn("brand-wash relative overflow-hidden rounded-panel", wash)} style={{ aspectRatio: `${DW} / ${DH}` }}>
        <div aria-hidden inert className={cn("pointer-events-none select-none", scale === null && "[zoom:0.6]")} style={{ width: DW, height: DH, ...(scale === null ? {} : { zoom: scale }) }}>
          <div className="absolute top-1/2 right-8 left-8 -translate-y-1/2 rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.12),0_24px_40px_-26px_rgb(30_28_40/0.5)]">{children}</div>
        </div>
      </div>
      <figcaption className="px-1 pt-4 lg:pt-5">
        <p className="text-[17px] text-ink">{title}</p>
        <p className="mt-1.5 max-w-[26rem] text-[15px] leading-[1.5] text-ink-2">{text}</p>
      </figcaption>
    </figure>
  );
}

/* ---------- The app's own small pieces ---------- */

function Field({ label, children, hint, wide }: { label: string; children: ReactNode; hint?: ReactNode; wide?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1.5", wide && "col-span-2")}>
      <span className="px-1 text-[13px] text-ink-2">{label}</span>
      {children}
      {hint ? <p className="px-1 text-[12.5px] leading-snug text-muted">{hint}</p> : null}
    </div>
  );
}

function Input({ children, icon, muted }: { children: ReactNode; icon?: typeof ArrowDown01Icon; muted?: boolean }) {
  return (
    <span className={cn("flex h-11 items-center justify-between gap-2 rounded-control bg-surface px-4 text-[14px] whitespace-nowrap", muted ? "text-muted" : "text-ink")}>
      <span className="truncate">{children}</span>
      {icon ? <Icon icon={icon} size={17} className="text-muted" /> : null}
    </span>
  );
}

function Button({ icon, children, ink }: { icon: typeof ArrowDown01Icon; children: ReactNode; ink?: boolean }) {
  return (
    <span className={cn("inline-flex h-9 items-center gap-1.5 self-start rounded-control px-3.5 text-[13.5px] whitespace-nowrap", ink ? "bg-ink text-white" : "bg-surface text-ink")}>
      <Icon icon={icon} size={16} />
      {children}
    </span>
  );
}

/* ---------- 1. Add expense: the category picker with its HMRC hint ---------- */

const EXPENSES = [
  { home: "Cotham Vale", date: "2 Oct 2026", amount: "96.00", category: "Repairs and maintenance", hint: "Fixing or maintaining what is there, like for like. Improvements are capital, not an expense.", what: "Annual boiler service", from: "Avon Heating Ltd" },
  { home: "Lavender Grove HMO", date: "6 Oct 2026", amount: "221.81", category: "Utilities", hint: "Gas, electricity, water and broadband you pay for the tenants.", what: "HMO gas and electricity", from: "Octopus Energy" },
  { home: "Cotham Vale", date: "1 Oct 2026", amount: "535.00", category: "Finance costs", hint: "Mortgage interest and finance arrangement fees. Not the capital repaid.", what: "Mortgage interest, September", from: "Bristol Building Society" },
  { home: "15 St Leonard's Road", date: "28 Sept 2026", amount: "75.00", category: "Legal and professional", hint: "Accountants, solicitors, licence fees and safety certificates.", what: "Gas safety record", from: "Exeter Gas Services" },
];

function AddExpense({ i }: { i: number }) {
  const e = EXPENSES[i];
  return (
    <div className="rounded-[8px] bg-lift p-5">
      <p className="text-[18px] leading-tight">Add expense</p>
      <p className="mt-1 text-[13.5px] leading-snug text-muted">Record what you paid, when, and for which property. Keep the receipt with it for your tax return.</p>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3.5">
        <Field label="Property">
          <Input icon={ArrowDown01Icon}>{e.home}</Input>
        </Field>
        <Field label="Date paid">
          <Input icon={Calendar03Icon}>{e.date}</Input>
        </Field>
        <Field label="Amount">
          <Input>
            <span className="text-muted">£ </span>
            <span className="tabular">{e.amount}</span>
          </Input>
        </Field>
        <Field label="Category">
          <span className="flex h-11 items-center justify-between rounded-control bg-white px-4 text-[14px] ring-2 ring-accent">
            {e.category}
            <Icon icon={ArrowDown01Icon} size={17} className="text-muted" />
          </span>
        </Field>
        <p className="col-span-2 -mt-1.5 min-h-[36px] px-1 text-[12.5px] leading-snug text-muted">{e.hint}</p>
        <Field label="What was it for?" wide>
          <Input>{e.what}</Input>
        </Field>
      </div>
    </div>
  );
}

/* ---------- 2. Reports: profit and loss ---------- */

function ProfitAndLoss() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {["Tax year 2026/27", "All properties"].map((t) => (
          <span key={t} className="flex h-10 items-center gap-2.5 rounded-control bg-surface px-4 text-[13.5px]">
            {t} <Icon icon={ArrowDown01Icon} size={15} />
          </span>
        ))}
      </div>
      <div className="panel p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[18px] leading-tight">Profit and loss</p>
            <p className="mt-1 text-[13.5px] leading-snug text-muted">All properties, tax year 2026/27. Cash basis, before tax.</p>
          </div>
          <div className="flex gap-2">
            <Button icon={Csv01Icon}>CSV</Button>
            <Button icon={Pdf01Icon}>PDF</Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            ["Rent received", "£93,300.00", "6 Apr 2026 to 5 Apr 2027"],
            ["Expenses", "£7,442.13", "Includes £183 rent collection fees"],
            ["Net profit", "£85,857.87", "Across 7 properties"],
          ].map(([label, value, hint]) => (
            <div key={label} className="flex flex-col rounded-tile bg-surface px-3.5 py-3.5">
              <span className="text-[12.5px] text-muted">{label}</span>
              <span className="mt-1 text-[21px] leading-tight font-light tabular">{value}</span>
              <span className="mt-auto pt-1.5 text-[12px] leading-snug text-muted">{hint}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 px-1 text-[12.5px] leading-snug text-muted">The PDF and CSV break this down by property and by HMRC expense heading.</p>
      </div>
    </div>
  );
}

/* ---------- 3. Export: download a tax year ---------- */

function Export() {
  return (
    <div className="panel p-5">
      <p className="text-[18px] leading-tight">Download a tax year</p>
      <p className="mt-1 text-[13.5px] leading-snug text-muted">Spreadsheet files you can open in Excel or Numbers, or give to your accountant.</p>
      <div className="mt-4 grid grid-cols-[3fr_2fr] gap-3">
        <Field label="Tax year">
          <Input icon={ArrowDown01Icon}>2026/27 (6 Apr 2026 to 5 Apr 2027)</Input>
        </Field>
        <Field label="Properties">
          <Input icon={ArrowDown01Icon}>All properties</Input>
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3 rounded-tile bg-white p-4">
          <div>
            <p className="text-[14.5px]">Making Tax Digital summary</p>
            <p className="mt-1 text-[13px] leading-snug text-muted">Rent and expense totals under HMRC&rsquo;s UK property headings, ready to copy into MTD software.</p>
          </div>
          <span className="mt-auto">
            <Button icon={Download04Icon} ink>
              Download summary
            </Button>
          </span>
        </div>
        <div className="flex flex-col gap-3 rounded-tile bg-surface p-4">
          <div>
            <p className="text-[14.5px]">Every transaction</p>
            <p className="mt-1 text-[13px] leading-snug text-muted">Each rent receipt, refund, fee and confirmed expense with its date, property and category.</p>
          </div>
          <span className="mt-auto">
            <Button icon={FileDownloadIcon}>Download transactions</Button>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- The section ---------- */

export function SectionTax() {
  const row = useRef<HTMLDivElement>(null);
  const seen = useInView(row, { amount: 0.3 });
  const still = useReducedMotion();
  const [i, setI] = useState(0);

  // While the boxes are on screen, the form steps through a few expenses so the category hint can be seen changing.
  useEffect(() => {
    if (!seen || still) return;
    const t = setInterval(() => setI((n) => (n + 1) % EXPENSES.length), 3200);
    return () => clearInterval(t);
  }, [seen, still]);

  return (
    <section id="tax" aria-labelledby="tax-title" className="scroll-mt-[-56px] pt-24 sm:scroll-mt-[-88px] sm:pt-32">
      <Column>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:items-start">
          <h2 id="tax-title" className="text-[clamp(25px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Tax time,
            <br />
            already sorted.
          </h2>
          <p className="max-w-[40rem] text-[17px] leading-[1.55] text-ink-2 xl:pt-2">
            Every cost goes under the right HMRC heading as you log it. When the tax year ends, your profit and loss and a Making Tax Digital summary are one download away.
          </p>
        </div>

        <div ref={row} className="mt-10 grid gap-x-2 gap-y-8 lg:mt-14 lg:grid-cols-3">
          <Shot title="HMRC headings as you go" text="Pick a category and the app says what belongs in it. The receipt stays with the cost.">
            <AddExpense i={i} />
          </Shot>
          <Shot title="Profit and loss for any tax year" wash="brand-wash-2" text="Rent from your ledger less what you spent, for one home or all of them, as CSV or PDF.">
            <ProfitAndLoss />
          </Shot>
          <Shot title="Ready for Making Tax Digital" wash="brand-wash-3" text="One summary under HMRC's property headings, for your accountant or your MTD software.">
            <Export />
          </Shot>
        </div>
      </Column>
    </section>
  );
}
