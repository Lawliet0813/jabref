# OVEREND 專案 - Week 1 Day 1 分析報告
## JabRef 原始碼結構分析

作者：彥儒
日期：2025-12-26
目標：將 JabRef 改造成 OVEREND

---

## 📋 一、專案概述

**JabRef** 是一個開源的參考文獻管理工具，使用 Java 和 JavaFX 開發。
- **主要功能**：管理書目資料、BibTeX/BibLaTeX 支援、文獻搜尋與整理
- **授權**：MIT License
- **技術棧**：Java 21, JavaFX, Gradle

---

## 🗂️ 二、專案結構分析

### 2.1 根目錄結構

```
jabref/
├── jabgui/              ⭐ GUI 模組（主要 UI 程式碼）
├── jablib/              📚 核心函式庫（業務邏輯）
├── jabkit/              🔧 CLI 命令列工具
├── jabsrv/              🌐 伺服器模組
├── jabsrv-cli/          🖥️ 伺服器 CLI
├── jabls/               📝 語言伺服器
├── jabls-cli/           📝 語言伺服器 CLI
├── test-support/        🧪 測試支援
├── build-logic/         ⚙️ Gradle 構建邏輯
├── docs/                📖 文件
├── config/              ⚙️ 配置檔案
├── scripts/             📜 腳本工具
└── gradle/              🛠️ Gradle Wrapper

主要配置檔案：
├── build.gradle.kts     構建腳本
├── settings.gradle.kts  專案設定
└── gradle.properties    Gradle 屬性
```

### 2.2 模組說明

| 模組 | 說明 | 重要性 |
|------|------|--------|
| **jabgui** | GUI 使用者介面，包含所有視覺元件和互動邏輯 | ⭐⭐⭐⭐⭐ |
| **jablib** | 核心業務邏輯、資料模型、匯入匯出功能 | ⭐⭐⭐⭐⭐ |
| **jabkit** | 命令列工具，可用 JBang 執行 | ⭐⭐⭐ |
| **jabsrv** | 伺服器功能 | ⭐⭐ |
| **jabls** | 語言伺服器支援（IDE 整合） | ⭐⭐ |

---

## 🎨 三、UI 相關檔案位置

### 3.1 主要 UI 目錄

```
jabgui/src/main/
├── java/org/jabref/gui/          ⭐ GUI Java 程式碼（58個子套件）
│   ├── JabRefGUI.java            主應用程式類別
│   ├── frame/JabRefFrame.java    主視窗框架
│   ├── maintable/                主表格顯示
│   ├── entryeditor/              條目編輯器
│   ├── preferences/              偏好設定
│   ├── search/                   搜尋功能
│   ├── groups/                   群組管理
│   ├── fieldeditors/             欄位編輯器
│   ├── theme/                    主題管理
│   ├── icon/                     圖示管理
│   ├── dialogs/                  對話框
│   ├── menus/                    選單
│   └── ... (更多功能模組)
│
└── resources/org/jabref/gui/     ⭐ UI 資源檔案
    ├── *.fxml                    介面佈局檔案（110個）
    ├── Base.css                  基礎樣式
    ├── Dark.css                  暗色主題
    ├── icons/                    圖示資源
    ├── images/                   圖片資源
    └── fonts/                    字型檔案
```

### 3.2 關鍵 UI 檔案

| 檔案路徑 | 說明 |
|---------|------|
| `jabgui/src/main/java/org/jabref/Launcher.java` | 應用程式入口點 |
| `jabgui/src/main/java/org/jabref/gui/JabRefGUI.java` | JavaFX 主應用程式 |
| `jabgui/src/main/java/org/jabref/gui/frame/JabRefFrame.java` | 主視窗框架 |
| `jabgui/src/main/resources/org/jabref/gui/Base.css` | 基礎樣式表 |
| `jabgui/src/main/resources/org/jabref/gui/Dark.css` | 暗色主題樣式 |

### 3.3 UI 技術架構

- **框架**：JavaFX 25+
- **架構模式**：MVVM（使用 mvvmFX 框架）
- **UI 佈局**：FXML（110 個介面定義檔案）
- **依賴注入**：Afterburner.fx
- **圖示**：Ikonli（Material Design 圖示）
- **進階控件**：
  - ControlsFX（增強控件）
  - RichTextFX（富文本編輯）
  - GemsFX（現代化控件）
  - PDFViewFX（PDF 檢視器）

---

## 🔧 四、編譯與執行指令

### 4.1 系統需求

✅ **你的環境**：
- Mac mini M4
- macOS
- Java 已安裝

📋 **需要的版本**：
- **Java**：JDK 21 或更高版本
- **Gradle**：專案內建 Gradle Wrapper（自動處理）

### 4.2 檢查 Java 版本

```bash
java -version
```

**預期輸出**：應該看到 Java 21 或更高版本

