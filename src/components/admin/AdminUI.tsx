import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Loader2, Plus, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/lib/supabase";

const inputClass =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
const labelClass = "block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground";

// ─── Labelled text input ──────────────────────────────────────────────────────
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

// ─── Labelled textarea ────────────────────────────────────────────────────────
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}

// ─── URL input with an upload button (Supabase Storage) ───────────────────────
export function MediaField({
  label,
  value,
  onChange,
  accept = "image/*",
  folder,
  placeholder = "https://... or upload a file",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept?: string;
  /** Storage folder, e.g. "home" or "events/haryana-hackathon". */
  folder: string;
  placeholder?: string;
}) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(true);
    const url = await uploadMedia(file, folder);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (url) onChange(url);
    else setError("Upload failed. Check the file size and try again.");
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-1.5 border border-border px-3 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── On/off switch ────────────────────────────────────────────────────────────
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring focus-visible:ring-primary/50 ${
        checked ? "bg-primary border-primary" : "bg-muted border-border"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
export function AdminCard({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">{title}</p>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Status text for save buttons ─────────────────────────────────────────────
export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function SaveStatusText({ status }: { status: SaveStatus }) {
  if (status === "saving") return <span className="text-xs text-muted-foreground">Saving…</span>;
  if (status === "saved") return <span className="text-xs font-semibold text-primary">✓ Saved</span>;
  if (status === "error")
    return <span className="text-xs font-semibold text-destructive">Save failed. Try again.</span>;
  return null;
}

// ─── Page header with breadcrumb + save button ────────────────────────────────
export function AdminHeader({
  title,
  description,
  previewTo,
  status,
  onSave,
  saveDisabled,
}: {
  title: string;
  description: string;
  previewTo: string;
  status: SaveStatus;
  onSave: () => void;
  saveDisabled?: boolean;
}) {
  return (
    <section className="section-padding pb-6 border-b border-border">
      <div className="container mx-auto max-w-5xl space-y-5">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground">
          <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin Panel
          </Link>
          <span>/</span>
          <span className="text-foreground">{title}</span>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">{title} — Editor</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <SaveStatusText status={status} />
            <Link
              to={previewTo}
              target="_blank"
              className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview
            </Link>
            <Button size="sm" onClick={onSave} disabled={saveDisabled || status === "saving"} className="flex items-center gap-2">
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Small icon button ────────────────────────────────────────────────────────
export function IconButton({
  label,
  onClick,
  children,
  danger,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`shrink-0 p-1 text-muted-foreground transition-colors disabled:opacity-30 ${
        danger ? "hover:text-destructive" : "hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Dashed "add" button ──────────────────────────────────────────────────────
export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors w-full justify-center"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

/** Wraps an async save with status handling. */
export function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const run = async (save: () => Promise<boolean>) => {
    setStatus("saving");
    const ok = await save();
    setStatus(ok ? "saved" : "error");
    if (ok) setTimeout(() => setStatus("idle"), 2500);
  };
  return { status, run };
}
