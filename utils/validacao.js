export const validarRepeticaoTarefa = (repeticao) => {
    const tipo = ['Diariamente', 'Semanalmente', 'Mensalmente', 'Anualmente'];

    if (repeticao !== '' && !tipo.includes(repeticao)) {
        return false;
    } else {
        return true;
    }
}