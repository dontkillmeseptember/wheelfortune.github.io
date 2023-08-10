const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Указываем день недели, который хотим использовать (0 - воскресенье, 1 - понедельник, и т.д.)
const targetDayOfWeek = 1;

let lastSpinTime = localStorage.getItem('lastSpinTime') || 0;
let isSpinning = false; // Флаг для проверки, идет ли вращение в данный момент

// Объект, который хранит значения минимального и максимального угла для значения
const rotationValues = [
	{ minDegree: 0, maxDegree: 30, value: "Россия", color: "#F6B66C", rotation: 0 },
	{ minDegree: 31, maxDegree: 90, value: "Украина", color: "#F54747", rotation: 0 },
	{ minDegree: 91, maxDegree: 150, value: "Германия", color: "#F6B66C", rotation: 0 },
	{ minDegree: 151, maxDegree: 210, value: "Польша", color: "#F54747", rotation: 0 },
	{ minDegree: 211, maxDegree: 270, value: "Испания", color: "#F6B66C", rotation: 0 },
	{ minDegree: 271, maxDegree: 330, value: "Швеция", color: "#F54747", rotation: 0 },
	{ minDegree: 331, maxDegree: 360, value: "Франция", color: "#F6B66C", rotation: 0 },
	{ minDegree: 361, maxDegree: 420, value: "Италия", color: "#F54747", rotation: 0 },
	{ minDegree: 421, maxDegree: 480, value: "Англия", color: "#F6B66C", rotation: 0 },
	{ minDegree: 481, maxDegree: 540, value: "Грузия", color: "#F54747", rotation: 0 },
];

// Цвет фона для каждой части
const pieColors = rotationValues.map(item => item.color);

// Создать диаграмму
let myChart = new Chart(wheel, {
  // Плагин для отображения текста на круговой диаграмме
  plugins: [ChartDataLabels],
  // Тип диаграммы: Круговая (Pie)
  type: "pie",
  data: {
    // Настройки для набора данных / круговой диаграммы
    datasets: [
      {
        backgroundColor: pieColors,
		offset: 10,
        data: rotationValues.map(() => 1), // Создать массив из единиц для представления секторов
      },
    ],
  },
  options: {
    // Отзывчивая диаграмма
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      // Скрыть подсказку (tooltip) и легенду
      tooltip: false,
      legend: {
        display: false,
      },
      // Отображение меток внутри круговой диаграммы
      datalabels: {
        color: 'rgba(0, 0, 0, 0)', // Задаем прозрачный цвет текста
        formatter: (value, context) => rotationValues[context.dataIndex].value,
        font: { size: 0 },
        anchor: "end", // Установить точку привязки для метки
        align: "start", // Установить выравнивание метки
        offset: 20, // Установить смещение метки от края сегмента
        rotation: (context) => {
          // Используйте индекс точки данных, чтобы получить желаемый угол поворота
          return rotationValues[context.dataIndex].rotation || 0;
        },
      },
    },
  },
});

// Отображение значения на основе случайного угла (randomAngle)
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    // Если значение угла (angleValue) находится между минимальным и максимальным, то отобразить его
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

// Функция для сохранения значения времени последней прокрутки
function saveLastSpinTime(time) {
	localStorage.setItem('lastSpinTime', time);
}

// Функция для сохранения значения в localStorage
function saveSelectedCountry(country) {
	localStorage.setItem('selectedCountry', country);
}
  
// Функция для получения сохраненного значения из localStorage
function getSelectedCountry() {
	return localStorage.getItem('selectedCountry');
}

// Количество прокрутов
let count = 0;
let resultValue = 101;

// Эвент для прокрутки колеса
spinBtn.addEventListener("click", () => {
  const currentTime = new Date().getTime();

  if (currentTime - lastSpinTime >= getNextSpinTimeDifference()) {
    lastSpinTime = currentTime;
    saveLastSpinTime(lastSpinTime);

    spinBtn.disabled = true;
    finalValue.innerHTML = `<p>Удачи!</p>`;

    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
    let rotationInterval = window.setInterval(() => {
      myChart.options.rotation = myChart.options.rotation + resultValue;
      myChart.update();

      if (myChart.options.rotation >= 360) {
        count += 1;
        resultValue -= 5;
        myChart.options.rotation = 0;
      }

      if (count > 15 && myChart.options.rotation == randomDegree) {
        valueGenerator(randomDegree);
        saveSelectedCountry(rotationValues.find(item => randomDegree >= item.minDegree && randomDegree <= item.maxDegree).value);
        clearInterval(rotationInterval);
        count = 0;
        resultValue = 101;
        updateSpinBtnText();
      }
    }, 10);
  } else {
    updateSpinBtnText();
  }
});

// Функция для форматирования времени только в часы
function formatTime(milliseconds) {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (days > 0) {
        return `${days} Д`;
    } else if (hours > 0) {
        return `${hours} Ч`;
    } else if (minutes > 0) {
        return `${minutes} М`;
    } else {
        return `${seconds} С`;
    }
}

// Функция для получения ближайшей даты указанного дня недели
function getNextDayOfWeek(dayOfWeek, baseDate) {
    const daysUntilNextDay = (dayOfWeek - baseDate.getDay() + 14) % 14;
    const nextDay = new Date(baseDate);
    nextDay.setDate(baseDate.getDate() + daysUntilNextDay);
    return nextDay;
}

// Функция для вычисления разницы во времени до следующей фиксированной даты
function getNextSpinTimeDifference() {
    const currentTime = new Date().getTime();
    const nextFixedDate = getNextDayOfWeek(targetDayOfWeek, new Date()); // Получаем ближайшую дату указанного дня недели
    const timeDiff = nextFixedDate - currentTime;

    return timeDiff;
}

// Функция для обновления таймера на кнопке
function updateSpinBtnText() {
    const remainingTime = getNextSpinTimeDifference();
    
    if (remainingTime <= 0) {
        spinBtn.textContent = "Spin";
    } else {
        spinBtn.textContent = `${formatTime(remainingTime)}`;
    }
}

// Эвент для изменения текста на нужный
document.addEventListener('DOMContentLoaded', () => {
    const savedCountry = getSelectedCountry();
    if (savedCountry) {
        finalValue.innerHTML = `<p>Следующий рацион из страны: ${savedCountry}</p>`;
    }

    updateSpinBtnText();
    
    // Обновление времени каждую секунду
    setInterval(updateSpinBtnText, 1000);
});