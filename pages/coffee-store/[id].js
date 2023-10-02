import Link from "next/link";
import { useRouter } from "next/router";
import coffeeStoresData from "../../data/coffee-stores.json";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty, fetcher } from "@/utils";
import useSWR from "swr";

export async function getStaticProps(staticProps) {
	const params = staticProps.params;
	const coffeeStores = await fetchCoffeeStores();
	const findStoreById = coffeeStores.find((coffeeStore) => {
		return coffeeStore.id.toString() === params.id;
	});

	return {
		props: {
			coffeeStore: findStoreById ? findStoreById : {},
		},
	};
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores();
	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: {
				id: coffeeStore.id.toString(),
			},
		};
	});
	return {
		paths,
		fallback: true,
	};
}

const CoffeeStore = (initialProps) => {
	const router = useRouter();

	if (router.isFallback) {
		return <div>Loading....</div>;
	}

	const id = router.query.id;

	const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

	const {
		state: { coffeeStores },
	} = useContext(StoreContext);

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, voting, address, locality, imageUrl } = coffeeStore;

			const response = await fetch("/api/createCoffeeStore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name,
					voting: 0,
					address: address || " ",
					locality: locality || "",
					imageUrl,
				}),
			});

			const dbCoffeeStore = await response.json();
		} catch (err) {
			console.log("Error creating coffee store");
		}
	};

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id;
				});
				if (coffeeStoreFromContext) {
					setCoffeeStore(coffeeStoreFromContext);
					handleCreateCoffeeStore(coffeeStoreFromContext);
				}
			}
		} else {
			handleCreateCoffeeStore(initialProps.coffeeStore);
		}
	}, [id, initialProps, initialProps.coffeeStore]);

	const { name, address, locality, imgUrl } = coffeeStore;
	const [votingCount, setVotingCount] = useState(0);

	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

	useEffect(() => {
		if (data && data.length > 0) {
			setCoffeeStore(data[0]);
			setVotingCount(data[0].voting);
		}
	}, [data]);

	if (error) {
		return <div>Something went wrong retrieving coffee store page</div>;
	}

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch("/api/upvoteCoffeeStoreById", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});

			const dbCoffeeStore = await response.json();

			const count = votingCount + 1;
			setVotingCount(count);
		} catch (err) {
			console.log("Error upvoting coffee store");
		}
	};

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link legacyBehavior href="/">
							<a>← Back to Home </a>
						</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}> {name}</h1>
					</div>

					<Image
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
						}
						width={600}
						height={360}
						className={styles.storeImg}
						alt={name ? name : " "}
					></Image>
				</div>
				<div className={cls("glass", styles.col2)}>
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/places.svg"
							width={24}
							height={24}
							alt={name ? name : " "}
						></Image>
						<p className={styles.text}>{address}</p>
					</div>
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/nearMe.svg"
							width={24}
							height={24}
							alt={name ? name : " "}
						></Image>
						<p className={styles.text}>{locality}</p>
					</div>
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/star.svg"
							width={24}
							height={24}
							alt={name ? name : " "}
						></Image>
						<p className={styles.text}>{votingCount}</p>
					</div>

					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>
						Up vote
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoffeeStore;
