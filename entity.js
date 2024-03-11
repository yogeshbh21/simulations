class Entity {
  constructor({
    name = "",
    weight = 0,
    posX = 0,
    posY = 0,
    color = "#00FF00",
    velX = 0,
    velY = 0,
    acceleration = 0,
  }) {
    this._name = name;
    this._weight = weight; // in gms
    this._posX = posX;
    this._posY = posY;
    this._color = color;
    this._velX = velX;
    this._velY = velY;
    this._acceleration = acceleration;
  }

  // Getters
  get name() {
    return this._name;
  }

  get weight() {
    return this._weight;
  }

  get posX() {
    return this._posX;
  }

  get posY() {
    return this._posY;
  }

  get color() {
    return this._color;
  }

  get velX() {
    return this._velX;
  }

  get velY() {
    return this._velY;
  }

  get acceleration() {
    return this._acceleration;
  }

  // Setters
  set name(name) {
    this._name = name;
  }

  set weight(weight) {
    this._weight = weight;
  }

  set posX(x) {
    this._posX = x;
  }

  set posY(y) {
    this._posY = y;
  }

  set color(color) {
    this._color = color;
  }

  set velX(value) {
    this._velX = value;
  }

  set velY(value) {
    this._velY = value;
  }

  set acceleration(value) {
    this._acceleration = value;
  }

  resetPos() {}
}

class Circle extends Entity {
  constructor({
    name = "Circle",
    weight = 0,
    posX = 0,
    posY = 0,
    color = "#00FF00",
    velX,
    velY,
    acceleration,
  }) {
    super({
      name,
      weight,
      posX,
      posY,
      color,
      velX,
      velY,
      acceleration,
    });
  }

  // Override the radius property
  get radius() {
    return this.weight * 10;
  }

  moveForwardOnX() {
    this.velX += this.acceleration;
    this.posX = this.posX + this.velX;
  }

  moveForwardOnY() {
    this.velY += this.acceleration;
    this.posY = this.posY + this.velY;
  }

  moveForwardOnXOnTime({ timePassedInMs }) {
    //make this a common function
    this.posX = this.posX + (this.velX * timePassedInMs) / 1000;
  }

  moveForwardOnYOnTime({ timePassedInMs }) {
    this.posY = this.posY + (this.velY * timePassedInMs) / 1000;
  }

  resetPos({ resetPosFn, ...params }) {
    resetPosFn({ ...params, ref: this });
  }

  draw({ ctx }) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  getNodePos() {
    const posX = (this.posX - this.weight * 10) / (this.weight * 10 * 2);
    const posY = (this.posY - this.weight * 10) / (this.weight * 10 * 2);
    return { posX, posY };
  }
}

class Story {
  constructor() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    this._canvas = canvas;
    this._ctx = ctx;
  }

  canvasInit() {
    if (this._canvas.getContext) {
      const devicePixelRatio = window.devicePixelRatio;
      // Scale the canvas based on the device pixel ratio
      this._canvas.width = window.innerWidth * devicePixelRatio;
      this._canvas.height = window.innerHeight * devicePixelRatio;
      this._ctx.scale(devicePixelRatio, devicePixelRatio);
    } else {
      alert("Canvas is not supported in your browser");
    }
  }

  clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
}

class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(node) {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, new Set());
    } else {
      console.error("Node already exists in the graph.");
    }
  }

  addEdge(node1, node2) {
    if (!this.nodes.has(node1) || !this.nodes.has(node2)) {
      console.error("Both nodes must exist in the graph.");
      return;
    }

    this.nodes.get(node1).add(node2);
    this.nodes.get(node2).add(node1); // For an undirected graph
  }

  getNeighbors(node) {
    return Array.from(this.nodes.get(node));
  }

  displayGraph() {
    for (const [node, neighbors] of this.nodes) {
      console.log(`${node} -> ${Array.from(neighbors).join(", ")}`);
    }
  }
}

class Matrix {
  constructor() {
    this.matrix = new Map();
  }

  addNode(row, col, node) {
    if (!this.matrix.has(row)) {
      this.matrix.set(row, new Map());
    }

    this.matrix.get(row).set(col, node);
  }

  getNode(row, col) {
    return this.matrix.has(row) ? this.matrix.get(row).get(col) : undefined;
  }

  displayMatrix({ displayFn }) {
    for (const [row, colNodeMap] of this.matrix) {
      _.map(Array.from(colNodeMap.values()), (node, indexY) => {
        displayFn({ row, col: indexY, ref: this, node });
      });
    }
  }

  getNodePos({ node, getFn }) {
    return getFn({ node, ref: this });
  }

  getMatrixLength() {
    const totalRows = this.matrix.size;
    const totalCols =
      totalRows > 0
        ? Math.max(
            ...Array.from(this.matrix.values()).map(
              (colNodeMap) => colNodeMap.size
            )
          )
        : 0;

    return { totalRows, totalCols };
  }
  getAdjacentNodes(row, col) {
    const adjacentNodes = [];

    // Check the node to the right
    if (this.matrix.has(row) && this.matrix.get(row).has(col + 1)) {
      adjacentNodes.push(this.matrix.get(row).get(col + 1));
    }

    // Check the node bottom-right
    if (this.matrix.has(row + 1) && this.matrix.get(row + 1).has(col + 1)) {
      adjacentNodes.push(this.matrix.get(row + 1).get(col + 1));
    }

    // Check the node below
    if (this.matrix.has(row + 1) && this.matrix.get(row + 1).has(col)) {
      adjacentNodes.push(this.matrix.get(row + 1).get(col));
    }

    // Check the node bottom-left
    if (this.matrix.has(row + 1) && this.matrix.get(row + 1).has(col - 1)) {
      adjacentNodes.push(this.matrix.get(row + 1).get(col - 1));
    }

    // Check the node to the left
    if (this.matrix.has(row) && this.matrix.get(row).has(col - 1)) {
      adjacentNodes.push(this.matrix.get(row).get(col - 1));
    }

    // Check the node top-left
    if (this.matrix.has(row - 1) && this.matrix.get(row - 1).has(col - 1)) {
      adjacentNodes.push(this.matrix.get(row - 1).get(col - 1));
    }

    // Check the node above
    if (this.matrix.has(row - 1) && this.matrix.get(row - 1).has(col)) {
      adjacentNodes.push(this.matrix.get(row - 1).get(col));
    }

    // Check the node top-right
    if (this.matrix.has(row - 1) && this.matrix.get(row - 1).has(col + 1)) {
      adjacentNodes.push(this.matrix.get(row - 1).get(col + 1));
    }

    return adjacentNodes;
  }
}
