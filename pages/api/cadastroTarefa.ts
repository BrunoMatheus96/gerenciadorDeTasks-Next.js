import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { TarefaModel } from "@/models/TarefaModel";
import { CadastroTarefaRequisicao } from "@/types/CadastroTarefaRequisicao";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";



const endpointCadastroTarefa = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        //Definição da requisição e tratativa do método
        //Se meu método for um POST então ele irá requisitar um payload
        if (req.method === "POST") {

            const tarefa = req.body as CadastroTarefaRequisicao

            //Título
            if (!tarefa.titulo) {
                return res.status(400).json({ erro: `O campo título é obrigatório` });
            }

            if (tarefa.titulo.length > 60) {
                console.log("Paassou de 60 caracteres")
                return res.status(413).json({ erro: `Limite de caracteres alcançado` });
            }

            //Descrição
            if (tarefa.descricao.length >= 160) {
                console.log("Paassou de 160 caracteres")
                return res.status(413).json({ erro: `Limite de caracteres alcançado` });
            }

            //Dia todo?
            if (!tarefa.diaTodo) {
                tarefa.diaTodo = false
            }

            //Se repete?
            const tipo = ['Diariamente', 'Semanalmente', 'Mensalmente', 'Anualmente'];
            if (tarefa.repeticao !== '' && tarefa.repeticao !== ' ' && !tipo.includes(tarefa.repeticao)) {

                return res.status(400).json({ erro: `Texto inválido para esse campo` });

            }


            //salvar no banco de dados
            const tarefaASerSalva = { // Cria uma const com o que é esperado de uma tarefa e isso foi definido no Model
                titulo: tarefa.titulo,
                descricao: tarefa.descricao,
                data: tarefa.data,
                hora: tarefa.hora,
                diaTodo: tarefa.diaTodo,
                repeticao: tarefa.repeticao
            }

            await TarefaModel.create(tarefaASerSalva); // O método create cria o objeto definido em tarefaASerSalvo na Coleção
            console.log(tarefa)
            return res.status(200).json({ msg: "Tarefa criada com sucesso!" });
        }
        console.log("Foi requisitado um " + req.method + ` mas correto é um POST`);
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointCadastroTarefa));