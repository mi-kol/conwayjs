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
        console.log(propkey, "=", propvalue)
        nodes[propkey] = propvalue;
        console.log(`created node ${i}, ${j}`)
        console.log(nodes)
        for (k = -1; k <= 1; k++) {
            for (l = -1; l<=1; l++) {
                if (!(k === 0 && l === 0)) {
                    nodes[`${i},${j}`].neighbors.push(`${i+k},${j+l}`)
                }
            } 
        }
    }  
}
console.log(nodes)

function prepare(nodes) {
    let actives = [];
    let recalcnodes = [];
    Object.keys(nodes).forEach(function (item) {
        if (nodes[item].state === true) {
            actives.push(item);
        }
    });
    // console.log('actives', actives)
    actives.forEach(element => {
        recalcnodes = recalcnodes.concat(nodes[element].neighbors);
    });
    // console.log(recalcnodes);
    const uniquercn = [...new Set(recalcnodes)]
    uniquercn.forEach(element => {
        if (!(element in nodes)) {
            let coords = element.split(',')
            let x = coords[0]
            let y = coords[1]
            nodes[element] = new Node(x, y);
        }
    });
    return uniquercn
}

function howManyNearby(element, state) {
    return element.neighbors.filter(obj => {
        let coords = obj.split(',')
        let x = coords[0]
        let y = coords[1]
        if (!(obj in nodes)) {
            nodes[obj] = new Node(x,y);
            console.log("made node");
        }
        return nodes[obj].state === state
    }).length;
}

function iterate() {
    console.log('hi')
    relevantNodes = prepare(nodes);
    // console.log(relevantNodes);
    relevantNodes.forEach(element => {
        var ref = nodes[element];
        // console.log(ref)
        if (ref.state === false) {
            console.log(howManyNearby(ref,false), ref)
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
    relevantNodes.forEach(element => {
        var ref = nodes[element];
        if (ref.changed === true) {
            ref.state = ref.propstate;
        }
    })
}

function prepareMap(dimension) {
    let nodeMap = {};
    for (var node in nodes) {
        nodeMap[node] = `<div id=${node} class="square"></div>`
    }
    propadded = '<div class="main">'
    for (i = 0; i <= dimension; i++) {
        rowAdd = '<div class="row">'
        for (j=0; j<=dimension; j++) {
            rowAdd += nodeMap[`${i},${j}`]
        }
        rowAdd += '</div>'
        propadded += rowAdd
    }
    propadded+= '</div>'
    root.innerHTML = propadded
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
console.log(nodes)
prepareMap(8)
paintMap()

// setInterval(function() {iterate();paintMap();}, 1000);


// for (i = 0; i <= 10; i++) {

// }