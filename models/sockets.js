const BandList = require("./band-list");

class Sockets {

    constructor( io ) {
        this.io = io

        this.bandList = new BandList()

        this.socketEvents()
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => { 
            // Emit => Emitir eventos y se recibiran por el socket del lado del cliente - Argumentos: (evento, payload)
            // On => Escuchar un evento que viene del cliente, (evento, callback)
            // Socket: Para el cliente que realiza el evento - Io: Para todos los clientes conectados
            
            console.log('Cliente conectado')

            // Emitir al cliente conectado, todas las bandas actuales
            socket.emit('current_bands', this.bandList.getBands())

            // Votar por la banda
            socket.on('vote_increase_band', ( bandId ) => {
                this.bandList.increaseVotes(bandId)
                this.io.emit('current_bands', this.bandList.getBands())
            })
            socket.on('vote_decrease_band', ( bandId ) => {
                this.bandList.decreaseVotes(bandId)
                this.io.emit('current_bands', this.bandList.getBands())
            })

            // Borrar Banda
            socket.on('remove_band', ( bandId ) => {
                this.bandList.removeBand(bandId)
                this.io.emit('current_bands', this.bandList.getBands())
            })

            // Cambiar nombre Banda
            socket.on('change_name_band', ({ id, name }) => {
                this.bandList.changeName(id, name)
                this.io.emit('current_bands', this.bandList.getBands())
            })

            // Agregar nueva Banda
            socket.on('add_band', ({ name }) => {
                this.bandList.addBand(name)
                this.io.emit('current_bands', this.bandList.getBands())
            })
        });
    }

}

module.exports = Sockets