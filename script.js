const juego = {
  timerId: 0,
  timerObstaculos: 0,
  gravedad: 2,
  skyHeight: 580,

  aleatorio: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  verificaColision: function () {
    if (bird.colision()) {
      juego.terminar();
    }
  },

  loop: function () {
    bird.efectoGravedad();
    obstaculos.mover();
    bird.dibujar(); 
    // 6. Llama a contador.dibujar()
    contador.dibujar()
    obstaculos.dibujar();
    juego.verificaColision();
  },

  iniciar: function () {
    document.addEventListener("keyup", bird.mover);
    obstaculos.crear();
    juego.timerObstaculos = setInterval(obstaculos.crear, 3000);
    juego.timerId = setInterval(juego.loop, 20);
    
  },

  terminar: function () {  
    clearInterval(juego.timerId);
    clearInterval(juego.timerObstaculos);
    juego.mostrarGameOver();
    juego.pararEfectos();
  },

  mostrarGameOver: function () {
    const mensaje = document.querySelector(".message");
    mensaje.setAttribute("id", "game-over");
  },

  pararEfectos: function () {
    let ground = document.querySelector(".ground");
    ground.removeAttribute("id");

    bird.div.setAttribute("id", "fall");
  },
};

// El objeto contador
const contador = {

  // 1. Agrega la propiedad unidades
  unidades: document.querySelector("#unidades"),

  // 2. Agrega la propiedad decenas
  decenas: document.querySelector("#decenas"),

  // 3. Agrega la propiedad puntaje
  puntaje: 0,

  // 4. Agrega el método dibujar()
  dibujar: function () {
    let digitos = contador.puntaje.toString().split("").reverse();

    contador.unidades.src = "img/" + digitos[0] + ".png";

    if (digitos.length > 1) {
      contador.decenas.src = "img/" + digitos[1] + ".png";
    }
  },

  // 5. Agrega el método actualizar()
  actualizar: function (parObstaculos) {
    if (bird.left == parObstaculos.left) {
      contador.puntaje += 1;
      console.log("puntaje: " + contador.puntaje);
    }
  },
};


const bird = {
  div: document.querySelector(".bird"),
  bottom: juego.aleatorio(10, 570),
  left: 250,
  width: 60,
  height: 45,

  efectoGravedad: function () {
    bird.bottom -= juego.gravedad;
  },

  dibujar: function () {
    bird.div.style.bottom = bird.bottom + "px";
    bird.div.style.left = bird.left + "px";
  },

  mover: function () {
    bird.bottom += 40;
  },

  colisionY: function (parObstaculos) {
    if (
      (bird.bottom < parObstaculos.bottomObstacleHeight &&
        bird.bottom >= parObstaculos.bottomObstacleBottom) ||
      (bird.bottom + bird.height > parObstaculos.topObstacleBottom &&
        bird.bottom + bird.height <
          parObstaculos.topObstacleBottom + parObstaculos.topObstacleHeight)
    ) {
      console.log("colisionY");
      return true;
    }
  },

  colisionX: function (parObstaculos) {
    if (
      (bird.left + bird.width > parObstaculos.left &&
        bird.left + bird.width <= parObstaculos.left + parObstaculos.width) ||
      (bird.left > parObstaculos.left &&
        bird.left < parObstaculos.left + parObstaculos.width)
    ) {
      console.log("colisionX");
      return true;
    }
  },

  colision: function () {
    obstaculos.lista.forEach((obs) => {
      if (bird.colisionX(obs) && bird.colisionY(obs)) {
        obs.topObstacle.setAttribute("id", "colision");
        obs.bottomObstacle.setAttribute("id", "colision");
        juego.terminar();
      }
    });

      if (bird.bottom < 0) {
        return true;
      }
    },
}


const obstaculos = {
  obstacleContainer: document.querySelector(".obstacles"),
  velocidad: 1,
  gap: 200,
  maxHeight: 320,
  minHeight: 50,
  width: 52,
  lista: [],

  crear: function () {
    const topObstacle = document.createElement("div");
    const bottomObstacle = document.createElement("div");
    topObstacle.classList.add("topObstacle");
    bottomObstacle.classList.add("bottomObstacle");
    obstaculos.obstacleContainer.appendChild(topObstacle);
    obstaculos.obstacleContainer.appendChild(bottomObstacle);

    topObstacleHeight = Math.max(
      Math.random() * obstaculos.maxHeight,
      obstaculos.minHeight
    );
    bottomObstacleHeight = Math.min(
      juego.skyHeight - topObstacleHeight - obstaculos.gap,
      obstaculos.maxHeight
    );

    const parObstaculos = {
      topObstacle: topObstacle,
      bottomObstacle: bottomObstacle,
      left: window.innerWidth,
      width: obstaculos.width,
      topObstacleHeight: topObstacleHeight,
      bottomObstacleHeight: bottomObstacleHeight,
      topObstacleBottom: juego.skyHeight - topObstacleHeight,
      bottomObstacleBottom: 0,
    };
    obstaculos.lista.push(parObstaculos);
  },

  eliminar: function (parObstaculos) {
    if (parObstaculos.left + obstaculos.width < 0) {
      parObstaculos.bottomObstacle.remove();
      parObstaculos.topObstacle.remove();
      obstaculos.lista.shift();
      console.log(obstaculos.lista.length);
    }
  },

  mover: function () {
    for (var i = 0; i < obstaculos.lista.length; i++) {
      obstaculos.lista[i].left -= obstaculos.velocidad;

      obstaculos.eliminar(obstaculos.lista[i]);
    // 7. Llama a contador.actualizar(), pasando como argumento un elemento de obstaculos.lista
      contador.actualizar(obstaculos.lista[i]);
    }
  },

  dibujar: function () {
    for (var i = 0; i < obstaculos.lista.length; i++) {
      obstaculos.lista[i].topObstacle.style.left =
        obstaculos.lista[i].left + "px";
      obstaculos.lista[i].bottomObstacle.style.left =
        obstaculos.lista[i].left + "px";

      obstaculos.lista[i].topObstacle.style.height =
        obstaculos.lista[i].topObstacleHeight + "px";
      obstaculos.lista[i].bottomObstacle.style.height =
        obstaculos.lista[i].bottomObstacleHeight + "px";
    }
  },
};


juego.iniciar();