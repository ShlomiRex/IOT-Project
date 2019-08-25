var bigml = require('bigml');

//var connection = bigml.BigML("shlomirex", "bc6c6d1bb2bf7eff67f471d0abda23c8ebb76144");

//var source = new bigml.Source();

// source.create('./data/iris.csv', function(error, sourceInfo) {
//     if (!error && sourceInfo) {
//       var dataset = new bigml.Dataset();
//       dataset.create(sourceInfo, function(error, datasetInfo) {
//         if (!error && datasetInfo) {
//           var model = new bigml.Model();
//           model.create(datasetInfo, function (error, modelInfo) {
//             if (!error && modelInfo) {
//               var prediction = new bigml.Prediction();
//               prediction.create(modelInfo, {'petal length': 1})
//             }
//           });
//         }
//       });
//     }
// });