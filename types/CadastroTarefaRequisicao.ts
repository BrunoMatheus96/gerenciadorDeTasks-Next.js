import { Date } from "mongoose";

export type CadastroTarefaRequisicao = {
    titulo: string,
    descricao: string,
    data: string,
    hora: string,
    diaTodo: boolean,
    repeticao: string,
    conclusao: boolean,
    }