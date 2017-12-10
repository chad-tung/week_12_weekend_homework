var app = function() {
  var url = "https://pokeapi.co/api/v2/pokemon/"
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
  populateSelect(pokemonList.results);
};

var requestData = function() {
  if(this.status != 200) return;
  var jsonString = this.responseText;
  var pokemonData = JSON.parse(jsonString);
  console.log(pokemonData);
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
  var type = document.getElementById('pokemon-type');
  var moveList = document.getElementById('move-list');
}

window.addEventListener('load', app);
