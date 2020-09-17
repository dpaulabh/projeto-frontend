erros = new Map();
erros.set("GPS", "Geolocalização não está disponível.");
erros.set('Cidades', "Erro ao carregar cidades. Verifique a sua conexão.");
erros.set("Estados", "Erro ao carregar Estados. Verifique a sua conexão.");
erros.set("API-Clima", "Impossível acessar o serviço de clima. Verifique a sua conexão.");


function getUserPosition() {
  let url;
  navigator.geolocation.getCurrentPosition((pos) => {
    let lat = pos.coords.latitude;
    let long = pos.coords.longitude;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&APPID=95b11822eb429c84c1143a19251b1881`;
    fetchApi(url);
  });
}

function fetchApi(url) {
  let cidade = document.getElementById('cidade');
  let temp = document.getElementById('temp');
  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      let tempCelsius = ((5 / 9) * (data.main.temp - 32)).toFixed(1);
      temp.innerText = data.name + "    " + tempCelsius;
    })
    .catch((err) => {
      cidade.innerText = erros.get("API-Clima");
      temp.innerText = '-';
    })
}


function getCities(ordena = true){
  let states = document.getElementById('states');  
  let url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + states.value + "/municipios";
  let cities = document.getElementById('cities');
  cities.length = 0;
  let option;
  option = document.createElement('option');
  option.disabled = true;
  option.text = "Cidade";
  cities.add(option);  
  cities.selectedIndex = 0;
  fetch(url)
    .then((data) => {
      data.json().then((data) => {
        if (ordena)
           data.sort(function(a,b){
             //IBGE fornece os dados fora de ordem
             if(a.nome == b.nome)
               return 0;
             if(a.nome < b.nome)
               return -1;
             if(a.nome > b.nome)
               return 1;
      });

        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].nome;
          option.value = data[i].nome;
          cities.add(option);
        }
      });
    })
    .catch((err) => {
      cidade.innerText =  erros.get("Cidades");
      temp.innerText = '-';
    })
}


function getStates(ordena = true) {

  // Colocando placeholder no drowpdown de cidades
  let cities = document.getElementById('cities');
  cities.length = 0;
  let option;
  option = document.createElement('option');
  option.disabled = true;
  option.text = "Cidade";
  cities.add(option);  
  cities.selectedIndex = 0;
  // 

  const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
  let states = document.getElementById('states');
  states.length = 0;
  option = document.createElement('option');
  option.disabled = true;
  option.text = "Estado";
  states.add(option);  
  states.selectedIndex = 0;
  fetch(url)
    .then((data) => {
      data.json().then((data) => {
        if (ordena)  
           data.sort(function(a,b){
             //IBGE fornece os dados fora de ordem
             if(a.nome == b.nome)
               return 0;
             if(a.nome < b.nome)
               return -1;
             if(a.nome > b.nome)
               return 1;
      });

        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].nome;
          option.value = data[i].sigla;
          states.add(option);
        }
      });
    })
    .catch((err) => {
      cidade.innerText = erros.get("Estados");
      temp.innerText = '-';
    })
}


function selectCity() {
  let cities = document.getElementById('cities');
  url = "https://api.openweathermap.org/data/2.5/weather?q=" + cities.value + "&units=imperial&APPID=95b11822eb429c84c1143a19251b1881";
  fetchApi(url);
}


getStates();

if (navigator.geolocation) {
  getUserPosition()
} else {
  city.innerText = erros.get("GPS");
  temp.innerText = '-';
}

