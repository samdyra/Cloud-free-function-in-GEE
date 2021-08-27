// Only works in Google Earth Engine
//Select study area by importing it to the GEE repo
var studyArea = table
Map.addLayer(studyArea,{color:"Red" },"studyArea");

//The longer the study date range, the better
var date1 = '2019-01-01';
var date2 = '2021-12-31';

//100% cloud free function
var maskingFunction = function cloudFree (image) {
  var qaBand = image.select(['BQA']).eq(2720) //memilih pixel yang bersih aja
  return image.updateMask(qaBand)//return hasil sesuai fungsi
}

//filter by area and date, also iterating the cloud free function into every image collection
var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")
.filterBounds(studyArea)
.filterDate(date1, date2)
.map(maskingFunction)

//get the median value of each filtered image, and clip it to the study area
var l8_Result = l8.median().clip(studyArea)

//visualize the result image
print('Result', l8_Result)
Map.addLayer(l8_Result)

//Export image
Export.image.toDrive({
  image: l8_Result.float(),
  region: studyArea,
  description: "Result",
  scale: 30,
  folder: 'GEE',
  maxPixels: 1e9
  })
