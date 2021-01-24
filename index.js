const meals = document.getElementById('meals')
const fav_meals = document.querySelector('.ra');
const Search = document.querySelector('#search_term');
const SearchBtn = document.querySelector('#search');
const meal_popup = document.getElementById('meal-popup');
const close_popup = document.getElementById('close-popup');
const meal_info = document.getElementById('meal-info');
// console.log(close_popup);
// console.log(meal_popup);

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
async function getRandomMeal() {

    const Meal = await fetch('https://www.themealdb.com/api/json/v1/1/random.php', headers);
    // console.log(Meal);
    const jsonMeal = await Meal.json();
    const MealData = await jsonMeal.meals[0];
    // console.log(MealData);
    addMeal(MealData, true)
}

async function getMealId(Id) {
    // console.log(Id);
    const MealID = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + Id, headers);
    const jsonMeal = await MealID.json();
    const data = await jsonMeal.meals[0];
    return data;

}

async function getMealsBySearch(term) {
    const MealSearch = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term, headers);
    const jsonMeal = await MealSearch.json();

    const meals = await jsonMeal.meals;
    return meals;
}
fetchMeals();
getRandomMeal();

function addMeal(MealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');
    //   console.log(rand);
    meal.innerHTML = `
    <div class="meal-header">
        <span class="random">
        ${random ? " Random Recipe" : ''}
        </span>
        <img src=${MealData.strMealThumb} alt="">
    </div>
    <div class="meal-body">
        <h4>${MealData.strMeal}</h4>
        <button>
            <i class="fas red  fa-heart"></i>
        </button>
    </div>
`
    //this is little bit tricky 
    const heart = meal.querySelector('.red');
    heart.addEventListener('click', () => {
        if (heart.classList.contains('active')) {
            removeMealFromLS(MealData.idMeal);
            heart.classList.remove('active');
        }
        else {
            addMealToLS(MealData.idMeal);
            heart.classList.add('active');
        }
        location.reload();

    })
         meal.addEventListener('click',()=>{
             showMealInfo(MealData);
         })
    meals.appendChild(meal);

}


function removeMealFromLS(mealId) {
    // console.log("riched");
    const mealIds = getMealFromLS();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function addMealToLS(mealId) {
    let mealIdd = getMealFromLS();
    localStorage.setItem('mealIds', JSON.stringify([...mealIdd, mealId]));
}
function getMealFromLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds == null ? [] : mealIds;
}

async function fetchMeals() {
    const mealsIds = getMealFromLS();
    const meals = [];
  
    for (let i = 0; i < mealsIds.length; i++) {
        const mealIds = mealsIds[i];
        meal = await getMealId(mealIds);

        meals.push(meal);
        addMealTofav(meal);
    }

  
}



function addMealTofav(mealData) {
    
    const fav_meal = document.createElement('li');
   
    fav_meal.innerHTML = `
    <img  src=${mealData.strMealThumb} alt=${mealData.strmeal}><span>${mealData.strMeal}</span>
    <button class='btn'><i class="fas clear fa-window-close"></i></button>
`;
console.log(mealData);
    const btn = fav_meal.querySelector('.clear');
    btn.addEventListener('click', (e) => {
        removeMealFromLS(mealData.idMeal);
        location.reload();
        // console.log(e);
        // console.log(mealData);

        
    })
    fav_meal.addEventListener('click',()=>{
        showMealInfo(mealData);
    })
   

   
    fav_meals.appendChild(fav_meal);
}


SearchBtn.addEventListener('click', async () => {
    meals.innerHTML = "";
    // console.log(Search.value);
    const search = Search.value;
    try {
        const meals = await getMealsBySearch(search);

        meals.forEach((meal) => {
            addMeal(meal);
        })
    }
    catch {
        console.log("some please write name properly");
    }
})

close_popup.addEventListener('click', () => {
    meal_popup.classList.add('hidden');
})

function showMealInfo(mealdata) {
    meal_info.innerHTML=""
    const meal = document.createElement('div');
    meal.innerHTML = ` <div>
    <h1>${mealdata.strMeal}</h1>
    <img class="random1" src=${mealdata.strMealThumb} alt="">
</div>
<div>
    <p>
       ${mealdata.strInstructions}
    </p>
    
</div>`
    meal_info.appendChild(meal);
    meal_popup.classList.remove('hidden');
}