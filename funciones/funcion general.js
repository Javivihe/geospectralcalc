/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var admin2 = ee.FeatureCollection("FAO/GAUL/2015/level2"),
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED"),
    features_hist = ee.FeatureCollection("projects/pepe-javi-2024/assets/proyecto/Features"),
    feaures_imagenes = ee.ImageCollection("projects/pepe-javi-2024/assets/proyecto/Features_imagenes");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// Importar módulos requeridos
var feature = require('users/Pruebas_javi/geospectralcalc:funciones/Creacion Feature Collection');
var clasificacion = require('users/Pruebas_javi/geospectralcalc:funciones/creacion modelo clasificacion');
var areas = require('users/Pruebas_javi/geospectralcalc:funciones/calculo areas');
var regresion = require('users/Pruebas_javi/geospectralcalc:funciones/calculo regresion');

/////////////////////////////////////////////////////////////////////////
// FUNCIÓN GENERAL QUE CREA FEATURE COLLECTION Y MODELO DE CLASIFICACIÓN.
/////////////////////////////////////////////////////////////////////////

exports.funcion_general_clasificacion = function(mapa, localizacion, fecha_ini, fecha_fin, dict, semilla, training_ratio, predefinido) {
  // Código comentado para copiar y eliminar assets
  // try{
  // ee.data.copyAsset('projects/pepe-javi-2024/assets/Features_aux', 'projects/pepe-javi-2024/assets/proyecto/Features', 1);
  // ee.data.deleteAsset('projects/pepe-javi-2024/assets/Features_aux');
  // } catch (exceptionVar){
  //   print('No existe aux');
  // }
  
  // Funciones adicionales que 'recortan' el diccionario de entrada
  var primer_elemento = function(key, value) {
    return key, ee.List(value).get(0);
  };
  
  var tercer_elemento = function(key, value) {
    return key, ee.List(value).get(2);
  };
  
  // Primero mira si se ha cargado previamente la información solicitada
  var sitio_string = ee.String(ee.List(localizacion.split(' == ')).get(1)).replace("'", '').replace("'", '');
  var flag = 0;
  var listOfImages = feaures_imagenes.toList(feaures_imagenes.size());
  
  // Definir la localización y el espacio temporal
  var admin2_geo = admin2.filter(localizacion);
  var geometry = admin2_geo.geometry();
  
  // Código comentado para visualización predefinida
  // var rgbVis_predefinida = {
  //   min: 0.0,
  //   max: 255,
  //   bands: ['vis-red', 'vis-green', 'vis-blue']
  //   };
  
  // Código comentado para verificar características históricas
  // var table_feature = features_hist.toList(10000);
  // for (var l = 0; l<features_hist.size().getInfo(); l++) {
  //   var cond_1 = ((ee.Feature(table_feature.get(l))).get('sitio').getInfo() == sitio_string.getInfo());
  //   var cond_2 = ((ee.Feature(table_feature.get(l))).get('fecha_inicio').getInfo() == fecha_ini);
  //   var cond_3 = ((ee.Feature(table_feature.get(l))).get('fecha_fin').getInfo() == fecha_fin);
  //   if (cond_1 && cond_2 && cond_3) {
  //     var string_capa = sitio_string.cat(' ').cat(fecha_ini).cat(' ').cat(fecha_fin);
  //     for (var p = 0; p<feaures_imagenes.size().getInfo(); p++) {
  //       if (sitio_string.replace(' ', '', 'g').cat('_').cat(fecha_ini).cat('_').cat(fecha_fin).getInfo() == ee.Image(ee.Image(listOfImages.get(p)).get('system:index')).getInfo()) {
  //         var imagen_final = ee.Image(listOfImages.get(p)).clip(geometry);
  //         print('imagen', imagen_final)
  //         mapa.addLayer(imagen_final, rgbVis_predefinida, sitio_string.cat(' ').cat(fecha_ini.slice(0,4)).cat('/').cat(fecha_fin.slice(0,4)).getInfo());
  //         mapa.centerObject(geometry);
  //         // regresion.calculo_regresion(sitio_string, features_hist);
  //         // mapa.addLayer(ee.Image(feaures_imagenes.get('imagen')).clip(geometry), rgbVis, ee.String(string_capa).getInfo());
  //         flag = 1;
  //         break;
  //       }
  //     }
  //     flag = 1;
  //     break;
  //   } 
  // }
  
  if (flag === 0) {
    // Definir la localización y el espacio temporal
    var filtered = s2
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
      .filter(ee.Filter.date(fecha_ini, fecha_fin))
      .filter(ee.Filter.bounds(geometry))
      .select('B.*');
      
    var composite = filtered.median();
    
    // Añadir la capa sin filtros para comparar
    var rgbVis = {
      min: 0.0,
      max: 3000,
      bands: ['B4', 'B3', 'B2'],
    };
    
    mapa.addLayer(composite.clip(geometry), rgbVis, 'Satellite');
    
    // Crear la feature collection a través del diccionario y su respectiva función
    var cityArea = geometry.area();
    var cityAreaSqKm = ee.Number(cityArea).divide(1e6).round();
    
    if(cityAreaSqKm.getInfo() > 75000){
      print('Demasiado grande');
      return 1;
    }
  
    var tope = ee.Dictionary(dict).values().length().getInfo();
  
    if(predefinido === 0){
      for (var i = 0; i<Number(tope); i++) {
        var parte = feature.definir_feature_collection(mapa, composite, geometry, cityAreaSqKm.getInfo(), (ee.List(dict.get(dict.keys().get(i)))).get(0).getInfo(), (ee.List(dict.get(dict.keys().get(i)))).get(1).getInfo(), ee.String(dict.keys().get(i)).getInfo(), ['white', (ee.List(dict.get(dict.keys().get(i)))).get(2).getInfo()],  (ee.List(dict.get(dict.keys().get(i)))).get(3).getInfo(), (ee.List(dict.get(dict.keys().get(i)))).get(4).getInfo(), i, (ee.List(dict.get(dict.keys().get(i)))).get(5).getInfo());
        if(parte !== 'vacio'){
          if (typeof gcps == 'undefined') {
            var gcps = parte;
          } else{
            gcps = gcps.merge(parte);
          }
        }
      }
    }
    else{
      gcps = 'NADA';
    }
  
    // Código comentado para centrar y agregar capa gcps
    // mapa.centerObject(geometry);
    // mapa.addLayer(gcps, {}, 'gcps');
    
    // Generar el modelo de clasificación y sus respectivas métricas
    var imagen_clasificada = clasificacion.definir_modelo_clasificacion(mapa, composite, geometry, gcps, dict.map(primer_elemento), semilla, training_ratio, dict.map(tercer_elemento).values().getInfo(), sitio_string, fecha_ini, fecha_fin, predefinido);
    
    // Crear Feature collection con información de áreas
    var lista_keys = ee.List([]);
    var lista_values = ee.List([]);
    var str_areas = 'Areas: \n';
    for (var j = 0; j<Number(tope); j++) {
        var area = areas.calculo_areas(imagen_clasificada, geometry, ee.String(dict.keys().get(j)).getInfo(), j);
        var key_value = ee.String(dict.keys().get(j)).getInfo();
        lista_values = lista_values.add(area);
        lista_keys = lista_keys.add(key_value);
        
        str_areas = ee.String(str_areas).cat(key_value).cat(' - ').cat(area).cat(' km^2').cat('\n');
    }
    
    var dict_areas = ee.Dictionary.fromLists(lista_keys, lista_values);
  
    var dic_areas_total_dict = ee.Dictionary({area_total: cityAreaSqKm, area_por_capa: dict_areas});
    var dic_areas_total = ee.String.encodeJSON(dic_areas_total_dict);
    var dict_total = {'system:index': sitio_string.cat(' ').cat(fecha_ini).cat(' ').cat(fecha_fin).getInfo(),
    sitio: sitio_string, 
    fecha_inicio: fecha_ini,
    fecha_fin: fecha_fin,
    areas: dic_areas_total};
    
    var feature_final = ee.Feature(geometry, dict_total);
    
    print('Feature de áreas', feature_final);
    
    var output = ee.String('Total area: ').cat(dic_areas_total_dict.get('area_total')).cat(' km^2').cat('\n').cat(str_areas);

    print(output);
    
    var button = ui.Label({
    value: output.getInfo(),
    style: {
      stretch: 'both',
      whiteSpace: 'pre',
      minHeight: '100px',
      position: 'top-right',
      backgroundColor: '#def8ff',
      fontSize: '15px',
      border: '5px solid #8bc6d6'
    }
    });
    mapa.add(button);
    
    return feature_final;
  }
};