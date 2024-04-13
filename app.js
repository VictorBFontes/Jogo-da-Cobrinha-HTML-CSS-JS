
window.addEventListener("DOMContentLoaded", function (event) {
    window.focus();

    let snakePositions;
    let applePosition;

    let startTimestamp;
    let lastTimestamp;
    let stepsTaken;
    let score;
    let contrast;

    let inputs; //Lista de direção vai fazer

    let gameStarted = false;
    let hardMode = false;

    const width = 15;
    const height = 15;

    const speed = 200;
    let fadeSpeed = 5000;
    let fadeExponential =1.024;

    const contrastIncrease = 0.5;
    const color = "black";


    const grid = document.querySelector(".grid");
    for (let i = 0; i < width * height; i++) {
        const content = document.createElement("div");
        content.setAttribute("class", "content");
        content.setAttribute("id", i);

        const tile = document.createElement("div");
        tile.setAttribute("class", "tile");
        tile.appendChild(content);

        grid.appendChild(tile);
    }

    const tiles = document.querySelectorAll(".grid .tile .content");

    const containerElement = document.querySelector(".container");
    const noteElement = document.querySelector("footer");
    const contrastElement = document.querySelector(".contrast");
    const scoreElement = document.querySelector(".score");

    resetGame();

    function resetGame() {
        snakePositions = [168, 169, 170, 171];
        applePosition = 100;

        startTimestamp = undefined;
        lastTimestamp = undefined;
        stepsTaken = -1;
        score = 0;
        contrast = 1;

        inputs = [];

        contrastElement.innerText = `${Math.floor(contrast * 100)}%`;
        scoreElement.innerText = hardMode ? `H ${score}` : score;

        for( const tile of tiles) setTile(tile);

        setTile(tiles[applePosition], {
            "background-color": color,
            "border-radius": "50%"
        });
        
        for(const i of snakePositions.slice(1)) {
            const snakePart = tiles[1];
            snakePart.style.backgroundColor = color;

            if (i == snakePositions[snakePositions.length - 1])
            snakePart.style.left = 0;
            if(i == snakePositions[0])
            snakePart.style.right = 0;
        }
    }



})