# Mission: Sangreal 1.18.1 — Hausmann NPC Sheet Compatibility

Updates **Kurt Hausmann — Newly Made Vampire** for the redesigned NPC sheet without changing his combat balance or document IDs.

- All fourteen canonical skills are explicitly populated: Brawl 4, Force 4, Sneak 3, Investigate 2, and zero in the other ten skills. Starting pools are 11, 11, 8 and 5 respectively.
- Claws and bite are intact natural weapons using Brawl with zero gear bonus. Their attack rules explain when each action is available and how to apply Blood Frenzy.
- Blood Frenzy records its Brawl +2 conditional modifier. All six talents contain complete rules for the Combat tab. Conditional modifiers and encounter effects remain manually adjudicated.
- DA notes now explain the sheet controls without duplicating the entire embedded ability list. Actor and item IDs, stats, portrait and token remain stable.

Requires **Neon Relic 0.12.1**, which replaces the empty NPC skills schema with declared skill fields. Version 0.12.0 can hide skill ratings even when the source actor contains them.

Update the system first, then the mission. Reload the world and run **Mission: Sangreal → Content Installer** to refresh the existing actor. For an existing placed unlinked token, replace it from the refreshed actor or update its synthetic actor data; installer refreshes do not rewrite live scene tokens. No balance change or automatic Blood Frenzy is introduced.

Validation includes source validation, production build, pack audit, links/media, scene integration, progress preservation, and direct cleaning/initialization checks using installed Foundry field implementations.
