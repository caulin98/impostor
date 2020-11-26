function ControlWeb($){


    this.mostrarNick=function(){
        var cadena='<div id=mostrarNick>';
            cadena=cadena+'<div class="form-group">';
            cadena=cadena+'<label for="nick">Nick:</label>';
            cadena=cadena+'<input type="text" class="form-control" id="nick" required="true">';
            cadena=cadena+'</div>';
            cadena=cadena+'</div>';

            $('#mostraNick').append(cadena);
    }

    this.mostrarCrearPartida=function(){
        var cadena='<div id=mostrarCP>';
            cadena=cadena+'<div class="col text-center">';
            cadena=cadena+'<h3>CREAR PARTIDA</h3>';
            cadena=cadena+'<div class="form-group">';
            cadena=cadena+'<label for="num">Numero: </label>';
            cadena=cadena+'<input type="number" id="num" name="numero jugadores" min="4" max="10"><br><br></br>'
            cadena=cadena+'</div>';
            cadena=cadena+'<button type="button" id="btnCrear" class="btn btn-primary">Crear Partida</button>';
            cadena=cadena+'</div>';
            cadena=cadena+'</div>';

            $('#crearPartida').append(cadena);
            $('#btnCrear').on('click',function(){
                var nick=$('#nick').val();
                var num=$('#num').val();
                $('#mostrarCP').remove();
                $('#mostrarNick').remove();
                $('#mUAP').remove();
                ws.crearPartida(nick,num);

            });
    }

    this.mostrarEsperandoRival=function(){
        //$('#mostrarER').remove();
        var cadena='<div id=mostrarER>';
            cadena=cadena+'<img src="cliente/img/cargando.gif">';
            cadena=cadena+'</div>';
            $('#esperando').append(cadena);
        }

    this.mostrarUnirAPartida=function(lista){
        $('#mUAP').remove();
        var cadena='<div id="mUAP">';
        cadena=cadena+'<div class="col text-center">';
        cadena=cadena+'<h3>UNIR A PARTIDA</h3>';
        cadena=cadena+'<div class="list-group">';
            for(var i=0;i<lista.length;i++){
                var maximo=lista[i].maximo;
                var jugadores=maximo-lista[i].huecos;
                cadena=cadena+'<a href="#" value="'+lista[i].codigo+'" class="list-group-item">'+lista[i].codigo+'<span class="badge">'+jugadores+'/'+maximo+'</span> </a>';
        }	
        cadena=cadena+'</div>';
        cadena=cadena+'<button type="button" id="btnUnir" class="btn btn-primary">Unir a partida</button>';
        cadena=cadena+'</div>';        
        cadena=cadena+'</div>';

        $('#unirAPartida').append(cadena);

        var StoreValue = [];
        $(".list-group a").click(function(){
            StoreValue = []; //clear array
            StoreValue.push($(this).attr("value")); // add text to array
        });

        $('#btnUnir').on('click',function(){
            var nick=$('#nick').val();
            var codigo=StoreValue[0];
            $('#mostrarCP').remove();
            $('#mostrarNick').remove();
            $("#mUAP").remove();
            ws.unirAPartida(nick,codigo);
        });

        if (lista.length==0){
            $("#mUAP").remove();
        }
        }

    this.mostrarListaJugadores=function(lista){
        var cadena='<div id="mostrarLJ">';
        cadena=cadena+'<h3>LISTA DE JUGADORES</h3>';
        cadena=cadena+'<div class="list-group">';
            for(var i=0;i<lista.length;i++){
                cadena=cadena+'<a href="#" value="'+lista[i].nick+'" class="list-group-item">'+lista[i].nick +'</a>';
        }	
        cadena=cadena+'</div>';
        cadena=cadena+'</div>';

        $('#listaJugadores').append(cadena);
    }

    this.mostrarIniciarPartida=function(){
        var cadena='<div id=mostrarIP>';
            cadena=cadena+'<hr noshade="noshade" />';
            cadena=cadena+'<div class="col text-center">';
            cadena=cadena+'<button type="button" id="btnIP" class="btn btn-primary">Iniciar Partida</button>';
            cadena=cadena+'</div>';
            cadena=cadena+'</div>';

            $('#iniciarPartida').append(cadena);
            $('#btnCrear').on('click',function(){
                ws.iniciarPartida();
            });
}
}