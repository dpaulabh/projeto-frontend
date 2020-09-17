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
      cidade.innerText = 'Impossível acessar o serviço de clima. Verifique a sua conexão.';
      temp.innerText = '-';
    })
}


function sortJsonArrayByProperty(objArray, prop, direction){
  if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
  var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

  if (objArray && objArray.constructor===Array){
      var propPath = (prop.constructor===Array) ? prop : prop.split(".");
      objArray.sort(function(a,b){
          for (var p in propPath){
              if (a[propPath[p]] && b[propPath[p]]){
                  a = a[propPath[p]];
                  b = b[propPath[p]];
              }
          }
          // convert numeric strings to integers
          a = a.match(/^\d+$/) ? +a : a;
          b = b.match(/^\d+$/) ? +b : b;
          return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
      });
  }
}

function getCities(){
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
      cidade.innerText =  'Erro ao carregar cidades. Verifique a sua conexão.';
      temp.innerText = '-';
    })
}





function getStates() {

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
      cidade.innerText = 'Erro ao carregar estados. Verifique a sua conexão.';
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
  city.innerText = 'Geolocalização não está disponível.';
  temp.innerText = '-';
}

