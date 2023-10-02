import { table, findRecordByFilter, getMinifiedRecords } from "@/lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
	if (req.method === "PUT") {
		try {
			const { id } = req.body;
			if (id) {
				const records = await findRecordByFilter(id);

				if (records.length !== 0) {
					const record = records[0];

					const calculateVoting = parseInt(record.voting) + parseInt(1);

					const updateRecord = await table.update([
						{
							id: record.recordId,
							fields: {
								voting: calculateVoting,
							},
						},
					]);

					if (updateRecord) {
						const minifiedRecords = getMinifiedRecords(updateRecord);
						res.json(minifiedRecords);
					}

					//res.json(records);
				} else {
					res.json({ message: "Id of a store doesnt exist", id });
				}
			} else {
				res.status(400);
				res.json({ message: "ID provided doesn't exist", id });
			}
		} catch (error) {
			res.json({ message: "Error upvoting", error });
			res.status(500);
		}
	}
};
export default upvoteCoffeeStoreById;
