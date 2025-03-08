import HomePage from "./pages/HomePage.tsx";
import { StoryProvider } from "./contexts/StoryContext.tsx";

function App() {
  return (
    <StoryProvider>
      <HomePage />
    </StoryProvider>
  );
}

export default App;
