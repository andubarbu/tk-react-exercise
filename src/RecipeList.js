import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';
import { get, post, patch, destroy } from './api';
import './Recipe.css';

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
            <div className="recipe-list" data-testid="recipe-list">
                <h1>Your recipes</h1>

                <button onClick={(() => setFormShown(true))}>Add new</button>

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
                    <form className="recipe form" onSubmit={(e) => newRecipe(e)}>

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

                        <div className="buttons">
                            <input type="submit" value="Submit" />
                            <button onClick={(() => setFormShown(false))}>Cancel</button>
                        </div>
                    </form>
                ) : ""}
            </div>
        );
    }
}

export default RecipeList;