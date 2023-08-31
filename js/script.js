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
	}
]

const rand = (m, M) => Math.random() * (M - m) + m
const tot = sectors.length
const spinEl = document.querySelector('#spin')
const ctx = document.querySelector('#wheel').getContext('2d')
const finalValue = document.getElementById("final-value")
const dia = ctx.canvas.width
const rad = dia / 2
const PI = Math.PI
const TAU = 2 * PI
const arc = TAU / sectors.length

const friction = 0.991 // 0,995 = Мягкий, 0,99 = Средний, 0,98 = Жесткий
let angVel = 0 // Угловая скорость
let ang = 0 // Угол в радиусе

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
	ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`
	spinEl.textContent = !angVel ? 'СТАРТ' : 'СТАРТ'
	spinEl.style.background = sector.color
	finalValue.innerHTML = `<p>Следующий рацион из страны: ${sector.label}</p>`
}

// Функция движения колеса
function frame() {
	if (!angVel) return
	angVel *= friction // Снижение скорости за счет трения
	if (angVel < 0.002) angVel = 0 // Привести к остановке
	ang += angVel // Угол обновления
	ang %= TAU // Нормализация угла
	rotate()
}

// Функция движка
function engine() {
	frame()
	requestAnimationFrame(engine)
}

// Функция запуска всех функций при нажатиии на Spin
function init() {
	sectors.forEach(drawSector)
	rotate() // Начальное вращение
	engine() // Запуск
	spinEl.addEventListener('click', () => {
		if (!angVel) angVel = rand(0.25, 0.45)
		
		finalValue.innerHTML = `<p>Удачи!</p>`
	})
}

init()