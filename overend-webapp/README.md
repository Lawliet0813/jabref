# Overend Web App

JabRef 功能的現代化 Web 應用版本

## 技術棧

### 前端
- **框架**: React 18 + TypeScript
- **建構工具**: Vite
- **UI 框架**: TailwindCSS + shadcn/ui
- **狀態管理**: Zustand
- **路由**: React Router v6
- **表單處理**: React Hook Form + Zod
- **資料表格**: TanStack Table (React Table v8)
- **圖標**: Lucide React

### 後端
- **運行環境**: Node.js + Express
- **語言**: TypeScript
- **BibTeX 解析**: bibtex-parse-js
- **檔案處理**: Multer
- **資料驗證**: Zod

## 專案結構

```
overend-webapp/
├── client/                 # 前端應用
│   ├── src/
│   │   ├── components/    # React 組件
│   │   │   ├── layout/    # 佈局組件
│   │   │   ├── library/   # 文獻庫相關
│   │   │   ├── editor/    # 編輯器組件
│   │   │   └── ui/        # 通用 UI 組件
│   │   ├── pages/         # 頁面組件
│   │   ├── stores/        # Zustand 狀態管理
│   │   ├── services/      # API 服務
│   │   ├── types/         # TypeScript 類型定義
│   │   ├── utils/         # 工具函數
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── server/                # 後端 API
│   ├── src/
│   │   ├── routes/        # API 路由
│   │   ├── controllers/   # 控制器
│   │   ├── services/      # 業務邏輯
│   │   ├── models/        # 資料模型
│   │   ├── middleware/    # 中間件
│   │   └── index.ts
│   └── package.json
│
└── shared/                # 共享類型和工具
    └── types/
```

## 核心功能頁面

1. **文獻庫列表** (`/libraries`)
   - 顯示所有文獻庫
   - 新增/刪除文獻庫

2. **文獻庫詳情** (`/library/:id`)
   - 文獻條目列表（表格視圖）
   - 搜尋和篩選
   - 排序功能

3. **文獻編輯器** (`/library/:id/entry/:entryId`)
   - 多標籤編輯介面
   - 必填欄位/可選欄位
   - BibTeX 源碼檢視

4. **匯入/匯出** (`/library/:id/import-export`)
   - BibTeX 檔案匯入
   - 匯出為多種格式
   - 拖放上傳

5. **搜尋** (全域)
   - 全文搜尋
   - 進階搜尋（欄位篩選）
   - 搜尋結果高亮

## 資料模型

### BibEntry (文獻條目)
```typescript
interface BibEntry {
  id: string;
  type: EntryType;
  citationKey: string;
  fields: Record<string, string>;
  files: LinkedFile[];
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BibDatabase (文獻資料庫)
```typescript
interface BibDatabase {
  id: string;
  name: string;
  entries: BibEntry[];
  metadata: MetaData;
  createdAt: Date;
  updatedAt: Date;
}
```

## API 端點

```
GET    /api/libraries              # 取得所有文獻庫
POST   /api/libraries              # 建立新文獻庫
GET    /api/libraries/:id          # 取得文獻庫詳情
DELETE /api/libraries/:id          # 刪除文獻庫

GET    /api/libraries/:id/entries  # 取得文獻條目列表
POST   /api/libraries/:id/entries  # 新增文獻條目
GET    /api/entries/:id            # 取得單一條目
PUT    /api/entries/:id            # 更新條目
DELETE /api/entries/:id            # 刪除條目

POST   /api/libraries/:id/import   # 匯入 BibTeX
GET    /api/libraries/:id/export   # 匯出 BibTeX

GET    /api/search?q=...           # 搜尋文獻
```

## 開發計劃

### Phase 1: 基礎架構
- [x] 專案結構建立
- [ ] 前端 React + Vite 設定
- [ ] 後端 Express + TypeScript 設定
- [ ] 基本路由和 API 架構

### Phase 2: 核心功能
- [ ] BibTeX 解析器整合
- [ ] 文獻庫管理
- [ ] 文獻條目 CRUD
- [ ] 資料持久化

### Phase 3: 進階功能
- [ ] 搜尋和篩選
- [ ] 文獻編輯器
- [ ] 匯入/匯出
- [ ] 檔案附件處理

### Phase 4: UI/UX 優化
- [ ] 響應式設計
- [ ] 深色模式
- [ ] 鍵盤快捷鍵
- [ ] 效能優化

## 參考 JabRef 架構

本專案參考 JabRef 的架構設計：
- **Model Layer**: 純資料模型，對應 `jablib/model`
- **Service Layer**: 業務邏輯，對應 `jablib/logic`
- **Presentation Layer**: UI 組件，對應 `jabgui`
- **Event System**: 使用 Observable/Event Emitter 模式
