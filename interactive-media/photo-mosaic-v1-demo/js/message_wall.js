class PopoutBoard {
  constructor(
    numberOfRows,
    numberOfCols,
    tileBorderColor,
    cardUnderlayColor,
    minimumFullness,
    canvasFadeInSeconds,
    drawGrid,
    interactive,
    data,
    animationClass,
    cycleDuration
  ) {
    (this._rows = numberOfRows),
      (this._cols = numberOfCols),
      (this._borderColor = tileBorderColor),
      (this._underlayColor = cardUnderlayColor),
      (this._minFullness = minimumFullness),
      (this._fadeIn = canvasFadeInSeconds),
      (this._drawGrid = drawGrid),
      (this._interactive = interactive),
      (this._data = data),
      (this._animationClass = animationClass),
      (this._cycleDur = cycleDuration);

    // set window variables
    this._windowHeight = Math.floor(window.innerHeight);
    this._windowWidth = Math.floor(window.innerWidth);
    this._timeouts = [];
  }

  animate(row, col, css, delay = 0) {
    // set active card todo disallow this to be selected or chosen again
    this._activeRow = row;
    this._activeCol = col;

    // todo move to function that returns interval
    // on click, cancel interval and call function that starts for one

    let to1 = setTimeout(() => {
      let activeCard = this.createPopoutCard(row, col);
      let activeUnderlay = this.createUnderlayCard(row, col);

      // start the animation after 3 seconds
      let to2 = setTimeout(async () => {
        activeCard.classList.add(css);
        this._activeCanvas.classList.add("canvas-1-blur");
        activeUnderlay.style.visibility = "visible";
        activeCard.style.visibility = "visible";

        // move card to center
        const cardLeft = activeCard.style.left;
        const cardTop = activeCard.style.top;
        const fromLeft = col < Math.ceil(this._cols / 2);
        const fromTop = row < Math.ceil(this._rows / 2);
        this.moveCard(
          activeCard,
          this._centerTileLeft,
          this._centerTileTop,
          fromLeft,
          fromTop
        );

        let to3 = setTimeout(() => {
          activeCard.classList.remove(css);
          this._activeCanvas.classList.remove("canvas-1-blur");
          this.moveCard(activeCard, cardLeft, cardTop, !fromLeft, !fromTop);

          // todo make transition duration a variable
          let to4 = setTimeout(() => {
            this.removeCards();
          }, 2000);
          this._timeouts.push(to4);
        }, 5000); // how long we want the card to stay in the center (plus transition duration)
        this._timeouts.push(to3);

        // reverse transition
      }, 100); // how long after creating cards will flip start
      this._timeouts.push(to2);
    }, delay); // how long after called to start animation
    this._timeouts.push(to1);
  }

  addListeners(context) {
    console.log("Adding listeners");
    onmouseout = function (e) {
      context._interactiveContext.clearRect(
        0,
        0,
        context._imageDisplayWidth,
        context._imageDisplayHeight
      );
    };

    // todo cleanup
    onmousemove = function (e) {
      const inBounds =
        context._canvasLeft <=
          e.clientX <=
          context._canvasLeft + context._imageDisplayWidth &&
        context._canvasTop <= e.clientY <= context._imageDisplayHeight;

      console.log(
        context._canvasLeft,
        context._canvasTop,
        context._imageDisplayHeight,
        context._imageDisplayWidth
      );

      if (inBounds) {
        console.log("INbounds");
        let mouseRow = Math.floor(
          (e.clientY - context._canvasTop) / context._tileHeight
        );
        let mouseCol = Math.floor(
          (e.clientX - context._canvasLeft) / context._tileWidth
        );

        if (
          context._currentMouseCoord &&
          (context._currentMouseCoord[0] != mouseRow ||
            context._currentMouseCoord[1] != mouseCol)
        ) {
          console.log("Hovered needs updating");

          // set hovered, clear canvas first
          context._interactiveContext.clearRect(
            0,
            0,
            context._imageDisplayWidth,
            context._imageDisplayHeight
          );
          if (context._data[`${mouseRow}_${mouseCol}`]) {
            context._interactiveContext.beginPath();
            context._interactiveContext.strokeRect(
              mouseCol * context._tileWidth,
              mouseRow * context._tileHeight,
              context._tileWidth,
              context._tileHeight
            );
          }
        }
        context._currentMouseCoord = [mouseRow, mouseCol];
      }
    };

    onclick = function (e) {
      const inBounds =
        context._canvasLeft <=
          e.clientX <=
          context._canvasLeft + context._imageDisplayWidth &&
        context._canvasTop <= e.clientY <= context._imageDisplayHeight;

      if (inBounds) {
        // determine mouse position
        let mouseRow = Math.floor(
          (e.clientY - context._canvasTop) / context._tileHeight
        );
        let mouseCol = Math.floor(
          (e.clientX - context._canvasLeft) / context._tileWidth
        );

        if (context._data[`${mouseRow}_${mouseCol}`]) {
          context._interval && this.clearInterval(context._interval);
          context.removeCards();

          // clear timeouts, animate the selected card, and then restart the interval
          this.setTimeout(() => {
            context.clearTimeouts();
            context.animate(mouseRow, mouseCol, context._animationClass);

            let to2 = this.setTimeout(() => {
              context._interval = context.run();
            }, 7000); // after 10 seconds, start auto again
            context._timeouts.push(to2);
          }, 100);
        }
      }
    };
  }

  createUnderlayCard(row, col) {
    let card = document.createElement("div");
    card.classList.add("img-cover");
    card.style.visibility = "hidden";
    card.style.height = this._tileHeight;
    card.style.width = this._tileWidth;
    card.style.left = parseInt(col * this._tileWidth + this._canvasLeft, 10);
    card.style.top = parseInt(row * this._tileHeight + this._canvasTop, 10);
    card.style.backgroundColor = this._underlayColor;

    // add underlay card to document body
    document.body.appendChild(card);

    return card;
  }

  clearTimeouts() {
    this._timeouts.forEach((to) => clearTimeout(to));
    this._timeouts = [];
  }

  moveCard(card, endingLeft, endingTop, fromLeft, fromTop) {
    const transitionDur = 500; // todo set in class variable and also update in photo message delay
    const numIterations = 80;

    let currentLeft = parseInt(card.style.left);
    let currentTop = parseInt(card.style.top);
    endingLeft = parseInt(endingLeft);
    endingTop = parseInt(endingTop);

    const verticalMove = Math.ceil(
      Math.abs(currentTop - endingTop) / numIterations
    );
    const horizontalMove = Math.ceil(
      Math.abs(currentLeft - endingLeft) / numIterations
    );

    let doneTop = false;
    let doneLeft = false;

    let interval = setInterval(() => {
      if (!doneTop) {
        if (fromTop && currentTop <= endingTop) {
          currentTop += verticalMove;
          card.style.top = Math.min(currentTop, endingTop);
        } else if (!fromTop && currentTop >= endingTop) {
          currentTop -= verticalMove;
          card.style.top = Math.max(currentTop, endingTop);
        } else {
          doneTop = true;
        }
      }

      if (!doneLeft) {
        if (fromLeft && currentLeft <= endingLeft) {
          currentLeft += horizontalMove;
          card.style.left = Math.min(currentLeft, endingLeft);
        } else if (!fromLeft && currentLeft >= endingLeft) {
          currentLeft -= horizontalMove;
          card.style.left = Math.max(currentLeft, endingLeft);
        } else {
          doneLeft = true;
        }
      }

      if (doneTop && doneLeft) {
        clearInterval(interval);
        doneTop = false;
        doneLeft = false;
      }
    }, Math.floor(transitionDur / numIterations));
  }

  removeCards() {
    let popouts = document.getElementsByClassName("popout-card");
    Array.from(popouts).forEach((element) => {
      element.remove();
    });

    let underlay = document.getElementsByClassName("img-cover");
    Array.from(underlay).forEach((element) => {
      element.remove();
    });
  }

  renderInteractiveCanvas() {
    // create the canvas
    let interactiveCanvas = document.createElement("canvas");

    // set canvas class, size, and position
    interactiveCanvas.id = "interactive-canvas";
    interactiveCanvas.height = this._windowHeight;
    interactiveCanvas.width = this._windowWidth;
    interactiveCanvas.style.left = this._canvasLeft;
    interactiveCanvas.style.top = this._canvasTop;

    // add to the document body
    document.body.appendChild(interactiveCanvas);

    // get the context for drawing
    const ctx = interactiveCanvas.getContext("2d");
    ctx.strokeStyle = this._borderColor;
    ctx.lineWidth = 1;
    return ctx;
  }
}

