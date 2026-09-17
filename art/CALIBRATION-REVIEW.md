# Current review

**Accepted by Bruce on 2026-09-16.** The approved text revisions have been promoted to canonical outputs, with earlier versions preserved. Style calibration is APPROVED. The material below is the historical review record.

The revised lettering and completed R01 are ready in [TEXT-REVISION-REVIEW.md](TEXT-REVISION-REVIEW.md). The historical first-pass report below is retained for audit; its R01 blocker has since been resolved.

# Calibration production review

Generated 13 standalone asset jobs across 18 generation/edit calls. 12 assets passed final visual and production QA. No human checkpoint has been recorded and no module records have been integrated.

## Calibration images

| Job | Result | Review file |
|---|---|---|
| npc-corvi | APPROVED | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/npc-corvi.webp) |
| R01 | BLOCKED | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/work/R01/attempt-003.png) |
| R03 | APPROVED | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/intel/i01-vault-altar-forensic.webp) |
| G03 | APPROVED | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/intel/i06-escrow-slip-carbon.webp) |
| Z03 | APPROVED | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/intel/i09-histology-polaroid.webp) |
| T01 | APPROVED | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/intel/i33-lingotto-rooftop.webp) |

R01: after three attempts the card still looks badge-mounted instead of protruding from a pocket. The faint human shadow, pitch-black case shadow and partly cropped Vane now pass. Do not automatically regenerate again. Recommended next treatment: a localized masked/manual pocket-and-pass edit, then separate timestamp compositing and complete final QA. The best full frame and all rejected attempts are preserved.

## Calibration prerequisites

| Job | Result | Review file |
|---|---|---|
| npc-vane | QA approved; human set review pending | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/npc-vane.webp) |
| ref-sangreal-case | QA approved; human set review pending | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-sangreal-case.webp) |
| ref-grey-lancia-scv47 | QA approved; human set review pending | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-grey-lancia-scv47.webp) |
| ref-green-railway-pass | QA approved; human set review pending | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-green-railway-pass.webp) |
| ref-ubs-key-tag | QA approved; human set review pending | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-ubs-key-tag.webp) |
| ref-rosary-thread-sheath | QA approved; human set review pending | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-rosary-thread-sheath.webp) |
| ref-sonnenberg-logo | QA approved; human set review pending | [Open standalone image](/mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-sonnenberg-logo.webp) |

## Review focus

- Muted analog color, grain, shadow readability and 1987 period details.
- Corvi and Vane identity, costume and recurring case/rosary/vehicle designs.
- The clinic logo is a proposed sun-and-mountain design, awaiting human prop-set approval.
- Exact wording was composited separately. The escrow memo is wrapped across two lines and its pencil tick sits next to “1 of 12”.
- R01 and T01 prompt metadata distinguish tiny reference labels from source-local readable clues. T01’s actual plate was readable, so SCV 47 was composited separately before approval.
- Human style approval is still pending; the configured calibration gate cannot pass while R01 remains blocked.

## Audit and files

[Manifest](art-manifest.yaml) · [Status](STATUS.md) · [QA reports](qa/) · [Attempt histories](work/history/)

Final images use their required WebP filenames. Human set approval is separate from the QA-approved asset locks. Original SVGs and module card/actor records remain unchanged.
