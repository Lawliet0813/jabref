// 共享類型定義 - 基於 JabRef 的 model 層

/**
 * BibTeX Entry Types
 * 參考: jabref/jablib/src/main/java/org/jabref/model/entry/types/
 */
export type EntryType =
  | 'article'
  | 'book'
  | 'booklet'
  | 'conference'
  | 'inbook'
  | 'incollection'
  | 'inproceedings'
  | 'manual'
  | 'mastersthesis'
  | 'misc'
  | 'phdthesis'
  | 'proceedings'
  | 'techreport'
  | 'unpublished'
  | 'online'
  | 'patent'
  | 'standard';

/**
 * Standard BibTeX Fields
 * 參考: jabref/jablib/src/main/java/org/jabref/model/entry/field/StandardField.java
 */
export type StandardField =
  | 'abstract'
  | 'author'
  | 'title'
  | 'year'
  | 'month'
  | 'journal'
  | 'booktitle'
  | 'publisher'
  | 'address'
  | 'volume'
  | 'number'
  | 'pages'
  | 'doi'
  | 'url'
  | 'isbn'
  | 'issn'
  | 'keywords'
  | 'note'
  | 'editor'
  | 'edition'
  | 'series'
  | 'chapter'
  | 'organization'
  | 'school'
  | 'institution'
  | 'howpublished';

/**
 * Linked File
 * 參考: jabref/jablib/src/main/java/org/jabref/model/entry/LinkedFile.java
 */
export interface LinkedFile {
  description: string;
  link: string;
  fileType: string;
}

/**
 * BibEntry - 單個文獻條目
 * 參考: jabref/jablib/src/main/java/org/jabref/model/entry/BibEntry.java
 */
export interface BibEntry {
  id: string;
  type: EntryType;
  citationKey: string;
  fields: Record<string, string>;
  files?: LinkedFile[];
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * MetaData - 資料庫元數據
 * 參考: jabref/jablib/src/main/java/org/jabref/model/metadata/MetaData.java
 */
export interface MetaData {
  encoding?: string;
  saveOrder?: SaveOrder;
  groups?: GroupTreeNode;
  contentSelectors?: Record<string, string[]>;
}

/**
 * Save Order
 */
export interface SaveOrder {
  orderType: 'original' | 'table' | 'specified';
  sortCriteria?: SortCriterion[];
}

export interface SortCriterion {
  field: string;
  descending: boolean;
}

/**
 * Group Tree Node
 * 參考: jabref/jablib/src/main/java/org/jabref/model/groups/
 */
export interface GroupTreeNode {
  name: string;
  type: 'AllEntriesGroup' | 'ExplicitGroup' | 'SearchGroup' | 'AutomaticGroup';
  searchExpression?: string;
  children?: GroupTreeNode[];
  context?: 'intersection' | 'union' | 'independent';
}

/**
 * BibDatabase - 文獻資料庫
 * 參考: jabref/jablib/src/main/java/org/jabref/model/database/BibDatabase.java
 */
export interface BibDatabase {
  id: string;
  name: string;
  entries: BibEntry[];
  metadata: MetaData;
  preamble?: string;
  bibtexStrings?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Search Query
 * 參考: jabref/jablib/src/main/java/org/jabref/logic/search/SearchQuery.java
 */
export interface SearchQuery {
  query: string;
  caseSensitive?: boolean;
  regularExpression?: boolean;
  searchFields?: string[];
}

/**
 * Entry Type Definition
 */
export interface EntryTypeDefinition {
  type: EntryType;
  requiredFields: StandardField[];
  optionalFields: StandardField[];
  description: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Import/Export Types
 */
export interface ImportResult {
  success: boolean;
  entriesAdded: number;
  entriesFailed: number;
  errors?: string[];
}

export interface ExportOptions {
  format: 'bibtex' | 'biblatex' | 'json' | 'csv';
  encoding?: string;
  saveOrder?: SaveOrder;
}
