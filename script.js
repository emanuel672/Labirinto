function rand(max) {
	return Math.floor(Math.random() * max);
}

function shuffle(a) {
    // Implementação do algoritmo Fisher-Yates (também conhecido como Knuth shuffle)
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]; // Troca os elementos aleatoriamente
    }
    return a; // Retorna o array embaralhado
}

function changeBrightness(factor, sprite) {
    // Cria um canvas virtual para processar a imagem
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500); // Desenha a imagem no canvas virtual
    var imgData = context.getImageData(0, 0, 500, 500); // Obtém os dados da imagem

    // Ajusta o brilho da imagem multiplicando os componentes RGB pelo fator
    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] * factor;
        imgData.data[i + 1] = imgData.data[i + 1] * factor;
        imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }

    context.putImageData(imgData, 0, 0); // Coloca os dados ajustados de volta no canvas
    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL(); // Converte o canvas virtual de volta para uma imagem
    virtCanvas.remove(); // Remove o canvas virtual após o uso
    return spriteOutput; // Retorna a imagem com o brilho ajustado
}

function toggleVisablity(id) {
    // Alterna a visibilidade do elemento com o ID fornecido entre "visible" e "hidden"
    if (document.getElementById(id).style.visibility == "visible") {
        document.getElementById(id).style.visibility = "hidden";
    } else {
        document.getElementById(id).style.visibility = "visible";
    }
}

