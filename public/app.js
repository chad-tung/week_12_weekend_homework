// Issue is that the pokemon list is limited to only 20 pokemon each time. Could potentially find a way to populate the first 100 or something like that, should give it a try.

// Could make it so that I have another dropdown select menu with fixed options, between default and 800, going up in increments of 20. (Each of the api dictionaries hold 20 pokemon and their associated links.) Actually, scrap that, found out how to access any of them, will probably only allow for first 151 to be accessed.

// Would have liked to make a compare function, where bar charts would have been formed with the selected pokemon's stats, and then an extra dropdown select which allowed for any pokemon's stats to be compared to the current one. I think I'd know how I would do it, will probably attempt it when I get some more time.

// Should have structured the table better. Would allow for easier styling. Don't forget that tables have thead and tbody, so it would have been more efficient to have cleared the tbody.

var app = function() {
  var url = "https://pokeapi.co/api/v2/pokemon/?limit=802"
  makeRequest(url, requestComplete);
};


var makeRequest = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send();
};

var requestComplete = function() {
  if(this.status != 200) return;
  var jsonString = this.responseText;
  var pokemonList = JSON.parse(jsonString);
  console.log(pokemonList);
  global_pokemon = pokemonList.results;
  populateSelect(pokemonList.results);
};

var requestData = function() {
  if(this.status != 200) return;
  var jsonString = this.responseText;
  var pokemonData = JSON.parse(jsonString);
  console.log(pokemonData);
  populateData(pokemonData);
};

var compareData = function() {
  if(this.status != 200) return;
  var jsonString = this.responseText;
  var pokemonData = JSON.parse(jsonString);
  populateCompareData(pokemonData);
}

var capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var populateSelect = function(pokemonList) {
  var select = document.getElementById('pokemon-select');
  var selectCompare = document.getElementById('compare-pokemon-select');
  pokemonList.forEach(function(pokemon) {
    var option = document.createElement('option');
    option.innerText = capitalize(pokemon.name);
    select.appendChild(option);

    var option2 = document.createElement('option');
    option2.innerText = capitalize(pokemon.name);
    selectCompare.appendChild(option2);
  });

  selectChanged(select.selectedIndex, pokemonList);

  compareChanged(selectCompare.selectedIndex, pokemonList);

  compareBarChart();

  select.addEventListener('change', function() {
    selectChanged(select.selectedIndex, pokemonList)
    compareBarChart();
  });

  selectCompare.addEventListener('change', function() {
    compareChanged(selectCompare.selectedIndex, pokemonList);
    compareBarChart();
  });

};

var compareChanged = function(index, pokemonList) {
  var url = pokemonList[index].url;
  makeRequest(url, compareData);
}

var selectChanged = function(index, pokemonList) {
  var url = pokemonList[index].url;
  makeRequest(url, requestData);
}

var populateData = function(pokemonData) {
  var name = document.getElementById('pokemon-name');
  var pic = document.getElementById('pokemon-pic');

  name.innerText = capitalize(pokemonData.name);
  pic.alt = capitalize(pokemonData.name);
  pic.src = pokemonData.sprites.front_default;


  var type = document.getElementById('pokemon-type');

  type.innerText = "Type: ";
  pokemonData.types.forEach(function(element) {
    type.innerText += element.type.name + '/'
  });


  var moveList = document.getElementById('move-list');
  removeChildNodes(moveList);

  pokemonData.moves.forEach(function(attack) {
    var li = document.createElement('li');
    li.innerText = capitalize(attack.move.name);
    moveList.appendChild(li);
  });

  pokemonStats(pokemonData);
};

var populateCompareData = function(pokemonData) {
  var name = document.getElementById('compare-pokemon-name');
  var pic = document.getElementById('compare-pokemon-pic');

  name.innerText = capitalize(pokemonData.name);
  pic.alt = capitalize(pokemonData.name);
  pic.src = pokemonData.sprites.front_default;


  var type = document.getElementById('compare-pokemon-type');

  type.innerText = "Type: ";
  pokemonData.types.forEach(function(element) {
    type.innerText += element.type.name + '/'
  });

  var moveList = document.getElementById('compare-move-list');
  removeChildNodes(moveList);

  pokemonData.moves.forEach(function(attack) {
    var li = document.createElement('li');
    li.innerText = capitalize(attack.move.name);
    moveList.appendChild(li);
  });

  comparePokemonStats(pokemonData);
};


var barSeries1 = [];
var barCategories = [];

