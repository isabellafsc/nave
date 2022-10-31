var jogador, bombas //Elementos
var frames //Controle de animação
var posJogadorX, posJogadorY //Posições
var dirJogadorY, dirJogadorX //Direção
var telaWidth, telaHeight //Tamanhos
var velJogador, velTiro, velBomba //Velocidade
var tecla, hpPlaneta //Controle
var jogo = false
var barraPlaneta, painelContBombas, telaMensagem //Painéis
var intervaloBomba
var contagemBombas, indiceExplosao, indiceSom //Contador

function teclaDown(event) {
  //MOVER NAVE
  tecla = event.key
  if (tecla == 'ArrowUp' || tecla == 'w') {
    dirJogadorY = -1
  } else if (tecla == 'ArrowDown' || tecla == 's') {
    dirJogadorY = 1
  } else if (tecla == 'ArrowLeft' || tecla == 'a') {
    dirJogadorX = -1
  } else if (tecla == 'ArrowRight' || tecla == 'd') {
    dirJogadorX = 1
  } else if (tecla == ' ') {
    criaTiro(posJogadorX + 18, posJogadorY)
  }
}

function teclaUp(event) {
  tecla = event.key
  if (
    tecla == 'ArrowUp' ||
    tecla == 'ArrowDown' ||
    tecla == 'w' ||
    tecla == 's'
  ) {
    dirJogadorY = 0
  } else if (
    tecla == 'ArrowLeft' ||
    tecla == 'ArrowRight' ||
    tecla == 'a' ||
    tecla == 'd'
  ) {
    dirJogadorX = 0
  }
}

function criaBomba() {
  if (jogo) {
    var bomba = document.createElement('div')
    var posBombaX = Math.random() * telaWidth - 20
    var posBombaY = 0
    var atributo1 = document.createAttribute('class')
    var atributo2 = document.createAttribute('style')
    atributo1.value = 'bomba'
    atributo2.value = 'top:' + posBombaY + 'px;left:' + posBombaX + 'px'
    bomba.setAttributeNode(atributo1)
    bomba.setAttributeNode(atributo2)
    document.body.appendChild(bomba)
    contagemBombas--
    painelContBombas = document.getElementById('contBombas')
    painelContBombas.innerHTML = 'Bombas restantes: ' + contagemBombas
  }
}

function controleBombas() {
  bombas = document.getElementsByClassName('bomba')
  for (var i = 0; i < bombas.length; i++) {
    if (bombas[i]) {
      var posBomba = bombas[i].offsetTop
      posBomba += velBomba
      bombas[i].style.top = posBomba + 'px'
      if (posBomba > telaHeight) {
        hpPlaneta -= 30   //DANO QUE O PLANETA RECEBE
        criaExplosao(2, bombas[i].offsetLeft, null)
        bombas[i].remove()
      }
    }
  }
}

function criaTiro(x, y) {
  var tiro = document.createElement('div')
  var atributo1 = document.createAttribute('class')
  var atributo2 = document.createAttribute('style')
  atributo1.value = 'tiroJogador'
  atributo2.value = 'top:' + y + 'px;left:' + x + 'px'
  tiro.setAttributeNode(atributo1)
  tiro.setAttributeNode(atributo2)
  document.body.appendChild(tiro)
}

function controleTiros() {
  var tiros = document.getElementsByClassName('tiroJogador')
  for (var i = 0; i < tiros.length; i++) {
    if (tiros[i]) {
      var posTiro = tiros[i].offsetTop
      posTiro -= velTiro
      tiros[i].style.top = posTiro + 'px'
      colisaoTiroBomba(tiros[i])
      if (posTiro < 0) {
        tiros[i].remove()
      }
    }
  }
}

function colisaoTiroBomba(tiro) {
  for (var i = 0; i < bombas.length; i++) {
    if (bombas[i]) {
      if (
        //CIMA TIRO COM BAIXO BOMBA
        tiro.offsetTop <= bombas[i].offsetTop + 40 &&
        //BAIXO TIRO COM CIMA BOMBA
        tiro.offsetTop + 6 >= bombas[i].offsetTop &&
        //ESQUERDA TIRO COM DIREITA BOMBA
        tiro.offsetLeft <= bombas[i].offsetLeft + 24 &&
        //DIREITA TIRO COM ESQUERDA BOMBA
        tiro.offsetLeft + 4 >= bombas[i].offsetLeft
      ) {
        criaExplosao(1, bombas[i].offsetLeft - 25, bombas[i].offsetTop)
        bombas[i].remove()
        tiro.remove()
      }
    }
  }
}

