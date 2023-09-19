import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Card from "@/components/card";
import coffeeStoresData from "../data/coffee-stores.json";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

/**
 *
 * Prerenders content using Static side generation
 * All data available and cached in CDN
 */
export async function getStaticProps(context) {
	const coffeeStores = await fetchCoffeeStores();

	return {
		props: { coffeeStores }, //will be passed to the page component as props
	};
}

export default function Home(props) {
	const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
		useTrackLocation();

	console.log({ locationErrorMsg, isFindingLocation });

	//const [coffeeStores, setCoffeeStores] = useState("");
	const [coffeeStoresError, setCoffeeStoresError] = useState(null);
	const { dispatch, state } = useContext(StoreContext);
	const { coffeeStores, latLong } = state;
	useEffect(() => {
		async function setCoffeeStoresByLocation() {
			if (latLong) {
				try {
					const fetchedCoffeeStores = await fetchCoffeeStores(latLong);
					console.log({ fetchedCoffeeStores });
					//setCoffeeStores(fetchedCoffeeStores);
					dispatch({
						type: ACTION_TYPES.SET_COFFEE_STORES,
						payload: { coffeeStores: fetchedCoffeeStores },
					});
					//set coffee stores
				} catch (error) {
					console.log({ error });
					setCoffeeStoresError(error.message);
				}
			}
		}
		setCoffeeStoresByLocation();
	}, [latLong]);

	const handleNearbyStoresClick = () => {
		handleTrackLocation();
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Coffee Connoisseur</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<Banner
					buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
					handleOnClick={handleNearbyStoresClick}
				/>
				{locationErrorMsg && (
					<p className={styles.errorLocating}>
						Something went wrong: {locationErrorMsg}
					</p>
				)}
				{coffeeStoresError && (
					<p className={styles.errorLocating}>
						Something went wrong: {coffeeStoresError}
					</p>
				)}
				<div className={styles.heroImage}>
					<Image
						alt="Hero"
						src="/static/hero-image.png"
						width={700}
						height={400}
					/>
				</div>
				{coffeeStores.length > 0 && (
					<div className={styles.sectionWrapper}>
						<h2 className={styles.heading2}>Stores near me</h2>
						<div className={styles.cardLayout}>
							{coffeeStores.map((coffeeStore) => {
								return (
									<Card
										key={coffeeStore.id}
										className={styles.card}
										name={coffeeStore.name}
										imgUrl={
											coffeeStore.imgUrl ||
											"https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
										}
										href={`/coffee-store/${coffeeStore.id}`}
									/>
								);
							})}
						</div>
					</div>
				)}

				{props.coffeeStores.length > 0 && (
					<div className={styles.sectionWrapper}>
						<h2 className={styles.heading2}>Bijeljina Stores</h2>
						<div className={styles.cardLayout}>
							{props.coffeeStores.map((coffeeStore) => {
								return (
									<Card
										key={coffeeStore.id}
										className={styles.card}
										name={coffeeStore.name}
										imgUrl={
											coffeeStore.imgUrl ||
											"https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
										}
										href={`/coffee-store/${coffeeStore.id}`}
									/>
								);
							})}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
