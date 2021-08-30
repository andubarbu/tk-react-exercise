import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';
import { get, patch, destroy } from './api';
import styled from 'styled-components';

export const ButtonsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const StyledButton = styled.button`
  flex-basis: 49%
`;
export const StyledSubmit = styled.input`
  flex-basis: 49%
`;

const RecipeList = () => {
  // State
  let [recipes, setRecipes] = useState([]);
  let [haveData, setHaveData] = useState(false);

  // Fetch all recipes from server
  const getData = () => {
    get().then((data) => {
      setRecipes(data);
      setHaveData(true);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  // Edit a recipe
  const editRecipe = (payload) => patch(payload);

  const changeRecipeDetails = (payload) => {
    let interimRecipes = [...recipes];
    let index = recipes.findIndex(recipe => recipe.id === payload.id);
    interimRecipes[index] = payload;
    setRecipes(interimRecipes);
  }

  // Remove a recipe
  const removeRecipe = (recipeId) => destroy(recipeId);

  const removeRecipeFromList = (recipeId) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
    setRecipes(updatedRecipes);
  }

  // Render
  if (!haveData) {
    return (
      <h1>Loading...</h1>
    )
  } else {
    return (
      <div data-testid="recipe-list">
        <h1>Your recipes</h1>

        {recipes.map((val) => {
          return (
            <Recipe
              recipe={val}
              key={val.id}
              remove={removeRecipe}
              edit={editRecipe}
              update={changeRecipeDetails}
              updateList={removeRecipeFromList}
            />);
        })}
      </div>
    );
  }
}

export default RecipeList;