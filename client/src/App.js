import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

function App() {
    const [ingredients, setIngredients] = useState("");
    const [recipes, setRecipes] = useState();
    const [dietaryRestriction, setDietaryRestriction] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState({});

    const handleInputChange = (e) => {
        setIngredients(e.target.value);
    };

    const handleDietaryRestrictionChange = (e) => {
        setDietaryRestriction(e.target.value);
    };

    const handleImageUpload = (event) => {
        setSelectedImage(event.target.files[0]);
        event.target.value = null;
    };

    const handleIdentifyIngredients = async () => {
        if (selectedImage) {
            setLoading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result.split(",")[1];
                try {
                    const response = await axios.post(
                        process.env.REACT_APP_BACKEND_URL + "/identify-ingredients",
                        { image: base64Image }
                    );
                    if (response.data.error) {
                        if (response.data.error.includes("not recognize")) {
                            alert("Image not recognized. Please type ingredients manually.");
                        } else {
                            alert(response.data.error);
                        }
                    } else {
                        setIngredients((prevIngredients) => {
                            const newIngredients = response.data.ingredients.join(", ");
                            return prevIngredients
                                ? `${prevIngredients}, ${newIngredients}`
                                : newIngredients;
                        });
                    }
                } catch (error) {
                    console.error(error);
                    alert("An unexpected error occurred.");
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    const handleGenerateRecipes = async () => {
        setLoading(true);
        const userIngredients = ingredients
            .toLowerCase()
            .split(",")
            .map((ing) => ing.trim());

        try {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            const recipeList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const matchedRecipes = recipeList.filter((recipe) => {
                if (!recipe.ingredients) {
                    return false;
                }

                if (
                    dietaryRestriction &&
                    !recipe.dietaryRestrictions.includes(dietaryRestriction)
                ) {
                    return false;
                }

                const recipeIngredients = recipe.ingredients.map((ing) =>
                    ing.toLowerCase().trim()
                );

                return userIngredients.some((userIng) =>
                    recipeIngredients.some((recipeIng) => recipeIng.includes(userIng))
                );
            });

            setRecipes(matchedRecipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            alert("Error fetching recipes.");
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (recipeId, rating) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [recipeId]: rating,
        }));
    };

    const handleSubmitRating = async (recipeId) => {
        try {
            const rating = ratings[recipeId];
            await addDoc(collection(db, "ratings"), {
                recipeId: recipeId,
                rating: rating,
            });
            alert("Rating submitted successfully!");
            setRatings((prevRatings) => ({
                ...prevRatings,
                [recipeId]: null,
            }));
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Error submitting rating.");
        }
    };

    return (
        <div className="App">
            <div className="App-content-container">
                <h1>Smart Recipe Generator</h1>
                <div>
                    <label htmlFor="ingredients">Enter Ingredients:</label>
                    <textarea
                        id="ingredients"
                        value={ingredients}
                        onChange={handleInputChange}
                        rows="4"
                        cols="50"
                    />
                </div>
                <div>
                    <label htmlFor="imageUpload">
                        Upload Image: (If want to identify the product and select from the
                        options)
                    </label>
                    <input type="file" id="imageUpload" onChange={handleImageUpload} />
                    <button onClick={handleIdentifyIngredients} disabled={loading}>
                        Identify Ingredients
                    </button>
                </div>
                <div>
                    <label htmlFor="dietaryRestriction">Dietary Restriction:</label>
                    <select
                        id="dietaryRestriction"
                        value={dietaryRestriction}
                        onChange={handleDietaryRestrictionChange}
                    >
                        <option value="">None</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                    </select>
                </div>
                <button onClick={handleGenerateRecipes} disabled={loading}>
                    Generate Recipes
                </button>

                {loading && <p>Loading...</p>}

                <div>
                    <h2>Recipes:</h2>
                    <ul>
                        {Array.isArray(recipes) && recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <li key={recipe.id}>
                                    <h3>{recipe.name}</h3>
                                    <p>
                                        <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
                                    </p>
                                    <p>
                                        <strong>Instructions:</strong> {recipe.instructions}
                                    </p>
                                    <div>
                                        <label>Rate this recipe:</label>
                                        <div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <label key={star} style={{ marginRight: "5px" }}>
                                                    <input
                                                        type="radio"
                                                        name={`rating-${recipe.id}`}
                                                        value={star}
                                                        checked={ratings[recipe.id] === star}
                                                        onChange={() => handleRatingChange(recipe.id, star)}
                                                    />
                                                    {star} ⭐
                                                </label>
                                            ))}
                                        </div>
                                        <button onClick={() => handleSubmitRating(recipe.id)}>
                                            Submit Rating
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No recipes found.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;