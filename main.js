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
            var elements = this.bars;
            elements.push(this.ball);
            return elements;
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
    }

    /*se modifica el modelo para agregar futuras funcionalidades para mover
    arriba y abajo las barras */
    self.Bar.prototype = {
        down: function () {
            
        },
        up: function () {

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
    el tablero */
    self.BoardView.prototype = {
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.context, el);
            }
        }
    }

    //función para dibujar un elemento del tablero según su forma (kind).
    //.fillRect es una función del contexto de canvas para dibujar un cuadrado
    function draw(context, element) {
        if (element !== null && element.hasOwnProperty("kind")) {
           switch (element.kind) {
            case "rectangle":
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
        } 
        }
        
    }
})();

//en el evento "load" (carga de la pág) se llama la función main.
window.addEventListener("load", main);

//función que crea los elementos (controlador)
function main() {
    var board = new Board(1000, 400);
    var bar = new Bar(20, 100, 40, 100, board);
    var canvas = document.getElementById("canvas");
    var boardView = new BoardView(canvas, board);
    boardView.draw();
}