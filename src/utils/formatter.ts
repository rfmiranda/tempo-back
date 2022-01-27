export const currencyBox = (valor: number) => {
  let sufix = '';

  let i = 0;
  while (valor > 1000) {
    switch (i) {
      case 0:
        sufix = 'm';
        break;
      case 1:
        sufix = 'mi';
        break;
      case 2:
        sufix = 'bi';
        break;

      default:
        sufix = '';
        break;
    }
    valor = valor / 1000;
    i = i + 1;
  }

  return valor.toFixed(0) + sufix;
};
