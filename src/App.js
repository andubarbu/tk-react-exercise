import RecipeList from './RecipeList';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  p {
    margin: 0.25rem 0;
  }
`;

const AppContainer = styled.div`
  margin: 0 auto;
  width: fit-content;
`;

function App() {
  return (
    <AppContainer className="App">
      <GlobalStyle />
      <RecipeList />
    </AppContainer>
  );
}

export default App;
