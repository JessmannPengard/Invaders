window.onload = () => {

    /* Constantes del juego
    */
    const areaJuego = document.getElementById("area_juego");    // Área de juego donde situaremos las casillas
    const ANCHO_AREA_JUEGO = 17;                                // Ancho del área de juego (en casillas)
    const ALTO_AREA_JUEGO = 15;                                 // Alto del área de juego (en casillas)
    const TAMANHOCASILLAS = 20;                                 // Tamaño de las casillas del área de juego en píxeles
    const VELOCIDAD_ENEMIGOS = 500                              // Velocidad de los enemigos (en milisegundos)
    const VELOCIDAD_BALAS = 100                                 // Velocidad de las balas (en milisegundos)

    /* Variables del juego
    */
    let estado = "PA";      // "JU" Jugando     "PA" Pausado     "GO" Game Over    "GA" Jugador gana
    let puntuacion = 0;     // Variable para almacenar la puntuación del jugador
    let posJugador = ((ANCHO_AREA_JUEGO * ALTO_AREA_JUEGO) - (ANCHO_AREA_JUEGO - 1) / 2) - 1;  // Variable que almacena la posición del jugador
    let dirEnemigos = "D";                      /* Variable que almacena la dirección actual de los enemigos
                                                   "D" -> derecha         "I" -> izquierda
                                                   "AD"-> abajo-derecha   "AI"-> abajo izquierda
                                                */
    let intervaloEnemigos;      //Variable para mover los enemigos
    let intervaloBalas;         //Variable para mover la balas

    // Captura los eventos de teclado del jugador y los pasa a la función controlJugador()
    document.addEventListener("keydown", controlJugador);
    // Captura los eventos de los botones y los pasa a la función controlJugador()
    document.getElementById("btnLeft").addEventListener("click", () => {
        let e = new Event("keydown");
        e.key = "ArrowLeft";
        controlJugador(e)
    });
    document.getElementById("btnRight").addEventListener("click", () => {
        let e = new Event("keydown");
        e.key = "ArrowRight";
        controlJugador(e)
    });
    document.getElementById("btnSpace").addEventListener("click", () => {
        let e = new Event("keydown");
        e.key = " ";
        controlJugador(e)
    });
    document.getElementById("btnPlay").addEventListener("click", () => {
        let e = new Event("keydown");
        e.key = "Enter";
        controlJugador(e)
    });
    document.getElementById("btnF5").addEventListener("click", () => {
        location.reload();
    });
    /* Función para crear el área de juego según los parámetros especificados,
       de este modo podemos cambiarlos sin tener que modificar el código
    */
    function crearAreaJuego(contenedor) {
        let numCasillas = ANCHO_AREA_JUEGO * ALTO_AREA_JUEGO;

        /* Modificamos el tamaño del área de juego en función del tamaño de
           los cuadros y del ancho/alto del tablero
        */
        //areaJuego.style.width = (ANCHO_AREA_JUEGO * TAMANHOCASILLAS) + "px";
        //areaJuego.style.height = (ALTO_AREA_JUEGO * TAMANHOCASILLAS) + "px";
        /* Creamos las casillas
        */
        for (let i = 0; i < numCasillas; i++) {
            contenedor.innerHTML += "<div></div>"
        }
        /* Les damos el tamaño correcto según el valor de TAMANHOCASILLAS
        */
        const casillas = obtener_casillas();
        for (let i = 0; i < casillas.length; i++) {
            casillas[i].style.height = TAMANHOCASILLAS + "px";
            casillas[i].style.width = TAMANHOCASILLAS + "px";
        }
    }

    function obtener_casillas() {
        return document.querySelectorAll("#area_juego div");
    }
    //Test:
    crearAreaJuego(areaJuego);

    /* Función que coloca al jugador en el número de casilla especificado en POSICION_INICIAL_JUGADOR
       ( de 0 a (ANCHO_AREA_JUEGO * ALTO_AREA_JUEGO) - 1 )
    */
    function inicializarJugador() {
        const casillas = obtener_casillas();
        casillas[posJugador].classList.add("jugador");
    }
    //Test:
    inicializarJugador();

    // Función que coloca a los enemigos en la posición inicial
    function inicializarEnemigos() {

        const casillas = obtener_casillas();

        for (let i = 0; i < 5; i++) {
            for (let j = 4; j < ANCHO_AREA_JUEGO - 4; j++) {
                casillas[j + ANCHO_AREA_JUEGO * i].classList.add("enemigo");
            }
        }
    }
    //Test:
    inicializarEnemigos();

    // Función para mover al jugador (comprobando que no se salga del área de juego)
    function controlJugador(evento) {
        const casillas = obtener_casillas();
        const limiteDerecho = posJugador >= (casillas.length - 1);
        const limiteIzquierdo = posJugador % ANCHO_AREA_JUEGO == 0;

        switch (evento.key) {
            case "ArrowRight":
                if (!limiteDerecho && estado == "JU") {
                    casillas[posJugador].classList.remove("jugador");
                    posJugador++;
                    casillas[posJugador].classList.add("jugador");
                }
                break;
            case "ArrowLeft":
                if (!limiteIzquierdo && estado == "JU") {
                    casillas[posJugador].classList.remove("jugador");
                    posJugador--;
                    casillas[posJugador].classList.add("jugador");
                }
                break;
            case " ":
                if (estado == "JU") {
                    disparar();
                }
                break;
            case "Enter":
                switch (estado) {
                    case "PA":
                        intervaloEnemigos = setInterval(moverEnemigos, VELOCIDAD_ENEMIGOS);
                        intervaloBalas = setInterval(moverBalas, VELOCIDAD_BALAS)
                        estado = "JU";
                        document.getElementById("txt").innerHTML = "";
                        break;
                    case "JU":
                        clearInterval(intervaloEnemigos);
                        clearInterval(intervaloBalas);
                        estado = "PA";
                        document.getElementById("txt").innerHTML = "PAUSA";
                        break;
                }
                break;
        }
    }

    // Función que permite disparar al jugador
    function disparar() {
        let casillas = obtener_casillas();
        casillas[posJugador - ANCHO_AREA_JUEGO].classList.add("bala");
    }

    function moverBalas() {
        let casillas = obtener_casillas();
        let balas = [];

        for (let i = 0; i < casillas.length; i++) {
            if (casillas[i].classList.contains("bala")) {
                balas.push(i - ANCHO_AREA_JUEGO);
                casillas[i].classList.remove("bala");
            }
        }

        for (let i = 0; i < balas.length; i++) {
            if (casillas[balas[i]].classList.contains("enemigo")) {
                casillas[balas[i]].classList.remove("enemigo", "bala");
                puntuacion += 10;
                document.getElementById("puntos").innerHTML = puntuacion;
            } else {
                casillas[balas[i]].classList.add("bala");
            }
        }
    }


    // Función para mover a los enemigos
    function moverEnemigos() {
        const casillas = obtener_casillas();

        // Guardamos en un array la posición actual de los enemigos
        let enemigos = obtener_enemigos();

        if (enemigos.length == 0) {
            estado = "GA";
            clearInterval(intervaloEnemigos);
            clearInterval(intervaloBalas);
            document.getElementById("txt").innerHTML = "HAS GANADO!!";
        } else {

            /* Comprobamos si han llegado al borde lateral,
               si es así los movemos una posición hacia abajo
               y cambiamos de dirección
            */
            // Comprobamos que ninguno de ellos haya llegado al límite del área de juego
            for (let i = 0; i < enemigos.length; i++) {
                if (dirEnemigos == "D" && (enemigos[i] + 1) % ANCHO_AREA_JUEGO == 0
                    || dirEnemigos == "I" && (enemigos[i]) % ANCHO_AREA_JUEGO == 0) {
                    // Si alguno ha llegado, cambiamos la dirección...
                    if (dirEnemigos == "I") {
                        dirEnemigos = "AD"      // De izquierda a abajo y a la derecha
                    } else {
                        dirEnemigos = "AI";     // De derecha a abajo y a la izquierda
                    }
                    enemigos = [];
                    // ... y los movemos una posición hacia abajo
                    for (let i = 0; i < casillas.length; i++) {
                        if (casillas[i].classList.contains("enemigo")) {
                            enemigos.push(i + ANCHO_AREA_JUEGO);
                            casillas[i].classList.remove("enemigo");
                        }
                    }
                    pintar_enemigos(enemigos);
                    i = enemigos.length;    // Salimos del bucle
                }
            }
            enemigos = [];

            /* Movemos los enemigos sólo si no han llegado al límite, puesto que en este caso
               ya los hemos movido anteriormente hacia abajo, y sólo cambiamos su dirección
            */
            switch (dirEnemigos) {
                case "D":
                    for (let i = 0; i < casillas.length; i++) {
                        if (casillas[i].classList.contains("enemigo")) {
                            enemigos.push(i + 1);
                            casillas[i].classList.remove("enemigo");
                        }
                    }
                    break;
                case "I":
                    for (let i = 0; i < casillas.length; i++) {
                        if (casillas[i].classList.contains("enemigo")) {
                            enemigos.push(i - 1);
                            casillas[i].classList.remove("enemigo");
                        }
                    }
                    break;
                case "AD":
                    dirEnemigos = "D";
                    break;
                case "AI":
                    dirEnemigos = "I";
                    break;
            }
            // Finalmente pintamos los enemigos en su nueva posición
            pintar_enemigos(enemigos);

            /* Comprobamos que no hayan llegado abajo (en este caso, el jugador pierde)
            */
            for (let i = enemigos.length - 1; i >= 0; i--) {
                if (enemigos[i] > (ANCHO_AREA_JUEGO * ALTO_AREA_JUEGO - 1) - ANCHO_AREA_JUEGO) {
                    clearInterval(intervaloEnemigos);
                    document.getElementById("txt").innerHTML = "GAME OVER!!"
                    estado = "GO";
                    i = -1; //Salimos del bucle
                }
            }
        }
    }

    function obtener_enemigos() {
        const casillas = obtener_casillas();
        let enemigos = [];
        for (let i = 0; i < casillas.length; i++) {
            if (casillas[i].classList.contains("enemigo")) {
                enemigos.push(i);
            }
        }
        return enemigos;
    }

    function pintar_enemigos(enemigos) {
        const casillas = obtener_casillas();
        for (let i = 0; i < enemigos.length; i++) {
            casillas[enemigos[i]].classList.add("enemigo");
        }
    }

}