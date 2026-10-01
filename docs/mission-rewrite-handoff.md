# Mission: Sangreal — rewrite handoff (30 September 2026)

The authoritative playable case is now `src/packs/sangreal-journals.yaml`, supported by the revised briefs, NPCs, sites, clues and relic sheets. The original design guide is historical reference, not current campaign canon.

## Resume the active campaign

The party has arrived, researched Vault IX, questioned Gerard and slept in Vatican guest rooms. Corvi’s room has not been investigated. Open the DA Walkthrough at **Start Here — Resume at the Vatican**. Keep the actual world day and filled shifts. Do not assume which individual clues the players obtained, or amend Gerard’s already-played testimony.

The first scene is breakfast and authorized access to Corvi’s room. It offers the room search, follow-up research, or a challenge to the Church’s safety assurance. It grants none of the unearned discoveries as a recap.

## Narrative decisions

- The expected San Greal / Holy Grail reading is encouraged by institutional silence. Sang Real is the blood reading: blood royal treated as holy blood. This is mission wordplay, not a claim that “real” literally means “holy.” Early player recognition is rewarded.
- The peace depends on the inability of existing vampires to expand without diluting their inheritance. Pure source material creates a threat outside that limit. A sustainable new lineage remains a fear, not an experiment already demonstrated.
- The Church fears renewed proliferation. The existing elders fear forced mortality. The Basarab command in this mission wants incineration; it has no unexplained immunity that lets it drink the source safely.
- Corvi stole the reserve to prevent institutional deployment, then knowingly made an inadequately supported healing bargain to fund his escape. That culpability explains the bank and clinic evidence.
- Claudia believes destruction protects humanity. Her helpfulness is sincere; her theft, conversion of allegiance, capture and death are all contingent.
- The default ledger is 12 → 11 after Hausmann → still 11 after the refused Turin sale → 10 after the conditional abbey break. Other outcomes use actual counts. Graf’s tests consume trace residue, not another whole vessel.
- Conversion uses 24 elapsed hours, equivalent to four operational board shifts. The old “six shifts (24 hours)” contradicted the four-shift day. Artifact combat bonuses and vampire Endure Difficulty 5 outcomes are preserved.
- The exact approved I04 cipher and image are unchanged. The square yields GENEUA / UBS / HAUSMANN / DDKI / C. Latin U/V normalization supplies GENEVA; the decimal indexing row ABCDEFGHIK = 1234567890 supplies 4409. This new explicit key replaces the old impossible claim that the letter square directly produced digits. Ghiberti, HQ, the blotter and a bank lookup provide fair support.
- No forced death, theft, spill or departure is needed to reach an ending. The Mission 2 bridge follows the actual result.

## Changed source content

All 14 walkthrough pages retain their existing positions and compiled identities. The first ten now form a playable case, followed by a 45-card evidence/limits index, conditional sound cues, a documentary-photo cue sheet and the existing C-series GM index. NPC stats and scene artwork remain unchanged. NPC motives, location guidance, clue interpretations, clocks, custody, relic wording, orientation and bridge are reconciled.

Existing theatre-of-the-mind images are embedded at the appropriate scenes; maps and evidence are linked. No images were regenerated or added, so there is no additional art footprint. All existing scene hashes were verified.

## Import with an active campaign

The source and `dist/` are updated; no live world has been imported or changed by this work. Back up the world and session annotations first. The existing Content Installer updates documents in place and can overwrite authored text and local edits; it is not a merge editor. It now preserves board day/shifts, discovered-card links, faction values/active/dormant state, consumed squares, triggered milestones and custom track entries. It also preserves information-card reveal state, organization activation state and existing permissions. It does not promise to merge arbitrary edited prose or restore NPC combat state.

For a targeted update, refresh the DA Walkthrough and reference documents first, then review the board’s revised milestone descriptions against your session notes. Never treat source day 14 as a instruction to restart the campaign. Restart Foundry if needed to load the updated installer script; do not run an import blindly over local annotations.

## Verification

Run `npm run validate`, `npm run build`, `npm run audit`, `npm run scenes:verify`, `npm run mission:verify`, and `npm run test:progress`.

The rewrite passed source validation, the 187-document / 11-pack audit, all 26 scene-art hash checks, 363 inline module links, 271 media references, the exact cipher decoder and three update-progress tests. Live Foundry rendering, dialogue pacing and player-account sharing remain table/runtime checks.

A local illustrated review copy is available at `/mnt/disk4/GPT-Projects/Neon-Relic-Sangreal/mission-rewrite/walkthrough-review.html`. Before-rewrite source backups are beside it in `before/`.