如果版本不對，你可以：
- 使用 Homebrew 安裝：`brew install openjdk@21`
- 或從 [Adoptium](https://adoptium.net/) 下載

### 4.3 編譯指令

```bash
# 1. 清理並編譯專案
./gradlew clean build

# 2. 執行應用程式（GUI 模式）
./gradlew run

# 3. 只編譯不執行
./gradlew assemble

# 4. 執行測試
./gradlew test

# 5. 查看所有可用任務
./gradlew tasks
```

### 4.4 常用開發指令

```bash
# 持續編譯（檔案變更時自動重新編譯）
./gradlew build --continuous

# 跳過測試快速編譯
./gradlew build -x test

# 清理建置快取
./gradlew clean

# 產生 IntelliJ IDEA 專案檔
./gradlew idea

# 檢查程式碼風格
./gradlew checkstyleMain
```

### 4.5 macOS 特別注意事項

在 macOS 上首次執行可能需要給予權限：

```bash
# 給予 gradlew 執行權限
chmod +x gradlew

# 如果遇到安全性問題
xattr -d com.apple.quarantine gradlew
```

---

## 📊 五、主要檔案和資料夾清單

### 5.1 GUI 核心套件（jabgui/src/main/java/org/jabref/gui/）

```
主要功能套件：
├── actions/              動作處理
├── ai/                   AI 功能整合
├── entryeditor/          條目編輯器
├── maintable/            主表格
├── preferences/          偏好設定
├── search/               搜尋功能
├── groups/               群組管理
├── fieldeditors/         欄位編輯器
├── exporter/             匯出功能
├── importer/             匯入功能
├── theme/                主題系統
├── icon/                 圖示管理
├── keyboard/             鍵盤綁定
├── menus/                選單系統
├── dialogs/              對話框
├── util/                 工具類別
└── frame/                主視窗框架

UI 元件套件：
├── commonfxcontrols/     通用 JavaFX 控件
├── libraryproperties/    圖書館屬性
├── openoffice/           OpenOffice/LibreOffice 整合
├── linkedfile/           連結檔案管理
├── preview/              預覽功能
├── sidepane/             側邊欄
├── welcome/              歡迎畫面
└── help/                 說明功能
```

### 5.2 資源檔案（jabgui/src/main/resources/）

```
org/jabref/gui/
├── preferences/          偏好設定介面（多個 .fxml）
├── entryeditor/          條目編輯器介面
├── fieldeditors/         欄位編輯器介面
├── libraryproperties/    圖書館屬性介面
├── importer/             匯入對話框
├── exporter/             匯出對話框
├── search/               搜尋介面
├── groups/               群組介面
├── ai/                   AI 功能介面
├── welcome/              歡迎畫面
├── Base.css              基礎樣式表
├── Dark.css              暗色主題
icons/                    圖示檔案
images/                   圖片資源
fonts/                    字型檔案
```

---

## 🎯 六、建議的 OVEREND 改造路線圖

### Phase 1：熟悉專案（Week 1）
- ✅ **Day 1**：完成專案結構分析（今天）
- 📅 **Day 2-3**：編譯並執行原始專案，熟悉主要功能
- 📅 **Day 4-5**：研究 UI 架構和資料流程
- 📅 **Day 6-7**：規劃 OVEREND 的功能差異

### Phase 2：UI 客製化（Week 2-3）
- 修改主題和樣式（Base.css, Dark.css）
- 更換品牌元素（圖示、Logo、名稱）
- 調整主視窗佈局

### Phase 3：功能調整（Week 4+）
- 根據 OVEREND 需求新增/移除功能
- 調整資料模型
- 整合新的服務

---

## 📝 七、重要提醒

### 7.1 技術債務注意事項
- 這是一個成熟的大型專案（數十萬行程式碼）
- 有完整的測試覆蓋
- 使用現代化的 Java 模組系統（JPMS）

### 7.2 依賴項
專案使用超過 50 個外部函式庫，主要包括：
- **UI**：JavaFX, ControlsFX, RichTextFX
- **資料處理**：Jackson, Apache Commons
- **網路**：Unirest, Apache HttpClient
- **搜尋**：Apache Lucene
- **PDF**：Apache PDFBox
- **AI**：LangChain4j

### 7.3 建置系統
- 使用 Gradle Kotlin DSL
- 自訂 Gradle Plugin（build-logic/）
- 支援跨平台打包（Windows, macOS, Linux）

---

## 🚀 八、下一步行動

### 立即執行：

1. **檢查 Java 版本**
   ```bash
   java -version  # 確認是 Java 21+
   ```

2. **首次編譯**
   ```bash
   ./gradlew clean build
   ```

3. **執行應用程式**
   ```bash
   ./gradlew run
   ```

4. **探索程式碼**
   - 建議使用 IntelliJ IDEA 開啟專案
   - 先從 `Launcher.java` 和 `JabRefGUI.java` 開始閱讀

---

## 📚 參考資源

- [JabRef 官方網站](https://www.jabref.org/)
- [開發者文件](https://devdocs.jabref.org/)
- [GitHub Repository](https://github.com/JabRef/jabref)
- [JavaFX 文件](https://openjfx.io/)
- [Gradle 文件](https://docs.gradle.org/)

---

**報告完成！祝你在 OVEREND 專案開發順利！** 🎉
