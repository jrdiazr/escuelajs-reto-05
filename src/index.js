localStorage.clear();
const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";
const getData = api => {
	/**
   Se deja de observar el elemento para que no haga mas llamados 
   hasta que termine la ejecucion de la promise del fetch
  */
	intersectionObserver.unobserve($observe);
	fetch(api)
		.then(response => response.json())
		.then(response => {
			const characters = response.results;
			let output = characters
				.map(character => {
					return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
				})
				.join("");
			let newItem = document.createElement("section");
			newItem.classList.add("Items");
			newItem.innerHTML = output;
			$app.appendChild(newItem);
			localStorage.setItem("next_fetch", response.info.next);
			/**
        Se activa el observar el elemento nuevamente porque ya resuelve la promise.
      */
			intersectionObserver.observe($observe);
		})
		.catch(error => {
			/**
        Se activa el observar el elemento nuevamente porque la promise tuvo error.
      */
			intersectionObserver.observe($observe);
			console.log(error);
		});
};

const loadData = async () => {
	const next_fetch = localStorage.getItem("next_fetch");
	let call = next_fetch !== null ? next_fetch : API;
	call === "" ? lastPetition() : await getData(call);
};

const lastPetition = () => {
	const output = `<h2><span>Ya no hay personajes...</span></h2>`;
	let newItem = document.createElement("section");
	newItem.innerHTML = output;
	$app.appendChild(newItem);
	intersectionObserver.unobserve($observe);
};

const intersectionObserver = new IntersectionObserver(
	async entries => {
		if (entries[0].isIntersecting) {
			await loadData();
		}
	},
	{
		rootMargin: "0px 0px 100% 0px"
	}
);

intersectionObserver.observe($observe);
