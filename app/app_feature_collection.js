// Muestra la interfaz de la aplicación para el histórico de localidades previamente guardadas.

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var features_hist = ee.FeatureCollection("projects/pepe-javi-2024/assets/proyecto/Features"),
    feaures_imagenes = ee.ImageCollection("projects/pepe-javi-2024/assets/proyecto/Features_imagenes"),
    admin2 = ee.FeatureCollection("FAO/GAUL/2015/level2"),
    admin22 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

exports.app_feature_collection = function(){
  // IMPORTS
  var app_inicio = require('users/Pruebas_javi/geospectralcalc:app/app_inicio');
  var regresion = require('users/Pruebas_javi/geospectralcalc:funciones/calculo regresion');
  var leyenda = require('users/Pruebas_javi/geospectralcalc:funciones/leyenda');

  // Limpiar la interfaz de usuario y agregar un nuevo mapa
  ui.root.clear();
  var newMap = ui.Map();
  ui.root.add(newMap);
  
  var localizacion;
  var geometry;
  
  // Título y descripción del panel
  var panelTitle = ui.Label('Saved locations', {
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'black'
  });
  
  var panelDescription_1 = ui.Label('Here, you can select from a range of previously analyzed saved locations.');
  var panelDescription_2 = ui.Label("Additionally, you will observe the area's evolution over the years. While there may be outliers, the overall trend will still be apparent.");

  // Desplegables
  var statesDropdown = ui.Select({
    placeholder: 'Loading countries...',
    disabled: true,
    onChange: onStateChange
  });
  updateStates();
  
  var launchButton = ui.Button({
    label: 'Choose a country first',
    onClick: function(){
      lanzamiento(newMap, localizacion, geometry);
      print('Lanzamiento correcto');
    },
    disabled: true,
    style: {},
    imageUrl: {}
  });
  
  // Panel principal
  var panel = ui.Panel({
    widgets: [panelTitle, panelDescription_1, panelDescription_2, statesDropdown, launchButton],
    style: {
      width: '390px', 
      backgroundColor: 'white'
    },
    layout: ui.Panel.Layout.flow('vertical')
  });
  
  ui.root.insert(1, panel);
  
  // Panel gráficas
  var panel_graficas = ui.Panel({
    style: {
      backgroundColor: 'white',
      width: '500px'
    },
    layout: ui.Panel.Layout.flow('vertical')
  });

  var panelTitleGraficas = ui.Label('Areas', {
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'black'
  });
  
  panel_graficas.add(panelTitleGraficas);
  ui.root.insert(1, panel_graficas);

  // Funciones cambio de estado
  function updateLaunch() {
    launchButton.setLabel('Start analysis');
    launchButton.setDisabled(false);
  }
  
  function onStateChange(stateId) {
    panel_graficas.clear();
    panel_graficas.add(panelTitleGraficas);
    var admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2');
    var condicion_pais = ee.String('ADM1_NAME == "').cat(stateId).cat('"');
    updateLaunch(stateId);
    admin2 = admin2.filter(condicion_pais);
    newMap.clear();
    geometry = admin2.geometry();  
    newMap.centerObject(geometry);
    localizacion = stateId;
  }
    
  function updateStates() {
    var names_countries = features_hist.distinct('sitio').aggregate_array('sitio');
    names_countries.sort()
        .evaluate(function(states) {
        statesDropdown.items().reset(states);
        statesDropdown.setPlaceholder('Choose a state');
        statesDropdown.setDisabled(false);
      });
  }
  
  // Lanzamiento
  function lanzamiento(mapa, localizacion, geometry) {
    var imagen_filtrada = feaures_imagenes.filter(ee.Filter.stringContains('system:index', ee.String(localizacion).replace(' ', '', 'g').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n').replace('/', '_')));
    print(imagen_filtrada);
    var listOfImages = imagen_filtrada.toList(imagen_filtrada.size());
    print(listOfImages);
    leyenda.leyenda_saved(newMap, localizacion);

    var rgbVis_predefinida = {
      min: 0.0,
      max: 255,
      bands: ['vis-red', 'vis-green', 'vis-blue']
    };
    
    for (var p = 0; p < imagen_filtrada.size().getInfo(); p++) {
      var imagen_final = ee.Image(listOfImages.get(p)).clip(geometry);
      var fecha_ini = ee.String(ee.String(imagen_final.get('system:index')).split('_').get(-2)).slice(0,4);
      var fecha_fin = ee.String(ee.String(imagen_final.get('system:index')).split('_').get(-1)).slice(0,4);
    
      mapa.addLayer(imagen_final, rgbVis_predefinida, ee.String(localizacion).cat(' ').cat(fecha_ini).cat('/').cat(fecha_fin).getInfo());
      mapa.centerObject(geometry);
    }
 
    regresion.calculo_regresion(panel_graficas, ee.String(localizacion), features_hist);
  }
  
  // Botón volver atrás
  var button = ui.Button({
    label: 'Go back',
    onClick: function(){
      app_inicio.app_inicio();
    },
    disabled: false,
    style: {position: 'bottom-right'},
    imageUrl: {}
  });
  panel.add(button);
};