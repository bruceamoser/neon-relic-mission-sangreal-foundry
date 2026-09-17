# Revised calibration review

**Accepted by Bruce on 2026-09-16.** The approved text revisions have been promoted to canonical outputs, with earlier versions preserved. Style calibration is APPROVED. The material below is the historical review record.

Eight separate text revisions passed visual QA. R01 now passes all four required clues after a localized pocket composite and separate analog timestamp lettering. All 12 previously approved images retain their original hashes. No Foundry integration has occurred.

Your feedback accepted the photographic style in principle. This review covers the changed lettering and completed CCTV frame; the style calibration checkpoint remains pending until these are accepted.

| Asset | Revision | Treatment |
|---|---|---|
| G03 | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/G03-text-v2.webp) | Worn carbon typewriter impressions, aligned to paper perspective. |
| Z03 | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/Z03-text-v2.webp) | Hand-drawn lab annotation with uneven pen strokes. |
| ref-ubs-key-tag | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/ref-ubs-key-tag-text-v2.webp) | Worn lettering sharing brass texture. |
| ref-green-railway-pass | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/ref-green-railway-pass-text-v2.webp) | Uneven typewriter ribbon on aged paper. |
| ref-sangreal-case | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/ref-sangreal-case-text-v2.webp) | Small worn metal lettering aligned to plaque. |
| ref-grey-lancia-scv47 | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/ref-grey-lancia-scv47-text-v2.webp) | Weathered plate lettering aligned to plate. |
| npc-corvi | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/npc-corvi-text-v2.webp) | Small plaque lettering, softened to photographic resolution. |
| T01 | [Open revised image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/composite/revisions/T01-text-v2.webp) | Plate wording rebuilt at scene scale, preserving border and screws. |
| R01 | [Open corrected CCTV](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/intel/i02-cctv-porta-santanna-0314.webp) | Ticket tucked behind cloth pocket lip; exact analog timestamp. |

Text revisions are review candidates, not replacements for the locked originals. Approval of these versions will require explicit promotion with the old assets archived and their reference hashes updated together.

Next: accept the revised calibration treatment, finish the remaining character and prop references, then produce Rome as the first complete Act. Source ambiguities listed in STATUS.md remain unresolved.

## Audit

Each revision has a YAML provenance file under `art/composite/revisions/` and a hash-bound final QA record under `art/qa/`. R01 uses attempt 004 with the unsuccessful generated pocket preserved before the manual correction.

Reusable surface lettering is in `tools/art/text_surface.py`; the exact Polaroid glyph strokes are in `tools/art/handwritten_label.py`. Full compositing layouts and scripts used for this pass are preserved under `art/work/history/production-scripts/`.
