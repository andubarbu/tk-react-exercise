import React, { useState } from 'react';
import './Recipe.css';

const Recipe = props => {
    const { recipe } = props;
    let [isEditing, setIsEditing] = useState(false);

    const getInputValue = inputId => {
        if (document.querySelector("#" + inputId).value) {
            return document.querySelector("#" + inputId).value;
        } else {
            return recipe[inputId];
        }
    }

    const handleDelete = () => {
        props.remove(recipe.id);
    };

    const handleEdit = () => {
        let ingredients = recipe.ingredients;
        if (document.querySelector("#ingredients").value) {
            ingredients = [];
            const ingredientsArray = getInputValue("ingredients").split(",");
            ingredientsArray.map((val) => ingredients.push({ "name": val }));
        }
        const payload = {
            id: recipe.id,
            name: getInputValue("name"),
            description: getInputValue("description"),
            ingredients: ingredients,
        }
        props.edit(payload);
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="recipe form" data-testid="recipe-form">
                <input type="text" name="name" id="name" placeholder="name" data-testid="name" />
                <input type="text" name="description" id="description" placeholder="description" />
                <p>Ingredients: (Separate with comma)</p><br />
                <textarea name="ingredients" id="ingredients" cols="30" rows="4"></textarea><br />
                <div className="buttons">
                    <button onClick={handleEdit}>Done</button>
                    <button onClick={(() => setIsEditing(false))}>Cancel</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="recipe" data-testid={`recipe-${recipe.id}`}>
                <p className="name" data-testid="name">{recipe.name}</p>
                <p className="description">{recipe.description}</p>
                <div className="ingredients">{recipe.ingredients.map((val, idx) => {
                    return <span className="ingredient" key={idx}>{val.name}</span>
                })}</div>
                <div className="buttons">
                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={(() => setIsEditing(true))}>Edit</button>
                </div>
            </div>
        );
    }
}

export default Recipe;