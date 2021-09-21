export function GeratDataJS(ano, mes, dia) {
  return new Date(ano, mes, dia);
}

export function ConvertDataJSParaDataExtenso(data) {
  var ano = data.getFullYear();
  var mes = MesporExtenso(data.getMonth());
  var dia = data.getDate();
  var dt = dia + " de " + mes + " de " + ano;
  return dt;
}

export function ConvertDataJSParaDataExtensoComDiadaSemana(data) {
  var ano = data.getFullYear();
  var mes = MesporExtenso(data.getMonth());
  var dia = data.getDate();
  var diadasemana = DiaSemana(data);
  var dt = diadasemana + ", " + dia + " de " + mes + " de " + ano;
  return dt;
}

export function DiaDaSemana(date) {
  var numdiasemana = date.getDay();
  var diasemana = "";
  switch (numdiasemana) {
    case 0:
      diasemana = "Domingo";
      break;
    case 1:
      diasemana = "Segunda feira";
      break;
    case 2:
      diasemana = "Terça feira";
      break;
    case 3:
      diasemana = "Quarta feira";
      break;
    case 4:
      diasemana = "Quinta feira";
      break;
    case 5:
      diasemana = "Sexta feira";
      break;
    case 6:
      diasemana = "Sabado";
      break;

    default:
  }
  return diasemana;
}

export function DiaSemana(datajs) {
  var dia = datajs.getDay();
  switch (dia) {
    case 0:
      return "Domingo";
      break;
    case 1:
      return "Segunda";
      break;
    case 2:
      return "Terça";
      break;
    case 3:
      return "Quarta";
      break;
    case 4:
      return "Quinta";
      break;
    case 5:
      return "Sexta";
      break;
    case 6:
      return "Sabado";
      break;
    default:
      return "";
      break;
  }
}

export function DataparaParametroPar(data) {
  return (
    data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()
  );
}

export function HoraFormatada(hora) {
  var minutes = hora.getMinutes();
  var minutesstr = minutes.toString();
  if (minutesstr.length == 1) {
    minutesstr = "0" + minutesstr;
  }
  var hour = hora.getHours();
  var hr = hour + ":" + minutesstr;
  return hr;
}

export function DiasdaSemanaFrase(stateDiasdaSemanana) {
  let x = [];
  var frase = "";

  if (stateDiasdaSemanana.segunda == true) {
    x.push("Segunda");
  }

  if (stateDiasdaSemanana.terca == true) {
    x.push("Terça");
  }

  if (stateDiasdaSemanana.quarta == true) {
    x.push("Quarta");
  }

  if (stateDiasdaSemanana.quinta == true) {
    x.push("Quinta");
  }

  if (stateDiasdaSemanana.sexta == true) {
    x.push("Sexta");
  }

  if (stateDiasdaSemanana.sabado == true) {
    x.push("Sabado");
  }

  if (stateDiasdaSemanana.domingo == true) {
    x.push("Domingo");
  }

  for (var i = 0; i < x.length; i++) {
    if (i == x.length - 1) {
      if (frase.indexOf(",") > -1) {
        frase = frase.substring(0, frase.length - 2);
      }

      if (x.length == 1) {
        frase = frase + x[i];
      } else {
        frase = frase + " e " + x[i];
      }
    } else {
      frase = frase + x[i] + " , ";
    }
  }

  return frase;
}

function MesporExtenso(nummes) {
  switch (nummes) {
    case 0:
      return "Janeiro";
      break;
    case 1:
      return "Fevereiro";
      break;
    case 2:
      return "Março";
      break;
    case 3:
      return "Abril";
      break;
    case 4:
      return "Maio";
      break;
    case 5:
      return "Junho";
      break;
    case 6:
      return "Julho";
      break;
    case 7:
      return "Agosto";
      break;
    case 8:
      return "Setembro";
      break;
    case 9:
      return "Outubro";
      break;
    case 10:
      return "Novembro";
      break;
    case 11:
      return "Dezembro";
      break;

    default:
  }
}
