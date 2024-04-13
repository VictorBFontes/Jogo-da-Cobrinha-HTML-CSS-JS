
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

    window.addEventListener("keydown", function(event) {

        if(
            ![
                "ArrowLeft",
                "ArrowUp",
                "ArrowRight",
                "ArrowDown",
                "A",
                "a",
                "W",
                "w",
                "D",
                "d",
                "S",
                "s",
                " ",
                "H",
                "h",
                "E",
                "e"
            ].includes(event.key)
        )
        return;

        event.preventDefault();

        if (event.key == " ") {
            resetGame();
            startGame();
            return;
        }

        if (event.key == "H" || event.key == "h") {
            hardMode = true;
            fadeSpeed = 4000;
            fadeExponential = 1.025;
            noteElement.innerHTML = `Modo dificil! Pressione espaço para iniciar!!`;
            noteElement.style.opacity = 1;
            resetGame();
            return;
        }
        
        if (event.key == "E" || event.key == "e") {
            hardMode = false;
            fadeSpeed = 5000;
            fadeExponential = 1.024;
            noteElement.innerHTML = `Modo normal! Pressione espaço para iniciar!!`;
            noteElement.style.opacity = 1;
            resetGame();
            return;
        }

        if (event.key == "ArrowLeft" || event.key == "A" || event.key == "a" &&
            inputs[inputs.length - 1] != "Left" &&
            headDirection() != "right"
        ) {
            inputs.push("Left");
            if (!gameStarted) startGame();
            return;
        }

        if (event.key == "ArrowUp" || event.key == "W" || event.key == "w" &&
            inputs[inputs.length - 1] != "Up" &&
            headDirection() != "down"
        ) {
            inputs.push("Up");
            if (!gameStarted) startGame();
            return;
        }

        if (event.key == "ArrowRight" || event.key == "D" || event.key == "d" &&
            inputs[inputs.length - 1] != "Right" &&
            headDirection() != "left"
        ) {
            inputs.push("Right");
            if (!gameStarted) startGame();
            return;
        }

        if (event.key == "ArrowDown" || event.key == "S" || event.key == "s" &&
            inputs[inputs.length - 1] != "Down" &&
            headDirection() != "up"
        ) {
            inputs.push("Down");
            if (!gameStarted) startGame();
            return;
        }
    });

    function startGame() {
        gameStarted = true;
        noteElement.style.opacity = 0;
        window.requestAnimationFrame(main);
    }


    function main (timestamp) {
        try {
            if (startTimestamp === undefined) startTimestamp = timestamp;
            const totalElapsedTime = timestamp - startTimestamp;
            const timeElapsedSinceLastCall = timestamp - lastTimestamp;

            const stepsShouldhaveTaken = Math.floor(totalElapsedTime / speed);
            const percentageOfStep = (totalElapsedTime % speed) / speed;

            if (stepsTaken != stepsShouldhaveTaken) {
                stepAndTransition(percentageOfStep);

                const headPosition = snakePositions[snakePositions.length - 1];
                if (headPosition == applePosition) {
                    score++;
                    scoreElement.innerText = hardMode ? `H ${score}` : score;

                    addNewApple();

                    contrast = Math.min(1, contrast + contrastIncrease);

                    console.log(`Contraste aumentou em ${contrastIncrease * 100}%`);
                    console.log("New fade speed (from 100% to 0% in milliseconds)",
                    Math.pow(fadeExponential, score) * fadeSpeed
                    );
                }

                stepsTaken++;
            } else {
                transition(percentageOfStep);
            }
            
            if (lastTimestamp) {
                const contrastDecrease = timeElapsedSinceLastCall / (Math.pow(fadeExponential, score) * fadeSpeed);
                contrast = Math.max(0, contrast - contrastDecrease);
            }

            contrastElement.innerText = `${Math.floor(contrast * 100)}%`;
            containerElement.style.opacity = contrast;

            window.requestAnimationFrame(main);
        } catch (error) {

            const pressSpaceToStart = "Pressione espaço para reiniciar o jogo";
            const changeMode = hardMode
            ? "Quer voltar ao modo normal? Pressione E para voltar."
            : "Preparado para o modo dificil!?? Presssione H para se desafiar.";
            const followMe = 'Me siga! <a href="www.linkedin.com/in/jose-victor-barros-fontes", target="_blank >In: José Victor</a>. Github: <a href="https://github.com/VictorBFontes", target="_blank >VictorBFontes</a>.';
            noteElement.innerHTML = `${error.message}. ${pressSpaceToStart} <div>${changeMode}</div> ${followMe}`;
            noteElement.style.opacity = 1;
            containerElement.style.opacity = 1;
        }
        lastTimestamp = timestamp;
    }

    function stepAndTransition(percentageOfStep) {

        const newHeadPosition = getNextPosition();
        console.log(`Snake stepping into tile ${newHeadPosition}`);
        snakePositions.push(newHeadPosition);


        const previousTail = tiles[snakePositions[0]];
        setTile(previousTail);

        if (newHeadPosition != applePosition) {
            snakePositions.shift();
        }
    }



})