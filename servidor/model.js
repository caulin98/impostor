function Juego() {
    this.partidas = {}; 
    this.crearPartida = function (num, owner) {
        let codigo="undefined";
        
        if(!this.partidas[codigo] && this.numValido(num)){
            codigo = this.obtenerCodigo();
            this.partidas[codigo] = new Partida(num, owner, codigo,this);
            //owner.partida = this.partidas[codigo];
        }
        else{
            console.log(codigo)
        }
        return codigo;
    }
    this.unirAPartida = function (codigo, nick) {
        var res=-1;
        if (this.partidas[codigo]) {
            res=this.partidas[codigo].agregarUsuario(nick);
        }
        return res;
    }
    this.numValido=function(num){
        return (num>=4 && num<=10)
    }
    this.obtenerCodigo = function () {
        let cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let letras = cadena.split('');
        let maxCadena = cadena.length;
        let codigo = [];
        for (i = 0; i < 6; i++) {
            codigo.push(letras[randomInt(1, maxCadena) - 1]);
        }
        return codigo.join('');
    }
    this.eliminarPartida=function(codigo){
        delete this.partidas[codigo];
    }
    this.listaPartidasDisponibles=function(){
        var lista=[]
        var huecos=0
        var maximo=0
        for (var key in this.partidas) {
            var partida=this.partidas[key];
            huecos=this.partidas[key].obtenerHuecos();
            maximo=partida.maximo;
            var owner=this.partidas[key].nickOwner;
            if(huecos>0){
                lista.push ({"codigo":key, "huecos":huecos, "owner":owner, "maximo":maximo});
            }
        }
        return lista
    }
    this.listaPartidas=function(){
        var lista=[]
        for (var key in this.partidas) {
            var owner=this.partidas[key].nickOwner;
                lista.push ({"codigo":key, "owner":owner});
            }
    
        return lista
    }
	this.iniciarPartida=function(nick,codigo){
		var owner=this.partidas[codigo].nickOwner;
		if (nick==owner){
			this.partidas[codigo].iniciarPartida();
		}
    }
    this.lanzarVotacion=function(nick,codigo){
        var usr=this.partidas[codigo].usuarios[nick];
        usr.lanzarVotacion();
    }
    this.saltarVoto=function(nick,codigo){
		var usr=this.partidas[codigo].usuarios[nick];
		usr.saltarVoto();
	}
	this.votar=function(nick,codigo,sospechoso){
		var usr=this.partidas[codigo].usuarios[nick];
		//usr=this.partidas[codigo].obtenerUsuario(nick)
		usr.votar(sospechoso);
	}
	this.obtenerEncargo=function(nick,codigo){
		var res={};
		var encargo=this.partidas[codigo].usuarios[nick].encargo;
        var impostor=this.partidas[codigo].usuarios[nick].impostor;
        var estado=this.partidas[codigo].usuarios[nick].estado.nombre;
		res={"nick":nick,"encargo":encargo,"impostor":impostor, "estado":estado};

		return res;
    }
    this.atacar=function(nick,codigo,sospechoso){
		var usr=this.partidas[codigo].usuarios[nick];
		//usr=this.partidas[codigo].obtenerUsuario(nick)
		usr.atacar(sospechoso);
	}
}

