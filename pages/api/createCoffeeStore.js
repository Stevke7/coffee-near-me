import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
	if (req.method === "POST") {
		const { id, name, address, locality, voting, imageUrl } = req.body;

		try {
			if (id) {
				const records = await findRecordByFilter(id);

				if (records.length !== 0) {
					res.json(records);
				} else {
					//create a record
					if (name) {
						const createCoffeeStoreRecord = await table.create([
							{
								fields: {
									id,
									name,
									address,
									locality,
									voting,
									imageUrl,
								},
							},
						]);
						const records = getMinifiedRecords(createCoffeeStoreRecord);
						res.json({
							records: records,
						});
					} else {
						res.status(400);
						res.json({ message: "Name is missing" });
					}
				}
			} else {
				res.status(400);
				res.json({ message: "Id is missing" });
			}
		} catch (err) {
			console.log("Err finding store", err);
			res.status(500);
			res.json({ message: "Something went wrong", err });
		}
	}
};

export default createCoffeeStore;
