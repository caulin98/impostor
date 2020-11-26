function ClienteWS(){
    this.socket=undefined;
	this.nick=undefined;
    this.codigo=undefined;
    this.crearPartida=function(nick, numero){
        this.nick=nick;
        this.socket.emit("crearPartida",nick,numero);//{"nick":nick, "num":num}
    }
    this.unirAPartida=function(nick, codigo){
        this.nick=nick;
        this.socket.emit("unirAPartida",nick,codigo);//{"nick":nick, "codigo":codigo}
    }
    this.iniciarPartida=function(){
        this.socket.emit("iniciarPartida",this.nick,this.codigo)//,nick,codigo);//{"nick":nick, "codigo":codigo}
    }
    this.listaPartidas=function(){
        this.socket.emit("listaPartidas")
    }
    this.listaPartidasDisponibles=function(){
        this.socket.emit("listaPartidasDisponibles")
    }

    this.lanzarVotacion=function(){
        this.socket.emit("lanzarVotacion", this.nick, this.codigo)
    }

    this.saltarVotacion=function(){
        this.socket.emit("saltarVotacion", this.nick, this.codigo)
    }

    this.votar=function(sospechoso){
        this.socket.emit("votar",this.nick,this.codigo,sospechoso);
    }

    this.obtenerEncargo=function(){
        this.socket.emit("obtenerEncargo", this.nick, this.codigo,)
    }
    this.atacar=function(inocente){
        this.socket.emit("atacar", this.nick, this.codigo,inocente)
    }
    this.listaJugadores=function(codigo){
        this.socket.emit("listaJugadores", this.codigo)
    }


    this.ini=function(){
        this.socket=io.connect();
        this.lanzarSocketSrv();
    }  
    this.lanzarSocketSrv=function(){
        var cli=this;
        this.socket.on('connect', function(){			
			console.log("conectado al servidor de Ws");
        });
        this.socket.on('partidaCreada', function(data){
            cli.codigo=data.codigo;
            console.log(data);
            if(data.codigo!="fallo"){
                cw.mostrarEsperandoRival();
                cw.mostrarIniciarPartida();
                ws.listaJugadores();

            }
        });
        this.socket.on('teHasUnido', function(data){
            cli.codigo=data.codigo;
            console.log(data);
            if(data.codigo!="fallo"){
                cw.mostrarEsperandoRival();
                ws.listaJugadores();
            }
            
        });
        this.socket.on('nuevoJugador', function(nick){
            console.log(nick + " se une a la partida");
        });
        this.socket.on('partidaIniciada', function(fase){
            console.log("Partida esta en fase: "+fase);
        });
        this.socket.on('recibirListaPartidas', function(lista){
            console.log(lista);
        });
        this.socket.on('recibirListaPartidasDisponibles', function(lista){
            console.log(lista);
            cw.mostrarUnirAPartida(lista);
        });
        this.socket.on('votacionLanzada', function(fase){
            console.log("Partida esta en fase: "+fase);
        });
        this.socket.on('finalVotacion', function(data){
            console.log(data);
        });
        this.socket.on('haVotado', function(data){
            console.log(data);
        });
        this.socket.on('encargo', function(data){
            console.log(data);
        });
        this.socket.on('atacado', function(data){
            console.log(data);
        });
        this.socket.on('muereInocente', function(data){
            console.log(data);
        });
        this.socket.on('recibirListaJugadores', function(lista){
            console.log(lista);
            cw.mostrarListaJugadores(lista);
        });

    }

    this.ini();
}

var ws2,ws3,sw4
function pruebasWS(){
    ws2=new ClienteWS();
    ws3=new ClienteWS();
    ws4=new ClienteWS();
    var codigo=ws.codigo;

    ws2.unirAPartida("juan2",codigo);
    ws3.unirAPartida("juan3",codigo);
    ws4.unirAPartida("juan4",codigo);
}

function saltarVotos(){
    ws.saltarVotacion();
    ws4.saltarVotacion()
    ws2.saltarVotacion()
    ws3.saltarVotacion()
}

function informacion(){
    ws.obtenerEncargo();
    ws4.obtenerEncargo()
    ws2.obtenerEncargo()
    ws3.obtenerEncargo()
}

function votar(){
    ws.votar(ws3.nick);
    ws2.votar(ws3.nick);
    ws3.votar(ws3.nick);
    ws4.votar(ws2.nick)
}