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
		label: 'Швеция'
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
	if (selectedLabel === 'Нейросеть' || selectedLabel === 'Слава') {
		story.innerHTML = `Следующий рацион делает: ${selectedLabel}`;
	} else {
		story.innerHTML = `Следующий рацион из страны: ${selectedLabel}`;
	}

	clearTimeout(timer);
	timer = setTimeout(() => {
	  spinning = false; // После завершения таймера можно снова вращать
	  spinEl.textContent = 'СТАРТ';
	  spinEl.style.background = sector.color;
	}, 5); // 10000 миллисекунд (10 секунд) таймер

	// Сохраняем значение в localStorage
	localStorage.setItem('selectedLabel', selectedLabel);

	spinning = true; // Устанавливаем флаг в true, чтобы предотвратить повторное вращение
}

// Функция движения колеса
function frame() {
	if (!angVel) return;
	angVel *= friction;
	if (angVel < 0.002) angVel = 0;
	ang += angVel;
	finalValue.innerHTML = "Удачи!⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀";
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

	ctx.font = '17px Lobster'

	sectors.forEach(drawSector)
	rotate() // Начальное вращение

	finalValue.innerHTML = "Нажмите на кнопку Старт, чтобы начать";

	if (storedLabel) {
		story.innerHTML = `Следующий рацион из страны: ${storedLabel}`;
	}

	engine() // Запуск

	spinEl.addEventListener('click', () => {
		if (!angVel && !spinning) {
			angVel = rand(0.25, 0.45);
		}
	});
}

init()