(() => {
	const form = document.querySelector('form');
	const resetBtn = document.querySelector("button[name='resetBtn']");
	const playerTableBody = document.querySelector('table.player-score-table tbody');
	const scoreDetailsBtn = document.querySelector("button[name='score-details-btn']");
	const closeDetailsBtn = document.querySelector("button[name='close-details-btn']");
	const scoreDetailsWrapper = document.querySelector('#score-details-wrapper');
	const allPlayersTableBody = document.querySelector('table.score-details-table tbody');

	let formData = null;

	const allPlayersScores = [];

	const formManager = {
		init: function () {
			this.attachEvents();
		},

		attachEvents: function () {
			const _this = this;

			form.onsubmit = function (e) {
				e.preventDefault();
				_this.calculateScore();
			};

			resetBtn.addEventListener('click', () => form.reset());

			scoreDetailsBtn.addEventListener('click', () => {
				this.renderAllPlayers();
				scoreDetailsWrapper.classList.add('show');
			});

			closeDetailsBtn.addEventListener('click', () => {
				scoreDetailsWrapper.classList.remove('show');
			});
		},

		calculatePow: (value) => {
			return Math.pow(value, 2);
		},

		renderPlayer: (name, score) => {
			const playerFragment = new DocumentFragment();
			const tr = document.createElement('tr');
			const tdName = document.createElement('td');
			const tdScore = document.createElement('td');

			tdName.append(name);
			tdScore.append(score);
			tr.append(tdName);
			tr.append(tdScore);
			playerFragment.append(tr);

			playerTableBody.append(playerFragment);
		},

		renderAllPlayers: () => {
			// clear the previous lines
			allPlayersTableBody.innerHTML = '';

			const allPlayersFragment = new DocumentFragment();

			allPlayersScores.forEach((playerMap) => {
				const tr = document.createElement('tr');

				for (const [propName, value] of playerMap) {
					const td = document.createElement('td');
					td.textContent = value;
					tr.append(td);
				}

				allPlayersFragment.append(tr);
			});

			allPlayersTableBody.append(allPlayersFragment);
		},

		reset: () => {
			formData = null;
		},

		calculateScore: function () {
			formData = new FormData(form);

			const playerName = formData.get('playerName');
			const military = formData.get('military');
			const coins = formData.get('coins');
			const wonder = formData.get('wonder');
			const civilian = formData.get('civilian');

			const symbolA = formData.get('scientific_SymbolA');
			const symbolB = formData.get('scientific_SymbolB');
			const symbolC = formData.get('scientific_SymbolC');
			const symbolAPoints = this.calculatePow(symbolA);
			const symbolBPoints = this.calculatePow(symbolB);
			const symbolCPoints = this.calculatePow(symbolC);
			const suits = Math.min(symbolA, symbolB, symbolC);
			const suitsPoints = suits * 7;

			const commercial = formData.get('commercial');
			const guilds = formData.get('guilds');
			const treasuryPoints = Math.floor(coins / 3);

			const totalScore = this.calculateSum(
				military,
				wonder,
				civilian,
				symbolAPoints,
				symbolBPoints,
				symbolCPoints,
				suitsPoints,
				commercial,
				guilds,
				treasuryPoints
			);

			const playerScoreMap = new Map();

			playerScoreMap.set('playerName', playerName);
			playerScoreMap.set('military', military);
			playerScoreMap.set('treasuryNr', coins);
			playerScoreMap.set('treasuryPoints', treasuryPoints);
			playerScoreMap.set('wonder', wonder);
			playerScoreMap.set('civilian', civilian);
			playerScoreMap.set('symbolANr', symbolA);
			playerScoreMap.set('symbolAPoints', symbolAPoints);
			playerScoreMap.set('symbolBNr', symbolB);
			playerScoreMap.set('symbolBPoints', symbolBPoints);
			playerScoreMap.set('symbolCNr', symbolC);
			playerScoreMap.set('symbolCPoints', symbolCPoints);
			playerScoreMap.set('commercial', commercial);
			playerScoreMap.set('guilds', guilds);
			playerScoreMap.set('totalScore', totalScore);

			allPlayersScores.push(playerScoreMap);

			this.renderPlayer(playerName, totalScore);
			this.reset();
		},

		calculateSum: (...points) => {
			return points.reduce((total, value) => (total += Number(value)), 0);
		},
	};

	formManager.init();
})();