class PhotoMosaic extends PopoutBoard {
  constructor(
    numberOfRows,
    numberOfCols,
    tileBorderColor,
    cardUnderlayColor,
    minimumFullness,
    canvasFadeInSeconds,
    imageTilesFolderPath,
    drawGrid,
    interactive,
    data,
    animationClass,
    cycleDuration
  ) {
    super(
      numberOfRows,
      numberOfCols,
      tileBorderColor,
      cardUnderlayColor,
      minimumFullness,
      canvasFadeInSeconds,
      drawGrid,
      interactive,
      data,
      animationClass,
      cycleDuration
    );
    this._tileDir = imageTilesFolderPath;
    this._tileHeight = Math.floor(this._windowHeight / this._rows);
    this._tileWidth = Math.floor(this._windowWidth / this._cols);
    this._canvasLeft = 0;
    this._canvasTop = 0;
    this._imageDisplayWidth = this._windowWidth;
    this._imageDisplayHeight = this._windowHeight;
    this._centerTileLeft = Math.floor(
      this._windowWidth / 2 - this._tileWidth / 2
    );
    this._centerTileTop = Math.floor(
      this._windowHeight / 2 - this._tileHeight / 2
    );
  }

  renderPhotoTilesCanvas() {
    // create the canvas
    let imageTilesCanvas = document.createElement("canvas");

    // set canvas class, size, and position
    imageTilesCanvas.id = "base-canvas";
    imageTilesCanvas.height = this._windowHeight;
    imageTilesCanvas.width = this._windowWidth;
    imageTilesCanvas.style.left = this._canvasLeft;
    imageTilesCanvas.style.top = this._canvasTop;

    // add to the document body
    document.body.appendChild(imageTilesCanvas);

    // get the context for drawing
    const ctx = imageTilesCanvas.getContext("2d");

    // draw images on canvas with borders
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        if (this._data[`${i}_${j}`]) {
          const img = new Image();
          const imgName = this._data[`${i}_${j}`].src;

          img.onload = () => {
            // draw tile image
            ctx.drawImage(
              img,
              j * this._tileWidth,
              i * this._tileHeight,
              this._tileWidth,
              this._tileHeight
            );

            if (this._drawGrid) {
              // draw tile outline
              ctx.beginPath();
              ctx.strokeStyle = this._borderColor;
              ctx.lineWidth = 0.05;
              ctx.strokeRect(
                j * this._tileWidth,
                i * this._tileHeight,
                this._tileWidth,
                this._tileHeight
              );
            }
          };

          img.src = `${this._tileDir}${imgName}`;
        } else {
          if (this._drawGrid) {
            // draw tile outline
            ctx.beginPath();
            ctx.fillStyle = this._underlayColor;
            ctx.fillRect(
              j * this._tileWidth,
              i * this._tileHeight,
              this._tileWidth,
              this._tileHeight
            );
          }
        }
      }
    }

    return imageTilesCanvas;
  }

  createPopoutCard(row, col) {
    // main card
    let card = document.createElement("div");
    card.id = "popout-card";
    card.classList.add("popout-card");
    card.style.visibility = "hidden";
    card.style.height = this._tileHeight;
    card.style.width = this._tileWidth;
    card.style.left = parseInt(col * this._tileWidth + this._canvasLeft, 10);
    card.style.top = parseInt(row * this._tileHeight + this._canvasTop, 10);

    // front of card
    let cardFront = document.createElement("img");
    cardFront.classList.add("popout-card-front");

    // front image
    const frontImgName = this._data[`${row}_${col}`].src;
    cardFront.src = `${this._tileDir}${frontImgName}`;
    console.log(cardFront.src);

    // add front and back to main card
    card.appendChild(cardFront);

    // add card to document body
    document.body.appendChild(card);

    return card;
  }

  run() {
    // run immediately
    const card = Object.keys(this._data)[
      Math.floor(Math.random() * Object.keys(this._data).length)
    ];
    const split = card.split("_");
    this.animate(split[0], split[1], this._animationClass, 3000);
    // then set interval to loop every 10 seconds
    return setInterval(() => {
      const card = Object.keys(this._data)[
        Math.floor(Math.random() * Object.keys(this._data).length)
      ];
      const split = card.split("_");
      this.animate(split[0], split[1], this._animationClass, 1000);
    }, this._cycleDur);
  }

  load() {
    this._activeCanvas = this.renderPhotoTilesCanvas();
    this._interactiveContext =
      this._interactive && this.renderInteractiveCanvas();

    // fade the canvas in
    setTimeout(() => {
      // make visible
      this._activeCanvas.style.visibility = "visible";
      this._activeCanvas.classList.add("fade-in");

      // add listeners if the canvas should be interactive
      this._interactive && this.addListeners(this);
    }, this._fadeIn * 1000);

    // run animation
    this._interval = this.run();
  }
}

