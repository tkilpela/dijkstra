var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.scale(2,2);
var grid = [
['*', '*', '*' ,'*' ,'*' , '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
['*', ' ', ' ' ,' ' ,' ' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', '*' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', '*', '*' ,'*' ,'*' , '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*']];

var start = [1, 5];
var finish = [9, 8];

grid[start[1]][start[0]] = 's';
grid[finish[0]][finish[1]] = 'f';

var walls = [];

var mousePosition = [];

function drawCube(i, j, fill){
    ctx.beginPath();
    ctx.rect(i*40, j*40, 40, 40);
    if(fill == true){
        ctx.fillStyle = '#808080'
        ctx.fill();
    }
    else ctx.stroke();
}

function drawDot(x, y){
    ctx.beginPath();
    ctx.arc((x*40)+20, (y*40)+20, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
}

function drawFinish(x, y){
    ctx.beginPath();
    ctx.arc((x*40)+20, (y*40)+20, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#0000FF';
    ctx.fill();
}

function drawFoundTile(x, y, distance){
    if (distance == undefined){
        distance = 0;
    }
    ctx.beginPath();
    ctx.rect(x*40, y*40, 40, 40);
    ctx.fillStyle = 'rgba(0,225,0,0.5)';
    ctx.fill();
    ctx.font = "15px Arial"
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(distance, (x*40)+2.5, (y*40)+14.5);
    ctx.fillText(distance, (x*40)+2.5, (y*40)+14.5);
}

function onClick(event){
    var mouseX = (event.clientX - (c.offsetLeft - c.scrollLeft)) - 2;
    var mouseY = (event.clientY - (c.offsetTop - c.scrollTop)) - 2;
    console.log(Math.floor(mouseX/2) + ", " + Math.floor(mouseY/2));
}

for(var i = 0; i < 16; i++){
    for(var j = 0; j < 12; j++){
        if(grid[j][i] == '*'){
            drawCube(i, j, true);
            walls.push([i, j]);
        }
        else{
            if(grid[j][i] == 's'){
                drawCube(i, j, false);
                drawDot(i, j);
            }
            else drawCube(i, j, false);
        }
    }
}

// queue with priorities
class PriorityQueue{
    constructor(){
        self.elements = [];
    }
    isEmpty(){
        return elements.length == 0;
    }
    put(item, priority){
        elements.push([priority, item]);
    }
    get(){
        return elements.pop()[1];
    }
}

// grid class for the drawn grid, includes neighbor detection and collision detection
class Grid{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.boundaries = []
    }

    neighbors(id){
        var [x, y] = id;
        var results = [[x+1, y], [x, y-1], [x-1, y], [x, y+1]];
        var json = this.boundaries.map(JSON.stringify);
        results = results.filter(result => {
            [x, y] = result;
            return ((0 < x && x < this.width-1) && (0 < y && y < this.height-1));
        });
        results = results.filter(result => {
            var search = JSON.stringify(result);
            return !json.includes(search);
        });
        return results;
    }
}

class WeightedGrid extends Grid{
    weights = {};
    constructor(width, height){
        super(width, height);
    }

    cost(to){
        if (this.weights.hasOwnProperty(to)){
            return target;
        }
        else{
            return 1;
        }
    }
}

g = new WeightedGrid(16, 12);
g.boundaries = walls;

function dijkstra(grid, start, finish){
    var queue = new PriorityQueue();
    queue.put(start, 0);

    var from = {};
    var cost = {};
    from[start] = null;
    cost[start] = 0;

    drawFinish(9, 8);

    while (!queue.isEmpty()){
        var current = queue.get();
        if (current == finish) break;
        for(next of grid.neighbors(current)){
            temp_cost = cost[current] + grid.cost(next)
            if (!(next in cost) || (temp_cost < cost[next])){
                cost[next] = temp_cost;
                var priority = temp_cost;
                queue.put(next, priority);
                from[next] = current;
            }
        }
    }
    return [from, cost];
}

var result = dijkstra(g, start, finish);

var from = result[0];
var cost = result[1];

function recreatePath(from, cost, start, finish){
    var current = finish;
    var path = [];
    while(current != start){
        path.push(current);
        drawFoundTile(current[0], current[1], cost[current]);
        current = from[current];
    }
    // add first node and reverse (the path is from finish to start)
    path.push(start)
    drawFoundTile(start[0], start[1]);
    path.reverse()
    return path;
}

var path = recreatePath(from, cost, start, finish);
