import Link from "next/link";
import { useRouter } from "next/router";

const coffeeStore = () => {
	const router = useRouter();

	return (
		<div>
			cofee store page {router.query.id}
			<Link href="/">Back to Home </Link>
		</div>
	);
};

export default coffeeStore;
