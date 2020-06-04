// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();


// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 220;
camera.position.x = 100;
camera.position.y = 250;

var control = new THREE.OrbitControls(camera);

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#FFFFFF");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight /1.35 );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------


function getCube(color, dimension) {
    //dimension la definimos como : {x:'', y: '', z:''}
    // Create a Cube Mesh with basic material
    let geometry = new THREE.BoxGeometry( dimension.x , dimension.y, dimension.z );
    let material = new THREE.MeshBasicMaterial( { color } );
    
    return new THREE.Mesh( geometry, material );
}

function getCircle(color, dimension) {
    let geometry = new THREE.CylinderGeometry( dimension.x , dimension.y, dimension.z );
    let material = new THREE.MeshBasicMaterial( { color } );
    
    return new THREE.Mesh( geometry, material );
}

function translate(object ,dimension) {
    object.position.x += dimension.x;
    object.position.y += dimension.y;
    object.position.z += dimension.z;
}

function rotate(object, dimension) {
    object.rotate.x += dimension.x;
    object.rotate.y += dimension.y;
    object.rotate.z += dimension.z;
}

function draw() {

}
//let cube1 = this.getCube('#63bea7', {x: 1, y: 1 , z: 1});
//scene.add( cube1 );

// Render Loop
var render = function () {
  requestAnimationFrame( render );
  control.update();
  renderer.render(scene, camera);
};

draw();
render();










//=====================================>

// Cave Generator With Cellular Automata
// Gamedevtuts+ Tutorial Code
// Code partly by Michael Cook - @mtrc on Twitter
// With thanks to Christer Kaitilia - @mcfunkypants!
// Read the full tutorial:
// http://gamedev.tutsplus.com/tutorials/implementation/cave-levels-cellular-automata

// Permission is granted to use this source in any
// way you like, commercial or otherwise. Enjoy!

// the world grid: a 2d array of tiles
var world = [[]];

// size in the world in sprite tiles
var worldWidth = 48;
var worldHeight = 48;

// size of a tile in pixels (this is only important for drawing)
var tileWidth = 8;
var tileHeight = 8;

/*
Variables we can use to tweak our demo!
*/
var chanceToStartAlive = 0.4;
var deathLimit = 3;
var birthLimit = 4;
var numberOfSteps = 2;

//This is called right at the start when the page loads
function onload() 
{
  world = generateMap();
  redraw();
}

//This is called whenever you press the 'doSimulationStep' button
function iterate()
{
    world = doSimulationStep(world);
    redraw();
}

//Used to create a new world - it grabs the values from
//the HTML form so you can affect the world gen :)
function recreate(form)
{
  birthLimit = form.birthLimit.value;
  deathLimit = form.deathLimit.value;
  chanceToStartAlive = form.initialChance.value;
  numberOfSteps = form.numSteps.value;
    
  world = generateMap();
  redraw();
}

function generateMap()
{
    //So, first we make the map
    var map = [[]];
    //And randomly scatter solid blocks
    initialiseMap(map);
    
    //Then, for a number of steps
    for(var i=0; i<numberOfSteps; i++){
        //We apply our simulation rules!
        map = doSimulationStep(map);
    }
    
    //And we're done!
    return map;
}

function initialiseMap(map)
{
  for (var x=0; x < worldWidth; x++)
  {
    map[x] = [];
    for (var y=0; y < worldHeight; y++)
    {
      map[x][y] = 0;
    }
  }
  
  for (var x=0; x < worldWidth; x++)
  {
    for (var y=0; y < worldHeight; y++)
    {
      //Here we use our chanceToStartAlive variable
      if (Math.random() < chanceToStartAlive)
        //We're using numbers, not booleans, to decide if something is solid here. 0 = not solid
        map[x][y] = 1;
    }
  }
  
  return map;
}

function doSimulationStep(map)
{
    //Here's the new map we're going to copy our data into
    var newmap = [[]];
    for(var x = 0; x < map.length; x++){
        newmap[x] = [];
        for(var y = 0; y < map[0].length; y++)
        {    
            //Count up the neighbours
            var nbs = countAliveNeighbours(map, x, y);
            //If the tile is currently solid
            if(map[x][y] > 0){
                //See if it should die
                if(nbs < deathLimit){
                    newmap[x][y] = 0;
                }
                //Otherwise keep it solid
                else{
                    newmap[x][y] = 1;   
                }
            }
            //If the tile is currently empty
            else{
                //See if it should become solid
                if(nbs > birthLimit){
                    newmap[x][y] = 1;       
                }
                else{
                    newmap[x][y] = 0;      
                }
            }
        }
    }
    
    return newmap;
}

//This function counts the number of solid neighbours a tile has
function countAliveNeighbours(map, x, y)
{
    var count = 0;
    for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            var nb_x = i+x;
            var nb_y = j+y;
            if(i == 0 && j == 0){
            }
            //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
            else if(nb_x < 0 || nb_y < 0 ||
                    nb_x >= map.length ||
                    nb_y >= map[0].length){
                count = count + 1;   
            }
            else if(map[nb_x][nb_y] == 1){
                count = count + 1;
            }
        }
    }
    return count;
}

/*
Extra credit assignment! Let's loop through the
map and place treasure in the nooks and crannies.
*/
function placeTreasure()
{
  //How hidden does a spot need to be for treasure?
  //I find 5 or 6 is good. 6 for very rare treasure.
  var treasureHiddenLimit = 5;
  for (var x=0; x < worldWidth; x++)
  {
    for (var y=0; y < worldHeight; y++)
    {
        if(world[x][y] == 0){
          var nbs = countAliveNeighbours(world, x, y);
          if(nbs >= treasureHiddenLimit){
            world[x][y] = 2;
          }
        }
    }
  }   
  redraw();
}

function getRandomColor() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function redraw() 
{
    for (let x_postion = 0; x_postion < world.length; x_postion++) {
        for (let y_positon = 0; y_positon < world[x_postion].length; y_positon++) {
            if(world[x_postion][y_positon] == 1){
                let cube = getCube('#00FF00',{x:4, y:4, z:4})
                translate(cube,{x: x_postion* 4, y: y_positon *4, z:1})
                scene.add(cube);
            }
            else{
                let cube = getCube('#0000ff',{x:4, y:4, z:4})
                translate(cube,{x: x_postion * 4, y: y_positon* 4, z:1})
                scene.add(cube);
            }
        }
    }
}

// the game's canvas element
var canvas = null;
// the canvas 2d context
var ctx = null;

// ensure that concole.log doesn't cause errors
if (typeof console == "undefined") var console = { log: function() {} };

// start running immediately
onload();
redraw();