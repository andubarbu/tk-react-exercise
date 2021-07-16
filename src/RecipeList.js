import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';
import './Recipe.css';

function RecipeList() {
    let [recipes, setRecipes] = useState({});
    let [haveData, setHaveData] = useState(false)
    useEffect(() => {
        async function getData() {
            let data;
            await fetch("http://0.0.0.0:8000/recipes/", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => data = response.json())
                .then((data) => {
                    setRecipes(data);
                    setHaveData(true);
                });
        }
        getData();
    }, [haveData]);

    if (!haveData) {
        return (
            <h1>Loading...</h1>
        )
    } else {
        return (
            <div className="recipe-list">
                <h1>Get your recipes</h1>
                {haveData ? (recipes.map((val) => {
                    return <Recipe recipe={val} key={val.id} />;
                })):''}
            </div>
        );
    }
}

export default RecipeList;