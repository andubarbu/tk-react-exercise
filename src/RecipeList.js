import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';
import { get, post, patch, destroy } from './api';
import styled from 'styled-components';

const StyledForm = styled.div`
  padding: 1rem;
  border: 1px solid #003097;
  border-radius: 5px;
  margin-top: 1.5rem;
  text-align: left;
`;

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
  let [formShown, setFormShown] = useState(false);

  let [formValues, setFormValues] = useState({
    name: "",
    description: "",
    ingredients: "",
  })

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

  // Add a recipe
  const newRecipe = (e) => {
    e.preventDefault();
    const payload = {
      name: formValues.name,
      description: formValues.description,
      ingredients: formValues.ingredients.split(",").map((val) => ({ "name": val })),
    }
    post(payload).then((data) => {
      let updatedRecipes = [...recipes];
      updatedRecipes.push(data);
      setRecipes(updatedRecipes);
      document.querySelector("form").reset();
      setFormShown(false);
    });
  }

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

        <StyledButton onClick={(() => setFormShown(true))}>Add new</StyledButton>

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

        {formShown ? (
          <StyledForm onSubmit={(e) => newRecipe(e)}>

            <input
              type="text"
              name="name"
              id="name"
              placeholder="name"
              data-testid="addnew-name"
              required
              value={formValues.name}
              onChange={((event) => setFormValues({ ...formValues, name: event.target.value }))} />

            <input
              type="text"
              name="description"
              id="description"
              placeholder="description"
              data-testid="addnew-description"
              required
              value={formValues.description}
              onChange={((event) => setFormValues({ ...formValues, description: event.target.value }))} />

            <p>Ingredients: (Separate with comma)</p><br />

            <textarea
              name="ingredients"
              id="ingredients"
              cols="30" rows="4"
              data-testid="addnew-ingredients"
              required
              value={formValues.ingredients}
              onChange={((event) => setFormValues({ ...formValues, ingredients: event.target.value }))}>
            </textarea>

            <br />

            <ButtonsContainer>
              <StyledSubmit type="submit" value="Submit" />
              <StyledButton onClick={(() => setFormShown(false))}>Cancel</StyledButton>
            </ButtonsContainer>
          </StyledForm>
        ) : ""}
      </div>
    );
  }
}

export default RecipeList;