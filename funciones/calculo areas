// Funciones para calcular áreas de superficies clasificadas.
// Filtra la imagen clasificada en función de un valor concreto y calcula el área de la superficie resultante.

exports.calculo_areas = function(image, geometry, nombre, eq) {
  // Recorta la imagen a la geometría especificada y filtra por el valor 'eq'
  var capa = image.clip(geometry).eq(eq);
  
  // Multiplica la capa filtrada por el área de cada píxel para obtener el área total
  var areaImage = capa.multiply(ee.Image.pixelArea());
  
  // Reduce la región para sumar todas las áreas de píxeles
  var area = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    scale: 600,
    maxPixels: 1e10
  });

  // Convierte el área de metros cuadrados a kilómetros cuadrados y redondea
  var AreaSqKm = ee.Number(area.get('classification')).divide(1e6).round();
  // print(nombre, AreaSqKm);
  return AreaSqKm;
};