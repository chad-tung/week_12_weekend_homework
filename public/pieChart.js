var PieChart = function(container, titleText, seriesData) {
  var chart = new Highcharts.Chart({
    chart: {
      type: 'pie',
      renderTo: container,
    },
    title: {
      text: titleText
    },
    series: seriesData
  })
};
