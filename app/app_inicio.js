// Muestra la interfaz de la aplicación de la pantalla de inicio, donde se elegirá si clasificar una 
// nueva superficie desde cero o el histórico de un lugar previamente guardado

exports.app_inicio = function(){
  var app_desglose_general = require('users/Pruebas_javi/geospectralcalc:app/app_desglose_general');
  var app_feature_collection = require('users/Pruebas_javi/geospectralcalc:app/app_feature_collection');

  // Limpiar la interfaz de usuario y agregar un nuevo mapa
  ui.root.clear();
  var newMap = ui.Map();
  ui.root.add(newMap);
  
  // Panel principal
  var panelMain = ui.Panel();
  
  panelMain.style().set({
    width: '390px',
    position: 'top-center'
  });
  
  ui.root.add(panelMain);
  
  // Título
  var panelTitle = ui.Label('GeoSpectralCalc', {
    fontWeight: 'bold',
    fontSize: '25px',
    color: 'black'
  });
  
  panelMain.add(panelTitle);
  
  // Descripción
  var description_1 = ui.Label('GeoSpectralCalc is an app that classifies land cover using spectral indices, such as NDVI and MNDWI using satellite imagery.');
  var description_2 = ui.Label('Whether you’re analyzing forests, water bodies, urban areas, or more, GeoSpectralCalc makes it easy to classify and visualize land cover with high accuracy.');
  var description_3 = ui.Label('There are two key features about this app:');
  var description_4 = ui.Label('1. It is easy to create and customize your own classification layers to suit any surface or terrain using a dictionary system that is explained in more detail later', {margin: '4px 4px 4px 20px'});
  var description_5 = ui.Label('2. You can track changes in specific areas over time.', {margin: '4px 4px 4px 20px'});

  // Botón para clasificar una nueva localización
  var button_desglose = ui.Button({
    label: 'Classify new location',
    onClick: function(){
      app_desglose_general.app_desglose_general();
    },
    disabled: false,
    style: { width: '360px' },
    imageUrl: {}
  });
  
  // Botón para ver localizaciones guardadas
  var button_feature = ui.Button({
    label: 'Saved locations',
    onClick: function(){
      app_feature_collection.app_feature_collection();
    },
    disabled: false,
    style: { width: '360px' },
    imageUrl: {}
  });

  // Agregar descripciones y botones al panel principal
  panelMain.add(description_1).add(description_2).add(description_3).add(description_4).add(button_desglose).add(description_5).add(button_feature);
};