const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionReiniciar = document.getElementById('reiniciar')
const botonPetsJugador = document.getElementById ('boton-pets')
const botonReiniciar = document.getElementById('boton-reiniciar')
sectionReiniciar.style.display= 'none'

const sectionSeleccionarPet = document.getElementById('seleccionar-pets')
const spanPetJugador = document.getElementById('pet-jugador')

const spanPetEnemigo = document.getElementById('pet-enemigo')

const spanVidasJugador  = document.getElementById('vidas-jugador')
const spanVidasEnemigo  = document.getElementById('vidas-enemigo')

const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedor-tarjetas')
const contenedorAtaques = document.getElementById('contenedor-ataques')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let pets = []
let petsEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionesDePets
let inputGolfo
let inputBalto
let inputFang
let petJugador
let petJugadorObjeto
let ataquesPetJugador
let ataquesPetEnemigo
let botonAgua
let botonTierra
let botonFuego
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './fotos/mokemap.webp'
let alturaBuscada
const anchoMaxMapa = 350
let anchoMapa = window.innerWidth < anchoMaxMapa ? window.innerWidth - 20 : anchoMaxMapa

const relacionAspecto = 600 / 800
alturaBuscada = anchoMapa * relacionAspecto

mapa.width = anchoMapa
mapa.height = alturaBuscada 

class Elementos {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id= id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.mapaFotoCargada = false

        this.mapaFoto.onload = () => {
            this.mapaFotoCargada = true
        }

        this.velocidadX = 0
        this.velocidadY = 0
    }
    pintarPets() {
        if (this.mapaFotoCargada) {
            lienzo.fillStyle = "gray"
            lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto)
            return
        } 
    }
}


let Golfo = new Elementos('Golfo', './fotos/Golfo.webp', 5, './fotos/golfoCabeza.webp')
let Balto = new Elementos('Balto', './fotos/Balto.webp', 5, './fotos/baltoCabeza.png')
let Fang = new Elementos('Fang', './fotos/Fang.webp', 5, './fotos/fangCabeza.webp')

const golfoAtaques = [
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🌱', id: 'boton-tierra'},
    { nombre: '🔥', id: 'boton-fuego'},
]

Golfo.ataques.push(...golfoAtaques)

const baltoAtaques = [
    { nombre: '🌱', id: 'boton-tierra'},
    { nombre: '🌱', id: 'boton-tierra'},
    { nombre: '🌱', id: 'boton-tierra'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🔥', id: 'boton-fuego'},
]

Balto.ataques.push(...baltoAtaques)

const fangAtaques = [
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🌱', id: 'boton-tierra'},
]

Fang.ataques.push(...fangAtaques)

pets.push(Golfo,Balto,Fang)

function iniciarJuego() {
    
    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'

    pets.forEach((pets) => {
        opcionesDePets = `
        <input type="radio" name="pets" id="${pets.nombre}" value="${pets.nombre}" />
        <label class='tarjeta-de-elementos' for=${pets.nombre}>
            <p>${pets.nombre}</p>
            <img src=${pets.foto} alt=${pets.nombre}>
        </label>
        `
    contenedorTarjetas.innerHTML += opcionesDePets

        inputGolfo = document.getElementById('Golfo')
        inputBalto = document.getElementById('Balto')
        inputFang = document.getElementById('Fang')
})

    botonPetsJugador.addEventListener('click', seleccionarPetJugador)

    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch('http://192.168.1.7:8080/unirse')
        .then(function (res) {
                if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                })
            }
        })
}

function seleccionarPetJugador () {
    
    if (inputGolfo.checked) {
        spanPetJugador.textContent = inputGolfo.id
        petJugador = inputGolfo.id
        petJugadorObjeto = obtenerObjetoPet(petJugador)
    } else if (inputBalto.checked) {
        spanPetJugador.textContent = inputBalto.id
        petJugador = inputBalto.id
        petJugadorObjeto = obtenerObjetoPet(petJugador)
    } else if (inputFang.checked) {
        spanPetJugador.textContent = inputFang.id
        petJugador = inputFang.id
        petJugadorObjeto = obtenerObjetoPet(petJugador)
    } else {
        alert('Selecciona una Pet')
        return

    }
    sectionSeleccionarPet.style.display = 'none'

    seleccionarPets(petJugador)

    extraerAtaques(petJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
}

function seleccionarPets(petJugador) {
    fetch(`http://192.168.1.7:8080/ELEMENTOS/${jugadorId}`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pet: petJugador
        
        })
    }) 
}

function extraerAtaques(petJugador) {
    let ataques
    for (let i = 0; i < pets.length; i++) {
        if(petJugador === pets[i].nombre) {
            ataques = pets[i].ataques
        }
    } 
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    contenedorAtaques.innerHTML = ""
    ataques.forEach((ataque, index) => {
        const ataquesPetJugador = `
            <button id="${ataque.id}-${index}" class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesPetJugador
    })

    botones = document.querySelectorAll('.BAtaque')
    secuenciaAtaque()
}


function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent  === '💧') {
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = 'rgba(143, 143, 143, 0.4)'
                boton.disabled = true
            } else if (e.target.textContent === '🌱') {
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = 'rgba(143, 143, 143, 0.4)'
                boton.disabled = true
            } else { 
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = 'rgba(143, 143, 143, 0.4)'
                boton.disabled = true
            }
            if (ataqueJugador.length === 5) {
                enviarAtaques()
            }
        })
    }) 
}

function enviarAtaques() {
    fetch(`http://192.168.1.7:8080/ELEMENTOS/${jugadorId}/ataques`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://192.168.1.7:8080/ELEMENTOS/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques && ataques.length === 5) {
                            ataqueEnemigo = ataques
                            combate()
                        }
                    })
            }
        })
}

