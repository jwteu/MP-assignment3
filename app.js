function getWeather() {
    const city = document.getElementById('weatherLocation').value;
    logUserInteraction('Weather');
    const apiKey = '168013637d1447c882c3ba794a5e1a76'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; 
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => displayWeather(data))
      .catch(error => {
        console.error('Error fetching weather:', error);
        document.getElementById('weatherDisplay').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
      });
}

function displayWeather(data) {
    const content = document.getElementById('weatherDisplay');
    
    const tempC = data.main.temp;
    const tempF = (tempC * 9/5) + 32;
    const feelsLikeC = data.main.feels_like;
    const feelsLikeF = (feelsLikeC * 9/5) + 32;

    let advice;
    if (tempC > 30) {
        advice = "It's quite hot outside. Stay hydrated and wear light clothing.";
    } else if (tempC > 20) {
        advice = "The weather is warm. A great day to be outdoors!";
    } else if (tempC > 10) {
        advice = "It's a bit cool. You might need a light jacket.";
    } else {
        advice = "It's quite cold. Dress warmly!";
    }

    content.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      <p>Temperature: ${tempC.toFixed(1)}°C / ${tempF.toFixed(1)}°F</p>
      <p>Feels like: ${feelsLikeC.toFixed(1)}°C / ${feelsLikeF.toFixed(1)}°F</p>
      <p>Condition: ${data.weather[0].main} - ${data.weather[0].description}</p>
      <p><strong>Advice:</strong> ${advice}</p>
    `;
}

function getNews() {
    const category = document.getElementById('newsCategory').value;
    logUserInteraction('News');
    const apiKey = 'Ql6zwae1B4FbNFlt8wfhGr7WMLAPgjVA0OMnEmtg';
    const apiUrl = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&search=Malaysia&categories=${category}&language=en&limit=3&sort=published_at`;
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Debugging line to check the API response
        if (data.data.length === 0) {
          throw new Error('No news articles found for the selected category');
        }
        displayNews(data);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
        document.getElementById('newsDisplay').innerHTML = `<p>Error fetching news data: ${error.message}. Please try again later.</p>`;
      });
}

function displayNews(data) {
    const content = document.getElementById('newsDisplay');
    content.innerHTML = `<h2>Malaysia News - ${document.getElementById('newsCategory').value.charAt(0).toUpperCase() + document.getElementById('newsCategory').value.slice(1)}</h2>`;
  
    data.data.forEach(article => {
        const formattedDate = moment(article.published_at).format('MMMM Do YYYY, h:mm:ss a');
        content.innerHTML += `
            <div>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <p><strong>Published at:</strong> ${formattedDate}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
            <hr>
        `;
    });
}

function getCovidData() {
    logUserInteraction('Covid-19');
    const apiUrl = `https://disease.sh/v3/covid-19/countries/Malaysia`;
  
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayCovidData(data))
    .catch(error => {
        console.error('Error fetching COVID-19 data:', error);
        document.getElementById('covidDisplay').innerHTML = '<p>Error fetching COVID-19 data. Please try again later.</p>';
    });
}

function displayCovidData(data) {
    const content = document.getElementById('covidDisplay');
    content.innerHTML = `
        <h2>COVID-19 Statistics in Malaysia</h2>
        <p><strong>Total Cases:</strong> ${data.cases.toLocaleString()}</p>
        <p><strong>Total Deaths:</strong> ${data.deaths.toLocaleString()}</p>
        <p><strong>Total Recovered:</strong> ${data.recovered.toLocaleString()}</p>
        <p><strong>Active Cases:</strong> ${data.active.toLocaleString()}</p>
        <p><strong>Critical Cases:</strong> ${data.critical.toLocaleString()}</p>
        <p><strong>Cases Today:</strong> ${data.todayCases.toLocaleString()}</p>
        <p><strong>Deaths Today:</strong> ${data.todayDeaths.toLocaleString()}</p>
        <p><strong>Recovered Today:</strong> ${data.todayRecovered.toLocaleString()}</p>
    `;
}

function logUserInteraction(functionName) {
    const now = new Date();
    const logEntry = {
        timestamp: now.toISOString(),
        function: functionName
    };

    let logs = JSON.parse(localStorage.getItem('userLogs')) || [];
    logs.push(logEntry);
    localStorage.setItem('userLogs', JSON.stringify(logs));
}

function displayLogs() {
    let logs = JSON.parse(localStorage.getItem('userLogs')) || [];
    const logsDisplay = document.getElementById('logsDisplay');
    
    if (logs.length === 0) {
        logsDisplay.innerHTML = '<p>No user interactions logged yet.</p>';
        return;
    }

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    logs = logs.slice(0, 10);

    let logsHtml = '<h3>Latest 10 User Interactions</h3><ul>';
    logs.forEach(log => {
        const date = new Date(log.timestamp);
        logsHtml += `<li>${date.toLocaleString()}: Used ${log.function} function</li>`;
    });
    logsHtml += '</ul>';

    logsDisplay.innerHTML = logsHtml;
}
