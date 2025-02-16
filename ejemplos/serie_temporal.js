// Script para mostrar ejemplos directos de clasificación, mostrando el evolutivo a lo largo de sus años.

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var features_hist = ee.FeatureCollection("projects/pepe-javi-2024/assets/proyecto/Features"),
    admin2 = ee.FeatureCollection("FAO/GAUL/2015/level2"),
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var funcion = require('users/Pruebas_javi/geospectralcalc:funciones/funcion general');

// Definir el diccionario de índices espectrales
var dictionary = ee.Dictionary({
    '1_ndbr2': ['(RE2 - RE3) / (RE2 + RE3)', 99, 'black', ['(G - S1) / (G + S1)', '(S1 - N) / (20 * sqrt(S1 + N))'], [99.9, 99.5], 0], // urbano
    '2_mndwi': ['(G - S1) / (G + S1)', 99.9, 'blue', [], [], 0], // agua
    '3_bi': ['((S1 + R) - (N + B))/((S1 + R) + (N + B))', 70, 'yellow', ['(N - R) / (N + R)'], [20], 0], // suelo
    '4_kbri': ['(S1 - N) / (20 * sqrt(S1 + N))', 99, 'ab9676', ['(RE2 - RE3) / (RE2 + RE3)'], [50], 0], // montaña
    '5_ndvi': ['(N - R) / (N + R)', 85, 'green', [], [], 0] // vegetación

    
    // '1_ndbr2': ['(RE2 - RE3) / (RE2 + RE3)', 99, 'black', ['(G - S1) / (G + S1)', '(S1 - N) / (20 * sqrt(S1 + N))'], [99.9, 99.9], 0], // urban
    // '2_mndwi': ['(G - S1) / (G + S1)', 99.9, 'blue',[], [], 0], // water
    // '3_bi': ['((S1 + R) - (N + B))/((S1 + R) + (N + B))', 70, 'yellow', ['(N - R)  / (N + R)'], [20],  0], // soil,
    // '4_kbri': ['(S1 - N) / (20 * sqrt(S1 + N))', 99, 'ab9676', ['(RE2 - RE3) / (RE2 + RE3)'], [50], 0], // mountain
    // '5_ndvi': ['(N - R)  / (N + R)', 85, 'green', [], [], 0], // vegetation


    // '5_ndbr2': ['(RE2 - RE3) / (RE2 + RE3)', 90, 'black', ['(G - S1) / (G + S1)', '(S1 - N) / (20 * sqrt(S1 + N))'], [99.9, 35], 1], // urban
    // '2_mndwi': ['(G - N) / (G + N)', 99.9, 'blue',['(RE2 - RE3) / (RE2 + RE3)', '(N - R)  / (N + R)', '((S1 + R) - (N + B))/((S1 + R) + (N + B))'], [99.9, 99, 99], 0], // water
    // '4_bi': ['((S1 + R) - (N + B))/((S1 + R) + (N + B))', 50, 'yellow', ['(N - R)  / (N + R)'], [10],  1], // soil,
    // '3_kbri': ['(S1 - N) / (20 * sqrt(S1 + N))', 80, 'ab9676', ['(RE2 - RE3) / (RE2 + RE3)'], [40], 1], // mountain
    // '6_ndvi': ['(N - R)  / (N + R)', 90, 'green', ['(RE2 - RE3) / (RE2 + RE3)','(S1 - N) / (20 * sqrt(S1 + N))'], [20, 50], 0], // vegetation
    // '1_ndsi': ['(G - S1) / (G + S1)', 99, 'white', ['(G - N) / (G + N)'], [99], 0] // snow

});

ui.root.clear();
var newMap = ui.Map();
ui.root.add(newMap);
var feature_areas = features_hist;

var names_countries = admin2.aggregate_array('ADM0_NAME').distinct();
print(names_countries);

var names_spain = admin2.filter('ADM0_NAME == "Spain"').aggregate_array('ADM1_NAME').distinct();
var tope = names_spain.length().getInfo();
var predefinido_no_nieve = ee.Classifier.load('projects/pepe-javi-2024/assets/proyecto/classifier_no_snow');
var predefinido_nieve = ee.Classifier.load('projects/pepe-javi-2024/assets/proyecto/classifier_snow');

// Cada valor de i será una localización distinta de España.
for (var i = 9; i < 10; i++) {
  print(names_spain.get(i));

  // Iterar sobre los años
  for (var l = 2017; l < 2024; l++) {
    var l_1 = l + 1;
    var fecha_ini = ee.String(ee.Number(l)).cat("-01-01");
    var fecha_fin = ee.String(ee.Number(l_1)).cat("-01-01");
  
    print(fecha_ini);
    print(fecha_fin);
    
    var feature = funcion.funcion_general_clasificacion(newMap, ee.String("ADM1_NAME == '").cat(names_spain.get(i).getInfo()).cat("'"), fecha_ini.getInfo(), fecha_fin.getInfo(), dictionary, 999, 0.8, predefinido_no_nieve);

    try {
      feature_areas = feature_areas.merge(feature);
    } catch (exceptionVar) {
      print(ee.String('No se pudo importar ').cat(names_spain.get(i)).cat(' en el año ').cat(fecha_ini));
    }
  }
}