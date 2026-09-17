# Sangreal landing scene

The module ships the landing scene twice, for two different workflows:

1. **Automatic (preferred):** the scene is in the module's `sangreal-scenes` compendium. Running **Configure Settings → Module Settings → Mission: Sangreal → Content Installer** imports it into the world's Scenes directory and activates it automatically when the world has no active scene. It carries the `landingPage` flag that the activation logic looks for.
2. **Manual import (fallback):** in Foundry v14, create an empty Scene, right-click it in the Scenes directory, choose **Import Data**, and select `sangreal-landing.json`. Activate the imported scene and drag player actors into the open FIELD TEAM panel.

In both cases the scene is gridless, uses 140-pixel tokens, and disables token vision and fog exploration. Players still need ownership of their actors to move their tokens.

The background is `modules/neon-relic-mission-sangreal/assets/art/sangreal-landing.webp` (1672 × 941). No story clues are present. All scene tokens and placeable collections start empty. This is a portable scene JSON, not an automatic world import.

Scene fields follow the Foundry v14 Scene and Level schemas:
https://foundryvtt.com/api/interfaces/foundry.documents.types.SceneData.html
https://foundryvtt.com/api/interfaces/foundry.documents.types.LevelData.html

File structure and image paths have been checked; the compendium-pack path is exercised by the Content Installer, while direct Import Data of the JSON follows the same Scene schema.
