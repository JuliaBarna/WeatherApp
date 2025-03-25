const express = require('express');
const fetch = require('node-fetch');
const hbs = require('hbs');
const path = require('path');


const app = express();
const port = 3000;
const API_KEY = ''; 
app.use(express.static(__dirname));
// Налаштування hbs
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('views', path.join(__dirname, '/views'));

// Меню міст
const cities = ['Kyiv', 'Lviv', 'Odesa', 'Dnipro', 'Kharkiv'];

// Головна сторінка
app.get('/', (req, res) => {
    res.render('index', { cities });
});

app.get('/weather/:city?', async (req, res) => {
    const { city } = req.params;
    const { lat, lon } = req.query;

    let url = '';
    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ua`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ua`;
    } else {
        return res.render('weather', { error: 'Вкажіть місто або дозвольте доступ до геолокації' });
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        res.render('weather', { city: data.name, weather: data });
    } catch (error) {
        res.render('weather', { error: 'Не вдалося отримати погоду' });
    }
});


// Сторінка входу
app.get('/login', (req, res) => {
    res.render('login');
});



app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});
