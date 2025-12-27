# Deputado Biography Scraper

This scraper downloads biography pages from the Câmara dos Deputados website for all deputados in the database.

## Features

- Downloads HTML pages from `https://www.camara.leg.br/deputados/$deputadoId/biografia`
- Stores files in `downloads/deputados/` directory at project root
- Skips already downloaded files (checks for `$deputadoId.html`)
- Rate limiting: 5-10 seconds between requests (5s base + 0-5s random)
- Fetches deputado IDs from the database
- Graceful error handling - continues on failures

## Usage

### Scrape all deputados

```bash
pnpm scrape
```

### Scrape a specific deputado

```bash
pnpm scrape <deputadoId>
```

Example:
```bash
pnpm scrape 220593
```

## Output

Files are saved as:
```
downloads/deputados/
  ├── 220593.html
  ├── 220594.html
  └── ...
```

## Rate Limiting

The scraper is configured to be a good citizen:
- Base delay: 5 seconds between requests
- Random additional delay: 0-5 seconds
- Total delay per request: 5-10 seconds

This ensures we don't overload the Câmara website servers.

## Implementation Details

- **Service**: `ScraperService` - handles downloading and file management
- **CLI**: `scrape.ts` - command-line interface
- **Module**: `ScraperModule` - NestJS module integration
- **Dependencies**: Uses `axios` for HTTP requests and Node.js `fs` for file operations