class PhotoMessageBoard extends PhotoMosaic {
  constructor(
    numberOfRows,
    numberOfCols,
    tileBorderColor,
    cardUnderlayColor,
    minimumFullness,
    canvasFadeInSeconds,
    imageTilesFolderPath,
    drawGrid,
    interactive,
    data,
    animationClass,
    cycleDuration
  ) {
    super(
      numberOfRows,
      numberOfCols,
      tileBorderColor,
      cardUnderlayColor,
      minimumFullness,
      canvasFadeInSeconds,
      imageTilesFolderPath,
      drawGrid,
      interactive,
      data,
      animationClass,
      cycleDuration
    );
  }

  createPopoutCard(row, col) {
    // main card
    let card = document.createElement("div");
    card.id = "popout-card";
    card.classList.add("popout-card");
    card.style.visibility = "hidden";
    card.style.height = this._tileHeight;
    card.style.width = this._tileWidth;
    card.style.left = parseInt(col * this._tileWidth + this._canvasLeft, 10);
    card.style.top = parseInt(row * this._tileHeight + this._canvasTop, 10);

    // front of card
    let cardFront = document.createElement("img");
    cardFront.classList.add("popout-card-front");

    // front image
    const frontImgName = this._data[`${row}_${col}`].src;
    cardFront.src = `${this._tileDir}${frontImgName}`;

    // back of card
    let cardBack = document.createElement("div");
    cardBack.classList.add("popout-card-back");
    cardBack.style.background = this._cardColor;

    // back of card text
    let p = document.createElement("p");
    let text = document.createTextNode(
      this._data[`${row}_${col}`] ? this._data[`${row}_${col}`].message : ""
    );
    p.appendChild(text);
    p.classList.add("message-text");
    cardBack.appendChild(p);

    // add front and back to main card
    card.appendChild(cardFront);
    card.appendChild(cardBack);

    // add card to document body
    document.body.appendChild(card);

    return card;
  }