var pokemonStats = function(pokemonData) {
  var container = document.getElementById('power-pie-chart');
  var tableBody = document.getElementById('stat-table-body');

  var dataName = "Base Stats"
  var dataArr = [];
  var title = `${capitalize(pokemonData.name)}\'s Base Stat Values`;
  var totalPower = 0;


  removeChildNodes(tableBody);

  var tableHead = document.getElementById('pokemon-table-heading');

  tableHead.innerText = title;

  barSeries1 = [];
  barCategories = [];

  pokemonData.stats.forEach(function(segment) {

    var statName = capitalize(segment.stat.name);
    var baseStat = segment.base_stat;
    var pokeData = {name: capitalize(statName), y: baseStat};
    totalPower += parseInt(baseStat);
    dataArr.push(pokeData);

    var row = document.createElement('tr');
    var statRowData = document.createElement('td');
    var valueRowData = document.createElement('td');

    statRowData.innerText = statName;
    valueRowData.innerText = baseStat;

    barCategories.push(statName);
    barSeries1.push(parseInt(baseStat));

    statRowData.class = "stat-type"
    valueRowData.class = "stat-value"

    row.appendChild(statRowData);
    row.appendChild(valueRowData);
    tableBody.appendChild(row);
  });

  var totalStatRow = document.createElement('tr');
  var statRowText = document.createElement('td');
  var totalStatData = document.createElement('td');
  statRowText.innerText = "Total Base Stat";
  totalStatData.innerText = totalPower;
  totalStatRow.appendChild(statRowText);
  totalStatRow.appendChild(totalStatData);
  tableBody.appendChild(totalStatRow);

  var output = [{name: dataName, data: dataArr}]

  var pieChart = new PieChart(container, title, output);

  compareBarChart();
};


var barSeries2 = [];

var comparePokemonStats = function(pokemonData) {
  var container = document.getElementById('compare-power-pie-chart');
  var tableBody = document.getElementById('compare-stat-table-body');

  var dataName = "Base Stats"
  var dataArr = [];
  var title = `${capitalize(pokemonData.name)}\'s Base Stat Values`;
  var totalPower = 0;


  removeChildNodes(tableBody);

  var tableHead = document.getElementById('compare-pokemon-table-heading');

  tableHead.innerText = title;

  barSeries2 = []

  pokemonData.stats.forEach(function(segment) {

    var statName = capitalize(segment.stat.name);
    var baseStat = segment.base_stat;
    var pokeData = {name: capitalize(statName), y: baseStat};
    totalPower += parseInt(baseStat);
    dataArr.push(pokeData);

    var row = document.createElement('tr');
    var statRowData = document.createElement('td');
    var valueRowData = document.createElement('td');

    statRowData.innerText = statName;
    valueRowData.innerText = baseStat;

    statRowData.class = "compare-stat-type"
    valueRowData.class = "compare-stat-value"

    barSeries2.push(parseInt(baseStat));

    row.appendChild(statRowData);
    row.appendChild(valueRowData);
    tableBody.appendChild(row);
  });

  var totalStatRow = document.createElement('tr');
  var statRowText = document.createElement('td');
  var totalStatData = document.createElement('td');
  statRowText.innerText = "Total Base Stat";
  totalStatData.innerText = totalPower;
  totalStatRow.appendChild(statRowText);
  totalStatRow.appendChild(totalStatData);
  tableBody.appendChild(totalStatRow);

  var output = [{name: dataName, data: dataArr}]

  var pieChart = new PieChart(container, title, output);

  compareBarChart();

}


var compareBarChart = function() {
  var container = document.getElementById('bar-chart');

  var pokemon = document.getElementById('pokemon-name').innerText;
  var comparePokemon = document.getElementById('compare-pokemon-name').innerText;
  var title = `${pokemon} vs ${comparePokemon}`;

  var categories = document.getElementsByClassName('stat-type');

  // var pokemonStat = document.getElementById('stat-table-body');
  // var comparePokemonStat = document.getElementById('compare-stat-table-body');
  // var pokemonSeriesArr = document.getElementsByClassName('stat-value');
  //
  // var comparePokemonSeriesArr = document.getElementsByClassName('compare-stat-value');
  //
  //
  //
  // pokemonSeriesArr.forEach(function(value) {
  //   var stat = parseInt(value);
  //   series1.push(stat);
  // });
  //
  //
  // comparePokemonSeriesArr.forEach(function(value) {
  //   var stat = parseInt(value);
  //   series2.push(stat);
  // })

  var pokemonSeries = {
    name: pokemon,
    data: barSeries1,
    color: "blue"
  };

  var comparePokemonSeries = {
    name: comparePokemon,
    data: barSeries2,
    color: "red"
  };

  var series = [pokemonSeries, comparePokemonSeries];

  var barChart = new BarChart(container, title, barCategories, series);

}

var removeChildNodes = function(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

window.addEventListener('load', app);
