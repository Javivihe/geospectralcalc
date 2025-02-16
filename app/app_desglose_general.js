// Muestra la interfaz de la aplicación para clasificar una nueva localización desde cero.

exports.app_desglose_general = function(){
  // IMPORTS
  var app_inicio = require('users/Pruebas_javi/geospectralcalc:app/app_inicio');
  var app_spectral_indices = require('users/Pruebas_javi/geospectralcalc:app/app_spectral_indices');
  var llamada = require('users/Pruebas_javi/geospectralcalc:funciones/llamada');
  
  // Limpiar la interfaz de usuario y agregar un nuevo mapa
  ui.root.clear();
  var newMap = ui.Map();
  ui.root.add(newMap);

  var admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2');
  
  var loc;
  var fec_ini;
  var admn;
  
  // Dropdown de país, estado, comunidad, año
  var statesDropdown = ui.Select({
    placeholder: 'Loading countries...',
    disabled: true,
    style: { width: '360px' },
    onChange: onStateChange
  });
  updateStates();
  
  var districtsDropdown = ui.Select({
    placeholder: 'Choose a country first',
    disabled: true,
    style: { width: '360px' },
    onChange: onDistrictChange
  });
  
  var communitiesDropdown = ui.Select({
    placeholder: 'Choose a state first',
    disabled: true,
    style: { width: '360px' },
    onChange: onCommunitiesChange
  });

  var yearsDropdown = ui.Select({
    placeholder: 'Choose a community first',
    disabled: true,
    style: { width: '360px' },
    onChange: onYearChange
  });
  
  // Botón de lanzamiento
  var launchButton = ui.Button({
    label: 'Choose a year first',
    onClick: function(){
      try{
        llamada.llamada(loc, admn, fec_ini, dict, newMap);
        print('Lanzamiento correcto');
      } catch (exceptionVar){
        var button = ui.Textbox({
          value: 'There was a problem with the dictionary, try another one.',
          disabled: true,
          style: {
            width: '360px',
            border : '2px red',
            position: 'top-center',
            backgroundColor: '#db7d7d',
            textAlign: 'center'
          }
        });
        newMap.add(button);
      }
    },
    disabled: true,
    style: { width: '360px' },
    imageUrl: {}
  });
  
  // Título y descripción del panel
  var panelTitle = ui.Label('New calculation', {
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'black'
  });
  
  var panelDescription = ui.Label('By selecting a country, a state (or region), and a year, the app allows you to classify a specific terrain using spectral indices from satellite imagery', {});
  
  var panelAdvertencia = ui.Label('Using a custom dictionary may take a while...', {
    fontWeight: 'bold',
    color: 'red'
  });
  
  // Botón más Info
  var new_dict;

  var buttonmasInfo = ui.Button({
    label: 'More information',
    onClick: function(){
      app_spectral_indices.app_spectral_indices();
    },
    disabled: false,
    style: {position: 'bottom-right'},
    imageUrl: {}
  });

  // Botón nieve
  var check_nieve = ui.Checkbox({
    label: 'Snow',
    value: false,
  });
  var dict = 0;
  
  var update_checkbox = function(){
    if (dict == 1){
      dict = 0;
    }
    else{
      dict = 1;
    }
  };

  check_nieve.onChange(update_checkbox);

  // Diccionario personalizado
  var customDescription = ui.Label("Here you can implement your own dictionary. Use '{' and '}' too.");

  var textbox = ui.Textbox({value:'{"name": ["index", percentile, "color", [ array ], [ percentiles ], 0]}'});
  textbox.style().set({width: '360px'});

  var button_desglose = ui.Button({
    label: 'Save dictionary',
    onClick: function(){
      print(textbox.getValue());
      dict = textbox.getValue();
      
      var button = ui.Textbox({
        value: 'Dictionary updated',
        disabled: true,
        style: {
          width: '150px',
          border : '2px green',
          position: 'top-center',
          backgroundColor: '#a6f078',
          textAlign: 'center'
        }
      });
      newMap.add(button);
      check_nieve.setDisabled(1);
      check_nieve.setValue(0);
      button_desglose.setDisabled(1);
      textbox.setDisabled(1);
    },
    disabled: false,
    style: { width: '360px' },
    imageUrl: {}
  });

  // Panel principal
  var panel = ui.Panel({
    widgets: [panelTitle, panelDescription, statesDropdown, districtsDropdown, communitiesDropdown, yearsDropdown, check_nieve, launchButton, customDescription, panelAdvertencia, textbox, button_desglose, buttonmasInfo],
    style: {
      width: '390px', 
      backgroundColor: 'white'
    },
    layout: ui.Panel.Layout.flow('vertical')
  });
  ui.root.insert(1, panel);
  
  // Funciones de cambio de estado
  function onStateChange(stateId) {
    var admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2');
    var condicion_pais = ee.String('ADM0_NAME == "').cat(stateId).cat('"');
    admin2 = admin2.filter(condicion_pais);
    newMap.clear();
    var geometry = admin2.geometry();  
    newMap.centerObject(geometry);
    if((admin2.aggregate_array('ADM1_NAME').distinct()).get(0).getInfo() == 'Administrative unit not available'){
      updateYears();
      admn = 'ADM0_NAME';
      loc = stateId;
      districtsDropdown.items().reset();
      districtsDropdown.setPlaceholder('No state available');
      districtsDropdown.setDisabled(true);
      
      communitiesDropdown.items().reset();
      communitiesDropdown.setPlaceholder('No community available');
      communitiesDropdown.setDisabled(true);

      launchButton.setDisabled(true);
    }
    else{
      updateDistricts(stateId, condicion_pais);
      
      communitiesDropdown.items().reset();
      communitiesDropdown.setPlaceholder('Choose a state first');
      communitiesDropdown.setDisabled(true);
      
      yearsDropdown.items().reset();
      yearsDropdown.setPlaceholder('Choose a community first');
      yearsDropdown.setDisabled(true);

      launchButton.setDisabled(true);
    }
  }

  function onDistrictChange(districtId) {
    var admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2');
    var condicion_comunidad = ee.String('ADM1_NAME == "').cat(districtId).cat('"');
    admin2 = admin2.filter(condicion_comunidad);
    newMap.clear();
    var geometry = admin2.geometry();  
    newMap.centerObject(geometry);
    print('selected state', districtId);

    if((admin2.aggregate_array('ADM2_NAME').distinct()).get(0).getInfo() == 'Administrative unit not available'){
      updateYears();
      admn = 'ADM1_NAME';
      loc = districtId;
      communitiesDropdown.items().reset();
      communitiesDropdown.setPlaceholder('No community available');
      communitiesDropdown.setDisabled(true);
      
      launchButton.setDisabled(true);
    }
    else{
      updateCommunities(districtId, condicion_comunidad);

      yearsDropdown.items().reset();
      yearsDropdown.setPlaceholder('Choose a community first');
      yearsDropdown.setDisabled(true);
      
      launchButton.setDisabled(true);
    }
  }
  
  function onCommunitiesChange(communityId) {
    var admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2');
    var condicion_barrio = ee.String('ADM2_NAME == "').cat(communityId).cat('"');
    admin2 = admin2.filter(condicion_barrio);
    newMap.clear();
    var geometry = admin2.geometry();  
    admn = 'ADM2_NAME';
    launchButton.setDisabled(true);
    updateYears();
    print('selected community', communityId);
    loc = communityId;
  }
    
  function onYearChange(year) {
    print('selected year', year);
    fec_ini = year;
    updateLaunch();
  }
  
  function updateStates() {
    var names_countries = admin2.aggregate_array('ADM0_NAME').distinct();
    names_countries.sort()
        .evaluate(function(states) {
        statesDropdown.items().reset(states);
        statesDropdown.setPlaceholder('Choose a country');
        statesDropdown.setDisabled(false);
      });
  }
  
  function updateDistricts(stateId, state) {
    // Antes de que los estados se carguen
    districtsDropdown.items().reset([]);
    districtsDropdown.setPlaceholder('Loading states...');
    districtsDropdown.setDisabled(true);
    
    admin2.filter(state)
      .aggregate_array('ADM1_NAME').distinct()
      .evaluate(function(districts) {
        // Después de que los estados se carguen
        districtsDropdown.items().reset(districts);
        districtsDropdown.setPlaceholder('Choose a state');
        districtsDropdown.setDisabled(false);
      });
  }
  
  function updateCommunities(stateId, state) {
    // Antes de que las comunidades se carguen
    communitiesDropdown.items().reset([]);
    communitiesDropdown.setPlaceholder('Loading communities...');
    communitiesDropdown.setDisabled(true);
    
    admin2.filter(state)
      .aggregate_array('ADM2_NAME').distinct()
      .evaluate(function(districts) {
        // Después de que las comunidades se carguen
        communitiesDropdown.items().reset(districts);
        communitiesDropdown.setPlaceholder('Choose a community');
        communitiesDropdown.setDisabled(false);
      });
  }
  
  function updateYears() {
    yearsDropdown.items().reset(['2017','2018','2019','2020','2021','2022','2023']);
    yearsDropdown.setPlaceholder('Choose a year');
    yearsDropdown.setDisabled(false);
  }
  
  function updateLaunch() {
    launchButton.setLabel('Start analysis');
    launchButton.setDisabled(false);
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