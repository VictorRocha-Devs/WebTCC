const connectDB = require('../config/db');

const Evento = {
    async findByDate(data) {
        const connection = await connectDB();
        const [eventos] = await connection.execute(
            'SELECT e.*, GROUP_CONCAT(u.nome) as participantes ' +
            'FROM tbEvento e ' +
            'LEFT JOIN tbParticipacaoEvento pe ON e.idEvento = pe.idEvento ' +
            'LEFT JOIN tbUsuario u ON pe.idUsuario = u.idUsuario ' +
            'WHERE e.dataEvento = ? ' +
            'GROUP BY e.idEvento',
            [data]
        );
        return eventos;
    }
};

module.exports = Evento;