function Maze(Width, Height) {
    var mazeMap; // Armazena o mapa do labirinto
    var width = Width;
    var height = Height;
    var startCoord, endCoord; // Coordenadas de início e fim do labirinto
    var dirs = ["n", "s", "e", "w"]; // Array das quatro direções possíveis
    var modDir = {
        // Objeto usado para modificar as coordenadas baseado na direção
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" },
    };

    // Retorna o mapa do labirinto
    this.map = function () {
        return mazeMap;
    };

    // Retorna as coordenadas de início do labirinto
    this.startCoord = function () {
        return startCoord;
    };

    // Retorna as coordenadas de fim do labirinto
    this.endCoord = function () {
        return endCoord;
    };

    // Gera o mapa do labirinto
    function genMap() {
        mazeMap = new Array(height);
        for (y = 0; y < height; y++) {
            mazeMap[y] = new Array(width);
            for (x = 0; x < width; ++x) {
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false, // Paredes nas quatro direções
                    visited: false, // Indica se foi visitado
                    priorPos: null, // Posição anterior
                };
            }
        }
    }

	// Define o labirinto
	function defineMaze() {
		var isComp = false; // Indica se o labirinto está completo
		var move = false; // Indica se houve movimento para uma nova célula
		var cellsVisited = 1; // Contador de células visitadas
		var numLoops = 0; // Contador de loops para embaralhar as direções
		var maxLoops = 0; // Número máximo de loops para embaralhar as direções
		var pos = {
			x: 0,
			y: 0,
		}; // Posição atual no labirinto

		var numCells = width * height; // Total de células no labirinto
		while (!isComp) {
			move = false;
			mazeMap[pos.x][pos.y].visited = true; // Marca a célula atual como visitada

			if (numLoops >= maxLoops) {
				shuffle(dirs); // Embaralha as direções possíveis
				maxLoops = Math.round(rand(height / 8)); // Define um novo número máximo de loops
				numLoops = 0; // Reinicia o contador de loops
			}
			numLoops++;

			// Loop através das direções embaralhadas
			for (index = 0; index < dirs.length; index++) {
				var direction = dirs[index];
				var nx = pos.x + modDir[direction].x;
				var ny = pos.y + modDir[direction].y;

				// Verifica se a próxima célula está dentro dos limites do labirinto
				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					// Verifica se a próxima célula ainda não foi visitada
					if (!mazeMap[nx][ny].visited) {
						// Remove a parede entre a célula atual e a próxima célula na direção especificada
						mazeMap[pos.x][pos.y][direction] = true;
						mazeMap[nx][ny][modDir[direction].o] = true;

						// Define a célula atual como a célula anteriormente visitada da próxima célula
						mazeMap[nx][ny].priorPos = pos;

						// Atualiza a posição atual para a nova localização visitada
						pos = {
							x: nx,
							y: ny,
						};

						cellsVisited++; // Incrementa o contador de células visitadas
						move = true; // Indica que houve um movimento para uma nova célula
						break; // Sai do loop, pois encontrou uma direção válida para mover
					}
				}
			}

			if (!move) {
				// Se não houve movimento para uma nova célula, volta para a célula anterior
				pos = mazeMap[pos.x][pos.y].priorPos;
			}

			if (numCells == cellsVisited) {
				isComp = true; // Se todas as células foram visitadas, o labirinto está completo
			}
		}
	}

	// Define o ponto inicial e final do labirinto
	function defineStartEnd() {
		// Escolhe aleatoriamente um dos quatro casos para definir o ponto inicial e final
		switch (rand(4)) {
			case 0:
				startCoord = {
					x: 0,
					y: 0,
				};
				endCoord = {
					x: height - 1,
					y: width - 1,
				};
				break;
			case 1:
				startCoord = {
					x: 0,
					y: width - 1,
				};
				endCoord = {
					x: height - 1,
					y: 0,
				};
				break;
			case 2:
				startCoord = {
					x: height - 1,
					y: 0,
				};
				endCoord = {
					x: 0,
					y: width - 1,
				};
				break;
			case 3:
				startCoord = {
					x: height - 1,
					y: width - 1,
				};
				endCoord = {
					x: 0,
					y: 0,
				};
				break;
		}
	}

	genMap(); // Gera o mapa do labirinto
	defineStartEnd(); // Define o ponto inicial e final do labirinto
	defineMaze(); // Define o labirinto utilizando o algoritmo implementado
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map(); // Obtém o mapa do labirinto do objeto Maze
    var cellSize = cellsize; // Define o tamanho da célula para desenho
    var drawEndMethod; // Variável para armazenar o método de desenho do fim

    ctx.lineWidth = Math.max(1, cellSize / 40); // Define a largura mínima de 1 pixel ou proporcional ao tamanho da célula

    // Fog padrão desativado
    this.fog = false;

    // Ativa o modo de neblina (fog)
    this.enableFog = function () {
        this.fog = true; // Define a propriedade fog como verdadeira
        document.getElementById("fogOn").play(); // Toca o som de ativação da neblina
    };

    // Desativa o modo de neblina (fog)
    this.disableFog = function () {
        this.fog = false; // Define a propriedade fog como falsa
        document.getElementById("fogOff").play(); // Toca o som de desativação da neblina
    };

    // Desenha o efeito de neblina (fog)
    this.drawFog = function (playerCoords) {
        // Redesenha o mapa do labirinto para garantir que as paredes estejam sempre visíveis
        drawMap();
        // Preenche o canvas com uma cor preta semitransparente para criar o efeito de neblina
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Calcula o raio visível ao redor do jogador com base no tamanho da célula e no tamanho do mapa
        var visibleRadius = cellSize * Math.round(map.length * 0.12);
        // Cria um gradiente radial que vai de completamente transparente a parcialmente opaco
        var gradient = ctx.createRadialGradient(
            (playerCoords.x + 0.5) * cellSize,
            (playerCoords.y + 0.5) * cellSize,
            0,
            (playerCoords.x + 0.5) * cellSize,
            (playerCoords.y + 0.5) * cellSize,
            visibleRadius
        );

        gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.5)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)"); // 0.2 makes the endpoint slightly brighter

        // Utiliza o gradiente para limpar a neblina ao redor do jogador
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(
            (playerCoords.x + 0.5) * cellSize,
            (playerCoords.y + 0.5) * cellSize,
            visibleRadius,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Limpa a neblina ao redor do ponto final do labirinto
        var endCoords = Maze.endCoord();
        ctx.beginPath();
        ctx.arc(
            (endCoords.x + 0.5) * cellSize,
            (endCoords.y + 0.5) * cellSize,
            visibleRadius,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Redesenha a imagem do ponto final para criar o efeito de neblina ao redor do ponto final
        if (endSprite) {
            drawEndSprite();
        }

        // Restaura a operação de composição padrão
        ctx.globalCompositeOperation = "source-over";
    };

    // Redesenha o labirinto
    this.redrawMaze = function (size) {
        cellSize = size; // Atualiza o tamanho da célula
        ctx.lineWidth = cellSize / 50; // Atualiza a largura da linha de acordo com o tamanho da célula
        drawMap(); // Redesenha o mapa do labirinto
        drawEndMethod(); // Chama o método para desenhar o ponto final do labirinto
        // Chama o método para desenhar o efeito de neblina, se o modo de neblina estiver ativado
        if (this.fog) {
            this.drawFog(player.cellCoords);
        }
    };

    // Função para desenhar uma célula
    function drawCell(xCord, yCord, cell) {
        var x = xCord * cellSize;
        var y = yCord * cellSize;
        ctx.strokeStyle = "white"; // Define a cor de traçado para desenhar as paredes do labirinto

        // Desenha a parede norte da célula, se não existir
        if (cell.n === false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        // Desenha a parede sul da célula, se não existir
        if (cell.s === false) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        // Desenha a parede leste da célula, se não existir
        if (cell.e === false) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        // Desenha a parede oeste da célula, se não existir
        if (cell.w === false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    function drawMap() {
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[x].length; y++) {
                drawCell(x, y, map[x][y]);
            }
        }
    }

    function drawEndFlag() {
        var coord = Maze.endCoord();
        var gridSize = 4;
        var fraction = cellSize / gridSize - 2;
        var colorSwap = true;
        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 == 0) {
                colorSwap = !colorSwap;
            }
            for (let x = 0; x < gridSize; x++) {
                ctx.beginPath();
                ctx.rect(
                    coord.x * cellSize + x * fraction + 4.5,
                    coord.y * cellSize + y * fraction + 4.5,
                    fraction,
                    fraction
                );
                if (colorSwap) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                } else {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                }
                ctx.fill();
                colorSwap = !colorSwap;
            }
        }
    }

    // Função para desenhar a imagem do ponto final
    function drawEndSprite() {
        var offsetLeft = cellSize / 50; // Deslocamento à esquerda para o recorte da imagem do ponto final
        var offsetRight = cellSize / 25; // Deslocamento à direita para o recorte da imagem do ponto final
        var coord = Maze.endCoord(); // Obtém as coordenadas do ponto final do labirinto

        // Desenha a imagem do ponto final no canvas
        ctx.drawImage(
            endSprite, // Imagem do ponto final a ser desenhada
            2, // Coordenada X de início do recorte na imagem do ponto final
            2, // Coordenada Y de início do recorte na imagem do ponto final
            endSprite.width, // Largura do recorte na imagem do ponto final
            endSprite.height, // Altura do recorte na imagem do ponto final
            coord.x * cellSize + offsetLeft, // Posição X no canvas para desenhar a imagem do ponto final
            coord.y * cellSize + offsetLeft, // Posição Y no canvas para desenhar a imagem do ponto final
            cellSize - offsetRight, // Largura da imagem do ponto final no canvas
            cellSize - offsetRight // Altura da imagem do ponto final no canvas
        );
    }

    // Limpa o canvas
    function clear() {
        var canvasSize = cellSize * map.length; // Calcula o tamanho total do canvas
        ctx.clearRect(0, 0, canvasSize, canvasSize); // Limpa o canvas completamente
    }

    // Verifica se há uma imagem de ponto final; se não houver, desenha um símbolo padrão
    if (endSprite != null) {
        drawEndMethod = drawEndSprite; // Define o método para desenhar a imagem do ponto final
    } else {
        drawEndMethod = drawEndFlag; // Define o método para desenhar o símbolo padrão de ponto final
    }

    clear(); // Limpa o canvas
    drawMap(); // Redesenha o mapa do labirinto
    drawEndMethod(); // Desenha o ponto final; pode ser a imagem do ponto final ou o símbolo padrão
}