function Partida(num, owner, codigo, juego) {
    this.maximo = num;
    this.nickOwner = owner;
    this.fase = new Inicial();
    this.codigo = codigo;
    this.juego = juego;
    this.usuarios = {};
    this.elegido="no hay nadie elegido";
    this.encargos=["enc1","enc2","enc3","enc4"];
    this.agregarUsuario = function (nick) {
        return this.fase.agregarUsuario(nick, this);
    }
    this.puedeAgregarUsuario = function (nick) {
        let nuevo = nick;
        let cont = 1;
        while (this.usuarios[nuevo]) {
            nuevo = nick + cont;
            cont = cont + 1;
        }
        this.usuarios[nuevo] = new Usuario(nuevo);
        this.usuarios[nuevo].partida = this;
        //this.comprobarMinimo();
        return 0;
    }
    this.obtenerHuecos=function(){
        return this.maximo - this.numJugadores();
    }   
    this.numJugadores=function(){
        return Object.keys(this.usuarios).length;
    }
    this.comprobarMinimo = function () {
        return this.numJugadores() >= 4
    }
    this.comprobarMaximo = function () {
        return this.numJugadores() < this.maximo
    }
    this.iniciarPartida = function () {
        this.fase.iniciarPartida(this);
    }
    this.puedeIniciarPartida = function(){
        this.fase = new Jugando();
        this.asignarEncargos();
        this.asignarImpostor();
    }
    this.abandonarPartida = function (nick) {
        this.fase.abandonarPartida(nick, this)
    }
    this.puedeAbandonarPartida=function(nick){
        this.eliminarUsuario(nick);
        if (!this.comprobarMinimo()) {
            this.fase = new Inicial();
        }
        if (this.numJugadores()<=0){
			this.juego.eliminarPartida(this.codigo);
		}
    }
    this.eliminarUsuario = function (nick) {
        delete this.usuarios[nick];
    }
    this.asignarEncargos = function (){
		let ind=0;
		for (var key in this.usuarios) {
		    this.usuarios[key].encargo=this.encargos[ind];
		    ind=(ind+1)%(this.encargos.length)
		}
    }  
    this.asignarImpostor = function (){
        let lista=Object.keys(this.usuarios);
        let aleatorio=randomInt(0,lista.length-1)
        let imp=lista[aleatorio]
        this.usuarios[imp].impostor=true;
        
    }
    this.atacar=function(usuario){
        this.fase.atacar(usuario,this)
    }
    this.puedeAtacar=function(usuario){
        this.usuarios[usuario].esAtacado()
        //this.comprobarFinal()
    }
    this.numeroImpostoresVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].impostor && this.usuarios[key].estado.nombre=="vivo"){
				cont++;
			}
		}
		return cont;
	}
    this.numeroCiudadanosVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].impostor == false && this.usuarios[key].estado.nombre=="vivo"){
				cont++;
			}
		}
		return cont;
	}
    this.gananImpostores = function(){
        if(this.numeroCiudadanosVivos() >= this.numeroImpostoresVivos()){
            return true
        } else{
            return false
        }
    }
    this.gananCiudadanos = function(){
        if(this.numeroImpostoresVivos()==0){
            return true
        } else{
            return false
        }
    }
    this.votar=function(sospechoso){
		this.fase.votar(sospechoso,this)
	}
	this.puedeVotar=function(sospechoso){
		this.usuarios[sospechoso].esVotado();
		this.comprobarVotacion();
    }
	this.masVotado=function(){
		let votado="no hay nadie mas votado";
		let max=1;
		for (var key in this.usuarios) {
			if (max<this.usuarios[key].votos){
				max=this.usuarios[key].votos;
				votado=this.usuarios[key];
			}
		}
		//comprobar que solo hay 1 más votado

		return votado;
	}
    this.numeroSkip=function(){
        let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo" && this.usuarios[key].skip==true){
				cont++;
			}
		}
		return cont;
    }
    this.todosHanVotado=function(){
		let res=true;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo" && !this.usuarios[key].haVotado){
				res=false;
				break;
			}
		}
		return res;
	}
	this.listaHanVotado=function(){
		var lista=[];
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo" && this.usuarios[key].haVotado){
				lista.push(key);
			}
		}
		return lista;
	}
	this.comprobarVotacion=function(){
		if (this.todosHanVotado()){
			let elegido=this.masVotado();
			if (elegido && elegido.votos>this.numeroSkip()){
				elegido.esAtacado();
				this.elegido=elegido.nick;
			}
			this.finalVotacion();
		}
	}
	this.finalVotacion=function(){
		this.fase=new Jugando();
		//this.reiniciarContadoresVotaciones(); 
		this.comprobarFinal();
	}
	this.reiniciarContadoresVotaciones=function(){
		this.elegido="no hay nadie elegido";
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo"){
				this.usuarios[key].reiniciarContadoresVotaciones();
			}
		}
    }
    this.comprobarFinal=function(){
        this.comprobarFinal=function(){
            if (this.gananImpostores()){
                this.finPartida();
            }
            else if (this.gananCiudadanos()){
                this.finPartida();
            }
        }
    }
    this.finPartida=function(){
        this.fase=new Final;
    }
    this.lanzarVotacion=function(){
        this.fase.lanzarVotacion(this);
    }
    this.puedeLanzarVotacion=function(){
        this.reiniciarContadoresVotaciones(); 
        this.fase=new Votacion();
    }

    this.listaJugadores=function(){
        var lista=[]
        for (var key in this.usuarios) {
                lista.push ({"nick":this.usuarios[key].nick});
            }
    
        return lista
    }

    this.agregarUsuario(owner);
}

function Inicial() {
    this.nombre = "inicial";
    this.agregarUsuario = function (nick, partida) {
        partida.puedeAgregarUsuario(nick);
        if (partida.comprobarMinimo()) {
            partida.fase = new Completado();
        }
    }

    this.iniciarPartida = function (partida) {
        console.log("Faltan jugadores");
    }

    this.abandonarPartida = function (nick, partida) {
        partida.puedeAbandonarPartida(nick);
        //comprobar si no hay usuarios
    }

    this.atacar=function(usuario){}
    this.lanzarVotacion=function(){}
    this.votar=function(sospechoso,partida){}
}

