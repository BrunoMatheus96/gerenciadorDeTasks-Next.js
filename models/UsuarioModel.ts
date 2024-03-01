/*Pagina Schema que define a forma dos documentos dentro dessa coleção.*/
import mongoose, { Schema } from "mongoose";

//Usado na API de cadastro
const UsuarioSchema = new Schema({
    //Campo required informa se o campo é obrigatório ou não
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
});
 
export const UsuarioModel = (mongoose.models.usuarios ||
    mongoose.model('usuarios', UsuarioSchema));

/*Basicamente, este código define a estrutura dos documentos na coleção "usuarios" do MongoDB, especificando quais campos os documentos podem ter e quais são obrigatórios.
O modelo resultante (UsuarioModel) pode ser usado para criar, ler, atualizar e excluir documentos nesta coleção. */