function Player(maze, c, _cellsize, onComplete, sprite = null) {
	var ctx = c.getContext("2d"); // Contexto 2D do canvas
	var drawSprite; // Função de desenho do sprite
	var moves = 0; // Contador de movimentos
	drawSprite = drawSpriteCircle; // Inicialmente define a função de desenho como drawSpriteCircle

	// Verifica se há um sprite; se houver, usa drawSpriteImg
	if (sprite != null) {
		drawSprite = drawSpriteImg;
	}
	var player = this; // Referência ao objeto jogador
	var map = maze.map(); // Obtém o mapa do labirinto
	var cellCoords = {
		x: maze.startCoord().x,
		y: maze.startCoord().y,
	}; // Coordenadas iniciais do jogador
	var cellSize = _cellsize; // Tamanho da célula
	var halfCellSize = cellSize / 2; // Metade do tamanho da célula

	// Redesenha o jogador
	this.redrawPlayer = function (_cellsize) {
		cellSize = _cellsize; // Atualiza o tamanho da célula
		drawSpriteImg(cellCoords); // Chama a função para desenhar o sprite de imagem nas coordenadas do jogador
	};

	this.startTime = performance.now(); // Define o startTime aqui

	// Desenha um jogador na forma de um círculo
	function drawSpriteCircle(coord) {
		ctx.beginPath();
		ctx.fillStyle = "yellow"; // Define a cor de preenchimento como amarelo
		ctx.arc(
			(coord.x + 1) * cellSize - halfCellSize,
			(coord.y + 1) * cellSize - halfCellSize,
			halfCellSize - 2,
			0,
			2 * Math.PI
		);
		ctx.fill(); // Preenche o círculo
		// Verifica se o jogador chegou ao fim do labirinto
		if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
			onComplete(moves); // Chama a função onComplete passando o número de movimentos
			player.unbindKeyDown(); // Desvincula os eventos de teclado do jogador
		}
	}

	// Função para desenhar um sprite na tela
	function drawSpriteImg(coord) {
		// Definindo os offsets para ajustar a posição do sprite dentro da célula
		var offsetLeft = cellSize / 50;  // Offset para a esquerda
		var offsetRight = cellSize / 25; // Offset para a direita
		// Desenha o sprite na tela usando o contexto de desenho (ctx) do Canvas
		// Parâmetros da função drawImage:
		// sprite: Imagem a ser desenhada
		// 0, 0, sprite.width, sprite.height: Posição e tamanho da parte da imagem a ser desenhada (parte do sprite)
		// coord.x * cellSize + offsetLeft, coord.y * cellSize + offsetLeft: Posição na tela onde o sprite será desenhado (canto superior esquerdo)
		// cellSize - offsetRight, cellSize - offsetRight: Tamanho do sprite na tela (ajustado pelos offsets para evitar cortes indesejados)
		ctx.drawImage(
			sprite,
			0,
			0,
			sprite.width,
			sprite.height,
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
		// Verifica se o jogador chegou à coordenada final do labirinto
		// Se verdadeiro, chama a função onComplete passando o número de movimentos e desativa os eventos de teclado do jogador
		if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
			onComplete(moves);
			player.unbindKeyDown();
		}
	}

	// Função para remover o sprite do jogador da tela
	function removeSprite(coord) {
		// Definindo os offsets para ajustar a posição do sprite dentro da célula
		var offsetLeft = cellSize / 50;  // Offset para a esquerda
		var offsetRight = cellSize / 25; // Offset para a direita
		// Limpa a área onde o sprite do jogador estava desenhado, usando o contexto de desenho (ctx) do Canvas
		ctx.clearRect(
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
	}

	//Verifica o movimento do jogador e aumenta o número de passos apenas se o jogador realmente se mover
	function check(e) {
		var cell = map[cellCoords.x][cellCoords.y]; // Obtém a célula atual do mapa usando as coordenadas do jogador
		var moved = false; // Variável para verificar se o jogador se moveu
    
		// Verifica a tecla pressionada pelo código ASCII e executa ação correspondente
		switch (e.keyCode) {
			case 65:
			case 37: // oeste
				if (cell.w == true) { // Se houver um caminho a oeste na célula atual
					moves++; // Incrementa o contador de movimentos
					removeSprite(cellCoords); // Remove o sprite do jogador da posição atual
					cellCoords = { // Atualiza as coordenadas do jogador para a esquerda
						x: cellCoords.x - 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords); // Desenha o sprite do jogador na nova posição
					moved = true; // Define que o jogador se moveu
				}
				break;
			case 87:
			case 38: // norte
				if (cell.n == true) { // Se houver um caminho ao norte na célula atual
					moves++; // Incrementa o contador de movimentos
					removeSprite(cellCoords); // Remove o sprite do jogador da posição atual
					cellCoords = { // Atualiza as coordenadas do jogador para cima
						x: cellCoords.x,
						y: cellCoords.y - 1,
					};
					drawSprite(cellCoords); // Desenha o sprite do jogador na nova posição
					moved = true; // Define que o jogador se moveu
				}
				break;
			case 68:
			case 39: // leste
				if (cell.e == true) { // Se houver um caminho a leste na célula atual
					moves++; // Incrementa o contador de movimentos
					removeSprite(cellCoords); // Remove o sprite do jogador da posição atual
					cellCoords = { // Atualiza as coordenadas do jogador para a direita
						x: cellCoords.x + 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords); // Desenha o sprite do jogador na nova posição
					moved = true; // Define que o jogador se moveu
				}
				break;
			case 83:
			case 40: // sul
				if (cell.s == true) { // Se houver um caminho ao sul na célula atual
					moves++; // Incrementa o contador de movimentos
					removeSprite(cellCoords); // Remove o sprite do jogador da posição atual
					cellCoords = { // Atualiza as coordenadas do jogador para baixo
						x: cellCoords.x,
						y: cellCoords.y + 1,
					};
					drawSprite(cellCoords); // Desenha o sprite do jogador na nova posição
					moved = true; // Define que o jogador se moveu
				}
				break;
		}
    
		// Chama o método para desenhar o "fog" (névoa) no jogo
		if (draw.fog) {
			draw.drawFog(cellCoords);
		}
		// Se o jogador não se moveu (não havia caminho na direção pressionada), reproduz um som de colisão
		if (!moved) {
			document.getElementById("wall").play();
		}
	}

	// Função para vincular eventos de teclado
	this.bindKeyDown = function () {
		// Adiciona um ouvinte de evento para teclas pressionadas no objeto window, chamando a função check
		window.addEventListener("keydown", check, false);
		// Configura um evento de deslize (swipe) para o elemento com id "view" usando jQuery Mobile
		$("#view").swipe({
			swipe: function (
				event,
				direction,
				distance,
				duration,
				fingerCount,
				fingerData
			) {
				console.log(direction); // Registra a direção do deslize no console (para fins de depuração)
				switch (direction) {
					case "up": // Se o deslize foi para cima
						check({ keyCode: 38 }); // Chama a função check com o código de tecla correspondente à seta para cima (38)
						break;
					case "down": // Se o deslize foi para baixo
						check({ keyCode: 40 }); // Chama a função check com o código de tecla correspondente à seta para baixo (40)
						break;
					case "left": // Se o deslize foi para a esquerda
						check({ keyCode: 37 }); // Chama a função check com o código de tecla correspondente à seta para a esquerda (37)
						break;
					case "right": // Se o deslize foi para a direita
						check({ keyCode: 39 }); // Chama a função check com o código de tecla correspondente à seta para a direita (39)
						break;
				}
			},
			threshold: 0, // Define a sensibilidade do deslize (threshold) como 0 para capturar todos os movimentos
		});
	};


	// Função para desvincular eventos de teclado
	this.unbindKeyDown = function () {
		// Remove o ouvinte de evento para teclas pressionadas no objeto window, para a função check
		window.removeEventListener("keydown", check, false);
		// Destrói o evento de deslize (swipe) configurado para o elemento com id "view" usando jQuery Mobile
		$("#view").swipe("destroy");
	};
	drawSprite(maze.startCoord()); // Desenha o sprite na posição inicial do labirinto
	this.bindKeyDown(); // Vincula os eventos de teclado

}

