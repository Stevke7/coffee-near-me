import { createApi } from "unsplash-js";

const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlsForStores = (latLong, query) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}`;
};

const getUnsplashPhotos = async () => {
	const photos = await unsplash.search.getPhotos({
		query: "coffee shop",
		page: 1,
		perPage: 30,
	});
	const unsplashResults = photos.response.results;

	return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
	latLong = "44.75900952053855%2C19.213289235768176"
) => {
	const photos = await getUnsplashPhotos();
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
		},
	};

	const response = await fetch(
		getUrlsForStores(latLong, "coffee shop"),
		options
	);
	const data = await response.json();
	return data.results.map((result, idx) => {
		return {
			id: result.fsq_id,
			name: result.name,
			address: result.location.address ? result.location.address : "",
			locality: result.location.locality ? result.location.locality : "",
			imgUrl: photos.length > 0 ? photos[idx] : null,
		};
	});
};
