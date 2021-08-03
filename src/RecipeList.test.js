import React from 'react';
import { waitFor, fireEvent, render, screen, within, waitForElementToBeRemoved } from '@testing-library/react';
import RecipeList from './RecipeList';
import { destroy, get, patch, post } from './api';


jest.mock('./api')

const fakeResponse = {
    id: 1,
    name: "My test recipe",
    description: "description",
    ingredients: [{ name: "ingredient" }]
}

beforeEach(() => {
    get.mockReset()
    get.mockResolvedValue([fakeResponse]);
})


test('Renders expected info when API responds to initial call', async () => {
    render(<RecipeList />)
    expect(await screen.findByText("Your recipes")).toBeInTheDocument();
    expect(get).toHaveBeenCalledTimes(1);
    expect(screen.getByText("My test recipe")).toBeInTheDocument();
});

test('Sends PATCH request and changes recipe in DOM when an edit is submitted', async () => {
    render(<RecipeList />)
    const recipeDiv = within(await screen.findByTestId("recipe-1"));

    expect(recipeDiv.getByText("My test recipe")).toBeInTheDocument();

    fireEvent.click(recipeDiv.getByText("Edit"));
    fireEvent.change(recipeDiv.getByTestId("name"), { target: { value: "New name" } });

    patch.mockResolvedValueOnce(Promise.resolve({
        status: 200,
        statusText: "OK",
        data: { ...fakeResponse, name: "New name" }
    }));
    fireEvent.click(recipeDiv.getByText("Done"));

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith({ ...fakeResponse, name: "New name" })

    await waitFor(() => {
        recipeDiv.getByText("New name")
    });
});

test('Sends DELETE request and removes recipe from DOM when delete is pressed', async () => {
    render(<RecipeList />)
    const recipeDiv = within(await screen.findByTestId("recipe-1"));

    destroy.mockResolvedValueOnce(Promise.resolve({
        status: 204,
        statusText: "No Content"
    }));
    fireEvent.click(recipeDiv.getByText("Delete"));

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledWith(1);

    await waitForElementToBeRemoved(() => screen.getByTestId("recipe-1"))
});

test('Sends POST request and adds new element to DOM when creating a new recipe', async () => {
    render(<RecipeList />)
    const container = within(await screen.findByTestId("recipe-list"));

    fireEvent.click(container.getByText("Add new"));
    expect(container.getByText("Ingredients: (Separate with comma)")).toBeInTheDocument();

    const fakePost = {
        name: "A name",
        description: "A description",
        ingredients: [{ name: "ingr1" }, { name: "ingr2" }]
    }

    fireEvent.change(container.getByTestId("addnew-name"), { target: { value: "A name" } });
    fireEvent.change(container.getByTestId("addnew-description"), { target: { value: "A description" } });
    fireEvent.change(container.getByTestId("addnew-ingredients"), { target: { value: "ingr1,ingr2" } });

    post.mockResolvedValueOnce({...fakePost, id: 2});
    fireEvent.click(container.getByText("Submit"));


    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(fakePost);

    await waitFor(() => {
        container.getByText("A name")
    })
});