# CLAUDE.md — JabRef Developer Guide for AI Assistants

> [!IMPORTANT]
> This project does not accept fully AI-generated pull requests. AI tools may be used assistively only. You must understand and take responsibility for every change you submit.
>
> Read and follow:
> • [AGENTS.md](./AGENTS.md)
> • [CONTRIBUTING.md](./CONTRIBUTING.md)
> • [AI_USAGE_POLICY.md](./AI_USAGE_POLICY.md)

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Module Structure](#module-structure)
- [Key Technologies](#key-technologies)
- [Development Workflow](#development-workflow)
- [Code Quality Standards](#code-quality-standards)
- [Testing Guidelines](#testing-guidelines)
- [Common Patterns](#common-patterns)
- [Navigation Guide](#navigation-guide)
- [Important Files](#important-files)
- [Build Commands](#build-commands)

---

## Project Overview

**JabRef** is an open-source, cross-platform citation and reference management tool written in Java. It helps researchers collect, organize, and cite their literature.

### Key Facts

- **Language**: Java 24+ (using Gradle toolchain)
- **UI Framework**: JavaFX (NO Swing except UndoManager)
- **Build System**: Gradle 8.x with Kotlin DSL
- **Architecture**: Multi-module project with strict layered architecture
- **Module System**: Java Platform Module System (JPMS)
- **License**: MIT

### Project Philosophy

JabRef regards contributors as **software engineers, not just programmers**. This means:
- You're expected to work on requirements, not just code
- Understand the "why" behind changes, not just the "what"
- Take responsibility for the full lifecycle of your contributions
- Avoid over-engineering and speculative changes

---

## Architecture Overview

### Three-Layer Architecture

JabRef enforces a strict layered architecture validated by ArchUnit tests:

```
┌─────────────────────────────────────┐
│           GUI Layer                 │
│    org.jabref.gui (jabgui)          │
│  - JavaFX views, ViewModels         │
│  - Controllers, UI logic            │
│  - User interaction                 │
├─────────────────────────────────────┤
│          Logic Layer                │
│   org.jabref.logic (jablib)         │
│  - Business logic                   │
│  - Importers/Exporters              │
│  - Search, formatting, AI           │
├─────────────────────────────────────┤
│          Model Layer                │
│   org.jabref.model (jablib)         │
│  - Domain objects                   │
│  - BibEntry, BibDatabase            │
│  - Events, data structures          │
└─────────────────────────────────────┘
```

### Dependency Rules (STRICTLY ENFORCED)

```
gui     --> logic --> model
gui     -----------> model
gui     -----------> preferences
gui     -----------> cli

logic   -----------> model

cli     -----------> model, logic, preferences
```

**CRITICAL**:
- Model CANNOT depend on Logic or GUI
- Logic CANNOT depend on GUI
- Violations will fail the `CommonArchitectureTest`

### Event Communication

JabRef uses an **event bus** to publish events from model to other layers. This maintains architectural boundaries while allowing reactive updates. The project is transitioning to JavaFX observables for stronger coupling to data producers.

---

## Module Structure

JabRef is organized as a multi-module Gradle project:

### Core Modules

#### `jablib/` — Core Library
- **Purpose**: Model and logic layers, published as Maven artifact
- **Packages**:
  - `org.jabref.model.*` — Data structures (BibEntry, BibDatabase, Events)
  - `org.jabref.logic.*` — Business logic (importers, exporters, search, AI, git)
- **Entry Point**: N/A (library)
- **Key Features**: Over 100 packages covering all core functionality

#### `jabgui/` — GUI Application
- **Purpose**: JavaFX-based graphical user interface
- **Entry Point**: `org.jabref.Launcher.main()`
- **Main Class**: `org.jabref.gui.JabRefGUI`
- **Dependencies**: jablib, jabls, jabsrv
- **Patterns**: MVVM using mvvmFX framework
- **UI Definition**: FXML files in `src/main/resources`

#### `jabkit/` — CLI Tool
- **Purpose**: Command-line interface for batch operations
- **Entry Point**: `org.jabref.toolkit.JabKitLauncher.main()`
- **Main Class**: `org.jabref.toolkit.commands.JabKit`
- **Framework**: Picocli for argument parsing
- **Commands**: CheckIntegrity, Convert, DoiToBibtex, Fetch, Search, etc.
- **Distribution**: Available via JBang and Docker

#### `jabls/` — Language Server
- **Purpose**: Language Server Protocol implementation for BibTeX/BibLaTeX
- **Entry Point**: `org.jabref.languageserver.LspLauncher.main()`
- **Framework**: Eclipse LSP4J
- **Purpose**: IDE integration for BibTeX editing

#### `jabsrv/` — HTTP Server
- **Purpose**: REST API for remote bibliography management
- **Framework**: Jersey (JAX-RS) with Grizzly HTTP server
- **Features**: Supports "Cite As You Write" (CAYW)

#### `test-support/` — Testing Utilities
- **Purpose**: Shared test utilities and architecture tests
- **Contents**: Common test helpers, custom assertions, ArchUnit rules

#### `build-logic/` — Build Configuration
- **Purpose**: Custom Gradle plugins for consistent build configuration
- **Language**: Kotlin DSL

---

## Key Technologies

### Build & Language

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 24+ | Primary language (toolchain managed) |
| Gradle | 8.x | Build automation with Kotlin DSL |
| JPMS | — | Java Platform Module System |
| JBang | — | Scripting and CLI tool execution |

### UI Technologies

| Technology | Purpose |
|------------|---------|
| JavaFX | Primary UI framework (ONLY UI technology) |
| mvvmFX | MVVM pattern framework |
| FXML | UI layout definition |
| ControlsFX | Additional UI controls |
| RichTextFX | Rich text editing components |
| Ikonli | Icon framework (Material Design) |
| Afterburner.fx | Dependency injection for JavaFX |

### Data & Persistence

| Technology | Purpose |
|------------|---------|
| JBibTeX | BibTeX parsing |
| Apache PDFBox | PDF manipulation and metadata extraction |
| Apache Lucene | Full-text search and indexing |
| H2 MVStore | Embedded database (journal abbreviations) |
| PostgreSQL/MariaDB | Shared database support |
| Jackson | JSON/YAML serialization |

### AI & Machine Learning

| Technology | Purpose |
|------------|---------|
| LangChain4j | LLM integration framework |
| DJL | Deep Java Library for ML models |
| jvm-openai | OpenAI API client |

### HTTP & Networking

| Technology | Purpose |
|------------|---------|
| Unirest | HTTP client |
| JSoup | HTML parsing |
| Jersey (JAX-RS) | REST API framework |
| Grizzly | HTTP server |

### Testing

| Technology | Purpose |
|------------|---------|
| JUnit 5 | Testing framework |
| Mockito | Mocking framework |
| TestFX | JavaFX GUI testing |
| ArchUnit | Architecture validation |
| XMLUnit | XML comparison |

### Other Key Libraries

- **JGit** — Git integration with semantic merge
- **Google Guava** — Utility collections
- **Apache Commons** (IO, Lang3, Text, CSV, Compress)
- **JSpecify** — Nullability annotations
- **SLF4J + Tinylog** — Logging

---

## Development Workflow

### Setting Up

1. **Clone the repository**
   ```bash
   git clone https://github.com/JabRef/jabref.git
   cd jabref
   ```

2. **Build the project**
   ```bash
   ./gradlew build
   ```

3. **Run the GUI**
   ```bash
   ./gradlew run
   ```

4. **Import into IntelliJ IDEA**
   - See [IntelliJ setup guide](docs/code-howtos/IntelliJ.md)
   - Use "Import Gradle Project"
   - Ensure Java 24 toolchain is configured

### Git Workflow

JabRef uses the **GitHub Flow** with feature branches:

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b fix-for-issue-121
   ```

2. **Make your changes**
   - Keep commits atomic and logical
   - Write clear commit messages (see [commit guidelines](CONTRIBUTING.md#write-a-good-commit-message))
   - DO NOT reference issues in commits
   - One logical change per commit

3. **Test your changes**
   ```bash
   ./gradlew check
   ```

4. **Update CHANGELOG.md**
   - Add user-facing changes to `CHANGELOG.md`
   - Skip internal refactorings not visible to users

5. **Create a Pull Request**
   - Use descriptive PR title (not just "Fix issue xyz")
   - Explain intent, not just implementation
   - Disclose AI tool usage if applicable
   - Complete the PR checklist

6. **Address feedback**
   - Push changes to the same branch
   - DO NOT close and recreate PRs
   - Commits will be squashed on merge

### Semantic Merge (Git)

JabRef implements **semantic merge** for `.bib` files:
- Goes beyond line-based syntactic merging
- Understands BibTeX entry structure
- Resolves conflicts at field level, not line level
- Automatically handles entry reordering
- See [docs/code-howtos/git.md](docs/code-howtos/git.md) for details

---

## Code Quality Standards

### Modern Java Requirements

**Use Java 24+ features and modern APIs:**

✅ **DO**:
```java
// Modern collection factories
List<String> list = List.of("a", "b", "c");
Set<Integer> set = Set.of(1, 2, 3);
Map<String, String> map = Map.of("key", "value");

// Modern path API
Path path = Path.of("some/path");

// Text blocks for multiline strings
String query = """
    SELECT * FROM entries
    WHERE author = ?
    """;

// Pattern compilation
private static final Pattern PATTERN = Pattern.compile("\\s{2,}");

// JUnit arguments
@ParameterizedTest
@CsvSource(Arguments.of("input", "expected"))

// StringJoiner instead of StringBuilder
StringJoiner joiner = new StringJoiner(", ");
```

❌ **DON'T**:
```java
// Old collection creation
new HashSet<>(Arrays.asList(...))
Collections.emptyList()

// Old path API
Paths.get("some/path")

// String concatenation for multiline
String query = "SELECT * FROM entries\n" +
               "WHERE author = ?";

// Inline pattern matching
if (text.matches("\\s{2,}")) { ... }

// Old JUnit syntax
new Object[] {"input", "expected"}

// StringBuilder for joining
StringBuilder sb = new StringBuilder();
```

### Optional and Nullability

**Prefer Optional over null:**

✅ **DO**:
```java
// Return Optional from public methods
public Optional<String> getAuthor() {
    return Optional.ofNullable(author);
}

// Use Optional methods
resolved.ifPresent(value -> doSomething(value));

// Use get() when truly present
if (optional.isPresent()) {
    String value = optional.get(); // NOT .orElse("")
}

// Use JSpecify annotations
import org.jspecify.annotations.Nullable;

public void process(@Nullable String input) { ... }
```

❌ **DON'T**:
```java
// Return null from public methods
public String getAuthor() {
    return author; // may be null
}

// Unnecessary orElse with empty string
String value = resolved.orElse("");
doSomething(value);

// Pass null to methods
process(null); // unless method has same name
```

### Exception Handling

✅ **DO**:
```java
// Minimal try blocks
String content = readFile();
try {
    parse(content);
} catch (ParseException e) {
    LOGGER.error("Failed to parse", e); // exception as last arg
}

// Specific exceptions
try {
    // ...
} catch (IOException e) {
    // handle
} catch (ParseException e) {
    // handle
}
```

❌ **DON'T**:
```java
// Large try blocks
try {
    String content = readFile();
    parse(content);
    validate();
    save();
} catch (Exception e) { ... }

// Generic exception catching
catch (Exception e) { ... }

// Throwing unchecked exceptions
throw new RuntimeException("error");
throw new IllegalStateException("error");

// String concatenation in logging
LOGGER.error("Failed: " + e.toString());
```

### Code Style

✅ **DO**:
```java
// Boolean parameters via separate methods
public void enableFeature() { ... }
public void disableFeature() { ... }

// Single Responsibility Principle
public void validateEntry() { ... }
public void saveEntry() { ... }

// Meaningful variable names
BibEntry currentEntry;
BibEntry previousEntry;

// Remove commented code (use git history)

// Use BackgroundTask for threading
BackgroundTask.wrap(() -> longRunningTask())
    .executeWith(Executor.INSTANCE);
```

❌ **DON'T**:
```java
// Boolean parameters in public methods
public void setFeature(boolean enabled) { ... }

// Multiple responsibilities
public void validateAndSave() { ... }

// Poor variable names
BibEntry extraEntry2;
BibEntry extraEntry3;

// Keep commented code
// Old implementation:
// oldMethod();

// Direct threading
new Thread(() -> longRunningTask()).start();
```

### Localization

All user-facing text MUST be localized:

✅ **DO**:
```java
// In Java code
String message = Localization.lang("Save changes?");
String formatted = Localization.lang("Current version: %0", version);

// In FXML
<Label text="%Want to help?"/>
<Button text="%Save"/>
```

❌ **DON'T**:
```java
// Hardcoded strings
String message = "Save changes?";
String formatted = "Current version: " + version;

// Title case (use sentence case)
Localization.lang("Save Changes?")

// Exclamation marks (use periods)
Localization.lang("Saved successfully!")

// In FXML without %
<Label text="Want to help?"/>
```

**Notes**:
- Use sentence case, NOT title case
- Avoid exclamation marks; use periods
- Use "BibTeX" in UI strings, "Bibtex" in variable names
- Reuse existing strings instead of creating similar ones
- Logging strings stay in English

### Comments

Comments should add NEW information, not restate code:

✅ **GOOD**:
```java
// Semantic merge required because entry order doesn't affect BibTeX semantics
performSemanticMerge(entries);

// Cache compiled pattern for performance in tight loops
private static final Pattern WHITESPACE = Pattern.compile("\\s+");
```

❌ **BAD**:
```java
// Commit the staged changes
RevCommit commit = git.commit();

// Trim and convert to lower case
fieldName = fieldName.trim().toLowerCase();

// Initialize the list
List<String> items = new ArrayList<>();
```

**Rule**: If the comment just describes what the code obviously does, delete it.

---

## Testing Guidelines

### Test Structure

```
module/src/test/java/org/jabref/...
  └─ ClassNameTest.java  (mirrors production structure)
```

### Naming Conventions

✅ **DO**:
```java
class BibEntryTest {
    @Test
    void getFieldReturnsEmptyOptionalForMissingField() { ... }

    @Test
    void setFieldUpdatesFieldValue() { ... }

    @ParameterizedTest
    @CsvSource({
        "author, John Doe",
        "title, My Title"
    })
    void withFieldSetsFieldCorrectly(String field, String value) { ... }
}
```

❌ **DON'T**:
```java
@DisplayName("BibEntry Tests")  // Don't use @DisplayName
class BibEntryTest {
    @Test
    void testGetField() { ... }  // Don't prefix with "test"

    @Test
    void test1() { ... }  // Use descriptive names
}
```

### Test Patterns

✅ **DO**:
```java
// Use @TempDir
@Test
void testFileOperation(@TempDir Path tempDir) {
    Path file = tempDir.resolve("test.bib");
    // No cleanup needed
}

// Use withField for BibEntry
BibEntry entry = new BibEntry(StandardEntryType.Article)
    .withField(StandardField.AUTHOR, "Doe")
    .withField(StandardField.TITLE, "Title");

// Assert content, not boolean conditions
assertEquals(List.of("Doe"), entry.getAuthor());
assertEquals("Title", entry.getTitle());

// Let JUnit handle exceptions
@Test
void testParsing() throws IOException { // No try-catch
    parser.parse(content);
}
```

❌ **DON'T**:
```java
// Manual temp directory creation
Path tempDir = Files.createTempDirectory("test");
// cleanup in @AfterEach

// Use setField
BibEntry entry = new BibEntry(StandardEntryType.Article);
entry.setField(StandardField.AUTHOR, "Doe");

// Boolean assertions
assertTrue(entry.getAuthor().contains("Doe"));
assertFalse(entry.getTitle().isEmpty());

// Catch and wrap exceptions
try {
    parser.parse(content);
} catch (IOException e) {
    throw new AssertionError("Parse failed", e);
}
```

### Running Tests

```bash
# All checks (including tests)
./gradlew check

# Only tests for a module
./gradlew :jablib:test

# Logic tests (headless, without GUI tests)
CI=true xvfb-run --auto-servernum ./gradlew :jablib:check

# Specific test class
./gradlew :jablib:test --tests BibEntryTest

# With parallel execution
./gradlew test --parallel
```

### Linting and Quality Checks

```bash
# Checkstyle
./gradlew checkstyleMain checkstyleTest

# Modernizer (enforces modern Java APIs)
./gradlew modernizer

# OpenRewrite (code refactoring checks)
./gradlew rewriteDryRun

# Apply OpenRewrite fixes
./gradlew rewriteRun

# Javadoc generation
./gradlew javadoc

# Markdown linting
npx markdownlint-cli2 "docs/**/*.md"
npx markdownlint-cli2 "*.md"
```

---

## Common Patterns

### MVVM Pattern (GUI)

JabRef uses the Model-View-ViewModel pattern with JavaFX:

```
Feature/
├── FeatureView.fxml           # UI layout (View)
├── FeatureViewController.java # Controller (minimal logic)
└── FeatureViewModel.java      # State & business logic
```

**ViewModel Pattern**:
```java
public class MyDialogViewModel extends AbstractViewModel {
    private final ReadOnlyStringWrapper heading = new ReadOnlyStringWrapper();
    private final BooleanProperty isValid = new SimpleBooleanProperty();

    // JavaFX Bean property pattern
    public ReadOnlyStringProperty headingProperty() {
        return heading.getReadOnlyProperty();
    }

    public String getHeading() {
        return heading.get();
    }

    public BooleanProperty isValidProperty() {
        return isValid;
    }

    public MyDialogViewModel(Dependency dependency) {
        heading.set("Processing " + dependency.getName());
        isValid.set(validate());
    }

    public void performAction() {
        // Business logic here
    }
}
```

**FXML Binding**:
```xml
<?import org.jabref.gui.myfeature.MyDialogViewModel?>

<VBox fx:controller="org.jabref.gui.myfeature.MyDialogViewController">
    <Label text="${viewModel.heading}"/>
    <Button text="%Save" disable="${!viewModel.valid}" onAction="#handleSave"/>
</VBox>
```

### Dependency Injection

JabRef uses **Afterburner.fx** for lightweight DI:

```java
// Register global services
Injector.setModelOrService(LibraryTabContainer.class, libraryTabContainer);
Injector.setModelOrService(PreferencesService.class, preferencesService);

// Constructor injection (preferred)
public class FeatureViewModel {
    private final PreferencesService preferences;

    public FeatureViewModel(PreferencesService preferences) {
        this.preferences = preferences;
    }
}

// Access in controller
public class FeatureViewController {
    @FXML private MyViewModel viewModel;

    @Inject private DialogService dialogService;
}
```

### Preferences Management

```java
// Interface in jablib
public interface CliPreferences {
    BibEntryPreferences getBibEntryPreferences();
    // ...
}

// CLI implementation
public class JabRefCliPreferences implements CliPreferences {
    // Implementation for CLI and library usage
}

// GUI extension
public interface GuiPreferences extends CliPreferences {
    AppearancePreferences getAppearancePreferences();
    // GUI-specific preferences
}

// Access preferences
@Inject private PreferencesService preferencesService;

BibEntryPreferences entryPrefs = preferencesService.getBibEntryPreferences();
```

### Event Bus

```java
// Subscribe to events
@Subscribe
public void listen(EntriesAddedEvent event) {
    List<BibEntry> newEntries = event.getBibEntries();
    // Handle new entries
}

// Publish events
eventBus.post(new EntriesAddedEvent(entries, EntriesEventSource.LOCAL));
```

**Note**: JabRef is transitioning from event bus to JavaFX observables.

### Background Tasks

NEVER use `new Thread()`. Use `BackgroundTask`:

```java
BackgroundTask<Void> task = BackgroundTask
    .wrap(() -> {
        // Long-running operation
        performHeavyComputation();
        return null;
    })
    .onSuccess(result -> {
        // UI update on success
        updateUI();
    })
    .onFailure(exception -> {
        // Error handling
        dialogService.showErrorDialogAndWait("Error", exception);
    });

task.executeWith(Executor.INSTANCE);
```

### Dialog Service

Use `DialogService` instead of native JavaFX dialogs:

```java
@Inject private DialogService dialogService;

// File chooser
FileDialogConfiguration config = new FileDialogConfiguration.Builder()
    .withDefaultExtension(FileType.BIBTEX_DB)
    .withInitialDirectory(Paths.get(System.getProperty("user.home")))
    .build();

dialogService.showFileOpenDialog(config)
    .ifPresent(path -> openFile(path));

// Confirmation dialog
boolean confirmed = dialogService.showConfirmationDialogAndWait(
    Localization.lang("Delete entry?"),
    Localization.lang("This action cannot be undone.")
);

// Error dialog
dialogService.showErrorDialogAndWait(
    Localization.lang("Import failed"),
    exception
);
```

---

## Navigation Guide

### Finding Components by Feature

JabRef organizes issues and code by **component labels**. Key components:

| Component | Package/Location | Documentation |
|-----------|------------------|---------------|
| **AI** | `org.jabref.logic.ai.*` | [docs](https://docs.jabref.org/ai) |
| **Entry Editor** | `org.jabref.gui.entryeditor.*` | [docs](https://docs.jabref.org/advanced/entryeditor) |
| **Groups** | `org.jabref.gui.groups.*` | [docs](https://docs.jabref.org/finding-sorting-and-cleaning-entries/groups) |
| **Search** | `org.jabref.gui.search.*` | [docs](https://docs.jabref.org/finding-sorting-and-cleaning-entries/search) |
| **Import** | `org.jabref.logic.importer.*` | [docs](https://docs.jabref.org/collect) |
| **Export** | `org.jabref.logic.exporter.*` | [docs](https://docs.jabref.org/collaborative-work/export) |
| **Fetchers** | `org.jabref.logic.importer.fetcher.*` | [docs](https://docs.jabref.org/collect) |
| **Citation Keys** | `org.jabref.logic.citationkeypattern.*` | [docs](https://docs.jabref.org/setup/citationkeypatterns) |

See [architecture-and-components.md](docs/architecture-and-components.md) for full list.

### Key Entry Points

**GUI Application**:
```
jabgui/src/main/java/org/jabref/Launcher.java
└─> org.jabref.gui.JabRefGUI
    └─> org.jabref.gui.JabRefFrame (main window)
```

**CLI Application**:
```
jabkit/src/main/java/org/jabref/toolkit/JabKitLauncher.java
└─> org.jabref.toolkit.commands.JabKit
    └─> Subcommands (Convert, Fetch, etc.)
```

**Language Server**:
```
jabls/src/main/java/org/jabref/languageserver/LspLauncher.java
```

**HTTP Server**:
```
jabsrv/src/main/java/org/jabref/http/server/
└─> REST resources (RootResource, etc.)
```

### Package Organization

```
org.jabref/
├── model/               # Data structures (no dependencies)
│   ├── entry/          # BibEntry, EntryType
│   ├── database/       # BibDatabase, BibDatabaseContext
│   ├── metadata/       # MetaData
│   └── ...
├── logic/              # Business logic (depends on model)
│   ├── importer/       # Import logic and fetchers
│   ├── exporter/       # Export logic and formatters
│   ├── search/         # Search functionality
│   ├── ai/             # AI integration
│   ├── git/            # Git integration with semantic merge
│   ├── citationkeypattern/  # Citation key generation
│   └── ...
├── gui/                # UI layer (depends on logic & model)
│   ├── entryeditor/    # Entry editing UI
│   ├── maintable/      # Main entry table
│   ├── groups/         # Group management UI
│   ├── search/         # Search UI
│   └── ...
├── cli/                # CLI-specific code
└── preferences/        # Preferences management
```

---

## Important Files

### Configuration & Build

| File | Purpose |
|------|---------|
| `build.gradle.kts` | Root build configuration |
| `settings.gradle.kts` | Module configuration |
| `gradle.properties` | Build properties |
| `build-logic/` | Custom Gradle plugins |
| `config/checkstyle/` | Checkstyle rules |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `CONTRIBUTING.md` | Contribution guidelines |
| `AGENTS.md` | AI assistant rules and conventions |
| `AI_USAGE_POLICY.md` | AI usage policy |
| `CLAUDE.md` | This file — comprehensive dev guide |
| `CHANGELOG.md` | User-facing change log |
| `docs/` | Developer documentation |
| `docs/architecture-and-components.md` | Architecture overview |
| `docs/code-howtos/` | How-to guides for common tasks |
| `docs/decisions/` | Architectural Decision Records (ADRs) |

### CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/` | GitHub Actions workflows |
| `.github/workflows/binaries.yml` | Build and release workflow |

### Resources

| Location | Purpose |
|----------|---------|
| `jabgui/src/main/resources/` | FXML, CSS, images, icons |
| `jablib/src/main/resources/l10n/` | Localization files |

---

## Build Commands

### Development

```bash
# Build entire project
./gradlew build

# Run GUI application
./gradlew run
# or
./gradlew :jabgui:run

# Run CLI application
./gradlew :jabkit:run --args="--help"
./gradlew :jabkit:run --args="convert -i input.bib -o output.json"

# Clean build
./gradlew clean build
```

### Testing

```bash
# Run all tests
./gradlew test

# Run tests for specific module
./gradlew :jablib:test
./gradlew :jabgui:test

# Run specific test class
./gradlew :jablib:test --tests BibEntryTest

# Run with coverage
./gradlew jacocoTestReport

# Logic tests only (headless)
CI=true xvfb-run --auto-servernum ./gradlew :jablib:check -x checkstyleJmh
```

### Code Quality

```bash
# All quality checks
./gradlew check

# Checkstyle
./gradlew checkstyleMain checkstyleTest checkstyleJmh

# Modernizer (enforce modern Java APIs)
./gradlew modernizer

# OpenRewrite checks (dry run)
./gradlew rewriteDryRun

# OpenRewrite fixes (apply)
./gradlew rewriteRun

# Javadoc
./gradlew javadoc

# Markdown linting
npx markdownlint-cli2 "docs/**/*.md"
npx markdownlint-cli2 "*.md"
```

### Packaging

```bash
# Create distribution
./gradlew jpackage

# Create installers
./gradlew jpackageImage
```

### Other Tasks

```bash
# List all tasks
./gradlew tasks

# List all tasks with details
./gradlew tasks --all

# Generate dependency report
./gradlew dependencies

# Generate CycloneDX SBOM
./gradlew cyclonedxBom
```

---

## Quick Reference: Do's and Don'ts

### ✅ DO

- Use Java 24+ features (`List.of()`, `Path.of()`, text blocks)
- Return `Optional` from public methods instead of null
- Use JSpecify `@Nullable` annotations
- Keep try blocks minimal
- Use specific exception types
- Use `BackgroundTask` for threading
- Localize all user-facing strings
- Follow MVVM pattern in GUI code
- Write tests for logic and model changes
- Use `@TempDir` in tests
- Use descriptive test method names
- Keep GUI code thin (delegate to logic layer)
- Update CHANGELOG.md for user-facing changes
- Disclose AI tool usage in PRs

### ❌ DON'T

- Use old APIs (`Paths.get()`, `Collections.emptyList()`)
- Return null from public methods
- Use generic `Exception` or unchecked exceptions
- Create threads with `new Thread()`
- Use Swing (only JavaFX)
- Hardcode user-facing strings
- Put business logic in GUI layer
- Use `@DisplayName` in tests
- Manually create temp files (use `@TempDir`)
- Reformat unrelated code
- Add speculative features or abstractions
- Force-push to PR branches
- Close and recreate PRs
- Commit generated code without review
- Submit code you don't understand

---

## Learning Resources

### Official Documentation

- **User Docs**: <https://docs.jabref.org/>
- **Developer Docs**: <https://devdocs.jabref.org/>
- **DeepWiki** (AI-powered): <https://deepwiki.com/JabRef/jabref>

### Key Developer Guides

- [Setting up local workspace](https://devdocs.jabref.org/getting-into-the-code/guidelines-for-setting-up-a-local-workspace/)
- [Architecture and Components](docs/architecture-and-components.md)
- [Code How-Tos](https://devdocs.jabref.org/code-howtos/)
- [Testing Guide](docs/code-howtos/testing.md)
- [Localization](docs/code-howtos/localization.md)
- [Git and Semantic Merge](docs/code-howtos/git.md)
- [JavaFX Tips](docs/code-howtos/javafx.md)
- [Architectural Decision Records](https://devdocs.jabref.org/decisions/)

### Community

- **Forum**: <https://discourse.jabref.org/>
- **Gitter Chat**: <https://gitter.im/JabRef/jabref>
- **Issue Tracker**: <https://github.com/JabRef/jabref/issues>

---

## Final Notes

### For AI Assistants

When working with JabRef:

1. **Understand before coding** — Read existing code and patterns first
2. **Follow architectural boundaries** — Respect the layer separation
3. **Keep changes minimal** — Only change what's necessary
4. **Write tests** — Logic and model changes require tests
5. **Localize UI text** — All user-facing strings must use `Localization.lang()`
6. **Ask when uncertain** — Don't make assumptions about requirements
7. **Disclose AI usage** — Be transparent about AI tool assistance in PRs

### Remember

> JabRef regards contributors as **software engineers, not just programmers**.
>
> You are expected to:
> - Understand the "why" behind changes
> - Work on requirements, not just implementation
> - Take full responsibility for your contributions
> - Avoid over-engineering and speculative changes

### Questions?

- Check the [FAQ](https://devdocs.jabref.org/code-howtos/faq)
- Ask in [Gitter chat](https://gitter.im/JabRef/jabref)
- Comment on the relevant issue
- Create a draft PR with questions

---

**Last Updated**: 2025-12-26
**JabRef Version**: Development (main branch)
**Maintained By**: JabRef Community

<!-- markdownlint-disable-file MD033 MD041 -->
