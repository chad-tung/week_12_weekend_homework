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
