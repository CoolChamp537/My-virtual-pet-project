var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed;
var lastFed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
foodObj = loadAnimation("Milk.png")
foodObj = loadAnimation("milkImage.png")
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("FEED")
  feed.position(700,95)
  feed.mousePressed(feedDog)

  addFood=createButton("ADD FOOD");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedTime = database.ref("FeedTime") 
  feedTime.on("value",function(data){
    lastFed = data.val()
  })
 
  //write code to display text lastFed time here

  textSize(30)
  fill("blue")
  textAlign(LEFT)
  if(lastFed >= 12){
    text("Last Feed - " + lastFed % 12 + "pm",200,30)
  } else if(lastFed === 0){
    text("Last Fed - 12am",200,30)
  } else {
    text("Last Fed - " + lastFed + "am",200,30)
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var foodStockVal = foodObj.getFoodStock()    
  if(foodStockVal <= 0){
    foodObj.updateFoodStock(1)
  } else {
    foodObj.updateFoodStock(foodStockVal - 1)
  }
  //write code here to update food stock and last fed time
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS,
  })
}
