# Kurt Hausmann — Newly Made Vampire

Designed as a dangerous solo encounter for five armed investigators in Ward Three. This is an encounter-specific profile, not a generic elder vampire. The pre-existing Hausmann actor remains available for earlier appearances.

## Statistics

| Statistic | Value |
| --- | --- |
| Tier | 4 |
| STR / AGI / WIT / EMP | 7 / 5 / 3 / 1 |
| Brawl / Force / Sneak / Investigate | 4 / 4 / 3 / 2 |
| Armor | 2 |
| Fear | 2; escalates to 3 when the first bite visibly feeds |
| Corruption stage | 3 |
| Full-strength attack pool | 11 dice; 13 against a wounded target |

NPC attributes are scalar values in Neon Relic. Track Physical Damage by reducing current STR from 7; do not add a separate Health field. Recalculate STR-based pools as he weakens. At STR 0 he is Broken and cannot attack or use his extra activation. Resolve finishing injuries and death under the normal rules; no automatic recovery, regeneration, ash transformation or reconstitution.

The system's actor `applyDamage` helper currently handles agents only. Adjust this NPC's numeric STR on its sheet manually. Abilities, damage resistance and the extra activation are also DA-adjudicated; embedded weapons and talents provide the records, not automatic scripts.

## Attacks

- **Raking claws:** Slow Action, Brawl, engaged range, base Physical Damage 2. Additional successes use the normal combat stunts. A grapple, shove or disarm uses the normal opposed maneuver instead of also dealing free claw damage.
- **Ravenous bite:** Slow Action, Brawl, engaged range, base Physical Damage 3. Requires a grapple he already holds from an earlier action. Defense and armor apply normally. It is unavailable during his extra activation. Feeding gives no healing or automatic infection; a separate attack is never free with a successful grapple.

## Abilities

- **Blood Frenzy:** +2 Brawl dice against a target currently carrying Physical Damage. Check the target's actual condition, not a decorative bloodstain. Applies to claws, bite and grapples; add the bonus once. No bonus against uninjured investigators.
- **Unnatural tissue:** resolve normal armor first, then halve the remaining ballistic Physical Damage, rounding up. Example: 3 damage remaining after armor becomes 2; 1 becomes 1. A successful brainstem called shot using the table's normal targeting procedure bypasses the halving, not armor. Melee, fire and other damage are not halved. Announce the resistance when the first shot lands; firearms can still kill him.
- **Feral surge — solo encounter rule:** draw two distinct initiative cards for the same actor. On the first activation he receives the normal action allowance. On the second he receives one Slow Action only: a claw attack, grapple, shove, disarm, or movement up to one zone. No bite, extra Fast Action or third activation. Both activations share one position, damage total and conditions. Grappled, stunned, Broken or otherwise restricted means both activations respect that restriction. He takes at most two attacks per round. If the tracker cannot represent two slots for one token, note the second card and resolve it manually. Do not add a second token or actor.
- **Wall-crawler:** may move on solid walls and ceilings using normal movement actions and distance. No teleport, free disengagement or automatic concealment. A grapple or blocked route still stops him. His hands scrape audibly and players can illuminate his actual position.
- **Light vulnerability:** direct sunlight or focused UV inflicts 2 unsoakable Physical Damage per round of actual exposure, once per round even with two activations. No halving. Ordinary lamps and camera flashes do not deal this damage. Focused UV must be equipment the cell really has; the encounter occurs at night.

## Run the fight

Describe the scrape overhead and his shape between flickers before initiative. Check normal awareness and Fear; darkness does not grant automatic surprise. Begin with the closest exposed wounded person as his focus; interposition and a closed theatre door can protect Graf. He attacks living threats, not helpless investigators for guaranteed executions.

Use the northeast lift or northwest stairs on BM04. Keep the surviving nurse inside the southeast theatre. Room 3.14 is the middle northern patient room; its exterior window is the escape route. Moving into the room, breaking the glass and getting through consume normal actions. Show his glance toward the window before he tries it. The cell can intercept or block him.

At current STR 3 or lower, or once the cell seals the victims away, he prioritizes escape. He does not automatically succeed. A restrained vampire remains restrained; lethal damage is honored. Once he is Broken the second initiative card is inactive. If he escapes, record the last sighting and request specialist containment through Petra.

This should hurt without requiring a special weapon to win: concentrated fire still accumulates damage; melee avoids the ballistic resistance; a grapple or door denies actions; protecting wounded people removes his easiest targets. If fewer than five investigators actually enter the fight, omit the second initiative activation before initiative is drawn and state the chosen version in the DA notes. Do not change his defenses secretly during combat.
