import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';

export interface LegislaturaData {
  deputadoId: number;
  legislaturaStart: number;
  legislaturaEnd: number;
  state: string;
  partido: string;
}

export interface ParseResult {
  success: boolean;
  data: LegislaturaData[];
  warnings: string[];
  errors: string[];
}

@Injectable()
export class ParserService {
  private readonly downloadsDir: string;

  constructor() {
    this.downloadsDir = path.join(process.cwd(), 'downloads', 'deputados');
  }

  /**
   * Parse a single HTML file and extract legislatura data
   */
  parseFile(deputadoId: number): ParseResult {
    const filePath = path.join(this.downloadsDir, `${deputadoId}.html`);
    const result: ParseResult = {
      success: false,
      data: [],
      warnings: [],
      errors: [],
    };

    try {
      if (!fs.existsSync(filePath)) {
        result.errors.push(`File not found: ${filePath}`);
        return result;
      }

      const html = fs.readFileSync(filePath, 'utf-8');
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Find the "Mandatos (na Câmara dos Deputados)" section
      // The structure is in a section with class "biografia-detalhes-deputado"
      let mandatosText = '';

      // Try to find the mandatos section in the biography section
      const bioSection = document.querySelector(
        '.biografia-detalhes-deputado, section',
      );
      if (bioSection) {
        const text = bioSection.textContent || '';
        if (text.includes('Mandatos (na Câmara dos Deputados)')) {
          mandatosText = text;
        }
      }

      // Fallback: search in all elements
      if (!mandatosText) {
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
          const text = element.textContent || '';
          if (
            text.includes('Mandatos (na Câmara dos Deputados)') &&
            text.length < 5000
          ) {
            mandatosText = text;
            break;
          }
        }
      }

      if (!mandatosText) {
        result.warnings.push(
          `No "Mandatos (na Câmara dos Deputados)" section found for deputado ${deputadoId}`,
        );
        result.success = true; // Not an error, just no data
        return result;
      }

      // Extract the content after the label
      // Format: "Mandatos (na Câmara dos Deputados): content"
      const labelMatch = mandatosText.match(
        /Mandatos \(na Câmara dos Deputados\):\s*(.+)/,
      );
      if (!labelMatch || !labelMatch[1]) {
        result.warnings.push(
          `Could not extract mandatos content for deputado ${deputadoId}`,
        );
        result.success = true;
        return result;
      }

      const content = labelMatch[1].trim();

      // Split by semicolon to get individual legislaturas
      const legislaturas = content
        .split(';')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (legislaturas.length === 0) {
        result.warnings.push(
          `No legislaturas found for deputado ${deputadoId}`,
        );
        result.success = true;
        return result;
      }

      // Parse each legislatura
      for (const legislatura of legislaturas) {
        const parsed = this.parseLegislatura(deputadoId, legislatura);

        if (parsed.success && parsed.data) {
          result.data.push(parsed.data);
        } else {
          result.warnings.push(
            `Failed to parse legislatura for deputado ${deputadoId}: "${legislatura}" - ${parsed.error}`,
          );
        }
      }

      result.success = true;
    } catch (error) {
      result.errors.push(
        `Error parsing file ${deputadoId}.html: ${error.message}`,
      );
    }

