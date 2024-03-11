const FRAME_SPEED = 1;
const WEIGHT = 1;
const AREA = 100;
const totalStarsX = 50;
const totalStarsY = 50;
const start = [0, 0];
const end = [getRandomNumber(1, 50), getRandomNumber(1, 50)];

function story2() {
  let frameSpeed = FRAME_SPEED;
  const story1 = new Story();
  story1.canvasInit();
  const ctx = story1._ctx;

  const grid = new Matrix();
  const originalMap = new Matrix();

  // playAudio();
  _.map(_.times(totalStarsX), (indexX) => {
    _.map(_.times(totalStarsY), (indexY) => {
      grid.addNode(
        indexX,
        indexY,
        new Circle({
          name: "Stars",
          weight: WEIGHT,
          posX: indexX * (WEIGHT * 10 * 2) + WEIGHT * 10,
          posY: indexY * (WEIGHT * 10 * 2) + WEIGHT * 10,
          color: colorHexMap.white,
          //   color: colorHexMap[_.keys(colorHexMap)[getRandomNumber(0, 20)]],
          velX: 0, // Math.random() * 3,
          velY: 0, // Math.random() * 3,
          acceleration: 0, // Math.random() * 3,
        })
      );

      originalMap.addNode(indexX, indexY, {
        val: Math.random(),
        visited: false,
        added: false,
      });
    });
  });

  ctx.getObjects = () => {
    return {
      grid,
    };
  };

  ctx.getVars = () => ({ originalMap });

  //   setInterval(() => {
  depthFirstSearch({ ctx, frameSpeed });
  //   }, frameSpeed);
}

const setPattern = ({ ctx }) => {
  const { originalMap } = ctx.getVars();
  const { grid } = ctx.getObjects();
  loopGrid({
    jobFn: ({ node, row, col }) => {
      //   if (node.visited === false) {
      node.visited = true;
      const starNode = grid.getNode(row, col);
      starNode.color = adjustColorIntensity(colorHexMap.white, node.val);
      //   return { exit: true };
      //   }
    },

    grid: originalMap,
  });

  drawGrid({ ctx });
};

const depthFirstSearch = async ({ ctx, frameSpeed }) => {
  const { originalMap } = ctx.getVars();
  const { grid } = ctx.getObjects();

  const startNode = grid.getNode(...start);
  const endNode = grid.getNode(...end);
  startNode.color = colorHexMap.green;
  endNode.color = colorHexMap.blue;

  const nodeStack = [startNode];

  async function processNode() {
    if (_.isEmpty(nodeStack)) return;

    const tempNode = nodeStack.pop();
    const nodePos = _.values(tempNode.getNodePos());
    const mapNode = originalMap.getNode(...nodePos);

    if (_.isEqual(nodePos, end)) return;

    if (mapNode.visited === false) {
      const neighborNodes = grid.getAdjacentNodes(...nodePos);
      nodeStack.push(
        ..._.filter(neighborNodes, (node) => {
          const neighborNodePos = _.values(node.getNodePos());
          return !originalMap.getNode(...neighborNodePos).added;
        })
      );
      _.map(neighborNodes, (node) => {
        const neighborNodePos = _.values(node.getNodePos());
        originalMap.getNode(...neighborNodePos).added = true;
        if (
          !originalMap.getNode(...neighborNodePos).visited &&
          originalMap.getNode(...neighborNodePos).added &&
          !_.isEqual(neighborNodePos, end)
        )
          node.color = colorHexMap.yellow;
      });
    }
    tempNode.color = colorHexMap.red;
    mapNode.visited = true;

    drawGrid({ ctx });
    await new Promise((resolve) => setTimeout(resolve, frameSpeed)); // Pause
    processNode();
  }

  await processNode();
};

const breadthFirstSearch = async ({ ctx, frameSpeed }) => {
  const { originalMap } = ctx.getVars();
  const { grid } = ctx.getObjects();

  const startNode = grid.getNode(...start);
  const endNode = grid.getNode(...end);
  startNode.color = colorHexMap.green;
  endNode.color = colorHexMap.blue;

  const nodeStack = [startNode];

  async function processNode() {
    if (_.isEmpty(nodeStack)) return;

    const tempNode = nodeStack.shift();
    const nodePos = _.values(tempNode.getNodePos());
    const mapNode = originalMap.getNode(...nodePos);

    if (_.isEqual(nodePos, end)) return;

    if (mapNode.visited === false) {
      const neighborNodes = grid.getAdjacentNodes(...nodePos);
      nodeStack.push(
        ..._.filter(neighborNodes, (node) => {
          const neighborNodePos = _.values(node.getNodePos());
          return !originalMap.getNode(...neighborNodePos).added;
        })
      );
      _.map(neighborNodes, (node) => {
        const neighborNodePos = _.values(node.getNodePos());
        originalMap.getNode(...neighborNodePos).added = true;
      });
    }
    tempNode.color = colorHexMap.red;
    mapNode.visited = true;

    drawGrid({ ctx });
    await new Promise((resolve) => setTimeout(resolve, frameSpeed)); // Pause
    processNode();
  }

  await processNode();
};

const drawGrid = ({ ctx }) => {
  const { grid } = ctx.getObjects();

  loopGrid({
    jobFn: ({ node, row, col }) => {
      node.draw({ ctx });
    },
    grid,
    ctx,
  });
};

const loopGrid = ({ jobFn, grid, ...params }) => {
  const { totalRows, totalCols } = grid.getMatrixLength();

  for (let indexX = 0; indexX < totalRows; indexX++) {
    for (let indexY = 0; indexY < totalCols; indexY++) {
      const node = grid.getNode(indexX, indexY);
      const result = jobFn({
        row: indexX,
        col: indexY,
        node,
        ...params,
      });
      if (result !== undefined) {
        const { exit = false } = result;

        if (exit) {
          return; // Use return to exit the function when exit is truthy
        }
      }
    }
  }
};

function adjustColorIntensity(hexColor, intensity) {
  // Ensure the intensity is within the valid range [0, 1]

  // Convert hex to RGB
  const hex = hexColor.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Adjust intensity for each RGB component
  const adjustedR = Math.round(r * intensity);
  const adjustedG = Math.round(g * intensity);
  const adjustedB = Math.round(b * intensity);

  // Convert back to hex
  const adjustedHex =
    "#" +
    ((1 << 24) | (adjustedR << 16) | (adjustedG << 8) | adjustedB)
      .toString(16)
      .slice(1);

  return adjustedHex;
}