  animate(row, col, css, delay = 0) {
    // set active card todo disallow this to be selected or chosen again
    this._activeRow = row;
    this._activeCol = col;

    // todo move to function that returns interval
    // on click, cancel interval and call function that starts for one

    let to1 = setTimeout(() => {
      let activeCard = this.createPopoutCard(row, col);
      let activeUnderlay = this.createUnderlayCard(row, col);

      // start the animation after 3 seconds
      let to2 = setTimeout(async () => {
        activeCard.classList.add(css);
        this._activeCanvas.classList.add("canvas-1-blur");
        activeUnderlay.style.visibility = "visible";
        activeCard.style.visibility = "visible";

        // move card to center
        const cardLeft = activeCard.style.left;
        const cardTop = activeCard.style.top;
        const fromLeft = col < Math.ceil(this._cols / 2);
        const fromTop = row < Math.ceil(this._rows / 2);
        this.moveCard(
          activeCard,
          this._centerTileLeft,
          this._centerTileTop,
          fromLeft,
          fromTop
        );
        // delay transition til post move
        setTimeout(() => {
          activeCard.classList.add("special-flip");
        }, 500 * 4);

        let to3 = setTimeout(() => {
          activeCard.classList.remove(css);
          activeCard.classList.remove("special-flip");
          this._activeCanvas.classList.remove("canvas-1-blur");
          this.moveCard(activeCard, cardLeft, cardTop, !fromLeft, !fromTop);

          // todo make transition duration a variable
          let to4 = setTimeout(() => {
            this.removeCards();
          }, 2000);
          this._timeouts.push(to4);
        }, 8000); // how long we want the card to stay in the center (plus transition duration)
        this._timeouts.push(to3);

        // reverse transition
      }, 100); // how long after creating cards will flip start
      this._timeouts.push(to2);
    }, delay); // how long after called to start animation
    this._timeouts.push(to1);
  }
}

