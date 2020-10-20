
function Juego() {
    this.partidas = {}; //que coleccion
    this.crearPartida = function (num, owner) {
        //comprobar limites
        let codigo="fallo";
        
        if(!this.partidas[codigo] && this.numValido(num)){
            codigo = this.obtenerCodigo();
            this.partidas[codigo] = new Partida(num, owner.nick);
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
}

function Partida(num, owner) {
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
    this.comprobarMinimo = function () {
        return Object.keys(this.usuarios).length >= 4
    }
    this.comprobarMaximo = function () {
        return Object.keys(this.usuarios).length < this.maximo
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

    this.eliminarUsuario = function (nick) {
        delete this.usuarios[nick];
    }

    this.asignarEncargos = function (){
        //Asignar encargos
        //
    }

    
    this.asignarImpostor = function (){
        // let imp=Object.keys(Partida.usuarios)[randomInt(1, maximo)];
        // Partida.usuarios.imp.impostor= true;
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
        partida.eliminarUsuario(nick);
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
        if (!partida.comprobarMinimo()) {
            partida.fase = new Inicial();
        }
    }
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
}

function Final() {
    this.final = "final";
    this.agregarUsuario = function (nick, partida) {
        console.log("LA PARTIDA ESTA EN ACBANDO");
    }
    this.iniciarPartida = function (partida) {//this.puedeAgregarUsuario(nick);
    }
    this.abandonarPartida = function (nick, partida) {
        //esto es absurdo
    }
}

function Usuario(nick, juego) {
    this.nick = nick;
    this.juego = juego;
    this.partida;
    this.impostor=false;
    this.encargo="ninguno";
    this.crearPartida = function (num) {
        return this.juego.crearPartida(num, this);
    }
    this.iniciarPartida = function () {
        this.partida.iniciarPartida();
    }
    this.abandonarPartida = function () {
        this.partida.abandonarPartida(this.nick);
    }

}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
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

