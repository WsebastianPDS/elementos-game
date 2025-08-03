const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
    constructor(id) {
        this.id = id
    } 

    asignarPet(pet) {
        this.pet = pet
    }

    actualizarPosicion(x, y) {
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques) {
        this.ataques = ataques
    }
}

class Pet {
    constructor(nombre) {
        this.nombre = nombre
    }
}

app.get('/unirse', (req, res) => {
    const id = `${Math.random()}`

    const jugador = new Jugador(id)

    jugadores.push(jugador)

    res.setHeader('Access-Control-Allow-Origin', '*')

    res.send(id)
})

app.post('/ELEMENTOS/:jugadorId', (req, res) => {
    const jugadorId = req.params.jugadorId || ''
    const nombre = req.body.pet || ''
    const pet  = new Pet(nombre);
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarPet(pet)
    }

    console.log(jugadores)
    console.log(jugadorId)
    res.end()
})

app.post('/ELEMENTOS/:jugadorId/posicion', (req, res) => {
    const jugadorId = req.params.jugadorId || ''
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)
    res.send({
        enemigos
    })
})

app.post('/ELEMENTOS/:jugadorId/ataques', (req, res) => {
    const jugadorId = req.params.jugadorId || ''
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }
    res.end()
})

app.get('/ELEMENTOS/:jugadorId/ataques', (req, res) => {
    const jugadorId = req.params.jugadorId || ''
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

app.listen(8080, () => {
        console.log('servidor funcionado en puerto 8080')
})

console.log(jugadores)