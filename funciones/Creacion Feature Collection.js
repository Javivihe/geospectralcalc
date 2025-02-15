// Creación de la Feature Collection empleada para generar datos train-test.


exports.definir_feature_collection = function(mapa, imagen, geometry, kilometros, expresion, percentile_1, nombre, lista_colores, expresion_2, percentile_2, valor_landscape, ver_capa) {

  // Creamos la banda principal. Con su mínimo, máximo y percentil.
  
  var banda_1 = imagen.expression(
  expresion, {
    'A': imagen.select('B1'),
    'B': imagen.select('B2'),
    'G': imagen.select('B3'),
    'R': imagen.select('B4'),
    'RE1': imagen.select('B5'),
    'RE2': imagen.select('B6'),
    'RE3': imagen.select('B7'),
    'N': imagen.select('B8'),
    'N2': imagen.select('B8A'),
    'S1': imagen.select('B11'),
    'S2': imagen.select('B12')
  }).rename([nombre]);
  
  // Obtener el valor mínimo de la banda principal
  var min_value = banda_1.reduceRegion({reducer: ee.Reducer.min(),
                               geometry: geometry,
                               scale: 800
                               }).get(nombre).getInfo();
                               
  // Obtener el valor máximo de la banda principal
  var max_value = banda_1.reduceRegion({reducer: ee.Reducer.max(),
                               geometry: geometry,
                               scale: 800
                               }).get(nombre).getInfo();
                               
  // Obtener el percentil de la banda principal
  var percentile_value = banda_1.reduceRegion({reducer: ee.Reducer.percentile([percentile_1]),
                               geometry: geometry,
                               scale: 800
                               }).get(nombre);

  percentile_1 = ee.Image.constant(percentile_value);

  // Creamos la banda secundaria, usada como filtro para la primera. Sacamos su percentil.

  var tope = ee.List(expresion_2).length().getInfo();
  
  var threshold = banda_1.gt(percentile_1);

  for (var i = 0; i<tope; i++) {
  
    var banda_2 = imagen.expression(
    ee.List(expresion_2).get(i).getInfo(), {
      'A': imagen.select('B1'),
      'B': imagen.select('B2'),
      'G': imagen.select('B3'),
      'R': imagen.select('B4'),
      'RE1': imagen.select('B5'),
      'RE2': imagen.select('B6'),
      'RE3': imagen.select('B7'),
      'N': imagen.select('B8'),
      'N2': imagen.select('B8A'),
      'S1': imagen.select('B11'),
      'S2': imagen.select('B12')
    }).rename(['filtro']);
  
    // Obtener el percentil de la banda secundaria
    var percentile_value_2 = banda_2.reduceRegion({reducer: ee.Reducer.percentile([ee.List(percentile_2).get(i).getInfo()]),
                               geometry: geometry,
                               scale: 800
                               }).get('filtro');
    var percentile_2_im = ee.Image.constant(percentile_value_2);
    
    // El threshold será la intersección de las dos bandas.
    threshold = threshold.and(banda_2.lt(percentile_2_im));
    
  }
    
   threshold = threshold.selfMask();
  

  // Aplicamos la máscara

  var ndwiVis = {min:min_value, max:max_value, palette: lista_colores};
  if (ver_capa){
    mapa.addLayer(banda_1.clip(geometry), ndwiVis, ee.String(nombre).cat('_full').getInfo());
    mapa.addLayer(threshold.clip(geometry), ndwiVis, nombre);

  }

  // Creamos la nueva feature collection con la máscara
  var vectors = threshold.reduceToVectors({
    geometry: geometry,
    crs: threshold.projection(),
    scale: 800,//I used  big number to reduce the effort
    maxPixels: 1e13,
    bestEffort: true,
    eightConnected: true
  });
  if(vectors.size().getInfo() > 0) { 
  // Generamos 30 puntos al azar dentro de nuestra nueva feature collection.
  // Mapeamos cada punto para añadir A CADA PUNTO (como un bucle) la feature.  
  var randomPoints = ee.FeatureCollection.randomPoints(vectors, 30)
      .map(function(f) {
          return f.set('landscape', valor_landscape);
      
      });
  return randomPoints;
  } else {
    return 'vacio';
  }

};