function ClienteRest(){
	this.crearPartida=function(nick,num,callback){
		$.getJSON("/crearPartida/"+nick+"/"+num,function(data){    
    		console.log(data);
    		callback(data);
		});
	}

	
	this.unirAPartida=function(nick,codigo){
		$.getJSON("/unirAPartida/"+nick+"/"+codigo,function(data){    
			console.log(data);
		});
	}	

	this.listaPartidas=function(){
		$.getJSON("/listaPartidas",function(data){    
			console.log(data);
		});
	}

	this.iniciarPartida=function(nick,codigo){
		$.getJSON("/iniciarPartida/"+nick+"/"+codigo,function(data){   
			console.log(data);
		});
	}

}

function pruebas(){
	var codigo=undefined;
	rest.crearPartida("pepe",3,function(data){
		codigo=data.codigo;		
	});
	rest.crearPartida("pepe",4,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
	});
	rest.crearPartida("pepe",5,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
	});

	rest.crearPartida("pepe",6,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanman",codigo);
	});
	
	rest.crearPartida("pepe",7,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanman",codigo);
		rest.unirAPartida("juanmano",codigo);
	});

	rest.crearPartida("pepe",8,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanman",codigo);
		rest.unirAPartida("juanmanol",codigo);
		rest.unirAPartida("juanmano",codigo);
	});

	rest.crearPartida("pepe",9,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanman",codigo);
		rest.unirAPartida("juanmanolo",codigo);
		rest.unirAPartida("juanmanol",codigo);
		rest.unirAPartida("juanmano",codigo);
	});

	rest.crearPartida("pepe",10,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanman",codigo);
		rest.unirAPartida("juanmanolo",codigo);
		rest.unirAPartida("juanmanol",codigo);
		rest.unirAPartida("juanmano",codigo);
	});

	rest.crearPartida("pepe",11,function(data){
		codigo=data.codigo;

	});
//agregar otras partidas de 6, 7… hasta 10 jugadores
}

//para usar esta función hay que llamarla desde la consola del navegador (una vez se ha lanzado el servidor)

