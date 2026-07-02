/**
 * The single decision object a plan's post-back returns. The serve-plan server writes it
 * verbatim; the calling skill reads it and acts. Every interactive component carries a stable
 * `data-id`, and that id is what appears in `flips` / `revisit`.
 */
export interface Decision {
  /** Approve (`true`) vs Adjust (`false`). */
  readonly approved: boolean;
  /** `data-id`s of picks the user flipped (chosen ↔ rejected). Re-open the grill on these. */
  readonly flips: readonly string[];
  /** `data-id`s marked "revisit" without a firm decision. */
  readonly revisit: readonly string[];
  /** Free text from the notes box. */
  readonly notes: string;
}
