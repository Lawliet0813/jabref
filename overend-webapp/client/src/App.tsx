import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LibraryList from './pages/LibraryList'
import LibraryView from './pages/LibraryView'
import EntryEditor from './pages/EntryEditor'
import ImportExport from './pages/ImportExport'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/libraries" replace />} />
          <Route path="libraries" element={<LibraryList />} />
          <Route path="library/:libraryId" element={<LibraryView />} />
          <Route path="library/:libraryId/entry/:entryId" element={<EntryEditor />} />
          <Route path="library/:libraryId/entry/new" element={<EntryEditor />} />
          <Route path="library/:libraryId/import-export" element={<ImportExport />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
