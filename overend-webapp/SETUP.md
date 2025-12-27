# Overend Web App - 安裝與啟動指南

## 快速開始

### 前置需求

- Node.js 18+
- npm 或 yarn

### 安裝步驟

1. **安裝後端依賴**

```bash
cd server
npm install
```

2. **安裝前端依賴**

```bash
cd client
npm install
```

### 啟動應用

#### 方法一：手動啟動

1. **啟動後端 API 服務器** (終端 1)

```bash
cd server
cp .env.example .env  # 首次運行
npm run dev
```

後端將運行在 http://localhost:5000

2. **啟動前端開發服務器** (終端 2)

```bash
cd client
npm run dev
```

前端將運行在 http://localhost:3000

#### 方法二：使用提供的啟動腳本 (推薦)

從專案根目錄運行：

```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat
```

### 訪問應用

打開瀏覽器訪問: http://localhost:3000

## 功能特性

### 已實現的核心功能

- ✅ 文獻庫管理（建立、刪除、檢視）
- ✅ 文獻條目 CRUD（新增、編輯、刪除、查看）
- ✅ 全文搜尋功能
- ✅ BibTeX 匯入/匯出
- ✅ 多種文獻類型支持
- ✅ 響應式 UI 設計

### 支持的文獻類型

- article
- book
- inproceedings
- phdthesis
- mastersthesis
- techreport
- misc
- online
- conference
- inbook
- incollection

### 支持的匯出格式

- BibTeX (.bib)
- BibLaTeX (.bib)
- JSON (.json)

## 開發

### 目錄結構

```
overend-webapp/
├── client/           # React 前端應用
│   ├── src/
│   │   ├── components/  # React 組件
│   │   ├── pages/      # 頁面組件
│   │   ├── stores/     # Zustand 狀態管理
│   │   ├── services/   # API 服務
│   │   └── utils/      # 工具函數
│   └── package.json
│
├── server/           # Express 後端 API
│   ├── src/
│   │   ├── routes/     # API 路由
│   │   ├── models/     # 資料模型
│   │   └── services/   # 業務邏輯
│   └── package.json
│
└── shared/           # 共享類型定義
    └── types/
```

### 技術棧

**前端:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (狀態管理)
- React Router
- Axios

**後端:**
- Node.js
- Express
- TypeScript
- 記憶體資料庫 (可替換為 PostgreSQL/MongoDB)

### API 端點

```
GET    /api/libraries              # 取得所有文獻庫
POST   /api/libraries              # 建立新文獻庫
GET    /api/libraries/:id          # 取得文獻庫詳情
DELETE /api/libraries/:id          # 刪除文獻庫

GET    /api/libraries/:id/entries  # 取得文獻條目列表
POST   /api/entries                # 新增文獻條目
GET    /api/entries/:id            # 取得單一條目
PUT    /api/entries/:id            # 更新條目
DELETE /api/entries/:id            # 刪除條目

GET    /api/search                 # 搜尋文獻
POST   /api/libraries/:id/import   # 匯入 BibTeX
GET    /api/libraries/:id/export   # 匯出文獻庫
```

### 建構生產版本

**前端:**
```bash
cd client
npm run build
```

建構產出在 `client/dist/`

**後端:**
```bash
cd server
npm run build
```

建構產出在 `server/dist/`

### 運行生產版本

```bash
cd server
npm start
```

然後使用 nginx 或其他 web 服務器提供前端靜態文件。

## 測試

```bash
# 前端測試
cd client
npm run lint

# 後端測試
cd server
npm run lint
```

## 疑難排解

### 端口已被占用

如果端口 3000 或 5000 已被占用，可以修改：

- 前端: 編輯 `client/vite.config.ts` 中的 `server.port`
- 後端: 編輯 `server/.env` 中的 `PORT`

### 依賴安裝失敗

嘗試清除緩存：

```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS 錯誤

確保後端的 CORS 設置正確，已在 `server/src/index.ts` 中配置。

## 未來改進

- [ ] 實作真實的資料庫 (PostgreSQL/MongoDB)
- [ ] 用戶認證與授權
- [ ] 文件附件上傳（PDF 等）
- [ ] 進階搜尋（多欄位篩選）
- [ ] 群組和標籤功能
- [ ] 引用格式化（APA, MLA, Chicago 等）
- [ ] 深色模式
- [ ] 鍵盤快捷鍵
- [ ] 批量操作
- [ ] 資料同步

## 貢獻

基於 JabRef 的架構設計，移植為現代化 Web 應用。

## 授權

與 JabRef 保持一致的開源授權。
