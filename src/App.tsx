import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './store/theme';
import { BoardsProvider } from './store/boards';
import BoardsOverview from './pages/BoardsOverview';
import CanvasPage from './pages/CanvasPage';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <BoardsProvider>
          <Routes>
            <Route path="/" element={<BoardsOverview />} />
            <Route path="/board/:id" element={<CanvasPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BoardsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
