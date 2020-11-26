var modelo=require("./model.js");

function ServidorWS(){
    this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
    this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
    this.enviarAAlguien=function(socket,mens,datos){
        socket.emit(mens,datos);
    }

    this.lanzarSocketSrv=function(io, juego){
        var cli=this;
        io.on('connection',function(socket){		    
            socket.on('crearPartida', function(nick,numero) {
                
               // var usr=new modelo.Usuario(nick);
                var codigo=juego.crearPartida(numero,nick);	
                socket.join(codigo);	      
                console.log('usuario nick: '+nick+" crea partida codigo: "+codigo);  				
                cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo, "nick":nick});			        		        
            });
            socket.on('unirAPartida', function(nick, codigo) {
                //console.log('usuario nick: '+nick+" crea partida numero: "+numero);
                //var usr=new modelo.Usuario(nick);
                var res=juego.unirAPartida(codigo, nick);	
                socket.join(codigo);
                var owner=juego.partidas[codigo].nickOwner;
                var maximo=juego.partidas[codigo].maximo;
                console.log("Usuario "+nick+" se une a partida "+codigo)
                cli.enviarRemitente(socket,"teHasUnido",{"codigo":codigo, "nick":nick, "owner":owner, "max":maximo});		
                cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick)	        		        
            });
		    socket.on('iniciarPartida',function(nick,codigo){
		    	//iniciar partida ToDo
		    	//controlar si nick es el owner
		    	//cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
		    	juego.iniciarPartida(nick,codigo);
		    	var fase=juego.partidas[codigo].fase.nombre;
		    	cli.enviarATodos(io, codigo, "partidaIniciada",fase);
		    });
            socket.on('listaPartidas', function() {
                var lista=juego.listaPartidas();
                cli.enviarRemitente(socket,"recibirListaPartidas",lista)
            });
            socket.on('listaPartidasDisponibles', function() {
                var lista=juego.listaPartidasDisponibles();
                cli.enviarRemitente(socket,"recibirListaPartidasDisponibles",lista)
            });
            socket.on('lanzarVotacion', function(nick,codigo) {
                juego.lanzarVotacion(nick,codigo);
                var fase=juego.partidas[codigo].fase.nombre;
                cli.enviarATodos(io,codigo,"votacionLanzada",fase)
            });

            socket.on('saltarVotacion', function(nick,codigo) {
                var partida=juego.partidas[codigo];
                juego.saltarVoto(nick,codigo);
                if(partida.todosHanVotado()){
                    // enviar el mas votado
                    var data={"elegido":partida.elegido, "fase":partida.fase.nombre}
                    cli.enviarATodos(io,codigo,"finalVotacion",data)
                }else{
                    var data=partida.listaHanVotado();
                    cli.enviarATodos(io,codigo,"haVotado",data)
                    //enviar lista de los que han votado
                }
            });

            socket.on('votar', function(nick,codigo,sospechoso) {
                var partida=juego.partidas[codigo];
                juego.votar(nick,codigo,sospechoso);
                if(partida.todosHanVotado()){
                    // enviar el mas votado
                    var data={"elegido":partida.elegido, "fase":partida.fase.nombre}
                    cli.enviarATodos(io,codigo,"finalVotacion",data)
                }else{
                    var data=partida.listaHanVotado();
                    cli.enviarATodos(io,codigo,"haVotado",data)
                }
            });

            socket.on('obtenerEncargo', function(nick,codigo) {
                var res=juego.obtenerEncargo(nick,codigo);
                cli.enviarRemitente(socket,"encargo",res)
            });

            socket.on('atacar', function(nick,codigo,inocente) {
                var partida=juego.partidas[codigo];
                juego.atacar(nick,codigo,inocente);
                if (partida.fase.nombre="final"){
                    var data={"fase":partida.fase.nombre}
                    cli.enviarATodos(io,codigo,"atacado",data)
                }else{
                    var res={"nick":inocente, "estado":partida.usuarios[inocente].estado.nombre}
                    cli.enviarRemitente(socket,"muereInocente",res)
                }       
            });
            socket.on('listaJugadores', function(codigo) {
                var lista=juego.partidas[codigo].listaJugadores();
                cli.enviarRemitente(socket,"recibirListaJugadores",lista)
            });
        });



    }
}

module.exports.ServidorWS=ServidorWS