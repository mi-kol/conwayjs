root = document.querySelector(".root");

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbors = [];
        this.state = false;
    }
}

let nodes = {};
for (i = 0; i <= 8; i++) {
    for (j = 0; j <= 8; j++) {
        nodes[(i,j)] = Node(i,j);
    }  
}

function prepare(nodes) {
    let actives = [];
    let recalcnodes = [];
    Object.keys(nodes).forEach(function (item) {
        if (nodes[item].state === true) {
            actives.push(item);
        }
    });
    actives.forEach(element => {
        for (i = -1; i <= 1; i++) {
            for (j = -1; j <= 1; j++) {
                recalcnodes.push((element[0] + i, element[1] + j));
            }
        }
    });
    const uniquercn = [...new Set(recalcnodes)]
    uniquercn.forEach(element => {
        if (!(element in nodes)) {
            nodes[element] = Node(element[0], element[1]);
        }
    });
    return uniquercn
}

function iterate(nodes) {
    relevantNodes = prepare(nodes);
    relevantNodes.forEach(element => {
        this.neighbors = [];
    })
}



nodes[(0,0)].state = true;

for (i = 0; i <= 10; i++) {

}