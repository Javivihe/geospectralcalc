exports.llamada = function(localizacion, admn, fecha_ini, dict, mapa) {

  // Limpiar el mapa
  mapa.clear();
  
  // Importar las funciones necesarias
  var funcion = require('users/Pruebas_javi/geospectralcalc:funciones/funcion general');
  var app_desglose_general = require('users/Pruebas_javi/geospectralcalc:app/app_desglose_general');
  var leyenda = require('users/Pruebas_javi/geospectralcalc:funciones/leyenda');

  var diccionario;
  
  // Definir diccionario para áreas con nieve
  var dictionary_snow = ee.Dictionary({
    '1_snow': ['(G - S1) / (G + S1)', 99, 'white', ['(G - N) / (G + N)'], [99], 0], // nieve
    '2_water': ['(G - N) / (G + N)', 99.9, 'blue',['(RE2 - RE3) / (RE2 + RE3)', '(N - R)  / (N + R)', '((S1 + R) - (N + B))/((S1 + R) + (N + B))'], [99.9, 99, 99], 0], // agua
    '3_mountain': ['(S1 - N) / (20 * sqrt(S1 + N))', 80, 'ab9676', ['(RE2 - RE3) / (RE2 + RE3)'], [40], 0], // montaña
    '4_soil': ['((S1 + R) - (N + B))/((S1 + R) + (N + B))', 50, 'yellow', ['(N - R)  / (N + R)'], [10],  0], // suelo
    '5_urban': ['(RE2 - RE3) / (RE2 + RE3)', 90, 'black', ['(G - S1) / (G + S1)', '(S1 - N) / (20 * sqrt(S1 + N))'], [99.9, 35], 0], // urbano
    '6_vegetation': ['(N - R)  / (N + R)', 90, 'green', ['(RE2 - RE3) / (RE2 + RE3)','(S1 - N) / (20 * sqrt(S1 + N))'], [20, 50], 0] // vegetación
  });

  // Definir diccionario para áreas sin nieve
  var dictionary_no_snow = ee.Dictionary({
    '1_urban': ['(RE2 - RE3) / (RE2 + RE3)', 99, 'black', ['(G - S1) / (G + S1)', '(S1 - N) / (20 * sqrt(S1 + N))'], [99.9, 99.5], 0], // urbano
    '2_water': ['(G - S1) / (G + S1)', 99.9, 'blue',[], [], 0], // agua
    '3_soil': ['((S1 + R) - (N + B))/((S1 + R) + (N + B))', 70, 'yellow', ['(N - R)  / (N + R)'], [20],  0], // suelo
    '4_mountain': ['(S1 - N) / (20 * sqrt(S1 + N))', 99, 'ab9676', ['(RE2 - RE3) / (RE2 + RE3)'], [50], 0], // montaña
    '5_vegetation': ['(N - R)  / (N + R)', 85, 'green', [], [], 0] // vegetación
  });
  
  var predefinido = 0;
  
  // Seleccionar el diccionario y el clasificador predefinido según el valor de dict
  if(dict == 1){
    diccionario = dictionary_snow;
    predefinido = ee.Classifier.load('projects/pepe-javi-2024/assets/proyecto/classifier_snow');
  }
  else if(dict === 0){
    diccionario = dictionary_no_snow;
    predefinido = ee.Classifier.load('projects/pepe-javi-2024/assets/proyecto/classifier_no_snow');
  }
  else{
    diccionario = ee.Dictionary(ee.String(dict).decodeJSON());
  }
  
  // Añadir la leyenda al mapa
  leyenda.leyenda_new(mapa, diccionario);
  
  // Crear la cadena de localización para la función
  var loc_funcion = ee.String(admn).cat(" == '").cat(localizacion).cat("'");
  
  // Convertir la fecha de inicio a número y calcular la fecha de fin
  fecha_ini = ee.Number.parse(fecha_ini);  
  var fecha_fin = fecha_ini.add(1);  
  var fecha_ini_funcion = ee.String(fecha_ini).cat("-01-01");
  var fecha_fin_funcion = ee.String(fecha_fin).cat("-01-01");

  // Obtener información del diccionario
  ee.Dictionary(diccionario).getInfo();
  
  // Llamar a la función general de clasificación
  var clasificacion = funcion.funcion_general_clasificacion(mapa, loc_funcion.getInfo(), fecha_ini_funcion.getInfo(), fecha_fin_funcion.getInfo(), ee.Dictionary(diccionario), 999, 0.7, predefinido);

  // Mostrar mensaje si el área seleccionada es demasiado grande
  if(clasificacion == 1){
    var button = ui.Textbox({
    value: 'The selected area is too large for classification (+ 75.000 Km^2)',
    disabled: true,
    style: {
      width: '400px',
      border : '2px red',
      position: 'top-center',
      backgroundColor: '#db7d7d',
      textAlign: 'center'
    }
    });
    mapa.add(button);
  }
};