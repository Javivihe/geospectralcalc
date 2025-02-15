// Pantalla de información sobre los índices espectrales.

exports.app_spectral_indices = function(){

  var app_desglose_general = require('users/Pruebas_javi/geospectralcalc:app/app_desglose_general');

  // Limpiar la interfaz de usuario y agregar un nuevo mapa
  ui.root.clear();
  var newMap = ui.Map();
  ui.root.add(newMap);
  
  // Título
  var panelTitle = ui.Label('More information about spectral indices', {
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'black'
  });
  
  var style = {color: 'red', fontSize : '13px', textAlign: 'right', margin: '4px 4px 4px 40px'};
  var style_2 = {color: 'black', fontSize : '15px', textAlign: 'right', margin: '4px 4px 4px 20px', fontWeight: 'bold'};

  var panelDescription_1 = ui.Label('The science behind this app relies on the use of spectral indices, which are mathematical formulas derived from satellite imagery.');
  var panelDescription_2 = ui.Label('Since each state has a unique landscape, we differentiate terrain features based on whether the land has snow or not. However, because terrain features can vary there may be occasional errors or discrepancies in the classification');
  var panelDescription_3 = ui.Label("The main goal of this app is to enable users to experiment with different spectral indices and understand how they can influence land classification. To facilitate this, an intuitive dictionary-based system is included, allowing users to easily access and apply various spectral indices to their analysis.");
  var panelDescription_4 = ui.Label("Examples of spectral indices here.").setUrl("https://github.com/awesome-spectral-indices/awesome-spectral-indices/blob/main/output/spectral-indices-table.csv");
  var panelDescription_5 = ui.Label("The default dictionaries are the following:");

  var dictionary_explanation_1 = ui.Label("The dictionary works as follows:");
  var dictionary_explanation_2 = ui.Label('{"NAME" : [ "INDEX", PERCENTILE (GREATER THAN), "COLOR", [ ARRAY OF NON DESIRED INDEXES ],', {color: "blue", fontSize : "13px", textAlign: "right", margin: "4px 4px 4px 40px"});
  var dictionary_explanation_3 = ui.Label(' [ PERCENTILES (LOWER THAN) ], BOOLEAN - WHETHER YOU DESIRE TO SEE THE LAYER ON ITS OWN]}', {color: "blue", fontSize : "13px", textAlign: "right", margin: "4px 4px 4px 40px"});

  // Diccionario 1
  var opening_1 = ui.Label("State with no snow: {", style_2);
  var d_1_1 = ui.Label('"1_ndbr2" : [ "(RE2 - RE3) / (RE2 + RE3)", 99, "black", [ "(G - S1) / (G + S1)", "(S1 - N) / (20 * sqrt(S1 + N))" ], [ 99.9, 99.5 ], 0], // urban', style);
  var d_1_2 = ui.Label('"2_mndwi": ["(G - S1) / (G + S1)", 99.9, "blue",[ ], [ ], 0], // water', style);
  var d_1_3 = ui.Label('"3_bi": ["((S1 + R) - (N + B))/((S1 + R) + (N + B))", 70, "yellow", ["(N - R)  / (N + R)"], [20],  0], // soil', style);
  var d_1_4 = ui.Label('"4_kbri": ["(S1 - N) / (20 * sqrt(S1 + N))", 99, "ab9676", ["(RE2 - RE3) / (RE2 + RE3)"], [50], 0], // mountain', style);
  var d_1_5 = ui.Label('"5_ndvi": ["(N - R)  / (N + R)", 85, "green", [ ], [ ], 0], // vegetation', style);
  var closing_1 = ui.Label("}", style_2);
    
  // Diccionario 2
  var opening_2 = ui.Label("State with snow: {", style_2);
  var d_2_1 = ui.Label('"1_ndsi": ["(G - S1) / (G + S1)", 99, "white", ["(G - N) / (G + N)"], [99], 0], // snow', style);
  var d_2_2 = ui.Label('"2_mndwi": ["(G - N) / (G + N)", 99.9, "blue",["(RE2 - RE3) / (RE2 + RE3)", "(N - R)  / (N + R)", "((S1 + R) - (N + B))/((S1 + R) + (N + B))"], [99.9, 99, 99], 0], // water', style);
  var d_2_3 = ui.Label('"3_kbri": ["(S1 - N) / (20 * sqrt(S1 + N))", 80, "ab9676", ["(RE2 - RE3) / (RE2 + RE3)"], [40], 1], // mountain', style);
  var d_2_4 = ui.Label('"4_bi": ["((S1 + R) - (N + B))/((S1 + R) + (N + B))", 50, "yellow", ["(N - R)  / (N + R)"], [10],  1], // soil,', style);
  var d_2_5 = ui.Label('"5_ndbr2": ["(RE2 - RE3) / (RE2 + RE3)", 90, "black", ["(G - S1) / (G + S1)", "(S1 - N) / (20 * sqrt(S1 + N))"], [99.9, 35], 0], // urban', style);
  var d_2_6 = ui.Label('"6_ndvi": ["(N - R)  / (N + R)", 90, "green", ["(RE2 - RE3) / (RE2 + RE3)","(S1 - N) / (20 * sqrt(S1 + N))"], [20, 50], 0], // vegetation', style);
  var closing_2 = ui.Label("}", style_2);
    
  // Panel principal
  var panelMain = ui.Panel({
    widgets: [panelTitle, panelDescription_1, panelDescription_2, panelDescription_3, panelDescription_4, 
      dictionary_explanation_1, dictionary_explanation_2, dictionary_explanation_3,
      panelDescription_5,
      opening_1, d_1_1, d_1_2, d_1_3, d_1_4, d_1_5, closing_1,
      opening_2, d_2_1, d_2_2, d_2_3, d_2_4, d_2_5, d_2_6, closing_2
    ],
    style: {
      width: '1000px', 
      backgroundColor: 'white'
    },
    layout: ui.Panel.Layout.flow('vertical')
  });
  
  ui.root.add(panelMain);
    
  // Botón volver atrás
  var button = ui.Button({
    label: 'Go back',
    onClick: function(){
      app_desglose_general.app_desglose_general();
    },
    disabled: false,
    style: {position: 'bottom-right'},
    imageUrl: {}
  });
  panelMain.add(button);
};