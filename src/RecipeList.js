import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';
import './Recipe.css';

const RecipeList = () => {
    // State
    let [recipes, setRecipes] = useState({});
    let [haveData, setHaveData] = useState(false);
    let [formShown, setFormShown] = useState(false);

    // Fetch all recipes from server
    useEffect(() => {
        const getData = async () => {
            await fetch("http://0.0.0.0:8000/recipes/", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setRecipes(data);
                    setHaveData(true);
                });
        }
        getData();
    }, [haveData]);

    // Add a recipe
    const newRecipe = async (e) => {
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
        await fetch("http://0.0.0.0:8000/recipes/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let updatedRecipes = [...recipes];
                    updatedRecipes.push(data);
                    setRecipes(updatedRecipes);
                    document.querySelector("form").reset();
                    setFormShown(false);
                });
    }

    // Edit a recipe
    const editRecipe = async (recipeId, payload) => {

        const changeRecipeDetails = () => {
            let interimRecipes = [...recipes];
            let index = recipes.findIndex(recipe => recipe.id === recipeId);
            interimRecipes[index] = payload;
            setRecipes(interimRecipes);
        }
        console.log(JSON.stringify(payload));
        await fetch("http://0.0.0.0:8000/recipes/" + recipeId + "/", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                console.log("Status: " + response.status + " " + response.statusText);
                if (response.status === 200) {
                    changeRecipeDetails();
                } else {
                    alert("Error editing recipe");
                }
            });
    }

    // Remove a recipe
    const removeRecipe = async (recipeId) => {
        console.log("Sending delete request...")
        await fetch("http://0.0.0.0:8000/recipes/" + recipeId + "/", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
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
            <div className="recipe-list">
                <h1>Your recipes</h1>

                <button onClick={(() => setFormShown(true))}>Add new</button>

                {recipes.map((val) => {
                    return <Recipe recipe={val} key={val.id} remove={removeRecipe} edit={editRecipe} />;
                })}

                {formShown ? (
                    <form className="recipe form" onSubmit={(e) => newRecipe(e)}>
                        <input type="text" name="name" id="name" placeholder="name" required />
                        <input type="text" name="description" id="description" placeholder="description" required />
                        <p>Ingredients: (Separate with comma)</p><br />
                        <textarea name="ingredients" id="ingredients" cols="30" rows="4" required></textarea><br />
                        <div className="buttons">
                            <input type="submit" />
                            <button onClick={(() => setFormShown(false))}>Cancel</button>
                        </div>
                    </form>
                ) : ""}
            </div>
        );
    }
}

export default RecipeList;