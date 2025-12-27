import type { BibEntry } from '../../../shared/types/index.js';

/**
 * BibTeX 解析器服務
 * 基於 JabRef 的 BibtexParser 邏輯
 */

interface ParsedEntry {
  type: string;
  citationKey: string;
  fields: Record<string, string>;
}

/**
 * 簡單的 BibTeX 解析器
 * 在生產環境中應該使用更完善的解析器，如 bibtex-parse-js
 */
export async function parseBibTeX(content: string): Promise<ParsedEntry[]> {
  const entries: ParsedEntry[] = [];

  // 簡單的正則匹配，匹配 @type{key, ...}
  const entryRegex = /@(\w+)\s*\{\s*([^,]+)\s*,([^}]+)\}/gi;
  let match;

  while ((match = entryRegex.exec(content)) !== null) {
    const type = match[1].toLowerCase();
    const citationKey = match[2].trim();
    const fieldsContent = match[3];

    // 解析欄位
    const fields: Record<string, string> = {};
    const fieldRegex = /(\w+)\s*=\s*[{"']([^}"']+)[}"']/gi;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(fieldsContent)) !== null) {
      const fieldName = fieldMatch[1].toLowerCase();
      const fieldValue = fieldMatch[2].trim();
      fields[fieldName] = fieldValue;
    }

    entries.push({
      type,
      citationKey,
      fields,
    });
  }

  return entries;
}

/**
 * 將條目列表轉換為 BibTeX 格式
 */
export function generateBibTeX(entries: BibEntry[]): string {
  const bibtexEntries = entries.map(entry => {
    let bibtex = `@${entry.type}{${entry.citationKey},\n`;

    // 添加所有欄位
    const fieldLines = Object.entries(entry.fields).map(([field, value]) => {
      // 處理特殊字符和換行
      const escapedValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `  ${field} = {${escapedValue}}`;
    });

    bibtex += fieldLines.join(',\n');
    bibtex += '\n}\n';

    return bibtex;
  });

  return bibtexEntries.join('\n');
}

/**
 * 驗證 BibTeX 條目的有效性
 */
export function validateBibEntry(entry: Partial<BibEntry>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!entry.type) {
    errors.push('Entry type is required');
  }

  if (!entry.citationKey) {
    errors.push('Citation key is required');
  }

  if (entry.citationKey && !/^[a-zA-Z0-9_:-]+$/.test(entry.citationKey)) {
    errors.push('Citation key contains invalid characters');
  }

  // 根據類型檢查必填欄位
  const requiredFields = getRequiredFields(entry.type as string);
  if (entry.fields) {
    for (const field of requiredFields) {
      if (!entry.fields[field]) {
        errors.push(`Required field missing: ${field}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 取得條目類型的必填欄位
 * 基於標準 BibTeX 規範
 */
function getRequiredFields(type: string): string[] {
  const requiredFieldsMap: Record<string, string[]> = {
    article: ['author', 'title', 'journal', 'year'],
    book: ['author', 'title', 'publisher', 'year'],
    inproceedings: ['author', 'title', 'booktitle', 'year'],
    phdthesis: ['author', 'title', 'school', 'year'],
    mastersthesis: ['author', 'title', 'school', 'year'],
    techreport: ['author', 'title', 'institution', 'year'],
    misc: [],
  };

  return requiredFieldsMap[type.toLowerCase()] || [];
}
