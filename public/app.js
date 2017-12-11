// Issue is that the pokemon list is limited to only 20 pokemon each time. Could potentially find a way to populate the first 100 or something like that, should give it a try.

// Could make it so that I have another dropdown select menu with fixed options, between default and 800, going up in increments of 20. (Each of the api dictionaries hold 20 pokemon and their associated links.) Actually, scrap that, found out how to access any of them, will probably only allow for first 151 to be accessed.

// Would have liked to make a compare function, where bar charts would have been formed with the selected pokemon's stats, and then an extra dropdown select which allowed for any pokemon's stats to be compared to the current one. I think I'd know how I would do it, will probably attempt it when I get some more time.

// Should have structured the table better. Would allow for easier styling. Don't forget that tables have thead and tbody, so it would have been more efficient to have cleared the tbody.

var app = function() {
  var url = "https://pokeapi.co/api/v2/pokemon/?limit=151"
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
}

var capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var populateSelect = function(pokemonList) {
  var select = document.getElementById('pokemon-select');
  pokemonList.forEach(function(pokemon) {
    var option = document.createElement('option');
    option.innerText = capitalize(pokemon.name);
    select.appendChild(option);
  });

  selectChanged(select.selectedIndex, pokemonList);

  select.addEventListener('change', function() {
    selectChanged(select.selectedIndex, pokemonList)
  })

};

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


var pokemonStats = function(pokemonData) {
  var container = document.getElementById('power-pie-chart');
  var table = document.getElementById('stat-table');

  var dataName = "Base Stats"
  var dataArr = [];
  var title = `${capitalize(pokemonData.name)}\'s Base Stat Values`;
  var totalPower = 0;


  removeChildNodes(table);

  var topRow = document.createElement('tr');
  var secondRow = document.createElement('tr');

  var tableHead = document.createElement('th');
  var secondRowType = document.createElement('th');
  var secondRowStat = document.createElement('th');

  secondRow.appendChild(secondRowType);
  secondRow.appendChild(secondRowStat);
  topRow.appendChild(tableHead);

  tableHead.innerText = title;
  secondRowType.innerText = "Stat type";
  secondRowStat.innerText = "Base Stat";

  table.appendChild(topRow);
  table.appendChild(secondRow);

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

    row.appendChild(statRowData);
    row.appendChild(valueRowData);
    table.appendChild(row);
  });

  var totalStatRow = document.createElement('tr');
  var statRowText = document.createElement('td');
  var totalStatData = document.createElement('td');
  statRowText.innerText = "Total Base Stat";
  totalStatData.innerText = totalPower;
  totalStatRow.appendChild(statRowText);
  totalStatRow.appendChild(totalStatData);
  table.appendChild(totalStatRow);

  var output = [{name: dataName, data: dataArr}]

  var pieChart = new PieChart(container, title, output);

  var power = document.getElementById('total-base-stats');
};

var removeChildNodes = function(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

window.addEventListener('load', app);
