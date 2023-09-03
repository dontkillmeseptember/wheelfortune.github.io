const sectors = [
	{
		color: '#F6B66C',
		label: 'Россия'
	},
	{
		color: '#F54747',
		label: 'Украина'
	},
	{
		color: '#F6B66C',
		label: 'Грузия'
	},
	{
		color: '#F54747',
		label: 'Германия'
	},
	{
		color: '#F6B66C',
		label: 'Польша'
	},
	{
		color: '#F54747',
		label: 'Италия'
	},
	{
		color: '#F6B66C',
		label: 'Англия'
	},
	{
		color: '#F54747',
		label: 'Индия'
	},
	{
		color: '#F6B66C',
		label: 'Слава',
	},
	{
		color: '#F54747',
		label: 'Нейросеть',
	},
	{
		color: '#F6B66C',
		label: 'Игорь'
	},
	{
		color: '#F54747',
		label: 'Испания'
	}
]

const rand = (m, M) => Math.random() * (M - m) + m
const tot = sectors.length
const spinEl = document.querySelector('#spin')
const ctx = document.querySelector('#wheel').getContext('2d')
const finalValue = document.getElementById("final-value")
const story = document.getElementById("story")
const dia = ctx.canvas.width
const rad = dia / 2
const PI = Math.PI
const TAU = 2 * PI
const arc = TAU / sectors.length

const friction = 0.991 // 0,995 = Мягкий, 0,99 = Средний, 0,98 = Жесткий

let angVel = 0 // Угловая скорость
let ang = 0 // Угол в радиусе
let spinning = false;
let timer;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot

function drawSector(sector, i) {
	const ang = arc * i

	ctx.save()
	// Цвет
	ctx.beginPath()
	ctx.fillStyle = sector.color
	ctx.moveTo(rad, rad)
	ctx.arc(rad, rad, rad, ang, ang + arc)
	ctx.lineTo(rad, rad)
	ctx.fill()
	// Текст
	ctx.translate(rad, rad)
	ctx.rotate(ang + arc / 2)
	ctx.textAlign = 'right'
	ctx.fillStyle = '#FFF'
	ctx.font = '17px Lobster'
	ctx.fillText(sector.label, rad - 25, 5)
	//
	ctx.restore()
}

// Функция нажатия на SPIN
function rotate() {
	const sector = sectors[getIndex()]
	const selectedLabel = sector.label;

	ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`
	spinEl.textContent = !angVel ? 'СТАРТ' : 'СТАРТ'
	spinEl.style.background = sector.color

	// Добавьте условный оператор для изменения сообщения в story
	if (selectedLabel === 'Нейросеть' || selectedLabel === 'Слава' || selectedLabel === 'Игорь') {
		story.innerHTML = `Следующий рацион делает: ${selectedLabel}`;
	} else {
		story.innerHTML = `Следующий рацион из страны: ${selectedLabel}`;
	}

	if (selectedLabel === 'Италия') {
		document.body.style.background = 'linear-gradient(135deg, #009246 33.33%, #ffffff 33.33%, #ffffff 66.66%, #ce2b37 66.66%)';
	} else if (selectedLabel === 'Россия') {
		document.body.style.background = 'linear-gradient(135deg, #ffffff 33.33%, #0000FF 33.33%, #0000FF 66.66%, #FF0000 66.66%)';
	} else if (selectedLabel === 'Украина') {
		document.body.style.background = 'linear-gradient(135deg, #005bbb 50%, #ffd500 50%)';
	} else if (selectedLabel === 'Грузия') {
		document.body.style.background = 'linear-gradient(135deg, #fff, #fff 33.33%, #e30a17 33.33%, #e30a17 66.66%, #fff 66.66%)';
	} else if (selectedLabel === 'Германия') {
		document.body.style.background = 'linear-gradient(135deg, #000, #000 33.33%, #D00 33.33%, #D00 66.66%, #FFD700 66.66%)';
	} else if (selectedLabel === 'Польша') {
		document.body.style.background = 'linear-gradient(135deg, #fff, #fff 50%, #dc143c 50%, #dc143c)';
	} else if (selectedLabel === 'Англия') {
		document.body.style.background = 'linear-gradient(135deg, #fff, #fff 25%, #cc142b 25%, #cc142b 75%, #fff 75%)';
	} else if (selectedLabel === 'Индия') {
		document.body.style.background = 'linear-gradient(135deg, #ff9933, #ff9933 33.33%, #fff 33.33%, #fff 66.66%, #138808 66.66%)';
	} else if (selectedLabel === 'Слава') {
		document.body.style.background = 'linear-gradient(135deg, #fff, #fff 33.33%, #0033A0 33.33%, #0033A0 66.66%, #fff 66.66%)';
	} else if (selectedLabel === 'Нейросеть') {
		document.body.style.background = 'linear-gradient(135deg, #008000, #008000 50%, #ffffff 50%, #ffffff)';
	} else if (selectedLabel === 'Игорь') {
		document.body.style.background = 'linear-gradient(135deg, #000000 33.33%, #FF8C00 33.33%, #FF8C00 66.66%, #ffffff 66.66%)';
	} else if (selectedLabel === 'Испания') {
		document.body.style.background = 'linear-gradient(135deg, #ff0000, #ff0000 50%, #ffd700 50%, #ffd700)';
	} else {
		// Возвращаем начальный задний фон страницы (если это не Италия)
		document.body.style.background = 'linear-gradient(135deg, #F6B66C, #F54747)';
	}

	clearTimeout(timer);
	timer = setTimeout(() => {
	  spinning = false; // После завершения таймера можно снова вращать
	  spinEl.textContent = 'СТАРТ';
	  spinEl.style.background = sector.color;
	}, 5); // 10000 миллисекунд (10 секунд) таймер

	// Сохраняем значение в localStorage
	localStorage.setItem('selectedLabel', selectedLabel);
	localStorage.setItem('backgroundColor', document.body.style.background);

	spinning = true; // Устанавливаем флаг в true, чтобы предотвратить повторное вращение
}

// Функция движения колеса
function frame() {
	if (!angVel) return;
	angVel *= friction;
	if (angVel < 0.002) angVel = 0;
	ang += angVel;
	finalValue.innerHTML = "Удачи!";
	ang %= TAU;
	rotate();
}

// Функция движка
function engine() {
	frame()
	requestAnimationFrame(engine)
}

// Функция запуска всех функций при нажатиии на Spin
function init() {
	const storedLabel = localStorage.getItem('selectedLabel');
	const storedBackgroundColor = localStorage.getItem('backgroundColor');

	sectors.forEach(drawSector)
	rotate() // Начальное вращение
	
	ctx.font = '17px Lobster'

	document.body.style.background = 'linear-gradient(135deg, #F6B66C, #F54747)';

	if (storedLabel) {
		story.innerHTML = `Следующий рацион из страны: ${storedLabel}`;
	}

    if (storedBackgroundColor) {
        document.body.style.background = storedBackgroundColor;
    }

	finalValue.innerHTML = "Нажмите на кнопку Старт, чтобы начать";

	engine() // Запуск

	spinEl.addEventListener('click', () => {
		if (!angVel && !spinning) {
			angVel = rand(0.25, 0.45);
		}
	});
}

init()