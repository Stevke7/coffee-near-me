import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Card from "@/components/card";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const buttonChangeText = () => {
		console.log("I am clickedddd");
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
					buttonText={"View stores nearby"}
					handleOnClick={buttonChangeText}
				/>
				<div className={styles.heroImage}>
					<Image src="/static/hero-image.png" width={700} height={400} />
				</div>
				<Card />
			</main>
		</div>
	);
}
