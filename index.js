root = document.querySelector(".root");

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
        propkey = {x: i, y: j}
        propvalue = new Node(i,j);
        console.log(propkey, "=", propvalue)
        nodes[propkey] = propvalue;
        console.log(`created node ${i}, ${j}`)
        console.log(nodes)
        for (k = -1; k <= 1; k++) {
            for (l = -1; l<=1; l++) {
                if (!(k === 0 && l === 0)) {
                    nodes[{x: i,y: j}].neighbors.push({x: i+k,y: j+l})
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
    actives.forEach(element => {
        recalcnodes.concat(nodes[element].neighbors);
    });
    const uniquercn = [...new Set(recalcnodes)]
    uniquercn.forEach(element => {
        if (!(element in nodes)) {
            nodes[element] = new Node(nodes[element].x, nodes[element].y);
        }
    });
    return uniquercn
}

function howManyNearby(element, state) {
    return length(element.neighbors.filter(obj => {
        return nodes[obj].state = state
    }));
}

function iterate(nodes) {
    relevantNodes = prepare(nodes);
    relevantNodes.forEach(element => {
        var ref = nodes[element];
        if (ref.state === false) {
            if (howManyNearby(ref, false) === 3) {
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

nodes[{x:0,y:5}].state = true;
nodes[{x:0,y:5}].propstate = true;
nodes[{x:1,y:4}].state = true;
nodes[{x:1,y:4}].propstate = true;
nodes[{x:2,y:4}].state = true;
nodes[{x:2,y:4}].propstate = true;
nodes[{x:2,y:5}].state = true;
nodes[{x:2,y:5}].propstate = true;
nodes[{x:2,y:6}].state = true;
nodes[{x:2,y:6}].propstate = true;


iterate(nodes)
console.log(nodes)

// for (i = 0; i <= 10; i++) {

// }