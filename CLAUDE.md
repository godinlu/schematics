# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Schématèque Solisart** — A PHP web application for generating hydraulic heating system schematics, execution schemas, and quotes. The app composes PNG image layers using PHP's GD library to build complex HVAC diagrams.

## Local Development

The app runs under **Laragon** (Apache + MySQL). Access it at `http://localhost/schematics`.

Required `.env` file at `htdocs/schematics/config/.env` (not committed):

```env
DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=
ADMIN_USER=
ADMIN_PASS=
API_KEY=
```

SQL migration scripts are in `dev/` (e.g., `dev/categorie.sql`, `dev/drop_db_local.sql`).

There is no build system — no npm, no Composer. Pure PHP + vanilla JS.

**URL difference:** On localhost, `BASE_URL` resolves to `/schematics/htdocs/schematics/`. On production it resolves to `/schematics/`. This is handled automatically in `config/config.php`.

## Deployment

- **GitHub Actions** handles deployment via SSH push to Gandi hosting.
- Workflows: `.github/workflows/deploy.yml` (main) and `deploy_dev.yml` (dev).
- `new_version.sh` — version/deployment helper script.

## Architecture

### Routing

`htdocs/schematics/index.php` is the sole entry point. It strips `BASE_URL` from the request and dispatches to page templates in `htdocs/schematics/pages/`:

| Route | Page |
| --- | --- |
| (default) / `formulaire` | `formulaire.php` — form builder |
| `schema_hydrau` | `schema_hydrau.php` — hydraulic schema viewer |
| `schema_exe` | `schema_exe.php` — execution schema viewer |
| `fiche_prog` | `fiche_prog.php` — programming sheet |
| `devis` | `devis.php` — quote generator |
| `admin` | `admin.php` — admin panel (HTTP Basic Auth) |

### Image Generation (Core Logic)

Located in `htdocs/schematics/includes/functions/images/`:

- **`Schema.php`** — Abstract base class. Wraps PHP GD: `addImage()`, `addLabel()`, `addParagraphe()`.
- **`Module.php`** — Extends `Schema`. Handles modular/zone-based layouts.
- **`SchemaHydrau.php`** — Hydraulic schema generator. Reads installation type options, stacks PNG layers, generates basic/annotated/complete versions with legend.
- **`SchemaExe.php`** — Execution schema generator. Uses JSON coordinate files for element placement.
- **`ImageFicheProg.php`** — Programming sheet image generator.
- **`Etiquetage.php`** — Label/tag overlay generator.
- **`image_utils.php`** — Helper functions for image composition and table rendering.
- **`table/`** — `Table`, `Row`, `Cell`, `Label` classes for structured GD table rendering.

JSON configuration files (in `assets/`) define element coordinates:

- `coord_module.json`, `coord_schema_exe.json` — position maps for schema components.

### API Endpoints

`htdocs/schematics/api/`:

- **`generateSchema.php`** — Main schema generation endpoint. Accepts `?image=<type>&format=<fmt>` with POST body as JSON. Valid `image` values: `schema_hydrau_brut`, `schema_hydrau_annote`, `schema_hydrau_complet`, `schema_exe`, `etiquetage`, `fiche_prog`. Valid `format` values: `png`, `pdf`.
- **`generateSchemaReport.php`** — Generates a full multi-page PDF report (hydraulic schema + exe schema + etiquetage + fiche prog) from a JSON body containing `{formulaire, fiche_prog}`.
- **`save_devis.php`** — Saves quotes to DB (uses transactions + versioning).
- **`export_devis.php`** — Exports quotes, requires API key.
- **`updateArticle.php`** — Updates article prices in DB.

### Database

PDO Singleton: `includes/functions/db/SchematicsDatabase.php`

Repository: `includes/functions/db/ArticleCategoryRepository.php`

Key tables: `article`, `category`, `category_article`, `devis_genere`, `devis_ligne`.

### Frontend

Vanilla JS (ES6 modules), no framework. Each page declares `$css` and `$js` arrays, loaded by `includes/head.php`. Pages call `api/generateSchema.php` asynchronously to render schema previews.

**Cross-page state** is managed by `assets/js/core/session.store.js`, which exposes a global `sessionStore` singleton. It persists `formulaire`, `fiche_prog`, and `devis` objects in `sessionStorage`. Accessing `sessionStore.formulaire` when not on the formulaire page and no data exists will redirect to `/formulaire`.

**Formulaire JS architecture** (`assets/js/pages/formulaire/`):

- `options.config.js` — Defines all form fields and their allowed values. Each option value is associated with an array of resource tags (e.g. `"S7"`, `"C1"`, `"T3"`). Tags prefixed with `>` mean the option emits that resource; `<` means it consumes it; unprefixed means both.
- `rules.config.js` — Defines conditional rules (`RulesConfig`): `when` predicate, `allow` map (field → permitted options), and a `reason` string. Also defines `event_rules` that force field values when a condition triggers.
- `rule_engine.js` — `RuleEngine` class. On each `resolve(context)` call it iteratively applies resource constraints (mutual exclusion of shared outputs/circulators/probes) and rule constraints until the context stabilizes. Modifies `context` in-place.
- `formulaire_app.js` — `FormulaireApp` orchestrates the DOM: initializes `RuleEngine`, calls `resolve()` on each user interaction, updates field states, and saves the result to `sessionStore`.

`assets/img/` holds thousands of PNG components organized under `schema_exe/` and `schema_hydro/`. **Image filenames are significant** — they correspond directly to form option values. Never rename images without updating the corresponding PHP logic.

### Libraries

- **PHP GD** — image generation
- **FPDF** (`includes/libs/fpdf/`) — PDF export
- **html2pdf** (JS) — client-side PDF generation
- **FontAwesome** — UI icons

## Key Conventions

- `config/config.php` defines `BASE_URL`, directory constants, and `asset_tag()` for cache-busting asset URLs.
- `config/env.php` parses `.env` into `$_ENV`.
- Admin panel at `/admin` uses HTTP Basic Auth configured via `.env` credentials.
- `dev/testApi.py` and `dev/testHTTP.py` are manual API test scripts (note: `testApi.py` references a legacy endpoint name; the current endpoint is `generateSchema.php`).
