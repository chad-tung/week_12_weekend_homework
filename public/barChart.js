// var BarChart = function() {
//   var container = document.querySelector("#bar-chart");
//   var chart = new Highcharts.Chart({
//     chart: {
//       type: "column",
//       renderTo: container
//     },
//     title: {
//       text: "G3's favourite Science Fiction Franchises"
//     },
//     xAxis: {
//       categories: ["Star Wars", "Star Trek", "BSG", "I hate nerds", "Jamie"]
//     },
//     series: [
//       {
//       name: "G3",
//       data: [8, 2, 3, 3, 1],
//       color: "red"
//     },
//     {
//       name: "G4",
//       data: [4, 4, 3, 3, 3],
//       color: "black"
//     }]
//   });
// };

var BarChart = function(container, titleText, categoriesArr, seriesArr) {
  var chart = new Highcharts.Chart({
    chart: {
      type: "column",
      renderTo: container
    },
    title: {
      text: titleText
    },
    xAxis: {
      categories: categoriesArr
    },
    series: seriesArr
  });
}
