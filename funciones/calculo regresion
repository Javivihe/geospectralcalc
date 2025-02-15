// Creación del modelo de regresión empleado para entender la tendencia de las localidades preguardadas.

exports.calculo_regresion = function(panel, localizacion, feature) {
  // Filtra las características por la localización especificada
  feature = feature.filter(ee.Filter.eq('sitio', localizacion.getInfo()));
  var feature_lista = feature.toList(feature.size());

  // Obtiene el diccionario de áreas de la primera característica
  var areas_diccionario = ee.Dictionary(ee.Dictionary(ee.String(ee.Feature(feature_lista.get(0)).get('areas')).decodeJSON()).get('area_por_capa'));
  var keys_diccionario_areas = areas_diccionario.keys();

  // Itera sobre cada clave en el diccionario de áreas
  for (var j = 0; j < areas_diccionario.size().getInfo(); j++) {
    var array = ee.List([]);
    var array_fechas = ee.List([]);
    var array_areas = ee.List([]);

    // Itera sobre cada característica en la lista de características
    for (var i = 0; i < feature.size().getInfo(); i++) {
      var fecha = ee.String(ee.Feature(feature_lista.get(i)).get('fecha_inicio'));
      var area_1 = ee.Dictionary(ee.Dictionary(ee.String(ee.Feature(feature_lista.get(i)).get('areas')).decodeJSON()).get('area_por_capa')).get(keys_diccionario_areas.get(j));
      array = array.add([ee.Date(fecha).get('year'), area_1]);
      array_fechas = array_fechas.add(ee.Date(fecha).get('year'));
      array_areas = array_areas.add(area_1);
    }

    // Ordena el array por el primer elemento (año)
    var sortColumn = 0;
    var keyValues = array.map(function(inner) {
      return ee.List(inner).get(sortColumn);
    });
    array = array.sort(keyValues);

    // Realiza el ajuste lineal
    var linearFit = ee.Dictionary(array.reduce(ee.Reducer.linearFit()));
    var yInt = linearFit.get('offset'); // Intercepto en el eje y
    var slope = linearFit.get('scale'); // Pendiente

    // Calcula los valores ajustados
    var y2 = ee.Array(array_fechas.map(function(x) {
      var y = ee.Number(x).multiply(slope).add(yInt);
      return y;
    }));

    // Combina los valores reales y ajustados en un array
    var yArr = ee.Array.cat([array_areas, y2], 1);

    // Crea el gráfico de dispersión con los valores reales y ajustados
    var chart = ui.Chart.array.values({
      array: yArr,
      axis: 0,
      xLabels: array_fechas
    })
      .setChartType('ScatterChart')
      .setOptions({
        legend: { position: 'none' },
        hAxis: { 'title': 'Evolución temporal', format: '# Y' },
        vAxis: { 'title': ee.String(keys_diccionario_areas.get(j)).slice(2).cat(' (km^2)').getInfo(), minValue: 0 },
        series: {
          0: {
            pointSize: 5,
            dataOpacity: 1,
          },
          1: {
            pointSize: 0,
            lineWidth: 2,
          }
        }
      });

    // Añade el gráfico al panel
    panel.add(chart);
    // print(chart);
  }
};