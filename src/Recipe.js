import React from 'react';
import './Recipe.css';

function Recipe(props) {
    let recipe = props.recipe;
    return (
        <div className="recipe">
            <p>Recipe name: {recipe.name}</p>
            <p>Recipe description: {recipe.description}</p>
            <p>Ingredients: &nbsp;
                {recipe.ingredients.map((val, idx) => {
                    if (idx+1===recipe.ingredients.length) {
                        return val.name;
                    } else {
                        return val.name+", ";
                    }
                })}
            </p>
        </div>
    );
}

export default Recipe;