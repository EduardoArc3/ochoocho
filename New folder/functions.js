        //VARIABLES GLOBALES ALV
        var contador = 0;
        var celdasProtegidas = new Set();
        var celdasResaltadas = new Map(); //Mapa para almacenar celdas con su color tipo hashmap
        var celdasTemporales = new Set(); //Celdas resaltadas solo con el mouse
        var coloresReinas = ["red", "blue", "green", "white", "orange", "gray", "brown", "yellow"];
        var imagenSeleccionada = "./img/reina.png"; 

        function MostrarReina(celda) {
            //Si la celda ya tiene una reina, la quitamos
            if (celdasProtegidas.has(celda)) {
                celda.style.backgroundImage = "none";
                celdasProtegidas.delete(celda);
                contador--;
        
                
                eliminarSombra(celda);
        
                
                limpiar();
                actualizarResaltado();
            } else {
                // Evitar colocar reinas en celdas resaltadas por otras
                if (celdasResaltadas.has(celda)) {
                    return;
                }
        
                if (contador < 8) {
                    celda.style.backgroundImage = `url(${imagenSeleccionada})`;
                    celda.style.backgroundSize = "50px";
                    celda.style.backgroundRepeat = "no-repeat";
                    celda.style.backgroundPosition = "center";
        
                    celdasProtegidas.add(celda);
                    contador++;
        
                    var fila = celda.parentElement.rowIndex;
                    var columna = celda.cellIndex;
                    var color = coloresReinas[contador - 1];
        
                    // Marcar su área de ataque
                    CambiarColor(fila, columna, true, color);
                }
            }
        }
        
        

        function CambiarColor(r, c, mantener = false, color = null) {
            if (!color) {
                color = coloresReinas[Math.min(contador, coloresReinas.length - 1)];
            }
            
            var celda = document.getElementById("tablero");
            var r1 = r, c1 = c, r2 = r, c2 = c;
            var r3 = r, c3 = c, r4 = r, c4 = c;

            for (let i = 0; i < 8; i++) {
                let fila = celda.rows[r].cells[i];
                let columna = celda.rows[i].cells[c];

                if (mantener) {    //si mantener es verdadero, se guarda el color 
                    celdasResaltadas.set(fila, color);
                    celdasResaltadas.set(columna, color);
                } else {
                    celdasTemporales.add(fila); // si es false, juegan las celdas temporales
                    celdasTemporales.add(columna);
                }
                fila.style.backgroundColor = celdasResaltadas.get(fila) || color;
                columna.style.backgroundColor = celdasResaltadas.get(columna) || color;

                if (r1 < 8 && c1 < 8) {
                    let diag1 = celda.rows[r1].cells[c1];
                    if (mantener) celdasResaltadas.set(diag1, color);
                    else celdasTemporales.add(diag1);
                    diag1.style.backgroundColor = celdasResaltadas.get(diag1) || color;
                    r1++; c1++;
                }
                if (r2 >= 0 && c2 < 8) {
                    let diag2 = celda.rows[r2].cells[c2];
                    if (mantener) celdasResaltadas.set(diag2, color);
                    else celdasTemporales.add(diag2);
                    diag2.style.backgroundColor = celdasResaltadas.get(diag2) || color;
                    r2--; c2++;
                }
                if (r3 >= 0 && c3 >= 0) {
                    let diag3 = celda.rows[r3].cells[c3];
                    if (mantener) celdasResaltadas.set(diag3, color);
                    else celdasTemporales.add(diag3);
                    diag3.style.backgroundColor = celdasResaltadas.get(diag3) || color;
                    r3--; c3--;
                }
                if (r4 < 8 && c4 >= 0) {
                    let diag4 = celda.rows[r4].cells[c4];
                    if (mantener) celdasResaltadas.set(diag4, color);
                    else celdasTemporales.add(diag4);
                    diag4.style.backgroundColor = celdasResaltadas.get(diag4) || color;
                    r4++; c4--;
                }
               

            
                    
            }
        }

        function eliminarSombra(celda) {
            var fila = celda.parentElement.rowIndex;
            var columna = celda.cellIndex;
        
            
            let celdasAEliminar = [];
            celdasResaltadas.forEach((color, celdaResaltada) => {
                if (celdaResaltada.style.backgroundColor === celdasResaltadas.get(celda)) {
                    celdasAEliminar.push(celdaResaltada);
                }
            });
        
            //Eliminar la sombra
            celdasAEliminar.forEach(celdaResaltada => {
                celdaResaltada.style.backgroundColor = "";
                celdasResaltadas.delete(celdaResaltada);
            });
        }
        
        

        function limpiar() {
            document.querySelectorAll("td").forEach(td => {
                if (!celdasProtegidas.has(td) && !celdasResaltadas.has(td)) {
                    td.style.backgroundColor = "";
                } else if (celdasResaltadas.has(td)) {
                    td.style.backgroundColor = celdasResaltadas.get(td);
                }
            });
            celdasTemporales.clear(); //Borrar solo las celdas que estan resaltadas
        }

        function actualizarResaltado() {
            celdasProtegidas.forEach((celda, index) => {
                var fila = celda.parentElement.rowIndex;
                var columna = celda.cellIndex;
                CambiarColor(fila, columna, true, coloresReinas[index]);
            });
        }

        function limpiarImagen() {
            document.querySelectorAll("td").forEach(td => {
                td.style.backgroundImage = "none";
                td.style.backgroundColor = "";
            });
            celdasProtegidas.clear();
            celdasResaltadas.clear();
            celdasTemporales.clear();
            contador = 0;
        }
        function actualizarImagen() {
            var seleccion = document.getElementById("reinas").value;
            imagenSeleccionada = `./img/${seleccion}`;
        }

        function solucion() {
            limpiarImagen();
            contador = 8;
            var celdas = document.getElementById("tablero");
            var estilo = `
                 background-image: url(${imagenSeleccionada});
                background-size:50px;
                background-repeat:no-repeat;
                background-position:center`;

            let posiciones = [
                [0, 3], [1, 6], [2, 2], [3, 7],
                [4, 1], [5, 4], [6, 0], [7, 5]
            ];

            posiciones.forEach(([fila, columna], index) => {
                celdas.rows[fila].cells[columna].style = estilo;
                celdasProtegidas.add(celdas.rows[fila].cells[columna]);
                CambiarColor(fila, columna, true, coloresReinas[index]);
            });
        }
