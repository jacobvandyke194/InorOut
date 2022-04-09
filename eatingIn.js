//CLASSES GRABBED FROM QUERY SELECTOR
const mealDetails = document.querySelector('.mealDescription');
//ID'S GRABBED FROM GET ELEMENT BY ID
const searchButton = document.getElementById('searchButton');
const listedMeals = document.getElementById('recipes');
const closeButton = document.getElementById('closeButton');
const mealModal = document.querySelector('.mealContent');
//BELOW IS EVENT LISTENERS TO SEARCH, CLOSE, ETC.
searchButton.addEventListener('click', activatemealList);
listedMeals.addEventListener('click', getRecipe);
closeButton.addEventListener('click', closeModal);



//Function below
function activatemealList(){
    // trims user input in search bar:
    let searchText = document.getElementById('searchInput').value.trim();
// type something in search bar and check console for issues:
    console.log(searchText);

//Meal Database API:
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchText}`)
    .then(response => response.json()) 
    .then(data => {
        //logs output data:
        console.log(data);
        let html = "";
        if (data.meals){
            data.meals.forEach(meal => {
               html += `
               <div class = "mealItem" data-id = "${meal.idMeal}">
                   <div class = "mealImage">
                       <img src = "${meal.strMealThumb}" alt = "spaghetti">
                   </div>
                   <div class = "nameMeal">
                       <h4>${meal.strMeal}</h4>
                       <a href = "#" class = "recipeButton">Recipe</a>
                   </div>
               </div>
           `;
           });
    //^^^ above is a copied string from html. The div is the meal searched and displayed.
    listedMeals.classList.remove('notFound');
        } else{
            html = "No meals with your ingredients available at this time :(";
            listedMeals.classList.add('notFound');
        }
        listedMeals.innerHTML = html;
    });
};
//function to get meal recipe from api
    function getRecipe(e){
        e.preventDefault();
        if(e.target.classList.contains('recipeButton')){
            let mealItem = e.target.parentElement.parentElement;
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => recipeModal(data.meals));
        };
    };

// creating new modal (kinda working)

function recipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
    <div class = "mealContent">
        <h3 class = "recipeTitle">${meal.strMeal}</h3>
        <p class = "mealType">${meal.strCategory}</p>
        <div class = "recipeDirection" id = "recipeDirection">
            <h4>Directions:</h4>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipeImage">
            <img src = "${meal.strMealThumb}" alt = "placeholder image of bread">
        </div>
        <div class = "videoLink">
            <a target = "_blank" href = "${meal.strYoutube}">*Cooking Tutorial*</a>
        </div>
    </div>
`;

mealDetails.innerHTML = html;
// mealDetails.classList.add('showRecipe');
mealDetails.style.display = "block"



}
