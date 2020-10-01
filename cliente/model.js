function Juego(){
	this.partidas={}; //que colaccion
	this.crearPartida=function(num,owner){
		let codigo=this.obtenerCodigo();
		if(!this.partida[codigo]){
			this.partidas[codigo]=new Partida(num,owner);
		}
		
	}
		
		//comprobar que no esta en uso; crear el objeto partida, 
		//pasandole los param: num y owner
	    //this.partida()
	
	//generar un codigo de 6 letras aleatorio;
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVWXYX";
		let letras=cadena.split('');
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push=letras[random(1,25)-1];
		}
		return codigo.join();
	}
										  
}

function Partida(num,owner){
	this.numUsuarios=num;
	this.owner=owner;
	this.usuarios={};
	
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}
