// Script para mostrar ejemplos directos de clasificación, eligiendo un diccionario específico y una localización y año concretos.

var funcion = require('users/Pruebas_javi/geospectralcalc:funciones/funcion general');

// Definir el diccionario de índices espectrales
var dictionary = ee.Dictionary({
    // '1_ndsi': ['(G - S1) / (G + S1)', 99, 'white', ['(G - N) / (G + N)', '(RE2 - RE3) / (RE2 + RE3)'], [99, 99], 0], // snow
    // '3_mndwi': ['(G - N) / (G + N)', 99.9, 'blue',['(RE2 - RE3) / (RE2 + RE3)', '(N - R)  / (N + R)', '((S1 + R) - (N + B))/((S1 + R) + (N + B))'], [99.9, 99, 99], 0], // water
    // '4_kbri': ['(S1 - N) / (20 * sqrt(S1 + N))', 80, 'ab9676', ['(RE2 - RE3) / (RE2 + RE3)'], [50], 0], // mountain
    // '5_bi': ['((S1 + R) - (N + B))/((S1 + R) + (N + B))', 50, 'yellow', ['(N - R)  / (N + R)'], [10],  0], // soil,
    // '2_ndbr2': ['(RE2 - RE3) / (RE2 + RE3)', 99, 'black', ['(G - S1) / (G + S1)', '(S1 - N) / (20 * sqrt(S1 + N))'], [99.9, 55], 0], // urban
    // '6_ndvi': ['(N - R)  / (N + R)', 99.9, 'green', ['(RE2 - RE3) / (RE2 + RE3)','(S1 - N) / (20 * sqrt(S1 + N))'], [20, 50], 0]// vegetation
    
    // "1_ndbr2" : [ "(RE2 - RE3) / (RE2 + RE3)", 99, "black", [ "(G - S1) / (G + S1)", "(S1 - N) / (20 * sqrt(S1 + N))", "((S1 + R) - (N + B))/((S1 + R) + (N + B))" ], [ 99.5, 99.5, 20 ], 0], // urban
    // "2_mndwi": ["(G - S1) / (G + S1)", 99.9, "blue",[ "(RE2 - RE3) / (RE2 + RE3)" ], [ 99.5 ], 0], // water
    // "3_bi": ["((S1 + R) - (N + B))/((S1 + R) + (N + B))", 70, "yellow", ["(N - R) / (N + R)"], [20], 0], // soil
    // "4_kbri": ["(S1 - N) / (20 * sqrt(S1 + N))", 99, "ab9676", ["(RE2 - RE3) / (RE2 + RE3)"], [50], 0], // mountain
    // "5_ndvi": ["(N - R) / (N + R)", 75, "green", ["(RE2 - RE3) / (RE2 + RE3)" ], [90 ], 0], // vegetation

    // "4_ndbr2" : [ "(RE2 - RE3) / (RE2 + RE3)", 99, "black", [ "(G - S1) / (G + S1)", "(S1 - N) / (20 * sqrt(S1 + N))", "((S1 + R) - (N + B))/((S1 + R) + (N + B))" ], [ 99.5, 99.5, 20 ], 0], // urban
    // "2_mndwi": ["(G - S1) / (G + S1)", 99.9, "blue",[ "(RE2 - RE3) / (RE2 + RE3)" ], [ 99.5 ], 0], // water
    
    "1_ndsi": ["((S1 - N) - (S1 + N))/((S1 + R) + (N + B))", 70, "yellow", ["(N - R) / (N + R)"], [20], 0], // soil
    "2_kbri": ["(S1 - N) / (20 * sqrt(S1 + N))", 90, "ab9676", ["(RE2 - RE3) / (RE2 + RE3)"], [50], 0], // mountain
    "3_ndvi": ["(N - S1) / (N + S1)", 95, "green", ["(RE2 - RE3) / (RE2 + RE3)", "((S1 - N) - (S1 + N))/((S1 + R) + (N + B))" ], [90, 30 ], 1], // vegetation

  });

// Crear un nuevo mapa y agregarlo a la interfaz de usuario
var newMap = ui.Map();
ui.root.add(newMap);

// Cargar clasificadores predefinidos
var predefinido_no_nieve = ee.Classifier.load('projects/pepe-javi-2024/assets/proyecto/classifier_no_snow');
var predefinido_nieve = ee.Classifier.load('projects/pepe-javi-2024/assets/proyecto/classifier_snow');

// Ejecutar la función de clasificación general con los parámetros especificados
var clasificacion = funcion.funcion_general_clasificacion(newMap, "ADM2_NAME == 'Jerada'", '2019-01-01', '2020-01-01', dictionary, 999, 0.6, 0);

// Ejemplo comentado de ejecución de la función de clasificación general
// var clasificacion = funcion.funcion_general_clasificacion(newMap, "ADM1_NAME == 'Comunidad de Madrid'", '2022-01-01', '2023-01-01', dictionary, 999, 0.8, predefinido_no_nieve);