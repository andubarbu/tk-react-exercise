import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';
import { get, post, patch, destroy } from './api';
import './Recipe.css';

const RecipeList = () => {
    // State
    let [recipes, setRecipes] = useState([]);
    let [haveData, setHaveData] = useState(false);
    let [formShown, setFormShown] = useState(false);

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
        let ingredients = [];
        const ingredientsArray = document.querySelector("#ingredients").value.split(",");
        ingredientsArray.map((val) => ingredients.push({ "name": val }));
        const payload = {
            name: document.querySelector("#name").value,
            description: document.querySelector("#description").value,
            ingredients: ingredients,
        }
        console.log(payload);
        console.log("Sending POST...")
        post(payload).then((data) => {
            console.log(data);
            let updatedRecipes = [...recipes];
            updatedRecipes.push(data);
            setRecipes(updatedRecipes);
            document.querySelector("form").reset();
            setFormShown(false);
        });
    }

    // Edit a recipe
    const editRecipe = (payload) => {

        const changeRecipeDetails = () => {
            let interimRecipes = [...recipes];
            let index = recipes.findIndex(recipe => recipe.id === payload.id);
            interimRecipes[index] = payload;
            setRecipes(interimRecipes);
        }
        console.log(JSON.stringify(payload));
        patch(payload).then((response) => {
            console.log("Status: " + response.status + " " + response.statusText);
            if (response.status === 200) {
                changeRecipeDetails();
                console.log(response)
            } else {
                alert("Error editing recipe");
            }
        });
    }

    // Remove a recipe
    const removeRecipe = (recipeId) => {
        console.log("Sending delete request...")
        destroy(recipeId).then((response) => {
            console.log("Status: " + response.status + " " + response.statusText);
            if (response.status === 204) {
                const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
                setRecipes(updatedRecipes);
            } else {
                alert("Error deleting recipe");
            }
        });
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

                {recipes ? recipes.map((val) => {
                    return <Recipe recipe={val} key={val.id} remove={removeRecipe} edit={editRecipe} />;
                }) : ''}

                {formShown ? (
                    <form className="recipe form" onSubmit={(e) => newRecipe(e)}>
                        <input type="text" name="name" id="name" placeholder="name" data-testid="addnew-name" required />
                        <input type="text" name="description" id="description" placeholder="description" data-testid="addnew-description" required />
                        <p>Ingredients: (Separate with comma)</p><br />
                        <textarea name="ingredients" id="ingredients" cols="30" rows="4" data-testid="addnew-ingredients" required></textarea><br />
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