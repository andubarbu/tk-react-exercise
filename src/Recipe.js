import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonsContainer, StyledButton } from './RecipeList';

export const RecipeContainer = styled.div`
  padding: 1rem;
  border: 1px solid #003097;
  border-radius: 5px;
  margin-top: 1.5rem;
  text-align: left;
  :hover {
    background: #1d2c3c;
    border-color: #1d2c3c;
    color: white;
    cursor: pointer;
    transition: all 0.125s ease-in-out
  }
`;

const RecipeName = styled.p`
  font-weight: bold;
`;

const IngredientsContainer = styled.div`
  margin-top: 1rem;
`;

const Ingredient = styled.span`
  padding: 0.5rem;
  margin-right: 0.2rem;
  border-radius: 8px;
  background: green;
  color: white;
`;

const Recipe = props => {
  const { recipe, remove, edit, update, updateList } = props;
  let [isEditing, setIsEditing] = useState(false);

  let [isPatching, setIsPatching] = useState(false);

  let [formValues, setFormValues] = useState({
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients.map((val) => val.name).join(",")
  });

  const handleDelete = () => {
    remove(recipe.id).then((response) => {
      if (response.status === 204) {
        updateList(recipe.id);
      } else {
        alert("Error deleting recipe");
      }
    });
  };

  const handleEdit = () => {
    setIsPatching(true);
    edit({
      ...formValues,
      id: recipe.id,
      ingredients: formValues.ingredients.split(",").map((val) => ({ "name": val }))
    })
      .then((response) => {
        setIsPatching(false);
        if (response.status === 200) {
          update({
            ...formValues,
            id: recipe.id,
            ingredients: formValues.ingredients.split(",").map((val) => ({ "name": val }))
          });
        } else {
          alert("Error editing recipe");
        }
      });
    setIsEditing(false);
  }

  if (isEditing) {
    if (!isPatching) {
      return (
        <RecipeContainer data-testid="recipe-form">

          <input
            type="text"
            name="name"
            id="name"
            placeholder="name"
            data-testid="name"
            value={formValues.name}
            onChange={((event) => setFormValues({ ...formValues, name: event.target.value }))}
          />

          <input
            type="text"
            name="description"
            id="description"
            placeholder="description"
            value={formValues.description}
            onChange={((event) => setFormValues({ ...formValues, description: event.target.value }))}
          />

          <p>Ingredients: (Separate with comma)</p><br />

          <textarea
            name="ingredients"
            id="ingredients"
            cols="30" rows="4"
            value={formValues.ingredients}
            onChange={((event) => setFormValues({ ...formValues, ingredients: event.target.value }))}>
          </textarea>

          <br />

          <ButtonsContainer>
            <StyledButton onClick={handleEdit}>Done</StyledButton>
            <StyledButton onClick={(() => setIsEditing(false))}>Cancel</StyledButton>
          </ButtonsContainer>
        </RecipeContainer>
      );
    } else {
      return (
        <RecipeContainer data-testid={`recipe-${recipe.id}`}>
          <h2>Loading...</h2>
        </RecipeContainer>
      )
    }
  } else {
    return (
      <RecipeContainer data-testid={`recipe-${recipe.id}`}>
        <RecipeName data-testid="name">{recipe.name}</RecipeName>
        <p>{recipe.description}</p>
        <IngredientsContainer>{recipe.ingredients.map((val, idx) => {
          return <Ingredient key={idx}>{val.name}</Ingredient>
        })}</IngredientsContainer>
        <ButtonsContainer>
          <StyledButton onClick={(() => setIsEditing(true))}>Edit</StyledButton>
          <StyledButton onClick={handleDelete}>Delete</StyledButton>
        </ButtonsContainer>
      </RecipeContainer>
    );
  }
}

export default Recipe;