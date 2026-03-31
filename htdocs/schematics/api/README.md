# Documentation de l'API Schématèque

L'API REST est accessible à l'adresse de base :

- **Production** : `https://www.solisart.fr/schematics/api/`

Toutes les requêtes avec un corps utilisent le format **JSON** (`Content-Type: application/json`).
Les réponses d'erreur sont toujours du JSON avec une clé `error` (et parfois `message`).

---

## Authentification

Certains endpoints nécessitent une clé API transmise dans le header HTTP :

```
Authorization: Bearer <API_KEY>
```

La clé est configurée dans le fichier `.env` (variable `API_KEY`).

---

## Schémas

Les endpoints de génération de schémas acceptent tous un **corps JSON** correspondant à l'objet `formulaire` de l'application (données issues du formulaire de configuration de l'installation). La réponse est un fichier image ou PDF selon le paramètre `format`.

### Paramètre de format commun

| Paramètre query | Valeurs acceptées | Défaut |
|---|---|---|
| `format` | `png`, `pdf` | `png` |

---

### POST /api/schemas/hydrau/brut

Génère le schéma hydraulique **brut** (sans annotations ni légende).

**Requête**

```
POST /api/schemas/hydrau/brut?format=png
Content-Type: application/json

{ ...formulaire }
```

**Réponse**

- `200 OK` — `image/png` ou `application/pdf`
- `400 Bad Request` — format invalide
- `422 Unprocessable Entity` — corps JSON absent ou invalide
- `500 Internal Server Error` — erreur de génération

---

### POST /api/schemas/hydrau/annote

Génère le schéma hydraulique **annoté** (avec repères et étiquettes).

**Requête**

```
POST /api/schemas/hydrau/annote?format=png
Content-Type: application/json

{ ...formulaire }
```

**Réponse** — identique à `/hydrau/brut`

---

### POST /api/schemas/hydrau/complet

Génère le schéma hydraulique **complet** (annoté + légende).

**Requête**

```
POST /api/schemas/hydrau/complet?format=pdf
Content-Type: application/json

{ ...formulaire }
```

**Réponse** — identique à `/hydrau/brut`

---

### POST /api/schemas/exe

Génère le **schéma d'exécution** (plan de câblage et raccordement).

**Requête**

```
POST /api/schemas/exe?format=png
Content-Type: application/json

{ ...formulaire }
```

**Réponse** — identique à `/hydrau/brut`

---

### POST /api/schemas/etiquetage

Génère la **planche d'étiquetage** des composants.

**Requête**

```
POST /api/schemas/etiquetage?format=png
Content-Type: application/json

{ ...formulaire }
```

**Réponse** — identique à `/hydrau/brut`

---

### POST /api/schemas/fiche-prog

Génère l'image de la **fiche de programmation** du régulateur.

**Requête**

```
POST /api/schemas/fiche-prog?format=pdf
Content-Type: application/json

{ ...fiche_prog }
```

> Le corps correspond à l'objet `fiche_prog` (et non `formulaire`).

**Réponse** — identique à `/hydrau/brut`

---

### POST /api/schemas/report

Génère un **rapport PDF complet** multi-pages contenant dans l'ordre :
1. Schéma hydraulique complet
2. Schéma d'exécution
3. Planche d'étiquetage
4. Fiche de programmation

**Requête**

```
POST /api/schemas/report
Content-Type: application/json

{
  "formulaire": { ...formulaire },
  "fiche_prog": { ...fiche_prog }
}
```

**Champs obligatoires**

| Champ | Type | Description |
|---|---|---|
| `formulaire` | object | Données de configuration de l'installation |
| `fiche_prog` | object | Données de programmation du régulateur |

**Réponse**

- `200 OK` — `application/pdf` (fichier `dossier.pdf`)
- `422 Unprocessable Entity` — `formulaire` ou `fiche_prog` manquant
- `500 Internal Server Error` — erreur de génération

---

## Devis

### POST /api/devis

Enregistre un nouveau devis en base de données. Si un devis existe déjà pour la même affaire et le même installateur, une nouvelle version est créée automatiquement.

**Requête**

```
POST /api/devis
Content-Type: application/json

{
  "affaire": "Résidence Les Pins",
  "installateur_entreprise": "Thermique Pro SARL",
  "lignes": [
    {
      "article_ref": "KIT-SC-079",
      "prix_tarif": 1250.00,
      "taux_remise": 10,
      "quantite": 2,
      "cout_total_ht": 2250.00
    }
  ],
  "date_devis": "2026-03-31",
  "type_devis": "standard",
  "cout_total_ht": 2250.00,
  "cout_total_ttc": 2700.00,
  "taux_remise": 10,
  "taux_tva": 20,
  "code_tva": "TVA20",
  "objet": "Installation pompe à chaleur",
  "installateur_nom_prenom": "Jean Dupont",
  "installateur_mail": "j.dupont@thermiquepro.fr",
  "affaire_suivie_par": "Marie Martin",
  "mode_reglement": "Virement",
  "validite": "30 jours",
  "delai_livraison": "4 semaines"
}
```

**Champs obligatoires**

| Champ | Type | Description |
|---|---|---|
| `affaire` | string | Nom ou identifiant de l'affaire |
| `installateur_entreprise` | string | Raison sociale de l'installateur |
| `lignes` | array | Liste des lignes du devis (au moins une) |

**Champs d'une ligne (`lignes[]`)**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `article_ref` | string | Oui | Référence de l'article |
| `prix_tarif` | number | Oui | Prix unitaire tarif HT |
| `quantite` | number | Oui | Quantité |
| `cout_total_ht` | number | Oui | Total HT de la ligne |
| `taux_remise` | number | Non | Taux de remise en % (défaut : 0) |

**Réponse**

```json
HTTP/1.1 201 Created

{
  "reference": "REF-2026-00001"
}
```

> La référence inclut le suffixe `-V2`, `-V3`, etc. à partir de la deuxième version.

- `422 Unprocessable Entity` — champ obligatoire manquant ou ligne invalide
- `500 Internal Server Error` — erreur base de données

---

### GET /api/devis

Exporte tous les devis en base de données au format **CSV**.

> Cet endpoint est protégé. Le header `Authorization: Bearer <API_KEY>` est obligatoire.

**Requête**

```
GET /api/devis
Authorization: Bearer <API_KEY>
```

**Paramètre query optionnel**

| Paramètre | Valeur | Description |
|---|---|---|
| `include_articles` | `1` | Inclut les lignes de chaque devis dans l'export (jointure avec `devis_ligne`) |

**Exemple avec lignes incluses**

```
GET /api/devis?include_articles=1
Authorization: Bearer <API_KEY>
```

**Réponse**

- `200 OK` — `text/csv` (fichier `devis_export.csv`)
- `401 Unauthorized` — clé API manquante ou invalide
- `500 Internal Server Error` — erreur base de données

---

## Articles

### PUT /api/articles

Importe ou met à jour les articles en base de données en **batch** depuis un tableau JSON (issu d'un fichier CSV ou Excel). Les articles non présents dans l'import sont désactivés.

**Requête**

```
PUT /api/articles
Content-Type: application/json

[
  {
    "CODE ARTICLE": "KIT-SC-079",
    "PV": 1250.00,
    "LIBELLE": "Kit solaire 079"
  },
  {
    "CODE ARTICLE": "KIT-SC-080",
    "PV": 980.00,
    "LIBELLE": "Kit solaire 080"
  }
]
```

**Champs obligatoires par article**

| Champ | Type | Description |
|---|---|---|
| `CODE ARTICLE` | string | Référence unique de l'article |
| `PV` | number | Prix de vente HT |
| `LIBELLE` | string | Désignation de l'article |

**Réponse**

```json
HTTP/1.1 200 OK

{
  "message": "Import réalisé avec succès",
  "total_processed": 2,
  "insert_count": 1,
  "update_count": 1,
  "disabled_count": 3
}
```

| Champ | Description |
|---|---|
| `total_processed` | Nombre d'articles traités dans l'import |
| `insert_count` | Nombre de nouveaux articles créés |
| `update_count` | Nombre d'articles mis à jour |
| `disabled_count` | Nombre d'articles désactivés (absents de l'import) |

- `422 Unprocessable Entity` — tableau vide ou clé obligatoire manquante
- `500 Internal Server Error` — erreur base de données

---

## Codes d'erreur récapitulatifs

| Code HTTP | Signification |
|---|---|
| `200 OK` | Requête traitée avec succès |
| `201 Created` | Ressource créée avec succès |
| `400 Bad Request` | Paramètre invalide (ex. format inconnu) |
| `401 Unauthorized` | Clé API absente ou incorrecte |
| `404 Not Found` | Route inexistante |
| `422 Unprocessable Entity` — | Corps JSON manquant, invalide ou champ obligatoire absent |
| `500 Internal Server Error` | Erreur serveur (génération d'image, base de données, etc.) |
