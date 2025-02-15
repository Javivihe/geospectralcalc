/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var features_hist = ee.FeatureCollection("projects/pepe-javi-2024/assets/proyecto/Features");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

exports.leyenda_saved = function(mapa, localizacion){
  // Establecer la posición del panel
  var legend = ui.Panel({
    style: {
      position: 'bottom-right',
      padding: '8px 15px'
    }
  });
   
  // Crear el título de la leyenda
  var legendTitle = ui.Label({
    value: 'Layers',
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
      }
  });
   
  // Añadir el título al panel
  legend.add(legendTitle);
   
  // Crear y estilizar una fila de la leyenda
  var makeRow = function(color, name) {
   
        // Crear la etiqueta que es la caja de color
        var colorBox = ui.Label({
          style: {
            backgroundColor: color,
            // Usar padding para dar altura y anchura a la caja
            padding: '8px',
            margin: '0 0 4px 0'
          }
        });
   
        // Crear la etiqueta con el texto descriptivo
        var description = ui.Label({
          value: name,
          style: {margin: '0 0 4px 6px'}
        });
   
        // Devolver el panel
        return ui.Panel({
          widgets: [colorBox, description],
          layout: ui.Panel.Layout.Flow('horizontal')
        });
  };
   
  // Paleta con los colores
  var palette_no_snow =['black', 'blue', 'yellow', 'ab9676', 'green'];
  var palette_snow =['white', 'blue', 'ab9676', 'yellow', 'black', 'green'];
  var palette;
  
  // Nombre de la leyenda
  var area = (features_hist.filter(ee.String("sitio == '").cat(localizacion).cat("'")).filter(("fecha_inicio == '2017-01-01'"))).aggregate_array('areas');
  var names = ee.Dictionary(ee.Dictionary(ee.String(area.get(0)).decodeJSON()).get('area_por_capa')).keys();
  if(names.contains('1_ndsi').getInfo() === true){
    palette = palette_snow;
  }
  else{
    palette = palette_no_snow;
  }
  
  // Añadir colores y nombres
  for (var i = 0; i < names.length().getInfo(); i++) {
    legend.add(makeRow(palette[i], names.get(i).getInfo()));
  }  
   
  // Añadir la leyenda al mapa (alternativamente se puede imprimir la leyenda en la consola)
  mapa.add(legend);
};

exports.leyenda_new = function(mapa, dict){
  // Establecer la posición del panel
  var legend = ui.Panel({
    style: {
      position: 'bottom-right',
      padding: '8px 15px'
    }
  });
   
  // Crear el título de la leyenda
  var legendTitle = ui.Label({
    value: 'Layers',
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
      }
  });
   
  // Añadir el título al panel
  legend.add(legendTitle);
   
  // Crear y estilizar una fila de la leyenda
  var makeRow = function(color, name) {
   
        // Crear la etiqueta que es la caja de color
        var colorBox = ui.Label({
          style: {
            backgroundColor: color,
            // Usar padding para dar altura y anchura a la caja
            padding: '8px',
            margin: '0 0 4px 0'
          }
        });
   
        // Crear la etiqueta con el texto descriptivo
        var description = ui.Label({
          value: name,
          style: {margin: '0 0 4px 6px'}
        });
   
        // Devolver el panel
        return ui.Panel({
          widgets: [colorBox, description],
          layout: ui.Panel.Layout.Flow('horizontal')
        });
  };
   
  // Paleta con los colores
  var names = dict.keys();
  var tercer_elemento = function(key, value) {
    return key, ee.List(value).get(2);
  };
  var palette = dict.map(tercer_elemento).values();

  // Añadir colores y nombres
  for (var i = 0; i < names.length().getInfo(); i++) {
    legend.add(makeRow(palette.get(i).getInfo(), names.get(i).getInfo()));
  }  
   
  // Añadir la leyenda al mapa (alternativamente se puede imprimir la leyenda en la consola)
  mapa.add(legend);
};