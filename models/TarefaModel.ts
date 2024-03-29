/*Pagina Schema que define a forma dos documentos dentro dessa coleção.*/
import mongoose, { Schema } from "mongoose";

//Usado na API de cadastro de tarefas
const TarefaSchema = new Schema({
    //Campo required informa se o campo é obrigatório ou não
    idUsuario: { type: String, required: true }, // Guarda uma String com o ID do usuário e é obrigatório para a criação
    tituloTarefa: { type: String, required: true },
    descricao: { type: String, required: false},
    data: { type: Date, required: false},
    diaTodo: { type: Boolean, required: false, default: false },
    repeticao: { type: String, required: false},
    conclusao: {type: Boolean, required: false, default: false}
});

//O Model é uma classe que representa a estrutura de uma tabela no banco de dados.
export const TarefaModel = (mongoose.models.tarefas ||
    mongoose.model('tarefas', TarefaSchema));

/*Basicamente, este código define a estrutura dos documentos na coleção "tarefas" do MongoDB, especificando quais campos os documentos podem ter e quais são obrigatórios.
O modelo resultante pode ser usado para criar, ler, atualizar e excluir documentos nesta coleção. */