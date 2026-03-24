# Schématèque Solisart

Web application for generating hydraulic heating system schematics, execution schemas, and quotes. It composes PNG image layers using PHP's GD library to build complex HVAC diagrams.

## Requirements

- [Laragon](https://laragon.org/) (Apache + MySQL + PHP with GD extension)
- PHP 7.4+

## Installation

1. Clone the repository into your Laragon `www` directory:
   ```bash
   git clone https://github.com/godinlu/schematics.git
   ```

2. Create the environment file at `htdocs/schematics/config/.env`:
   ```env
   DB_HOST=localhost
   DB_NAME=schematics
   DB_USER=root
   DB_PASS=
   ADMIN_USER=admin
   ADMIN_PASS=password
   API_KEY=your_api_key
   ```

3. Import the database schema using the migration scripts in `dev/`:
   ```bash
   mysql -u root schematics < dev/categorie.sql
   ```

4. Access the app at `http://localhost/schematics`.

## Usage

The app is a multi-page form wizard:

1. **Formulaire** (`/formulaire`) — Configure the heating installation (type, zones, equipment options). The rule engine automatically disables incompatible options based on resource conflicts and logical constraints.
2. **Schéma hydraulique** (`/schema_hydrau`) — View and download the generated hydraulic diagram (PNG or PDF).
3. **Schéma d'exécution** (`/schema_exe`) — View the wiring/execution schema.
4. **Fiche de programmation** (`/fiche_prog`) — View the programming sheet.
5. **Devis** (`/devis`) — Build and save a quote based on the configured installation.

Form state persists in `sessionStorage` across pages. Navigating to any page other than `/formulaire` without first filling in the form will redirect back automatically.

## Admin Panel

Available at `/admin` (HTTP Basic Auth using `ADMIN_USER`/`ADMIN_PASS` from `.env`). Allows viewing saved quotes and updating article prices.

## API

The schema generation API is at `api/generateSchema.php`:

```
POST /api/generateSchema.php?image=<type>&format=<fmt>
Body: <formulaire JSON>
```

| `image` | Description |
| --- | --- |
| `schema_hydrau_brut` | Base hydraulic diagram |
| `schema_hydrau_annote` | With header/footer |
| `schema_hydrau_complet` | With header/footer and equipment legend |
| `schema_exe` | Execution schema |
| `etiquetage` | Label overlay |
| `fiche_prog` | Programming sheet |

`format` can be `png` (default) or `pdf`.

For a full multi-page PDF report (all schemas in one document):

```
POST /api/generateSchemaReport.php
Body: { "formulaire": {...}, "fiche_prog": {...} }
```

## Deployment

Deployment is handled automatically by GitHub Actions on push to the `main` branch (SSH push to Gandi hosting). See `.github/workflows/deploy.yml`