function Completado() {
    this.nombre = "completado";
    this.iniciarPartida = function (partida) {
        //llame a puede inciar partida
        partida.puedeIniciarPartida();
        //agsinar encargos: secuencialmente a todos los usuario
        // asignar impostor: dado el array de usuario (Object.keys)


    }
    this.agregarUsuario = function (nick, partida) {
        if (partida.comprobarMaximo()) {
            partida.puedeAgregarUsuario(nick);
        }
        else {
            console.log("Lo siento, numero máximo")
        }
    }
    this.abandonarPartida = function (nick, partida) {
        partida.eliminarUsuario(nick);
        if(!partida.comprobarMinimo()){
            partida.fase=new Inicial()
        }
        
    }

    this.atacar=function(usuario){}
    this.lanzarVotacion=function(){}
    this.votar=function(sospechoso,partida){}
}

function Jugando() {
    this.nombre = "jugando";
    this.agregarUsuario = function (nick, partida) {
        console.log("LA PARTIDA ESTA EN JUEGO");
    }
    this.iniciarPartida = function (partida) {//this.puedeAgregarUsuario(nick);
    }
    this.abandonarPartida = function (nick, partida) {
        partida.eliminarUsuario(nick);
        //comprobar si termina la partida
    }
    this.atacar=function(usuario,partida){
        partida.puedeAtacar(usuario)
    }

    this.lanzarVotacion=function(partida){
		partida.puedeLanzarVotacion();
    }
    this.votar=function(sospechoso,partida){}
}


function Votacion(){
	this.nombre="votacion";
		this.agregarUsuario=function(nick,partida){}
		this.iniciarPartida=function(partida){}
		this.abandonarPartida=function(nick,partida){}
		this.atacar=function(inocente){};
        this.lanzarVotacion=function(){}
        this.votar=function(sospechoso,partida){
            partida.puedeVotar(sospechoso);
        }
}


function Final() {
    this.nombre = "final";
    this.agregarUsuario = function (nick, partida) {
        console.log("LA PARTIDA ESTA EN ACBANDO");
    }
    this.iniciarPartida = function (partida) {//this.puedeAgregarUsuario(nick);
    }
    this.abandonarPartida = function (nick, partida) {}
    this.atacar=function(usuario,partida){}
    this.lanzarVotacion=function(){}
    this.votar=function(sospechoso,partida){}
}
function Usuario(nick) {
    this.nick = nick;
    //this.juego = juego;
    this.partida;
    this.impostor=false;
    this.encargo="ninguno";
    this.estado=new Vivo()
    this.votos=0
    this.skip=false
    this.heVotado=false
    this.iniciarPartida = function () {
        this.partida.iniciarPartida();
    }
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numJugadores()<=0){
			console.log(this.nick," era el último jugador");
		}
	}
    this.atacar = function(usuario){
        if (this.impostor){
            this.partida.atacar(usuario)
        }else {
            console.log("un ciudadano no puede atacar")
        }
    }
    this.esAtacado=function(){
        this.estado.esAtacado(this);
    }
	this.saltarVoto=function(){
		this.skip=true;
		this.haVotado=true;
		this.partida.comprobarVotacion();
	}
	this.lanzarVotacion=function(){
		this.estado.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.partida.lanzarVotacion();
	}
	this.votar=function(sospechoso){
		this.haVotado=true;
		this.partida.votar(sospechoso);
	}
	this.esVotado=function(){
		this.votos++;
	}
    this.reiniciarContadoresVotaciones=function(){
		this.votos=0;
		this.haVotado=false;
		this.skip=false;
	}


}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function Vivo(){
    this.nombre="vivo";
	this.esAtacado=function(usr){
		usr.estado=new Muerto();
		usr.partida.comprobarFinal();
	}
    this.lanzarVotacion=function(usuario){
        usuario.puedeLanzarVotacion();
    }
}

function Muerto(){
    this.nombre="muerto";
    this.esAtacado=function(usuario){}
    this.lanzarVotacion=function(usuario){}   
}

/*function inicio(){
    juego=new Juego();
    var usr=new Usuario("rafa");
    var codigo=juego.crearPartida(4,usr);
    if (codigo!="fallo"){
        juego.unirAPartida(codigo,"rafa");
        juego.unirAPartida(codigo,"rafa");
        juego.unirAPartida(codigo,"rafa");
        usr.iniciarPartida();
    }
}
*/

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;