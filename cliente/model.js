
function Juego() {
    this.partidas = {}; //que coleccion
    this.crearPartida = function (num, owner) {
        //comprobar limites
        let codigo="fallo";
        
        if(!this.partidas[codigo] && this.numValido(num)){
            codigo = this.obtenerCodigo();
            this.partidas[codigo] = new Partida(num, owner.nick, codigo);
            owner.partida = this.partidas[codigo];
        }else{
            console.log(codigo)
        }
        return codigo;
    }

    this.unirAPartida = function (codigo, nick) {
        if (this.partidas[codigo]) {
            this.partidas[codigo].agregarUsuario(nick);
        }
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

    this.numValido=function(num){
        return (num>=4 && num<=10)
    }

    this. eliminarPartida=function(codigo){
        delete this.partida[codigo]
    }
}

function Partida(num, owner, codigo) {
    this.maximo = num;
    this.nickOwner = owner;
    this.fase = new Inicial();
    this.usuarios = {};
    this.encargos=["enc1","enc2","enc3","enc4"];
    this.agregarUsuario = function (nick) {
        this.fase.agregarUsuario(nick, this);
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
    }

    this.numJugadores=function(){
        return Object.keys(this.usuarios).length
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
    }

    this.eliminarUsuario = function (nick) {
        delete this.usuarios[nick];
    }

    this.asignarEncargos = function (){
        let aleatorio=0
        for (var key in this.usuarios) {
            aleatorio=randomInt(0,this.encargos.length-1)
            this.usuarios[key].encargo=this.encargos[aleatorio]
        //
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
        this.comprobarFinal()
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

    this.masVotado=function(){
        let max=0
        let usrVotado=undefined
        for (var key in this.usuarios) {
        if (max<this.usuarios[key].votos){
            max=this.usuarios[key].votos;
            usrVotado=this.usuarios[key]
        }
        return usrVotado;
        }
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

    this.elegido=function(){
        let masVotado=this.masVotado();
        if (masVotado.votos>this.numeroSkip())
            masVotado.esAtacado();
    }

    this.votar=function(sospechoso){
        this.usuarios[sospechoso].esVotado();
    }
    this.comprobarFinal=function(){
        if(this.gananImpostores() || this.gananCiudadanos()){
            this.finPartida();
        }
    }

    this.finPartida=function(){
        this.fase=new Final;
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
}

function Final() {
    this.final = "final";
    this.agregarUsuario = function (nick, partida) {
        console.log("LA PARTIDA ESTA EN ACBANDO");
    }
    this.iniciarPartida = function (partida) {//this.puedeAgregarUsuario(nick);
    }
    this.abandonarPartida = function (nick, partida) {
        this.partida.abandonarPartida(this.nick)
        if(this.partida.numJugadores()<=0){
            this.juego.eliminarPartida(this.partida.codigo);
            console.log(this.nick,"era el ultimo jugador")
        }
    }
    this.atacar=function(usuario,partida){}
}

function Usuario(nick, juego) {
    this.nick = nick;
    this.juego = juego;
    this.partida;
    this.impostor=false;
    this.encargo="ninguno";
    this.estado=new Vivo()
    this.votos=0
    this.skip=false
    this.heVotado=false
    this.crearPartida = function (num) {
        return this.juego.crearPartida(num, this);
    }
    this.iniciarPartida = function () {
        this.partida.iniciarPartida();
    }
    this.abandonarPartida = function () {
        this.partida.abandonarPartida(this.nick);
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

    this.skip=function(){
        this.skip=true
    }
    this.votar=function(usuario){
        this.partida.votar(usuario)
    }
    this.esVotado=function(){
        this.votos++;
    }
    this.lanzarVotacion=function(){
        this.estado.lanzarVotacion()
    }
    this.puedeLanzarVotacion=function(){
        this.partida.lanzarVotacion()
    }


}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function Vivo(){
    this.nombre="vivo";
    this.esAtacado=function(usuario){
        usuario.estado=new Muerto();
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

function inicio(){
    juego=new Juego();
    var usr=new Usuario("rafa");
    var codigo=juego.crearPartida(4,usr);
    if (codigo!="fallo"){
        juego.unirAPartida(codigo,"luis");
        juego.unirAPartida(codigo,"luis");
        juego.unirAPartida(codigo,"luis");
        usr.iniciarPartida();
    }
}


