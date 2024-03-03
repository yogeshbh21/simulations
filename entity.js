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
    name = "",
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

  resetPos({ resetPosFn, ...params }) {
    resetPosFn({ ...params, ref: this });
  }

  draw({ ctx }) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
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
