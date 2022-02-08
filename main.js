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
            elements.push(ball);
            return elements;
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
})();

//en el evento "load" (carga de la pág) se llama la función main.
window.addEventListener("load", main);

//función que crea los elementos (controlador)
function main() {
    var board = new Board(1000, 400);
    var canvas = document.getElementById("canvas");
    var boardView = new BoardView(canvas, board);
}