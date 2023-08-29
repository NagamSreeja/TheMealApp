// Here, all the code is written to for the favourite meal page.

if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        } 
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } else {
        arr.push(id);
        alert("your meal add your favourites list");
    }
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    
    showFavMealList();
}

function showFavMealList(){
    let favList = JSON.parse(localStorage.getItem("favouritesList"));
    var html = "";
    favList.forEach((mealfav)=>{
    var mealarr = fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealfav}`);
    mealarr.then((response)=>{return response.json()})
    .then((data)=>{
        console.log(data);
            for(let meal of data.meals){

                html += `<div class="col-sm-6 col-md-4 col-lg-3 shadow meal-item" data-id="${meal.idMeal}">
                <div class="card p-2 m-2">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <a href="#" class="btn btn-primary d-inline-block fav-recipe-btn">Get Recipe</a>
                        <button class="btn dicon m-2 d-inline" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fa-regular fa-trash-can"></i></button>
                    </div>  
                </div>
            </div>`;

            }
            document.getElementById("favorite-list").innerHTML = html;
    });
});
};
    
let favItems = document.getElementById("favorite-list");
favItems.addEventListener("click", getfavMealRecipe);
function getfavMealRecipe(e){
  if(e.target.classList.contains('fav-recipe-btn')){
      let mealItem = e.target.parentElement.parentElement.parentElement;
      
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
      .then(response => response.json())
      .then(data => favmealRecipeModal(data.meals));
  }
};

const favmealDetailsContent = document.querySelector('.meal-details-content');
const favrecipeCloseBtn = document.getElementById('recipe-close-btn');
favrecipeCloseBtn.addEventListener('click', () => {
  favmealDetailsContent.parentElement.classList.remove('showRecipe');
});

function favmealRecipeModal(meal){
    console.log(meal);
    meal=meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    favmealDetailsContent.innerHTML = html;
    favmealDetailsContent.parentElement.classList.add('showRecipe');
}