    return result;
  }

  /**
   * Parse a single legislatura string
   * Expected formats:
   * - "Deputado(a) Federal - 2023-2027, RJ, PL, Dt. Posse: 01/02/2023"
   * - "Deputado(a) Federal - 2019-2023, SP, PT"
   * - "2015-2019, MG, PSDB" (legacy format)
   */
  private parseLegislatura(
    deputadoId: number,
    legislatura: string,
  ): { success: boolean; data?: LegislaturaData; error?: string } {
    try {
      // Remove extra whitespace and normalize
      let normalized = legislatura.trim().replace(/\s+/g, ' ');

      // Remove "Deputado(a) Federal -" prefix if present
      normalized = normalized.replace(/^Deputado\(a\)\s+Federal\s*-\s*/i, '');

      // Try to match pattern: YYYY-YYYY, STATE, PARTIDO (with optional Dt. Posse: date)
      // This regex handles various formats and optional spaces
      const match = normalized.match(
        /(\d{4})\s*-\s*(\d{4})\s*,\s*([A-Z]{2})\s*,\s*([^,]+?)(?:\s*,\s*Dt\.\s*Posse:.*)?$/,
      );

      if (!match) {
        return {
          success: false,
          error: `Could not match pattern YYYY-YYYY, STATE, PARTIDO in: "${normalized}"`,
        };
      }

      const [, startYear, endYear, state, partido] = match;

      // Validate years
      const start = parseInt(startYear, 10);
      const end = parseInt(endYear, 10);

      if (start < 1900 || start > 2100 || end < 1900 || end > 2100) {
        return {
          success: false,
          error: `Invalid year range: ${start}-${end}`,
        };
      }

      if (start > end) {
        return {
          success: false,
          error: `Start year (${start}) is greater than end year (${end})`,
        };
      }

      // Validate state (should be 2 uppercase letters)
      if (!/^[A-Z]{2}$/.test(state)) {
        return {
          success: false,
          error: `Invalid state format: "${state}" (expected 2 uppercase letters)`,
        };
      }

      // Clean partido name (remove extra spaces)
      const partidoClean = partido.trim();

      if (!partidoClean) {
        return {
          success: false,
          error: 'Empty partido name',
        };
      }

      return {
        success: true,
        data: {
          deputadoId,
          legislaturaStart: start,
          legislaturaEnd: end,
          state,
          partido: partidoClean,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Exception: ${error.message}`,
      };
    }
  }

  /**
   * Parse all HTML files in the downloads directory
   */
  parseAll(): { results: ParseResult[]; summary: any } {
    const files = fs.readdirSync(this.downloadsDir);
    const htmlFiles = files.filter((f) => f.endsWith('.html'));

    console.log(`📊 Found ${htmlFiles.length} HTML files to parse`);

    const results: ParseResult[] = [];
    let totalLegislaturas = 0;
    let filesWithData = 0;
    let filesWithWarnings = 0;
    let filesWithErrors = 0;

    // Process in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < htmlFiles.length; i++) {
      const file = htmlFiles[i];
      const deputadoId = parseInt(file.replace('.html', ''), 10);

      if (isNaN(deputadoId)) {
        console.warn(`⚠️  Skipping invalid filename: ${file}`);
        continue;
      }

      const result = this.parseFile(deputadoId);
      results.push(result);

      if (result.data.length > 0) {
        filesWithData++;
        totalLegislaturas += result.data.length;
      }

      if (result.warnings.length > 0) {
        filesWithWarnings++;
      }

      if (result.errors.length > 0) {
        filesWithErrors++;
      }

      // Progress indicator every 100 files
      if ((i + 1) % batchSize === 0) {
        console.log(`   Processed ${i + 1}/${htmlFiles.length} files...`);
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }
    }

    const summary = {
      totalFiles: htmlFiles.length,
      filesWithData,
      filesWithWarnings,
      filesWithErrors,
      totalLegislaturas,
    };

    return { results, summary };
  }

  /**
   * Convert parsed data to CSV format
   */
  toCSV(results: ParseResult[]): string {
    const lines: string[] = [];

    // Header
    lines.push('deputadoId,legislaturaStart,legislaturaEnd,state,partido');

    // Data rows
    for (const result of results) {
      for (const data of result.data) {
        lines.push(
          `${data.deputadoId},${data.legislaturaStart},${data.legislaturaEnd},${data.state},${data.partido}`,
        );
      }
    }

    return lines.join('\n');
  }

  /**
   * Get all warnings and errors from parsing results
   */
  getIssues(results: ParseResult[]): { warnings: string[]; errors: string[] } {
    const warnings: string[] = [];
    const errors: string[] = [];

    for (const result of results) {
      warnings.push(...result.warnings);
      errors.push(...result.errors);
    }

    return { warnings, errors };
  }
}