// Configurações básicas do labirinto
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite = new Image(); // Inicializa o objeto Image para o sprite do jogador
var finishSprite = new Image(); // Inicializa o objeto Image para o sprite do ponto final
var maze, draw, player;
var cellSize; // Tamanho de cada célula
var difficulty; // Dificuldade do labirinto
// sprite.src = 'media/sprite.png';

window.onload = function () {
    // Obtém a largura e altura do elemento com id "view"
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();

    // Verifica se a altura é menor que a largura
    if (viewHeight < viewWidth) {
        // Ajusta a largura e altura do canvas se a altura for menor que a largura
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        // Caso contrário, ajusta com base na largura
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    // Função para verificar se ambas as imagens foram carregadas
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () => {
        // Verifica se ambas as variáveis de conclusão são true
        if (completeOne === true && completeTwo === true) {
            // Se ambas forem true, imprime uma mensagem e chama makeMaze() após 500 milissegundos
            console.log("Runs");
            setTimeout(function () {
                makeMaze();
            }, 500);
        }
    };

    // Carrega e ajusta a primeira imagem (sprite)
    sprite = new Image();
    sprite.src =
        "https://i.ibb.co/c8DnVSG/1-12-icon-icons-com-68880.png" +
        "?" +
        new Date().getTime();
    sprite.setAttribute("crossOrigin", " ");
    sprite.onload = function () {
        // Ajusta o brilho da imagem e marca completeOne como true
        sprite = changeBrightness(1.2, sprite);
        completeOne = true;
        console.log(completeOne);
        isComplete(); // Verifica se ambas as imagens estão completas
    };

    // Carrega e ajusta a segunda imagem (finishSprite)
    finishSprite = new Image();
    finishSprite.src =
        "https://i.ibb.co/g7p9R1c/door-icon-126434.png" +
        "?" +
        new Date().getTime();
    finishSprite.setAttribute("crossOrigin", " ");
    finishSprite.onload = function () {
        // Ajusta o brilho da imagem e marca completeTwo como true
        finishSprite = changeBrightness(1.1, finishSprite);
        completeTwo = true;
        console.log(completeTwo);
        isComplete(); // Verifica se ambas as imagens estão completas
    };
};

window.onresize = function () {
    // Obtém a largura e altura do elemento com id "view"
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();

    // Verifica se a altura é menor que a largura
    if (viewHeight < viewWidth) {
        // Ajusta a largura e altura do canvas se a altura for menor que a largura
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        // Caso contrário, ajusta com base na largura
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    // Calcula o tamanho das células do labirinto com base na largura do canvas e na dificuldade
    cellSize = mazeCanvas.width / difficulty;

    // Redesenha o labirinto se o jogador já estiver definido
    if (player != null) {
        // Redesenha o labirinto usando a função draw.redrawMaze() com o tamanho da célula atualizado
        draw.redrawMaze(cellSize);
        // Redesenha o jogador usando a função player.redrawPlayer() com o tamanho da célula atualizado
        player.redrawPlayer(cellSize);
    }
};

// Seleção de dificuldade
document.getElementById("diffSelect").addEventListener("change", function () {
    // Verifica se o valor selecionado é "custom"
    if (this.value === "custom") {
        // Se sim, torna visível o elemento com id "customInput"
        document.getElementById("customInput").style.visibility = "visible";
    } else {
        // Caso contrário, torna oculto o elemento com id "customInput"
        document.getElementById("customInput").style.visibility = "hidden";
    }
});

function makeMaze() {
	// Verifica se o jogador está definido e desvincula a captura de teclas se estiver
	if (player != undefined) {
		player.unbindKeyDown(); // Desvincula os eventos de teclado do jogador
		player = null; // Define o jogador como null para reinicialização
	}
	// Obtém o elemento de seleção de dificuldade
	var e = document.getElementById("diffSelect");
	// Determina a dificuldade com base na seleção do usuário
	var difficulty =
		e.value === "custom"
			? document.getElementById("customInput").value // Se a opção customizada estiver selecionada, usa o valor do campo personalizado
			: e.options[e.selectedIndex].value; // Caso contrário, usa o valor selecionado no menu de opções
	// Calcula o tamanho da célula do labirinto com base na largura do canvas e na dificuldade
	cellSize = mazeCanvas.width / difficulty;
	// Cria um novo labirinto com a dificuldade especificada
	maze = new Maze(difficulty, difficulty);
	// Inicializa a renderização do labirinto com o novo labirinto criado
	draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
	// Cria um novo jogador com base no labirinto, canvas, tamanho da célula, função de exibição de mensagem de vitória e sprite
	player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);

	// Verifica se a opacidade do contêiner do labirinto é menor que 100 e a ajusta se necessário
	if (document.getElementById("mazeContainer").style.opacity < "100") {
		document.getElementById("mazeContainer").style.opacity = "100";
	}

	// Mantém as configurações de neblina (fog) se estiverem ativadas
	if (document.getElementById("fogCheckbox").checked) {
		draw.enableFog(); // Habilita o efeito de neblina na renderização do labirinto
	} else {
		draw.disableFog(); // Desabilita o efeito de neblina na renderização do labirinto
	}

	// Função para calcular a pontuação
function calculateScore(steps, time, minSteps, maxSteps, maxTime) {
    // Calcula a pontuação com base nos parâmetros fornecidos
    var score = 100 * (1 - (steps - minSteps) / maxSteps - time / maxTime);

    // Garante que a pontuação não seja inferior a 0 e arredonda para duas casas decimais
    return Math.max(0, score.toFixed(2));
}


	// Função para exibir informações de conclusão do labirinto
	function displayVictoryMess(moves) {
		var endTime = performance.now(); // Obtém o tempo de término da partida
		var timeElapsed = ((endTime - player.startTime) / 1000).toFixed(2); // Calcula o tempo decorrido em segundos, com duas casas decimais
		var fogMode = document.getElementById("fogCheckbox").checked; // Verifica se o modo de neblina está ativado

		// Função para encontrar o caminho mais curto usando BFS (Busca em Largura)
		function findShortestPath(maze) {
			var startCoord = maze.startCoord(); // Obtém as coordenadas de início do labirinto
			var endCoord = maze.endCoord(); // Obtém as coordenadas de fim do labirinto
			var queue = [startCoord]; // Fila para o BFS
			var visited = new Set(); // Conjunto para armazenar nós visitados
			var distance = {}; // Objeto para armazenar a distância até cada nó
			var key = (coord) => coord.x + "," + coord.y; // Função para gerar chaves únicas para coordenadas
			distance[key(startCoord)] = 0; // Define a distância até o nó inicial como 0

			while (queue.length > 0) {
				var current = queue.shift(); // Remove o primeiro elemento da fila
				var currentKey = key(current); // Obtém a chave do nó atual
				if (current.x === endCoord.x && current.y === endCoord.y) {
					// Se chegamos ao nó de destino
					return distance[currentKey]; // Retorna a distância até o nó de destino
				}
				// Explora os vizinhos do nó atual
				for (var direction of ["n", "s", "e", "w"]) {
					if (maze.map()[current.x][current.y][direction]) {
						var next = {
							x: current.x + (direction === "e" ? 1 : direction === "w" ? -1 : 0),
							y: current.y + (direction === "s" ? 1 : direction === "n" ? -1 : 0),
						};
						var nextKey = key(next); // Obtém a chave do próximo nó
						if (!visited.has(nextKey)) {
							queue.push(next); // Adiciona o próximo nó à fila
							visited.add(nextKey); // Marca o próximo nó como visitado
							distance[nextKey] = distance[currentKey] + 1; // Atualiza a distância até o próximo nó
						}
					}
				}
			}
			// Se não encontramos um caminho, retorna Infinity (infinito)
			return Infinity;
		}
		// Após gerar o labirinto, executa BFS para encontrar o caminho mais curto
		var minSteps = findShortestPath(maze);
		// Salva o valor original de minSteps antes de calcular a pontuação
		var originalMinSteps = minSteps;
		// Se o modo de neblina estiver ativado, ajusta minSteps multiplicando por um fator
		if (fogMode) {
			var factor = Math.pow(1.01, difficulty); // Fator baseado na dificuldade do labirinto
			minSteps *= factor; // Ajusta minSteps com o fator
		}	
		var maxSteps = difficulty * difficulty; // Número máximo de passos estimados com base no tamanho do labirinto
		var maxTime = maxSteps * 2; // Tempo máximo estimado baseado no número máximo de passos
		// Se o dispositivo for móvel, aumenta o tempo máximo para levar em conta o uso em dispositivos móveis
		if (isMobileDevice()) {
			maxTime = maxSteps * 5; // Tempo máximo aumentado para dispositivos móveis
		}
	
		// Calcula a pontuação com base nos movimentos, tempo decorrido, minSteps, maxSteps e maxTime
		var score = calculateScore(moves, timeElapsed, minSteps, maxSteps, maxTime);
		// Atualiza o conteúdo no elemento HTML com id "moves" com as informações de vitória
		document.getElementById("moves").innerHTML =
			"Você realizou <b>" + moves + "</b> movimentos.<br />" +
			"Menos etapas possíveis: <b>" + originalMinSteps + "</b><br />" +
			"Tempo gasto: <b>" + timeElapsed + "</b> segundos.<br />" +
			"Sua pontuação: <b>" + score + "</b>";
		// Mostra o contêiner de mensagem
		toggleVisablity("Message-Container");
		// Toca o som de vitória
		document.getElementById("victory").play();
	}

	document.getElementById("moves").className = "score";
}

// Função para ligar/desligar o efeito de neblina (fog)
document.getElementById("fogCheckbox").addEventListener("change", function () {
    // Verifica se o checkbox está marcado
    if (this.checked) {
        // Se marcado, chama a função para habilitar o efeito de neblina
        draw.enableFog();
    } else {
        // Se não marcado, chama a função para desabilitar o efeito de neblina
        draw.disableFog();
    }
});

// Função para determinar se é um dispositivo móvel
function isMobileDevice() {
    // Verifica se o dispositivo do usuário possui tela sensível ao toque
    var hasTouchScreen = false;

    // Verifica se o navegador suporta a propriedade maxTouchPoints
    if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
        // Para navegadores Internet Explorer e Edge
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
        // Caso o navegador não suporte maxTouchPoints, usa outras maneiras de detectar
        var mQ = window.matchMedia && matchMedia("(pointer:coarse)");

        // Verifica se há suporte a media queries para detectar dispositivos com tela sensível ao toque
        if (mQ && mQ.media === "(pointer:coarse)") {
            hasTouchScreen = !!mQ.matches; // Verifica se a consulta corresponde
        } else if ("orientation" in window) {
            hasTouchScreen = true; // Supõe que todos os dispositivos com orientação são dispositivos sensíveis ao toque
        } else {
            // Usa uma verificação baseada na string do user agent para detectar dispositivos móveis comuns
            var ua = navigator.userAgent;
            var regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            hasTouchScreen = regex.test(ua); // Verifica se o user agent contém alguma das strings de dispositivos móveis
        }
    }

    return hasTouchScreen; // Retorna true se o dispositivo for sensível ao toque, false caso contrário
}

