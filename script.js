let li=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","v","w","y"];
//Array to store all the items from the mealdb api.
let food=[];
 
for(let i of li){
    var mealdata = fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${i}`);
    mealdata.then((data)=>{
        return data.json()
    }).then((getdata)=>{
        getdata.meals.forEach(e=>{
            food.push(e.strMeal);
        })
    });
};

//Code to display the meal list in a way similar to google search suggestions.
const inputbox = document.getElementById('input-box');
var result;
inputbox.addEventListener("keyup",function(){
    result = [];
    var input = inputbox.value;
    if(input.length){
        result = food.filter((keyword)=>{
            return keyword.toLowerCase().startsWith(input.toLowerCase()) || keyword.toLowerCase().replaceAll(' ','').startsWith(input.toLowerCase()) ;
        });
        console.log(result);
    }
    display(result);
});

function display(result){
    removeElements();
    for(let i of result){
        let listItem = document.createElement("li");
        listItem.classList.add("list-items");
        listItem.style.cursor = 'pointer';
        listItem.setAttribute("onclick", "displayNames('"+i+"')");
        listItem.innerHTML = i;
        document.querySelector(".list").appendChild(listItem);
    }
}

function displayNames(value){
    inputbox.value = value;
    var e = document.querySelector("ul");
    e.innerHTML ="";
    result=[];
    result.push(value);
} 

function removeElements(){
    let items = document.querySelectorAll(".list-items");
    items.forEach((item)=>{
        item.remove();
    });
};


let searchBtn = document.getElementById("search-btn");
let resultItems = document.querySelector(".result");

searchBtn.addEventListener("click",getMealList);



//Code to display the items searched by the user.
function getMealList(){
    var e = document.querySelector("ul");
     e.innerHTML ="";
     inputbox.value = "";
    resultItems.innerHTML = "";
    let html = "";
    //If there is no item in our meals searched by the user.
    if(result.length==0){
        resultItems.innerHTML = `<div class="container-fluid d-flex align-items-center justify-content-center error">
        <h1 class="text-center h1 fw-bold">Sorry, There is no such meal!!</h1>
      </div>

        `;
    }
    result.forEach((mealdet)=>{
    var mealarr = fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealdet}`)
    mealarr.then((response)=>{return response.json()})
    .then((data)=>{
        console.log(data);
            for(let meal of data.meals){

                html += `<div class="col-sm-6 col-md-4 col-lg-3 shadow meal-item" data-id="${meal.idMeal}">
                <div class="card p-2 m-2">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <a href="#" class="btn btn-primary d-inline-block recipe-btn">Get Recipe</a>
                        <button class="btn hicon m-2 d-inline" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fa-solid fa-heart"></i></button>
                    </div>  
                </div>
            </div>`;

            }
        resultItems.innerHTML = html;
    });
});
result=[]
}

resultItems.addEventListener("click", getMealRecipe);
function getMealRecipe(e){
  //Identifies whether recipe button is clicked or not. 
  if(e.target.classList.contains('recipe-btn')){
      let mealItem = e.target.parentElement.parentElement.parentElement;
      
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
      .then(response => response.json())
      .then(data => mealRecipeModal(data.meals));
  }
};



//Function to display the modal on the frontend.
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
recipeCloseBtn.addEventListener('click', () => {
  mealDetailsContent.parentElement.classList.remove('showRecipe');
});

function mealRecipeModal(meal){
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
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}


//Stores the meal items in the local storage.

if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}


//Function to add and remove favourite items from the local storage.
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
    
}