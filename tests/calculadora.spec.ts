class Calculadora {
    public somar(x: number, y: number) {
        return x + y;
    }

    public multiplicar(x: number, y: number) {
        return x * y;
    }
}

describe("Testes da classe calculadora", () => {
    test("teste do método somar", () => {
        // 1 - criar o SUT
        const calculadora = new Calculadora();

        // 2 - executar o método a ser testado
        const result = calculadora.somar(50, 10);

        // 3 - validar o resultado (asserts)
        expect(result).toBe(60);
        expect(result).toEqual(60);
    });

    test("teste do método multiplicar", () => {
        // 1 - criar o SUT
        const calculadora = new Calculadora();

        // 2 - executar o método a ser testado
        const result = calculadora.multiplicar(50, 10);

        // 3 - validar o resultado (asserts)
        expect(result).toBe(50 * 10);
        expect(result).toEqual(50 * 10);
    });
});
