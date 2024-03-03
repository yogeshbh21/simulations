function story1() {
  const story1 = new Story();
  story1.canvasInit();
  const ctx = story1._ctx;
  const stars = [];

  _.map(_.times(1000), () => {
    stars.push(
      new Circle({
        name: "",
        weight: Math.random() * 0.1,
        posX: getRandomNumber(0, ctx.canvas.width),
        posY: getRandomNumber(0, ctx.canvas.height),
        color: colorHexMap.white,
        //   color: colorHexMap[_.keys(colorHexMap)[getRandomNumber(0, 20)]],
        velX: 2, // Math.random() * 3,
        velY: 1, // Math.random() * 3,
        acceleration: 0.1, //Math.random() * 3,
      })
    );
  });

  _.map(stars, (star) => {
    star.draw({ ctx });
  });

  function displayStats() {
    ctx.font = "14px Arial"; // Set font and size
    ctx.fillText(
      `Vx - ${parseFloat(stars[0].velX).toFixed(2)}\nVy - ${parseFloat(
        stars[0].velY
      ).toFixed(2)} \na - ${stars[0].acceleration}`,
      10,
      ctx.canvas.height / 2 - 10
    );
  }

  setInterval(() => {
    story1.clearCanvas();
    story1.canvasInit();
    timeLapse({ stars, ctx });
    displayStats();
  }, 50);
}

const resetPosition = ({ canvas, ref }) => {
  if (
    ref.posX > canvas.width + canvas.width / 2 ||
    ref.posY > canvas.height + canvas.height / 2
  ) {
    ref.posX = getRandomNumber(-canvas.width / 2, 0);
    ref.posY = getRandomNumber(-canvas.height / 2, 0);
  } else if (ref.posX < -canvas.width / 2 || ref.posY < -canvas.height / 2) {
    ref.posX = getRandomNumber(canvas.width / 2, canvas.width);
    ref.posY = getRandomNumber(canvas.height / 2, canvas.height);
  }

  if (Math.abs(ref.velX) > 20) {
    ref.acceleration = -ref.acceleration;
  }
};

const timeLapse = ({ stars, ctx }) => {
  _.map(stars, (star) => {
    star.moveForwardOnX();
    star.moveForwardOnY();
    star.resetPos({ resetPosFn: resetPosition, canvas: ctx.canvas });

    star.draw({ ctx });
  });
};
