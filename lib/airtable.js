const Airtable = require("airtable");
const base = new Airtable({
	apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

const table = base("coffee-stores");

const getMinifiedRecord = (record) => {
	return {
		recordId: record.id,
		...record.fields,
	};
};

const getMinifiedRecords = (records) => {
	return records.map((record) => getMinifiedRecord(record));
};

const findRecordByFilter = async (id) => {
	const findCoffeeStoreRecords = await table
		.select({
			filterByFormula: `id="${id}"`,
		})
		.firstPage();

	if (findCoffeeStoreRecords.length !== 0) {
		return getMinifiedRecords(findCoffeeStoreRecords);
	}

	return [];
};

export { table, getMinifiedRecords, findRecordByFilter };
