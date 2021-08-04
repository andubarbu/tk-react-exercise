import RecipeList from './RecipeList';
import NewRecipeForm from './NewRecipeForm';
import styled, { createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
    <AppContainer>
      <Router>
        <div>
          <GlobalStyle />
          <nav>
            <ul>
              <li>
                <Link to="/recipes">Recipes</Link>
              </li>
              <li>
                <Link to="/new">Add New Recipe</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/recipes">
              <RecipeList />
            </Route>
            <Route path="/new">
              <NewRecipeForm />
            </Route>
          </Switch>
        </div>
      </Router>
    </AppContainer>
  );
}

export default App;