class MessageBoardImage extends PopoutBoard {
  constructor(
    numberOfRows,
    numberOfCols,
    tileBorderColor,
    cardUnderlayColor,
    minimumFullness,
    canvasFadeInSeconds,
    fullImageSourcePath,
    fullImageAspectRatio,
    imageTilesFolderPath,
    cardBackgroundColor,
    stretchImage,
    drawGrid,
    interactive,
    data,
    animationClass,
    cycleDuration
  ) {
    super(
      numberOfRows,
      numberOfCols,
      tileBorderColor,
      cardUnderlayColor,
      minimumFullness,
      canvasFadeInSeconds,
      drawGrid,
      interactive,
      data,
      animationClass,
      cycleDuration
    );
    this._fullImageSrc = fullImageSourcePath;
    this._ratio = fullImageAspectRatio;
    this._tileDir = imageTilesFolderPath;
    this._cardColor = cardBackgroundColor;

    // calculations based on constructor variables
    this._widerThanTall = fullImageAspectRatio > 0.5;
    this._imageDisplayHeight = stretchImage
      ? this._windowHeight
      : this._widerThanTall
      ? this._windowHeight
      : Math.round(this._windowWidth * this._ratio);
    this._imageDisplayWidth = stretchImage
      ? this._windowWidth
      : this._widerThanTall
      ? Math.round(this._windowHeight * (1 / this._ratio))
      : this._windowWidth;
    this._tileHeight = Math.floor(this._imageDisplayHeight / this._rows);
    this._tileWidth = Math.floor(this._imageDisplayWidth / this._cols);
    this._canvasLeft = this._widerThanTall
      ? Math.round((this._windowWidth - this._imageDisplayWidth) / 2)
      : 0;
    this._canvasTop = this._widerThanTall
      ? 0
      : Math.round((this._windowHeight - this._imageDisplayHeight) / 2);
    this._centerTileLeft = Math.floor(
      this._windowWidth / 2 - this._tileWidth / 2
    );
    this._centerTileTop = Math.floor(
      this._windowHeight / 2 - this._tileHeight / 2
    );

    console.log({
      imageRatio: this._ratio,
      windowHeight: this._windowHeight,
      windowWidth: this._windowWidth,
      rows: this._rows,
      cols: this._cols,
      displayHeight: this._imageDisplayHeight,
      displayWidth: this._imageDisplayWidth,
      tileHeight: this._tileHeight,
      tildWidth: this._tileWidth,
      fullImage: this._fullImageSrc,
      drawGrid: this._drawGrid,
    });
  }

