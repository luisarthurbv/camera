#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { ParserService } from './parser.service';

async function main() {
  console.log('🔍 Starting legislatura parser...\n');

  const parser = new ParserService();
  const outputPath = path.join(process.cwd(), 'downloads', 'legislaturas.csv');
  const downloadsDir = path.join(process.cwd(), 'downloads', 'deputados');

  // Get list of files
  const files = fs.readdirSync(downloadsDir);
  const htmlFiles = files.filter((f) => f.endsWith('.html'));

  console.log(`📊 Found ${htmlFiles.length} HTML files to parse\n`);

  // Check if CSV already exists and load processed deputados
  const processedDeputados = new Set<number>();
  let fileHandle: number;
  let csvExists = false;

  if (fs.existsSync(outputPath)) {
    csvExists = true;
    console.log('📋 Found existing CSV file, loading processed deputados...');

    // Read existing CSV to get processed deputados
    const existingCsv = fs.readFileSync(outputPath, 'utf-8');
    const lines = existingCsv.split('\n');

    for (let i = 1; i < lines.length; i++) {
      // Skip header
      const line = lines[i].trim();
      if (line) {
        const deputadoId = parseInt(line.split(',')[0], 10);
        if (!isNaN(deputadoId)) {
          processedDeputados.add(deputadoId);
        }
      }
    }

    console.log(
      `   ✅ Found ${processedDeputados.size} already processed deputados`,
    );
    console.log(`   🔄 Will skip these and continue from where we left off\n`);

    // Open file in append mode
    fileHandle = fs.openSync(outputPath, 'a');
  } else {
    console.log('📝 Creating new CSV file\n');

    // Create new file and write header
    fileHandle = fs.openSync(outputPath, 'w');
    fs.writeSync(
      fileHandle,
      'deputadoId,legislaturaStart,legislaturaEnd,state,partido\n',
    );
  }

  // Track statistics
  let totalFiles = 0;
  let filesWithData = 0;
  let filesWithWarnings = 0;
  let filesWithErrors = 0;
  let totalLegislaturas = 0;
  let rowCount = 0;
  let skipped = 0;
  const sampleRows: string[] = [];
  const allWarnings: string[] = [];
  const allErrors: string[] = [];

  // Process files one by one
  const batchSize = 100;
  for (let i = 0; i < htmlFiles.length; i++) {
    const file = htmlFiles[i];
    const deputadoId = parseInt(file.replace('.html', ''), 10);

    if (isNaN(deputadoId)) {
      console.warn(`⚠️  Skipping invalid filename: ${file}`);
      continue;
    }

    // Check if already processed
    if (processedDeputados.has(deputadoId)) {
      skipped++;
      continue;
    }

    totalFiles++;

    // Parse single file
    const result = parser.parseFile(deputadoId);

    // Update statistics
    if (result.data.length > 0) {
      filesWithData++;
      totalLegislaturas += result.data.length;

      // Write data immediately to CSV
      for (const data of result.data) {
        const row = `${data.deputadoId},${data.legislaturaStart},${data.legislaturaEnd},${data.state},${data.partido}\n`;
        fs.writeSync(fileHandle, row);
        rowCount++;

        // Keep first 5 rows for sample
        if (sampleRows.length < 5) {
          sampleRows.push(row.trim());
        }
      }
    }

    if (result.warnings.length > 0) {
      filesWithWarnings++;
      allWarnings.push(...result.warnings);
    }

    if (result.errors.length > 0) {
      filesWithErrors++;
      allErrors.push(...result.errors);
    }

    // Progress indicator and flush every 100 files
    if ((i + 1) % batchSize === 0) {
      console.log(
        `   Processed ${i + 1}/${
          htmlFiles.length
        } files... (${totalLegislaturas} legislaturas so far)`,
      );

      // Flush to disk (checkpoint) - synchronous writes are already flushed
      fs.fsyncSync(fileHandle);

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    }
  }

  // Close the file
  fs.closeSync(fileHandle);

  console.log('\n📊 Parsing Summary:');
  console.log(`   📁 Total files available: ${htmlFiles.length}`);
  console.log(`   ⏭️  Skipped (already processed): ${skipped}`);
  console.log(`   🔄 Files processed this run: ${totalFiles}`);
  console.log(`   ✅ Files with data: ${filesWithData}`);
  console.log(`   ⚠️  Files with warnings: ${filesWithWarnings}`);
  console.log(`   ❌ Files with errors: ${filesWithErrors}`);
  console.log(`   📋 Total legislaturas extracted: ${totalLegislaturas}`);

  if (allWarnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    allWarnings.slice(0, 10).forEach((w) => console.log(`   - ${w}`));
    if (allWarnings.length > 10) {
      console.log(`   ... and ${allWarnings.length - 10} more warnings`);
    }
  }

  if (allErrors.length > 0) {
    console.log('\n❌ Errors:');
    allErrors.slice(0, 10).forEach((e) => console.log(`   - ${e}`));
    if (allErrors.length > 10) {
      console.log(`   ... and ${allErrors.length - 10} more errors`);
    }
  }

  console.log(`\n✅ CSV file generated: ${outputPath}`);
  console.log(`   📊 Total rows: ${rowCount} (excluding header)`);

  // Show sample data
  if (sampleRows.length > 0) {
    console.log('\n📋 Sample data (first 5 rows):');
    console.log('deputadoId,legislaturaStart,legislaturaEnd,state,partido');
    sampleRows.forEach((row) => console.log(row));
  }

  console.log('\n✨ Parsing completed!');

  // Exit with error code if there were errors
  if (allErrors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