function criaExplosao(tipo, x, y) {
  if (document.getElementById('explosao' + (indiceExplosao - 4))) {
    //REMOVE ELEMENTO QUANDO TIVER 4 COM MESMO ID
    document.getElementById('explosao' + (indiceExplosao - 4)).remove()
  }

  //TIPO (1 = AR) (2 = CHÃO)
  var explosao = document.createElement('div')
  var img = document.createElement('img')
  var som = document.createElement('audio')
  //ATRIBUTOS PARA DIV
  var atributo1 = document.createAttribute('class')
  var atributo2 = document.createAttribute('style')
  var atributo3 = document.createAttribute('id')
  //ATRIBUTOS PARA IMG
  var atributo4 = document.createAttribute('src')
  //ATRIBUTOS PARA AUDIO
  var atributo5 = document.createAttribute('src')
  var atributo6 = document.createAttribute('id')

  if (tipo == 1) {
    atributo1.value = 'explosaoAr'
    atributo2.value = 'top:' + y + 'px;left:' + x + 'px'
    atributo4.value = './assets/explosao_ar.gif?' + new Date()
  } else {
    atributo1.value = 'explosaoChao'
    atributo2.value = 'top:' + (telaHeight - 57) + 'px;left:' + (x - 17) + 'px'
    atributo4.value = './assets/explosao_chao.gif?' + new Date()
  }
  atributo3.value = 'explosao' + indiceExplosao
  atributo5.value = './assets/exp1.mp3?' + new Date()
  atributo6.value = 'som' + indiceSom
  explosao.setAttributeNode(atributo1)
  explosao.setAttributeNode(atributo2)
  explosao.setAttributeNode(atributo3)
  img.setAttributeNode(atributo4)
  som.setAttributeNode(atributo5)
  som.setAttributeNode(atributo6)
  explosao.appendChild(img)
  explosao.appendChild(som)
  document.body.appendChild(explosao)
  document.getElementById('som' + indiceSom).play()
  indiceExplosao++
  indiceSom++
}

function controleJogador() {
  posJogadorY += dirJogadorY * velJogador
  posJogadorX += dirJogadorX * velJogador
  jogador.style.top = posJogadorY + 'px'
  jogador.style.left = posJogadorX + 'px'

  if (posJogadorX < 0) {
    posJogadorX = 0
  } else if (posJogadorX > telaWidth - 40) {
    posJogadorX = telaWidth - 40
  } else if (posJogadorY < 200) {
    posJogadorY = 200
  } else if (posJogadorY > telaHeight - 40) {
    posJogadorY = telaHeight - 40
  }
}

function gerenciaGame() {
  barraPlaneta.style.width = hpPlaneta + 'px'

  if (contagemBombas <= 0) {
    jogo = false
    clearInterval(intervaloBomba)
    bombas = document.getElementsByClassName('bomba')
    for (var i = 0; i < bombas.length; i++) {
      if (bombas[i]) {
        bombas[i].remove()
      }
    }
    telaMensagem.style.backgroundImage = 'url("./assets/vitoria.jpg")'
    telaMensagem.style.display = 'block'
  }
  if (hpPlaneta <= 0) {
    jogo = false
    clearInterval(intervaloBomba)
    bombas = document.getElementsByClassName('bomba')
    for (var i = 0; i < bombas.length; i++) {
      if (bombas[i]) {
        bombas[i].remove()
      }
    }
    telaMensagem.style.backgroundImage = 'url("./assets/derrota.jpg")'
    telaMensagem.style.display = 'block'
  }
}

function gameLoop() {
  if (jogo) {
    //FUNÇÃO DE CONTROLE
    controleJogador()
    controleTiros()
    controleBombas()
  }
  gerenciaGame()
  frames = requestAnimationFrame(gameLoop)
}

function reinicia() {
  telaMensagem.style.display = 'none'
  clearInterval(intervaloBomba)
  cancelAnimationFrame(frames)
  hpPlaneta = 300
  posJogadorX = telaWidth / 2
  posJogadorY = telaHeight / 2
  jogador.style.top = posJogadorY + 'px'
  jogador.style.left = posJogadorX + 'px'
  contagemBombas = 20   //QUANTIDADE DE BOMBAS NO JOGO
  painelContBombas.innerHTML = 'Bombas restantes: 20'
  jogo = true
  intervaloBomba = setInterval(criaBomba, 1700)
  gameLoop()
}

function inicia() {
  jogo = false

  //CONTROLES TELAS
  telaWidth = window.innerWidth
  telaHeight = window.innerHeight
  telaMensagem = document.getElementById('telaMensagem')
  telaMensagem.style.background = 'url("./assets/intro.jpg")'
  telaMensagem.style.display = 'block'
  document.getElementById('btnJogar').addEventListener('click', reinicia)
  painelContBombas = document.getElementById('contBombas')
  painelContBombas.innerHTML = 'Bombas restantes: 20'

  //CONTROLES JOGADOR
  dirJogadorX = dirJogadorY = 0
  posJogadorX = telaWidth / 2
  posJogadorY = telaHeight / 2
  velJogador = velTiro = 5
  jogador = document.getElementById('naveJogador')
  jogador.style.top = posJogadorY + 'px'
  jogador.style.left = posJogadorX + 'px'

  //CONTROLES BOMBAS
  velBomba = 3

  //CONTROLES EXPLOSÃO
  indiceExplosao = indiceSom = 0

  //CONTROLES PLANETA
  hpPlaneta = 300
  barraPlaneta = document.getElementById('barraPlaneta')
  barraPlaneta.style.width = hpPlaneta + 'px'
}

document.addEventListener('keydown', teclaDown)
document.addEventListener('keyup', teclaUp)
window.addEventListener('load', inicia)
