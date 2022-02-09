(function () {
    // clase board para crear el tablero con sus atributos.
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }
    
    /*se modifica el modelo con prototype para agregar un método que
    crea la lista de elementos del tablero y los retorna*/
    self.Board.prototype = {
        get elements() {
            /* en lugar de agregar una referencia de bars en elements, se
            agrega una copia creada con map para que no estalle :/ */
            var elements = this.bars.map(function (bar) { return bar });
            elements.push(this.ball);
            return elements;
        }
    }
})();

//se crea la clase Ball con sus propiedades
(function () {
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        this.direction = 1; //1 = derecha, -1 = izquierda

        this.board.ball = this;
        this.kind = "circle";
    }

    //se modifica el modelo Ball para agregar su movimiento
    self.Ball.prototype = {
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y * this.direction);
        }
    }
})();


//se crea el elemento bar con sus propiedades.
(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        this.board.bars.push(this); //se agrega a board este elemento
        this.kind = "rectangle"; //forma de lo que se va a dibujar
        this.speed = 10; //parámetro para mover las barras
    }

    /*se modifica el modelo para agregar futuras funcionalidades para mover
    arriba y abajo las barras.
    Se agrega condición para evitar que se salgan del tablero
    Se agrega condición para evitar que mueva la barra estando pausado*/
    self.Bar.prototype = {
        down: function () {
            if ((this.y < this.board.height - this.height) && this.board.playing) {
                this.y += this.speed;
            }
        },
        up: function () {
            if ((this.y > 0) && (this.board.playing)) {
                this.y -= this.speed;
            }
        }
    }
})();

//función para dibujar el tablero en el canvas (view).
/*no sé qué es el canvas ni cómo funcona aún pero parece que tiene
width y height como propiedades, las cuales se obtienen del tablero
y se le dan como atributo al canvas */
(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.context = canvas.getContext("2d");
    }

    /* función para llamar la función draw con cada elemento que tenga
    el tablero.
    se agrega función play para ejecutar todas las funciones para jugar */
    self.BoardView.prototype = {
        //para limpiar el board y que la línea se actualice en lugar de alargarse
        clean: function () {
            this.context.clearRect(0, 0, this.board.width, this.board.height)
        },
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.context, el);
            }
        },
        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.board.ball.move();
            }
            
        }
    }

    //función para dibujar un elemento del tablero según su forma (kind).
    //.fillRect es una función del contexto de canvas para dibujar un cuadrado
    //se agrega el caso "circle" para la bola
    function draw(context, element) {
        /*se elimina el if que comprueba que no sea null y tenga kind porque afecta
        el rendimiento */
        switch (element.kind) {
            case "rectangle":
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                context.beginPath();
                context.arc(element.x, element.y, element.radius, 0, 7);
                context.fill();
                context.closePath();
                break;
        }
        
    }
})();

//se sacan de main para que puedan ser usadas por el listener de flechas
var board = new Board(600, 400);
var bar = new Bar(20, 150, 30, 100, board);
var bar_2 = new Bar(550, 150, 30, 100, board);
var canvas = document.getElementById("canvas");
var boardView = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

boardView.draw();

window.requestAnimationFrame(main);

/* listener de flechas (keydown), en el video se usa .keycode pero este método
sale como obsoleto y la alternativa es .key.
se agrega función de pausa*/
document.addEventListener("keydown", function (ev) {
    if (ev.key == "ArrowUp") {
        ev.preventDefault();
        bar.up();
    } else if (ev.key == "ArrowDown") {
        ev.preventDefault();
        bar.down();
    } else if (ev.key == "w") {
        ev.preventDefault();
        bar_2.up();
    } else if (ev.key == "s") {
        ev.preventDefault();
        bar_2.down();
    } else if (ev.key == " ") {
        ev.preventDefault();
        board.playing = !board.playing;
    }
})

//en el evento "load" (carga de la pág) se llama la función main.
window.addEventListener("load", main);

//función que crea los elementos (controlador)
function main() {
    boardView.play();
    window.requestAnimationFrame(main);
}