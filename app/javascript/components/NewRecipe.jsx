import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

class NewRecipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      ingredients: "",
      instruction: ""
    };
  }

  stripHtmlEntities = (str) => {
    return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    const url = "/api/v1/recipes/create";
    const { name, ingredients, instruction } = this.state;

    if (name.length === 0 || ingredients.length === 0 || instruction === 0) {
      return
    }

    const body = {
      name,
      ingredients,
      instruction: instruction.replace(/\n/g, "<br> <br>")
    };

    const token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
    axios(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(body)
    })
      .then(response => {
        if (response.statusText === "OK") {
          return response.data;
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.props.history.push(`/recipe/${response.id}`))
      .catch(error => console.log(error.message));
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            <h1 className="font-weight-normal mb-5">
              Add a new recipe to our awesome recipe collection.
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="recipeName">Recipe name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="recipeName"
                  required
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipeIngredients">Ingredients</label>
                <input
                  type="text"
                  name="ingredients"
                  id="recipeIngredients"
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
                <small id="ingredientsHelp" className="form-text text-muted">
                  Separate each ingredient with a comma.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="instruction">Preparation Instructions</label>
                <textarea
                  type="text"
                  name="instruction"
                  id="instruction"
                  className="form-control"
                  rows="5"
                  required
                  onChange={this.onChange}
                />
                <button type="submit" className="btn custom-button mt-3">
                  Create Recipe
                </button>
                <Link to="/recipes" className="btn btn-link mt-3">
                  Back to recipes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default NewRecipe