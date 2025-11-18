#!/usr/bin/env node

/**
 * Popular Apps Organizer
 * 1. Loads POPULAR_APPS from src/renderer/src/constants/popularApps.ts
 * 2. Previews the alphabetical order (per suite) and highlights duplicates
 * 3. Shows the first few ordering diffs and, on confirmation, rewrites POPULAR_APPS
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const readline = require('node:readline');
const ts = require('typescript');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const POPULAR_APPS_PATH = path.resolve(
  PROJECT_ROOT,
  'src/renderer/src/constants/popularApps.ts'
);

const args = new Set(process.argv.slice(2));
const PRINT_FULL_ORDER = args.has('--full');
const DRY_RUN = args.has('--dry-run');
const AUTO_CONFIRM = args.has('--yes') || args.has('-y') || args.has('--apply');

const title = (label) => `\n=== ${label} ===`;
const formatSuiteLabel = (suiteName) => suiteName || 'General (no suite)';

const compareByName = (a, b) =>
  a.name.localeCompare(b.name, 'en', { sensitivity: 'base', numeric: true });

const safeReadFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Failed to read ${filePath}`);
    throw error;
  }
};

const transpilePopularApps = (source, filePath) =>
  ts.transpileModule(source, {
    fileName: filePath,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;

const evaluatePopularAppsModule = (code, filePath) => {
  const moduleStub = { exports: {} };
  const sandbox = {
    module: moduleStub,
    exports: moduleStub.exports,
    require,
    __filename: filePath,
    __dirname: path.dirname(filePath),
  };

  vm.runInNewContext(code, sandbox, { filename: filePath });

  if (!Array.isArray(sandbox.module.exports.POPULAR_APPS)) {
    throw new Error('POPULAR_APPS export is missing or invalid.');
  }

  return sandbox.module.exports.POPULAR_APPS;
};

const loadPopularApps = () => {
  const source = safeReadFile(POPULAR_APPS_PATH);
  const transpiled = transpilePopularApps(source, POPULAR_APPS_PATH);
  return {
    source,
    apps: evaluatePopularAppsModule(transpiled, POPULAR_APPS_PATH),
  };
};

const groupSuites = (apps) => {
  const groupMap = new Map();
  const orderedSuites = [];

  apps.forEach((app, index) => {
    const suiteKey = app.suite ?? null;
    if (!groupMap.has(suiteKey)) {
      groupMap.set(suiteKey, []);
      orderedSuites.push({ suite: suiteKey, firstIndex: index });
    }

    groupMap.get(suiteKey).push({ app, originalIndex: index });
  });

  const namedSuites = orderedSuites
    .filter(({ suite }) => suite !== null)
    .sort((a, b) => a.firstIndex - b.firstIndex);

  return {
    namedSuites,
    groups: groupMap,
  };
};

const sortAppsWithinSuites = ({ namedSuites, groups }) => {
  const sortedSuites = namedSuites.map(({ suite }) => {
    const items = groups
      .get(suite)
      .map(({ app }) => app)
      .sort(compareByName);
    return { suite, apps: items };
  });

  const generalSorted = (groups.get(null) || [])
    .map(({ app }) => app)
    .filter(Boolean)
    .sort(compareByName);

  return {
    sortedSuites,
    generalSorted,
    sortedFlatList: [...sortedSuites.flatMap(({ apps }) => apps), ...generalSorted],
  };
};

const detectDuplicates = (apps) => {
  const nameMap = new Map();

  apps.forEach((app) => {
    const key = app.name.trim().toLowerCase();
    if (!nameMap.has(key)) {
      nameMap.set(key, []);
    }
    nameMap.get(key).push(app);
  });

  return Array.from(nameMap.entries())
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([key, occurrences]) => ({
      canonicalName: occurrences[0].name,
      normalizedKey: key,
      occurrences,
    }));
};

const detectSuiteBreaks = (apps) => {
  const suitePositions = new Map();

  apps.forEach((app, index) => {
    if (!app.suite) {
      return;
    }

    if (!suitePositions.has(app.suite)) {
      suitePositions.set(app.suite, []);
    }
    suitePositions.get(app.suite).push(index);
  });

  const issues = [];

  suitePositions.forEach((indices, suite) => {
    const sorted = [...indices].sort((a, b) => a - b);
    const span = sorted[sorted.length - 1] - sorted[0] + 1;
    if (span !== sorted.length) {
      issues.push({ suite, indices: sorted });
    }
  });

  return issues;
};

const summarizeOrderingDiff = (original, sorted) => {
  const mismatches = [];
  const length = Math.min(original.length, sorted.length);

  for (let index = 0; index < length; index += 1) {
    if (original[index].id !== sorted[index].id) {
      mismatches.push({
        index,
        current: original[index],
        expected: sorted[index],
      });
    }
    if (mismatches.length >= 10) {
      break;
    }
  }

  return mismatches;
};

const printDuplicates = (duplicates) => {
  if (!duplicates.length) {
    console.log('No duplicate app names detected. ✅');
    return;
  }

  console.log(title('Duplicate App Names'));
  duplicates.forEach(({ canonicalName, occurrences }) => {
    console.log(`- ${canonicalName} -> ${occurrences.length} entries`);
    occurrences.forEach((entry) => {
      console.log(
        `  • ${entry.name} | suite: ${entry.suite ?? 'none'} | url: ${entry.url}`
      );
    });
  });
};

const printSuiteBreaks = (breaks) => {
  if (!breaks.length) {
    console.log('All suite groupings are contiguous. ✅');
    return;
  }

  console.log(title('Suite Grouping Issues'));
  breaks.forEach(({ suite, indices }) => {
    console.log(`- ${suite} appears at indices ${indices.join(', ')}`);
  });
};

const printSortedSummary = (sortedSuites, generalSorted) => {
  console.log(title('Alphabetical Order (Suites Preserved)'));

  sortedSuites.forEach(({ suite, apps }) => {
    console.log(`\n${formatSuiteLabel(suite)} (${apps.length})`);
    const items = PRINT_FULL_ORDER ? apps : apps.slice(0, 10);
    items.forEach((app) => console.log(`  - ${app.name}`));
    if (!PRINT_FULL_ORDER && apps.length > 10) {
      console.log(`  ... ${apps.length - 10} more`);
    }
  });

  console.log(`\n${formatSuiteLabel(null)} (${generalSorted.length})`);
  const generalItems = PRINT_FULL_ORDER ? generalSorted : generalSorted.slice(0, 20);
  generalItems.forEach((app) => console.log(`  - ${app.name}`));
  if (!PRINT_FULL_ORDER && generalSorted.length > 20) {
    console.log(`  ... ${generalSorted.length - 20} more general apps`);
  }
};

const findPopularAppsArrayLiteral = (sourceFile) => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    const declaration = statement.declarationList.declarations.find(
      (decl) => decl.name && ts.isIdentifier(decl.name) && decl.name.text === 'POPULAR_APPS'
    );

    if (!declaration) {
      continue;
    }

    if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
      throw new Error('POPULAR_APPS initializer is not an array literal.');
    }

    return declaration.initializer;
  }

  throw new Error('Unable to locate POPULAR_APPS declaration.');
};

const extractArrayChunks = (source, arrayLiteral) => {
  const elements = arrayLiteral.elements;
  if (!elements.length) {
    return { start: arrayLiteral.getEnd(), end: arrayLiteral.getEnd(), chunks: [] };
  }

  const start = elements[0].getFullStart();
  const end = elements.end ?? arrayLiteral.getEnd();

  const chunks = elements.map((element, index) => {
    const chunkStart = element.getFullStart();
    const chunkEnd = index + 1 < elements.length ? elements[index + 1].getFullStart() : end;
    return {
      index,
      start: chunkStart,
      end: chunkEnd,
      text: source.slice(chunkStart, chunkEnd),
    };
  });

  return { start, end, chunks };
};

const askForConfirmation = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${question} `, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer.trim()));
    });
  });

const rewritePopularAppsFile = (apps, sortedApps, source) => {
  const sourceFile = ts.createSourceFile(
    POPULAR_APPS_PATH,
    source,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TS
  );

  const arrayLiteral = findPopularAppsArrayLiteral(sourceFile);
  const { start, end, chunks } = extractArrayChunks(source, arrayLiteral);

  if (chunks.length !== apps.length) {
    throw new Error('App metadata length mismatch. Aborting rewrite.');
  }

  const chunkById = new Map();
  chunks.forEach((chunk, index) => {
    chunkById.set(apps[index].id, chunk.text);
  });

  const missingChunk = sortedApps.find((app) => !chunkById.has(app.id));
  if (missingChunk) {
    throw new Error(`Missing chunk for app ${missingChunk.name} (${missingChunk.id}).`);
  }

  const sortedBody = sortedApps.map((app) => chunkById.get(app.id)).join('');
  const nextSource = `${source.slice(0, start)}${sortedBody}${source.slice(end)}`;
  fs.writeFileSync(POPULAR_APPS_PATH, nextSource, 'utf8');
};

const main = async () => {
  const { apps, source } = loadPopularApps();
  console.log(`Loaded ${apps.length} apps from popularApps.ts`);

  const duplicates = detectDuplicates(apps);
  const suiteBreaks = detectSuiteBreaks(apps);
  const suiteGrouping = groupSuites(apps);
  const { sortedSuites, generalSorted, sortedFlatList } = sortAppsWithinSuites(
    suiteGrouping
  );
  const orderingDiff = summarizeOrderingDiff(apps, sortedFlatList);

  printDuplicates(duplicates);
  printSuiteBreaks(suiteBreaks);
  printSortedSummary(sortedSuites, generalSorted);

  if (orderingDiff.length) {
    console.log(title('First Ordering Differences vs. Alphabetical Suite Order'));
    orderingDiff.forEach(({ index, current, expected }) => {
      console.log(
        `${index.toString().padStart(4, ' ')} | current: ${current.name} | expected: ${expected.name}`
      );
    });
  } else {
    console.log('POPULAR_APPS already matches the suggested order. ✅');
  }

  const requiresRewrite = orderingDiff.length > 0;
  const unresolvedIssues = duplicates.length > 0 || suiteBreaks.length > 0;

  if (!requiresRewrite && !unresolvedIssues) {
    process.exit(0);
  }

  if (!requiresRewrite) {
    console.error('\nNo ordering changes were calculated, but issues remain.');
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log('\nDry run enabled. No changes written.');
    process.exit(unresolvedIssues ? 1 : 0);
  }

  const proceed =
    AUTO_CONFIRM || (!process.stdin.isTTY ? false : await askForConfirmation('Apply the sorted order to popularApps.ts? (y/N)'));

  if (!proceed) {
    console.error('Aborted. No changes applied.');
    process.exit(1);
  }

  rewritePopularAppsFile(apps, sortedFlatList, source);
  console.log('POPULAR_APPS reordered successfully.');
  process.exit(0);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
