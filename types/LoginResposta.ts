/*Classe utilizada para padronizar a tipagem dos campos de login no responsebody*/
export type LoginResposta = {
    nome : string,
    email : string,
    token : string
}