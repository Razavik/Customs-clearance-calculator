export const calculator = () => {
	// Получаем элементы формы
	const carCostInput = document.getElementById("carCost");
	const engineVolumeInput = document.getElementById("engineVolume");
	const calculateButton = document.getElementById("calculateButton");
	const decree140Checkbox = document.getElementById("decree140");

	// Получаем элементы результатов
	const resultCarCost = document.getElementById("resultCarCost");
	const resultDuty = document.getElementById("resultDuty");
	const resultCustomsFee = document.getElementById("resultCustomsFee");
	const resultRecyclingFee = document.getElementById("resultRecyclingFee");
	const resultEPTS = document.getElementById("resultEPTS");
	const resultTotal = document.getElementById("resultTotal");

	const CUSTOMS_FEE_BYN = 120; // Таможенный сбор
	const EPTS_FEE_BYN = 70; // Регистрация ЭПТС
	const RECYCLING_FEE_UNDER_3_BYN = 544; // Утилизационный сбор для авто до 3 лет
	const RECYCLING_FEE_OVER_3_BYN = 1089; // Утилизационный сбор для авто от 3 лет и старше

	// Курс валют (1 евро = 3.57 BYN)
	const BYN_TO_EUR = 1 / 3.57;

	// Инициализация кастомных селектов
	const initCustomSelects = () => {
		const selects = document.querySelectorAll(".calculator__select");

		selects.forEach((select) => {
			const header = select.querySelector(".calculator__select-header");
			const items = select.querySelectorAll(".calculator__select-item");
			const current = select.querySelector(".calculator__select-current");
			const hiddenInput = select.querySelector('input[type="hidden"]');

			// Обработчик клика по заголовку селекта
			header.addEventListener("click", () => {
				selects.forEach((otherSelect) => {
					if (otherSelect !== select) {
						otherSelect.classList.remove("active");
					}
				});

				select.classList.toggle("active");
			});

			// Обработчик клика по элементу селекта
			items.forEach((item) => {
				item.addEventListener("click", () => {
					current.textContent = item.textContent;

					if (hiddenInput) {
						hiddenInput.value = item.dataset.value;
					}

					items.forEach((i) => {
						i.dataset.selected = "false";
					});

					item.dataset.selected = "true";

					select.classList.remove("active");
				});
			});
		});

		// Закрытие селекта при клике вне его
		document.addEventListener("click", (e) => {
			const isSelect = e.target.closest(".calculator__select");
			if (!isSelect) {
				selects.forEach((select) => {
					select.classList.remove("active");
				});
			}
		});
	};

	// Функция получения значения из кастомного селекта
	const getSelectValue = (id) => {
		const hiddenInput = document.getElementById(id);
		return hiddenInput ? hiddenInput.value : null;
	};

	// Функция форматирования числа в денежный формат
	const formatMoney = (amount) => {
		return new Intl.NumberFormat("ru-BY", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	// Функция расчета таможенной пошлины для авто до 3 лет
	const calculateDutyUnder3Years = (carCost, engineVolume, isDecree140) => {
		// Способ 1: По стоимости автомобиля
		let dutyByPrice;
		if (carCost <= 8500) {
			dutyByPrice = carCost * 0.54;
		} else {
			dutyByPrice = carCost * 0.48;
		}

		// Способ 2: По объему двигателя
		let dutyByEngine;
		if (carCost <= 8500) {
			dutyByEngine = engineVolume * 2.5;
		} else if (carCost <= 16700) {
			dutyByEngine = engineVolume * 3.5;
		} else if (carCost <= 42300) {
			dutyByEngine = engineVolume * 5.5;
		} else if (carCost <= 84500) {
			dutyByEngine = engineVolume * 7.5;
		} else if (carCost <= 169000) {
			dutyByEngine = engineVolume * 15;
		} else {
			dutyByEngine = engineVolume * 20;
		}

		let duty = Math.max(dutyByPrice, dutyByEngine);

		if (isDecree140) {
			duty /= 2;
		}

		return duty;
	};

	// Функция расчета таможенной пошлины для авто от 3 до 5 лет
	const calculateDuty3To5Years = (engineVolume, isDecree140) => {
		let duty;

		if (engineVolume <= 1000) {
			duty = engineVolume * 1.5;
		} else if (engineVolume <= 1500) {
			duty = engineVolume * 1.7;
		} else if (engineVolume <= 1800) {
			duty = engineVolume * 2.5;
		} else if (engineVolume <= 2300) {
			duty = engineVolume * 2.7;
		} else if (engineVolume <= 3000) {
			duty = engineVolume * 3;
		} else {
			duty = engineVolume * 3.6;
		}

		if (isDecree140) {
			duty /= 2;
		}

		return duty;
	};

	// Функция расчета таможенной пошлины для авто старше 5 лет
	const calculateDutyOver5Years = (engineVolume, isDecree140) => {
		let duty;

		if (engineVolume <= 1000) {
			duty = engineVolume * 3;
		} else if (engineVolume <= 1500) {
			duty = engineVolume * 3.2;
		} else if (engineVolume <= 1800) {
			duty = engineVolume * 3.5;
		} else if (engineVolume <= 2300) {
			duty = engineVolume * 4.8;
		} else if (engineVolume <= 3000) {
			duty = engineVolume * 5;
		} else {
			duty = engineVolume * 5.7;
		}

		if (isDecree140) {
			duty /= 2;
		}

		return duty;
	};

	const calculateDutyMoto = (carCost, engineVolume) => {
		let firstIndicator;

		if (engineVolume <= 800) {
			firstIndicator = carCost * 0.15;
		} else {
			firstIndicator = carCost * 0.1;
		}

		const secondIndicator = (carCost + firstIndicator) * 0.2;

		return firstIndicator + secondIndicator;
	};

	const calculateCustomsFees = () => {
		const carCost = parseFloat(carCostInput.value) || 0;
		const engineVolume = parseFloat(engineVolumeInput.value) || 0;
		const carType = getSelectValue("carType");
		const engineType = getSelectValue("engineType");
		const carAge = getSelectValue("carAge");
		const isDecree140 = decree140Checkbox ? decree140Checkbox.checked : false;

		if (carCost <= 0 || engineVolume <= 0) {
			alert("Пожалуйста, заполните все обязательные поля корректно");
			return;
		}

		let duty = 0;
		let recyclingFee = 0;

		if (carType === "auto") {
			if (carAge === "under3") {
				duty = calculateDutyUnder3Years(carCost, engineVolume, isDecree140);
				recyclingFee = RECYCLING_FEE_UNDER_3_BYN * BYN_TO_EUR;
			} else if (carAge === "3to5") {
				duty = calculateDuty3To5Years(engineVolume, isDecree140);
				recyclingFee = RECYCLING_FEE_OVER_3_BYN * BYN_TO_EUR;
			} else if (carAge === "over5") {
				duty = calculateDutyOver5Years(engineVolume, isDecree140);
				recyclingFee = RECYCLING_FEE_OVER_3_BYN * BYN_TO_EUR;
			}
		} else if (carType === "moto") {
			duty = calculateDutyMoto(carCost, engineVolume);
			recyclingFee = 0;
		}

		if (engineType === "electric") {
			duty = 0;
		}

		const customsFee = CUSTOMS_FEE_BYN * BYN_TO_EUR;
		const eptsFee = EPTS_FEE_BYN * BYN_TO_EUR;

		const total = duty + customsFee + recyclingFee + eptsFee;

		resultCarCost.textContent = formatMoney(carCost);
		resultDuty.textContent = formatMoney(duty);
		resultCustomsFee.textContent = formatMoney(customsFee);
		resultRecyclingFee.textContent = formatMoney(recyclingFee);
		resultEPTS.textContent = formatMoney(eptsFee);
		resultTotal.textContent = formatMoney(total);
	};

	// Обработчик события клика на кнопку расчета
	if (calculateButton) {
		calculateButton.addEventListener("click", calculateCustomsFees);
	}

	// Инициализация калькулятора
	initCustomSelects();
	initTooltips();
};
