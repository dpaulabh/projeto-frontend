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
      let tempCelsius = ((5/9) * (data.main.temp-32)).toFixed(1);
      cidade.innerText = data.name;
      console.log(data);
      temp.innerText = tempCelsius;
    })
    .catch((err) => {
      cidade.innerText = 'Impossível acessar o serviço de clima. Verifique a sua conexão.';
      temp.innerText = '-';
    })
  }
  if (navigator.geolocation) {
    getUserPosition()
  } else {
    city.innerText = 'Geolocalização não está disponível.';
    temp.innerText = '-';      
  }
     
