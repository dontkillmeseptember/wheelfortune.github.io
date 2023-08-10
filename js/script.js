const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

const WHEEL_ROTATION_INTERVAL = 604800000; // Неделя в миллисекундах (7 дней * 24 часа * 60 минут * 60 секунд * 1000 миллисекунд)
let lastSpinTime = localStorage.getItem('lastSpinTime') || 0;

//Object that stores values of minimum and maximum angle for a value
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
  
// Background color for each piece
const pieColors = rotationValues.map(item => item.color);

// Create chart
let myChart = new Chart(wheel, {
  // Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  // Chart Type Pie
  type: "pie",
  data: {
    // Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
		offset: 10,
        data: rotationValues.map(() => 1), // Create an array of 1s to represent the sectors
      },
    ],
  },
  options: {
    // Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      // Hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      // Display labels inside pie chart
      datalabels: {
        color: 'rgba(0, 0, 0, 0)', // Задаем прозрачный цвет текста
        formatter: (value, context) => rotationValues[context.dataIndex].value,
        font: { size: 0 },
        anchor: "end", // Set the anchor point of the label
        align: "start", // Set the alignment of the label
        offset: 20, // Set the offset of the label from the edge of the slice
        rotation: (context) => {
          // Use the index of the data point to get the desired rotation angle
          return rotationValues[context.dataIndex].rotation || 0;
        },
      },
    },
  },
});

//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
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

// Spinner count
let count = 0;
let resultValue = 101;

function updateSpinBtnText() {
  const currentTime = new Date().getTime();
  const nextSpinTime = parseInt(lastSpinTime) + WHEEL_ROTATION_INTERVAL;
  const remainingTime = nextSpinTime - currentTime;

  if (remainingTime <= 0) {
    spinBtn.textContent = "Spin";
    return;
  }

  spinBtn.textContent = `${formatTime(remainingTime)}`;
}

spinBtn.addEventListener("click", () => {
  const currentTime = new Date().getTime();

  if (currentTime - lastSpinTime >= WHEEL_ROTATION_INTERVAL) {
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
    const remainingTime = WHEEL_ROTATION_INTERVAL - (currentTime - lastSpinTime);
    updateSpinBtnText();
  }
});

// Функция для форматирования времени только в часы
function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  return `${hours} ч`;
}

document.addEventListener('DOMContentLoaded', () => {
  const savedCountry = getSelectedCountry();
  if (savedCountry) {
    finalValue.innerHTML = `<p>Следующий рацион из страны: ${savedCountry}</p>`;
  }

  updateSpinBtnText();
});