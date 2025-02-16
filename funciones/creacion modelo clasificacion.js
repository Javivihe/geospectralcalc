// Creación del modelo de clasificación.

var alos = ee.ImageCollection('JAXA/ALOS/AW3D30/V3_2');

exports.definir_modelo_clasificacion = function(mapa, imagen, geometry, coleccion ,dict_expresiones, semilla, training_ratio, paleta, sitio_string, fecha_ini, fecha_fin, predefinido) {
  print('predef', predefinido)
  // Mejorar la matriz, añadiendo más 'bands', pudiendo así no solo discernir 
  // entre colores si no entre 'categorías de elementos (vegetación, agua, etc.)
  
  // Usamos un diccionario de entrada para definir las nuevas bandas que deseamos implementar.
  var addIndices = function(key, value) {
    var banda = imagen.expression(
    value, {
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
    }).rename([key]);
    return banda;
  };
  
  // Aplicamos la función addIndices a cada entrada del diccionario dict_expresiones
  var composite = dict_expresiones.map(addIndices);
  
  // Obtenemos el número de entradas en el diccionario
  var tope = dict_expresiones.values().length().getInfo();
  
  // Añadimos cada banda generada a la imagen original
  for (var i = 0; i<Number(tope); i++) {
    imagen = imagen.addBands(composite.values().get(i));
  }
  
  composite = imagen;

  // Calculamos la pendiente y la elevación.
  var proj = alos.first().projection();
  
  var elevation = alos.select('DSM').mosaic()
    .setDefaultProjection(proj)
    .rename('elev');
  
  var slope = ee.Terrain.slope(elevation)
    .rename('slope');
  
  // Añadimos las bandas de elevación y pendiente a la imagen compuesta
  composite = composite.addBands(elevation).addBands(slope);
  
  if(predefinido === 0){
    // Cogemos la feature collection que hemos previamente creado.
    var gcp = coleccion;
    
    // Añadimos una columna random para dividir la feature en dos colecciones, validación y entrenamiento.
    // Ponemos una semilla al azar, variable semilla
    gcp = gcp.randomColumn('random', semilla);
    
    // La variable training_ratio manda a la hora de hacer un split en la feature collection.
    var trainingGcp = gcp.filter(ee.Filter.lt('random', training_ratio));
    var validationGcp = gcp.filter(ee.Filter.gte('random', training_ratio));
    
    // Superponemos el punto en la imagen para obtener datos de entrenamiento.
    var training = composite.sampleRegions({
      collection: trainingGcp,
      properties: ['landscape'],
      scale: 10,
      tileScale: 16
    });
    
    // Entrenamos el clasificador usando Random Forest
    var classifier = ee.Classifier.smileRandomForest(10)
    .train({
      features: training,  
      classProperty: 'landscape',
      inputProperties: composite.bandNames()
    });
  }
  else{
    // Usamos el clasificador predefinido si está disponible
    classifier = predefinido;
  }
  
  // Clasificamos la imagen compuesta
  var classified = composite.classify(classifier);

  var fecha_ini_red = ee.String(fecha_ini).slice(0,4);
  var fecha_fin_red = ee.String(fecha_fin).slice(0,4);
  
  // Añadimos la capa clasificada al mapa
  mapa.addLayer(classified.clip(geometry), {min: 0, max: 3, palette: paleta}, ee.String(sitio_string).cat(' ').cat(fecha_ini_red).cat('/').cat(fecha_fin_red).getInfo());
  // mapa.centerObject(geometry);

  // Exportamos la imagen clasificada a un asset
  Export.image.toAsset({
  image: classified.visualize({min: 0, max: 3, palette: paleta}),
  description: ee.String('Task_imagenes').cat(ee.String(sitio_string).getInfo().replace(/ /g, '')).cat('_').cat(fecha_ini).cat('_').cat(fecha_fin).getInfo(),
  assetId: ee.String('projects/pepe-javi-2024/assets/proyecto/Features_imagenes/').cat(ee.String(sitio_string).getInfo().replace(/ /g, '')).cat('_').cat(fecha_ini).cat('_').cat(fecha_fin).getInfo(),
  maxPixels: 1e13,
  scale: 100
  });

  //************************************************************************** 
  // Evaluación del modelo.
  //************************************************************************** 
  
  if(predefinido === 0){
    // Obtenemos datos de validación
    var validation = composite.sampleRegions({
      collection: validationGcp,
      properties: ['landscape'],
      scale: 10,
      tileScale: 16
    });
    
    // Clasificamos los datos de validación
    var test = validation.classify(classifier);
    
    // Calculamos la matriz de confusión
    var testConfusionMatrix = test.errorMatrix('landscape', 'classification');
    
    // Generamos todas estas métricas.
    // OJITO, al ser multiclase hay 4 categorías en cada métrica ! 
    print('Confusion Matrix', testConfusionMatrix);
    print('Test Accuracy', testConfusionMatrix.accuracy());
    print('Test CostumersAccuracy', testConfusionMatrix.consumersAccuracy());
    print('Test ProducersAccuracy', testConfusionMatrix.producersAccuracy());
    print('Test F1-Score', testConfusionMatrix.fscore());
  }
  return classified;

};