  renderImageTilesCanvas() {
    // create the canvas
    let imageTilesCanvas = document.createElement("canvas");

    // set canvas class, size, and position
    imageTilesCanvas.id = "base-canvas";
    imageTilesCanvas.height = this._imageDisplayHeight;
    imageTilesCanvas.width = this._imageDisplayWidth;
    imageTilesCanvas.style.left = this._canvasLeft;
    imageTilesCanvas.style.top = this._canvasTop;

    // add to the document body
    document.body.appendChild(imageTilesCanvas);

    // get the context for drawing
    const ctx = imageTilesCanvas.getContext("2d");

    // draw images on canvas with borders
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        if (this._data[`${i}_${j}`]) {
          console.log(i, j, "confirmed");
          const img = new Image();
          const imgName = `${i}_${j}.jpg`;

          img.onload = () => {
            // draw tile image
            ctx.drawImage(
              img,
              j * this._tileWidth,
              i * this._tileHeight,
              this._tileWidth,
              this._tileHeight
            );

            if (this._drawGrid) {
              // draw tile outline
              ctx.beginPath();
              ctx.strokeStyle = this._borderColor;
              ctx.lineWidth = 0.05;
              ctx.strokeRect(
                j * this._tileWidth,
                i * this._tileHeight,
                this._tileWidth,
                this._tileHeight
              );
            }
          };

          img.src = `${this._tileDir}${imgName}`;
        } else {
          if (this._drawGrid) {
            // draw tile outline
            ctx.beginPath();
            ctx.fillStyle = this._underlayColor;
            ctx.fillRect(
              j * this._tileWidth,
              i * this._tileHeight,
              this._tileWidth,
              this._tileHeight
            );
          }
        }
      }
    }

    return imageTilesCanvas;
  }

  renderImageCanvas() {
    // create the canvas
    let imageCanvas = document.createElement("canvas");

    // set canvas class, size, and position
    imageCanvas.id = "base-canvas";
    imageCanvas.height = this._imageDisplayHeight;
    imageCanvas.width = this._imageDisplayWidth;
    imageCanvas.style.left = this._canvasLeft;
    imageCanvas.style.top = this._canvasTop;

    // add to the document body
    document.body.appendChild(imageCanvas);

    // get the context for drawing
    const ctx = imageCanvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      // draw file image
      ctx.drawImage(
        img,
        0,
        0,
        this._cols * this._tileWidth,
        this._rows * this._tileHeight
      );

      if (this._drawGrid) {
        // draw "tile" borders
        for (let i = 0; i < this._rows; i++) {
          for (let j = 0; j < this._cols; j++) {
            // draw tile outline
            ctx.beginPath();
            ctx.strokeStyle = this._borderColor;
            ctx.lineWidth = 0.05;
            ctx.strokeRect(
              j * this._tileWidth,
              i * this._tileHeight,
              this._tileWidth,
              this._tileHeight
            );
          }
        }
      }
    };
    img.src = this._fullImageSrc;

    return imageCanvas;
  }

  createPopoutCard(row, col) {
    // main card
    let card = document.createElement("div");
    card.id = "popout-card";
    card.classList.add("popout-card");
    card.style.visibility = "hidden";
    card.style.height = this._tileHeight;
    card.style.width = this._tileWidth;
    card.style.left = parseInt(col * this._tileWidth + this._canvasLeft, 10);
    card.style.top = parseInt(row * this._tileHeight + this._canvasTop, 10);

    // front of card
    let cardFront = document.createElement("img");
    cardFront.classList.add("popout-card-front");

    // front image
    const frontImgName = `${row}_${col}.jpg`;
    cardFront.src = `${this._tileDir}${frontImgName}`;

    // back of card
    let cardBack = document.createElement("div");
    cardBack.classList.add("popout-card-back");
    cardBack.style.background = this._cardColor;

    // back of card text
    let p = document.createElement("p");
    let text = document.createTextNode(
      this._data[`${row}_${col}`] ? this._data[`${row}_${col}`].message : ""
    );
    p.appendChild(text);
    p.classList.add("message-text");
    cardBack.appendChild(p);

    // add front and back to main card
    card.appendChild(cardFront);
    card.appendChild(cardBack);

    // add card to document body
    document.body.appendChild(card);

    return card;
  }

  // todo needs work
  run() {
    // run immediately
    const card = Object.keys(this._data)[
      Math.floor(Math.random() * Object.keys(this._data).length)
    ];
    const split = card.split("_");
    this.animate(split[0], split[1], this._animationClass, 3000);
    // then set interval to loop every 10 seconds
    return setInterval(() => {
      const card = Object.keys(this._data)[
        Math.floor(Math.random() * Object.keys(this._data).length)
      ];
      const split = card.split("_");
      this.animate(
        split[0],
        split[1],
        this._animationClass,
        "popout-card-flipped",
        1000
      );
    }, this._cycleDur);
  }

  load() {
    // create the base canvas
    this._activeCanvas = this.renderImageTilesCanvas();
    // let activeCanvas = this.renderImageCanvas();
    this._interactiveContext = this.renderInteractiveCanvas();

    // fade the canvas in
    setTimeout(() => {
      // make visible
      this._activeCanvas.style.visibility = "visible";
      this._activeCanvas.classList.add("fade-in");

      // add listeners if the canvas should be interactive
      this._interactive && this.addListeners(this);
    }, this._fadeIn * 1000);

    // run animation
    this._interval = this.run();
  }
}

