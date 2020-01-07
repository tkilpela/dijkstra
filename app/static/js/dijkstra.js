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
    ctx.beginPath();
    ctx.font = "15px Arial"
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(distance, (x*40)+2.5, (y*40)+14.5);
}

function onClick(event){
    var mouseX = (event.clientX - (c.offsetLeft - c.scrollLeft)) - 2;
    var mouseY = (event.clientY - (c.offsetTop - c.scrollTop)) - 2;
    console.log(Math.floor(mouseX/2) + ", " + Math.floor(mouseY/2));
    Math.floor(mouseX/2), Math.floor(mouseY/2)
}

function compareArrays(x, y){
    var i = JSON.stringify(x);
    var j = JSON.stringify(y);

    if(i == j) return true;
    else return false;
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
    put(priority, item){
        console.log(priority + " , " + item)
        elements.push([priority, item]);
    }
    get(){
        return elements.pop();
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
            return (0 < x && x < this.width-1) && (0 < y && y < this.height-1);
        });
        results = results.filter(result => {
            var search = JSON.stringify(result);
            return !json.includes(search);
        });
        
        return results;
    }
}

class WeightedGrid extends Grid{
    constructor(self, width, height){
        super(width, height);
        self.weights = {};
    }

    cost(self, target){
        return self.weights(target, 1)
    }
}

g = new Grid(16, 12);
g.boundaries = walls;

function dijkstra(grid, start, finish){
    var queue = new PriorityQueue();
    queue.put(start, 0);

    var from = {};
    var cost = {};
    from[start] = null;
    cost[start] = 0;

    drawFinish(9, 8);

    console.log(queue.isEmpty())

    while (!queue.isEmpty()){
        var current = queue.get();
        console.log("current: "+current);
        if (current == finish) break;
        console.log(grid.neighbors(current))
        for(next of grid.neighbors(current)){
            console.log("test")
            temp_cost = cost[current] + graph.cost(current, next)
            if (!(next in cost) || (temp_cost < cost[next])){
                cost[next] = temp_cost;
                var priority = temp_cost;
                queue.put(next, priority);
                from[next] = current;
            }
        }
    }
    return from, cost;
}

//drawFoundTile(next[0], next[1], distance[next]);
//if(next[0] == finish[0] && next[1] == finish[1]){
//    drawFinish(next[0], next[1]);
//    queue = [];
//}

var from = dijkstra(g, start, finish);

console.log(from)


function createPath(from, start, finish){
    var current = finish
    path = []
    while(current != start){
        path.push(current)
        drawFoundTile(next[0], next[1], distance[next]);
        current = from[current]
    }
    // add first node and reverse (the path is from finish to start)
    path.push(start)
    path.reverse()
    return path;
}

var path = createPath()

console.log()