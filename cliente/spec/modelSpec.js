describe("El juego del impostor", function () {
  var juego;
  var usr;

  beforeEach(function () {
    juego = new Juego();
    usr = new Usuario("Pepe", juego);
  });

  it("comprobar valores iniciales del juego", function () {
    expect(Object.keys(juego.partidas).length).toEqual(0);
    expect(usr.nick).toEqual("Pepe");
    expect(usr.juego).not.toBe(undefined);
  });

  describe("el usr Pepe crea una partida de 4 jugadores", function () {
    var codigo;
    beforeEach(function () {
      codigo = usr.crearPartida(4);
    });

    it("se comprueba la partida", function () {
      expect(codigo).not.toBe(undefined);
      expect(juego.partidas[codigo].nickOwner).toEqual(usr.nick);
      expect(juego.partidas[codigo].maximo).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(1);
    });

    it("varios usuarios se unen a la partida", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
    });

    it("Pepe inicia la partida", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      usr.iniciarPartida();
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
    })

    it("Pepe abandona la partida ya empezada", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      usr.iniciarPartida();
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
      usr.abandonarPartida();
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
    });

      it("Pepe abandona la partida sin empezar", function () {
        juego.unirAPartida(codigo, "ana");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(2);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "isa");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(3);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "tomas");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(4);
        expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
        usr.abandonarPartida();
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      })

      it("Todos abandonan la partida", function () {
        juego.unirAPartida(codigo, "ana");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(2);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "isa");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(3);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "tomas");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(4);
        expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
        juego.partidas[codigo].usuarios["Pepe"].abandonarPartida();
        juego.partidas[codigo].usuarios["isa"].abandonarPartida();
        juego.partidas[codigo].usuarios["tomas"].abandonarPartida();
        juego.partidas[codigo].usuarios["ana"].abandonarPartida();
        expect(juego.partidas[codigo].numJugadores()).toEqual(0);
      })

      it("Los encargos han sido asignados", function () {
        juego.unirAPartida(codigo, "ana");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(2);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "isa");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(3);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "tomas");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(4);
        expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
        usr.iniciarPartida();
        expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
        for (var key in juego.partidas[codigo].usuarios) {
          expect(juego.partidas[codigo].usuarios[key].encargo).not.toEqual("ninguno");
        }
      })

        it("Los impostores han sido asignados", function () {
          juego.unirAPartida(codigo, "ana");
          var num = Object.keys(juego.partidas[codigo].usuarios).length;
          expect(num).toEqual(2);
          expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
          juego.unirAPartida(codigo, "isa");
          var num = Object.keys(juego.partidas[codigo].usuarios).length;
          expect(num).toEqual(3);
          expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
          juego.unirAPartida(codigo, "tomas");
          var num = Object.keys(juego.partidas[codigo].usuarios).length;
          expect(num).toEqual(4);
          expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
          usr.iniciarPartida();
          expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
          var esImpostor=false;
          for (var key in juego.partidas[codigo].usuarios) {
            if(juego.partidas[codigo].usuarios[key].impostor==true){
              esImpostor=true;
            };
          }
            expect(esImpostor).toEqual(true);
          
      })

      it("Impostor mata", function () {
        juego.unirAPartida(codigo, "ana");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(2);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "isa");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(3);
        expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
        juego.unirAPartida(codigo, "tomas");
        var num = Object.keys(juego.partidas[codigo].usuarios).length;
        expect(num).toEqual(4);
        expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
        usr.iniciarPartida();
        expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
        var contMuertos=0;
        for (var key in juego.partidas[codigo].usuarios) {
          if(juego.partidas[codigo].usuarios[key].impostor==true){
            var impo = key;
          };
          if(juego.partidas[codigo].usuarios[key].impostor==false){
            var ciudadano = key;
          };
        }
        juego.partidas[codigo].usuarios[impo].atacar(ciudadano);
        for (var key in juego.partidas[codigo].usuarios) {
          
          if(juego.partidas[codigo].usuarios[key].estado.nombre=="muerto"){
            contMuertos++;
          };
        }
          expect(contMuertos).not.toEqual(0);
        
    })
    
    it("Ganan impostores", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      usr.iniciarPartida();
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
      var contMuertos=0;
      for (var key in juego.partidas[codigo].usuarios) {
        if(juego.partidas[codigo].usuarios[key].impostor==true){
          var impo = key;
        };
      }
      for (var key in juego.partidas[codigo].usuarios) {
          if(juego.partidas[codigo].usuarios[key].impostor==false){
            juego.partidas[codigo].usuarios[impo].atacar(key);
          };   
      }
      var victoria=juego.partidas[codigo].gananImpostores();
        expect(victoria).toBe(true);
      
  })
  
});

    describe("el usr Pepe crea una partida de pocos jugadores", function () {
      var codigo;
      beforeEach(function () {
        codigo = usr.crearPartida(3);
      });
      it("se comprueba la partida", function () {
        expect(codigo).toBe("fallo");
      });
      })

      describe("el usr Pepe crea una partida de muchos jugadores", function () {
        var codigo;
        beforeEach(function () {
          codigo = usr.crearPartida(11);
        });
        it("se comprueba la partida", function () {
          expect(codigo).toBe("fallo");
        });
        })


  
})

