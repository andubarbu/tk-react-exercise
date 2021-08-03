import React, { useState } from 'react';
import './Recipe.css';
import styled from 'styled-components';

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
                <div className="recipe form" data-testid="recipe-form">

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

                    <div className="buttons">
                        <button onClick={handleEdit}>Done</button>
                        <button onClick={(() => setIsEditing(false))}>Cancel</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="recipe" data-testid={`recipe-${recipe.id}`}>
                    <h2>Loading...</h2>
                </div>
            )
        }
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