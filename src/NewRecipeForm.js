import React, { useState } from 'react';
import styled from 'styled-components';
import { post } from './api';
import { ButtonsContainer, StyledSubmit } from './RecipeList';

const StyledForm = styled.form`
  padding: 1rem;
  border: 1px solid #003097;
  border-radius: 5px;
  margin-top: 1.5rem;
  text-align: left;
`;

const NewRecipeForm = () => {

  let [formValues, setFormValues] = useState({
    name: "",
    description: "",
    ingredients: "",
  })

  // Add a recipe
  const newRecipe = (e) => {
    e.preventDefault();
    const payload = {
      name: formValues.name,
      description: formValues.description,
      ingredients: formValues.ingredients.split(",").map((val) => ({ "name": val })),
    }
    post(payload).then((data) => {
      alert("Recipe created!")
    });
  }

  return (
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
      </ButtonsContainer>
    </StyledForm>
  )
}

export default NewRecipeForm;