function obtenerObjetoPet(nombre) {
    return pets.find(p => p.nombre === nombre)
}

function ataqueAleatorioEnemigo() {
    console.log('Ataques enemigo', ataquesPetEnemigo);
    let ataqueAleatorio = aleatorio(0,ataquesPetEnemigo.length -1)

    if (ataqueAleatorio == 0 || ataqueAleatorio ==1) {
        ataqueEnemigo.push('AGUA')
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push('TIERRA')
    } else {
        ataqueEnemigo.push('FUEGO')
    }
    console.log(ataquesPetEnemigo)
    iniciarPelea()
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo){
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate() {
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]) {
                indexAmbosOponentes(index, index)
                crearMensaje('EMPATE')
        } else if (ataqueJugador[index] === 'AGUA' && ataqueEnemigo
            [index] === 'TIERRA') {
            indexAmbosOponentes(index, index)
            crearMensaje('GANASTE!')
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        }  else if (ataqueJugador[index] === 'TIERRA' && ataqueEnemigo
            [index] === 'FUEGO') {
            indexAmbosOponentes(index, index)
            crearMensaje('GANASTE!')
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        }   else if (ataqueJugador[index] === 'FUEGO' && ataqueEnemigo
            [index] === 'AGUA') {
            indexAmbosOponentes(index, index)
            crearMensaje('GANASTE!')
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        }   else {
            indexAmbosOponentes(index, index)
            crearMensaje('PERDISTE!')
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }
            
    revisarVidas()     
}

function revisarVidas() {
    if ((victoriasJugador + victoriasEnemigo) === 5) {
        crearMensajefinal('Esto fue un empate!')
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajefinal('🎊FELICITACIONES GANASTE!🎊')
    } else {
        crearMensajefinal('Oh Oh! Vuelve a intentarlo 👎')
    }
}

function crearMensaje(resultado) {
    
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function crearMensajefinal(resultadoFinal) {
    
    sectionMensajes.innerHTML = resultadoFinal

    sectionReiniciar.style.display = 'block'
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas() {
    petJugadorObjeto.x = petJugadorObjeto.x + petJugadorObjeto.velocidadX
    petJugadorObjeto.y = petJugadorObjeto.y + petJugadorObjeto.velocidadY

    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height)
    petJugadorObjeto.pintarPets()

    enviarPosicion(petJugadorObjeto.x, petJugadorObjeto.y)

    petsEnemigos.forEach(function (pet) {
        if (pet && typeof pet.pintarPets === 'function') {
        pet.pintarPets()
        revisarColision(pet)
    	}
    })
    pintarEnemigos()
}

function pintarEnemigos() {
    petsEnemigos.forEach(pet => {
        pet.pintarPets(pet)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://192.168.1.7:8080/ELEMENTOS/${jugadorId}/posicion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x, y })
    })
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        throw new Error('Error en la respuesta del servidor');
    })
    .then(({ enemigos }) => {
        petsEnemigos = enemigos.map(enemigo => {
            const petNombre = enemigo.pet?.nombre

            let petEnemigo = null

                if (petNombre === 'Golfo') {
                    petEnemigo = new Elementos('Golfo', './fotos/Golfo.webp', 5, './fotos/golfoCabeza.webp', enemigo.id);
                } else if (petNombre === 'Balto') {
                    petEnemigo = new Elementos('Balto', './fotos/Balto.webp', 5, './fotos/baltoCabeza.png', enemigo.id);
                } else if (petNombre === 'Fang') {
                    petEnemigo = new Elementos('Fang', './fotos/Fang.webp', 5, './fotos/fangCabeza.webp', enemigo.id);
                } else { 
                    return null 
                }

                if (!petEnemigo) {
                return null
                }

                petEnemigo.x = enemigo.x 
                petEnemigo.y = enemigo.y
                
                return petEnemigo;

                
            }).filter(Boolean)
    })
}   
   
function moverArriba() {
    petJugadorObjeto.velocidadY = - 4
    pintarCanvas()
}

function moverAbajo() {
    petJugadorObjeto.velocidadY = 4
    pintarCanvas()
}

function moverDerecha() {
    petJugadorObjeto.velocidadX = 4
    pintarCanvas()
}

function moverIzquierda() {
    petJugadorObjeto.velocidadX = - 4
    pintarCanvas()
}

function detenerMovimiento() {
    petJugadorObjeto.velocidadX = 0
    petJugadorObjeto.velocidadY = 0
}

window.addEventListener('keydown', teclas)
window.addEventListener('keyup', detenerMovimiento)

function teclas(event) {
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowRight':
            moverDerecha()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
    }
}

function iniciarMapa() {
    petJugadorObjeto = obtenerObjetoPet(petJugador)
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', teclas)
    window.addEventListener('keyup', detenerMovimiento)

    pintarCanvas()
}

function revisarColision(enemigo) {

    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaJugador = petJugadorObjeto.y
    const abajoJugador = petJugadorObjeto.y + petJugadorObjeto.alto
    const izquierdaJugador = petJugadorObjeto.x
    const derechaJugador = petJugadorObjeto.x + petJugadorObjeto.ancho

    if (
        abajoJugador < arribaEnemigo ||
        arribaJugador > abajoEnemigo ||
        derechaJugador < izquierdaEnemigo ||
        izquierdaJugador > derechaEnemigo
    ) {
        return
    }

    detenerMovimiento()
    clearInterval(intervalo)
    console.log('Combate');

    enemigoId = enemigo.id
    spanPetEnemigo.textContent = enemigo.nombre
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarPetEnemigo()
}

window.addEventListener('load', iniciarJuego)