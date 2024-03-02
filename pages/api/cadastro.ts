//Introdução a Node.JS na aula Schemas - Parte 1
import { CadastroRequisicao } from "@/types/CadastroRequisicao";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB"; // Importando o middleware de conexão com DB que foi criado
import { UsuarioModel } from "../../models/UsuarioModel"; // Importando o model do Usuário
import md5 from "md5";

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    //Definição da requisição e tratativa do método
    //Se meu método for um POST então ele irá requisitar um payload
    try {
        if (req.method === "POST") {
            const usuario = req.body as CadastroRequisicao;

            //Verificação de campos obrigatórios
            if (!usuario.nome || !usuario.email || !usuario.senha) {

                //O operador ternário (condicao ? valorSeVerdadeiro : valorSeFalso) é usado para verificar qual campo está vazio e retornar o nome do campo.
                const campoVazio = !usuario.nome ? "nome" : !usuario.email ? "email" : "senha";

                console.log(usuario);
                return res.status(400).json({ erro: `O campo ${campoVazio} é obrigatório` });
            }

            //Verifcação de nome
            if (usuario.nome.length <= 2 //Verificar se o campo tem mais de 2 carcteres
            ) {
                return res.status(400).json({ erro: "Nome inválido. Favor colocar um nome com mais de 2 caracteres" });
            }

            //Verifcação de email
            if (usuario.email.length < 5 //Verificar se o campo tem mais de 4 carcteres
                || !usuario.email.includes("@") //Verifica se o campo possui @ e torna o @ obrigatório
                || !usuario.email.includes(".") //Verifica se o campo possui .  e torna o . obrigatório
            ) {
                console.log(usuario.email);
                return res.status(400).json({ erro: "E-mail inválido. Para o mesmo ser válido siga o exemplo: tasks@gmail.com" });
            }

            //Verifcação de senha
            if (usuario.senha.length <= 5) {
                return res.status(400).json({ erro: "Senha inválida. O campo precisa ter pelo menos 6 caracteres" });
            }

            //Verificação da confirmação de senha
            if (usuario.senha != usuario.confSenha) {
                console.log(`Campo senha = "${usuario.senha}" e Campo confSenha = "${usuario.confSenha}"`);
                return res.status(400).json({ erro: "As senhas estão diferentes" });
            }


            //Verificação no banco se já existe o usuário cadastrado. A verificação será feita pelo e-mail 
            //O método find() do Model UsuarioModel é usado para realizar a pesquisa no banco de dados.
            const usuarioExistente = await UsuarioModel.find({
                // Método de pesquisa em um Model, é passado os parâmetros e é retornado um objeto que contenha o que foi passado
                email: usuario.email, // Passando um JSON com o usuário do cadastro.
                //O método recebe um JSON como parâmetro, que define os critérios da pesquisa que neste caso, o critério é o e-mail do usuário (usuario.email).
            });

            //Condição para validar se a pesquisa no banco (código acima) já possui o email cadastrado e se tem mais de 0 caracteres
            if (usuarioExistente && usuarioExistente.length > 0) {
                return res.status(400).json({ erro: "Email já cadastrado" });
            }

            //salvar no banco de dados
            const usuarioASerSalvo = { // Cria uma const com o que é esperado de um usuario e isso foi definido no Model
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha), // Utilização do md5 para que o dado seja guardado criptografado, caso haja algum vazamento a senha ao menos estará com uma criptografia
            }

            await UsuarioModel.create(usuarioASerSalvo); // O método create cria o objeto definido em usuarioASerSalvo na Coleção
            return res.status(200).json({ msg: "Usuário cadastrado com sucesso!" });
        }
        console.log("Foi requisitado um " + req.method + ` mas correto é um POST`);
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default conectarMongoDB(endpointCadastro);