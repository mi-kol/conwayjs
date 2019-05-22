root = document.querySelector("#root");

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbors = [];
        this.state = false;
        this.propstate = false;
        this.changed = false;
    }
}

let nodes = {};
for (i = 0; i <= 8; i++) {
    for (j = 0; j <= 8; j++) {
        propkey = `${i},${j}`
        propvalue = new Node(i,j);
        // console.log(propkey, "=", propvalue)
        nodes[propkey] = propvalue;
        // console.log(`created node ${i}, ${j}`)
        // console.log(nodes)
        for (k = -1; k <= 1; k++) {
            for (l = -1; l<=1; l++) {
                if (!(k === 0 && l === 0)) {
                    nodes[`${i},${j}`].neighbors.push(`${i+k},${j+l}`)
                }
            } 
        }
    }  
}
// console.log(nodes)

function prepare(nodes) {
    let actives = [];
    let recalcnodes = [];
    for (var node in nodes) {
        if (nodes[node].state === true) {
            actives.push(node);
        }
    }
    console.log(actives);
    // console.log('actives', actives)
    actives.forEach(element => {
        recalcnodes = recalcnodes.concat(nodes[element].neighbors);
    });
    recalcnodes = recalcnodes.concat(recentlyChanged);
    recalcnodes = recalcnodes.concat(actives);
    for (var node in recentlyChanged) {
        recentlyChanged[node].changed = false;
    }
    recentlyChanged = [];
    // console.log(recalcnodes);
    const uniquercn = [...new Set(recalcnodes)]
    uniquercn.forEach(element => {
        if (!(element in nodes)) {
            let coords = element.split(',')
            let x = parseInt(coords[0])
            let y = parseInt(coords[1])
            nodes[element] = new Node(x, y);
            for (k = -1; k <= 1; k++) {
                for (l = -1; l<=1; l++) {
                    if (!(k === 0 && l === 0)) {
                        nodes[element].neighbors.push(`${x+k},${y+l}`)
                    }
                } 
            }
        }
    });
    return uniquercn
}

function howManyNearby(element, state) {
    return element.neighbors.filter(obj => {
        let coords = obj.split(',')
        let x = parseInt(coords[0])
        let y = parseInt(coords[1])
        if (!(obj in nodes)) {
            nodes[obj] = new Node(x,y);
            for (k = -1; k <= 1; k++) {
                for (l = -1; l<=1; l++) {
                    if (!(k === 0 && l === 0)) {
                        nodes[obj].neighbors.push(`${x+k},${y+l}`)
                    }
                } 
            }
            // console.log("made node");
        }
        return nodes[obj].state === state
    }).length;
}

function iterate() {
    // console.log('hi')
    let maxv = 0
    relevantNodes = prepare(nodes);
    // console.log(relevantNodes);
    relevantNodes.forEach(element => {
        var ref = nodes[element];
        if (ref.x > maxv) {
            maxv = ref.x
        } else if (ref.y > maxv) {
            maxv = ref.y
        }
        // console.log(ref)
        if (ref.state === false) {
            // console.log(howManyNearby(ref,false), ref)
            if (howManyNearby(ref, true) === 3) {
                ref.propstate = true;
                ref.changed = true;
            }
        } else {
            if (howManyNearby(ref, true) < 2 || howManyNearby(ref, true) > 3) {
                ref.propstate = false;
                ref.changed = true;
            }
        }
    });
    console.log(maxv)
    relevantNodes.forEach(element => {
        var ref = nodes[element];
        if (ref.changed === true) {
            ref.state = ref.propstate;
        }
    });
    for (var node in nodes) {
        if (nodes[node].changed === true) {
            nodes[node].changed = false;
        }
    }
    let maxValue = Math.max.apply(Math, [Math.max.apply(Math, Object.values(nodes).map(function(o) {return o.x})), Math.max.apply(Math, Object.values(nodes).map(function(o) {return o.y}))])
    console.log(maxValue)
    if (maxValue > maxv) {
        prepareMap(maxValue)
    }
}

let recentlyChanged = []

function boxClickHandler(event) {
    console.log(event.target.id)
    if (timer === false) {
        if (!(event.target.id in nodes)) {
            let coords = event.target.id.split(',')
            let x = parseInt(coords[0])
            let y = parseInt(coords[1])
            nodes[event.target.id] = new Node(x,y);
            for (k = -1; k <= 1; k++) {
                for (l = -1; l<=1; l++) {
                    if (!(k === 0 && l === 0)) {
                        nodes[event.target.id].neighbors.push(`${x+k},${y+l}`)
                        if (!(`${x+k},${y+l}` in nodes)) {
                            nodes[event.target.id] = new Node(x+k,y+l)
                        } else {
                        }
                    }
                } 
            }
        }
        nodes[event.target.id].state = !nodes[event.target.id].state;
        nodes[event.target.id].propstate = nodes[event.target.id].state;
        nodes[event.target.id].changed = true;
        recentlyChanged.push(event.target.id);
        paintMap();
    }
}

function prepareMap(dimension) {
    var allOldBoxes = Array.from(document.querySelectorAll('.square'))
    let nodeMap = {};
    for (var node in nodes) {
        nodeMap[node] = `<div id=${node} class="square"></div>`
    }
    propadded = '<div class="main">'
    for (i = 0; i <= dimension; i++) {
        rowAdd = '<div class="row">'
        for (j=0; j<=dimension; j++) {
            if (!(`${i},${j}` in nodeMap)) {
                rowAdd += `<div id=${i},${j} class="square unmade"></div>`
            } else {
                rowAdd += nodeMap[`${i},${j}`]
            }    
        }
        rowAdd += '</div>'
        propadded += rowAdd
    }
    propadded+= '</div>'
    root.innerHTML = propadded
    var allBoxes = Array.from(document.querySelectorAll('.square'))
    let difference = allOldBoxes.filter(x => !allBoxes.includes(x)).concat(allBoxes.filter(x => !allOldBoxes.includes(x)));
    // console.log(difference)
    for (var box in difference) {
        // console.log(box)
        difference[box].addEventListener('click', boxClickHandler);
    }
}


function paintMap() {
    for (var coor in nodes) {
        // please fix this
        let toChange = document.getElementById(`${coor}`)
        // console.log(coor)
        // console.log(toChange)
        if (!(toChange == null)) {
            if (nodes[coor].state === true) {
                toChange.classList.add('alive')
            } else {
                toChange.className = 'square'
            }
        }
    }
}

nodes["3,2"].state = true;
nodes["3,2"].propstate = true;
nodes["4,3"].state = true;
nodes["4,3"].propstate = true;
nodes["2,4"].state = true;
nodes["2,4"].propstate = true;
nodes["3,4"].state = true;
nodes["3,4"].propstate = true;
nodes["4,4"].state = true;
nodes["4,4"].propstate = true;
// console.log(nodes)
prepareMap(8)
paintMap()

let timer = false;
let play = ''



document.body.onkeyup = function (e) {
    if (e.keyCode === 32) {
        if (timer) {
            clearInterval(play);
            timer = false;
        } else {
            play = setInterval(function() {iterate();paintMap();}, 500);
            timer = true;
        }
        
    }
}