window.onload = async function () {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let type = params.type;

  if (type == "message") {
    const numberOfRows = 9;
    const numberOfCols = 16;
    // const numberOfRows = 18;
    // const numberOfCols = 32;
    const fullImageSourcePath =
      "../static/full/050418_AG_2018_Commencement_095.webp";
    // const fullImageSourcePath = "../static/full/p8n82a8xlppjchvzrtzc.webp";
    const fullImageWidth = 1400;
    const fullImageHeight = 933;
    // const fullImageWidth = 1620;
    // const fullImageHeight = 911;
    const fullImageAspectRatio = fullImageHeight / fullImageWidth;
    const imageTilesFolderPath = "../static/split/";
    // const imageTilesFolderPath = "../static/split_2/";
    // const imageTilesFolderPath = "../static/split_1/";
    const cardBackgroundColor = "#fff";
    const tileBorderColor = "#fff";
    const cardUnderlayColor = "#fff";
    const minimumFullness = 30; // %
    const canvasFadeInSeconds = 2;
    const stretchImage = true;
    const drawGrid = false;
    const interactive = true;
    const animationClass = "popout-card-flipped";
    const cycleDuration = 10000;

    // // determine image ratio
    // const img = new Image();
    // img.onload = () => {
    //   fullImageAspectRatio = this.height / this.width;
    // };
    // img.src = fullImageSourcePath;

    // load the data
    let data = await fetch("../data/messages.json").then((res) => {
      return res.json();
    });

    console.log("Messages");

    const messageBoardImage = new MessageBoardImage(
      numberOfRows,
      numberOfCols,
      tileBorderColor,
      cardUnderlayColor,
      minimumFullness,
      canvasFadeInSeconds,
      fullImageSourcePath,
      fullImageAspectRatio,
      imageTilesFolderPath,
      cardBackgroundColor,
      stretchImage,
      drawGrid,
      interactive,
      data.messages,
      animationClass,
      cycleDuration
    );

    messageBoardImage.load();
  } else if (type == "photo") {
    const numberOfRows = 9;
    const numberOfCols = 16;
    const tileBorderColor = "#fff";
    const imageTilesFolderPath = "../static/photos/";
    const cardUnderlayColor = "#000";
    const minimumFullness = 30; // %
    const canvasFadeInSeconds = 1;
    const drawGrid = true;
    const interactive = false;
    const animationClass = "popout-card-scaled";
    const cycleDuration = 10000;

    // load the data
    let data = await fetch("../data/photos.json").then((res) => {
      return res.json();
    });

    console.log("Photos");

    const photoMosaic = new PhotoMosaic(
      numberOfRows,
      numberOfCols,
      tileBorderColor,
      cardUnderlayColor,
      minimumFullness,
      canvasFadeInSeconds,
      imageTilesFolderPath,
      drawGrid,
      interactive,
      data.photos,
      animationClass,
      cycleDuration
    );

    photoMosaic.load();
  } else if ((type = "special")) {
    const numberOfRows = 9;
    const numberOfCols = 16;
    const tileBorderColor = "#fff";
    const imageTilesFolderPath = "../static/photos/";
    const cardUnderlayColor = "#000";
    const minimumFullness = 30; // %
    const canvasFadeInSeconds = 1;
    const drawGrid = true;
    const interactive = true;
    const animationClass = "popout-card-special"; // todo make list of css classes to add/remove
    const cycleDuration = 13000;

    // load the data
    let data = await fetch("../data/photos.json").then((res) => {
      return res.json();
    });

    console.log("Special");

    const photoMessageSpecial = new PhotoMessageBoard(
      numberOfRows,
      numberOfCols,
      tileBorderColor,
      cardUnderlayColor,
      minimumFullness,
      canvasFadeInSeconds,
      imageTilesFolderPath,
      drawGrid,
      interactive,
      data.photos,
      animationClass,
      cycleDuration
    );

    photoMessageSpecial.load();
  }
};

// demo messages changing numbers and clicking around
// demo photos with 10 percent and changing sizes (update py with new row height and js)
