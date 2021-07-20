export const get = async () => {
    return await fetch("http://0.0.0.0:8000/recipes/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
}
export const post = async (payload) => {
    return await fetch("http://0.0.0.0:8000/recipes/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
        .then((response) => response.json())
}
export const patch = async (payload) => {
    return await fetch("http://0.0.0.0:8000/recipes/" + payload.id + "/", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
}
export const destroy = async (recipeId) => {
    return await fetch("http://0.0.0.0:8000/recipes/" + recipeId + "/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}