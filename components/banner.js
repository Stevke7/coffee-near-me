import styles from "./banner.module.css";

export default function Banner({ buttonText, handleOnClick }) {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				<span className={styles.title1}>Coffee</span>
				<span className={styles.title2}>Connoisseur</span>
			</h1>
			<p className={styles.subTitle}>Discover Your local coffee shops</p>
			<span className={styles.buttonWrapper}>
				<button onClick={handleOnClick} className={styles.button}>
					{buttonText}
				</button>
			</span>
		</div>
	);
}
