import { fileExists, loadTransactionData, parseRecordToTransaction } from "../../src/connector/csvConnector"

describe("Test CSVConnector", () => {

    describe("Check if files exist", () => {
        test("True if files exist", () => {
            expect(fileExists(__dirname + "/samples/sample1.csv")).toBeTruthy();
        });
        test("False if files do not exist", () => {
            expect(fileExists(__dirname + "/samples/sample1_.csv")).toBeFalsy();
        });
        test("False if path string empty", () => {
            expect(fileExists("")).toBeFalsy();
        });
    });

    describe("Parse record to transaction", () => {
        const dataKeys = { date: "booking", initiator: "initiator", purpose: "use", value: "amount" };
        const record = { booking: "01.11.2021", initiator: "FOOD SHOP 1", use: "Thanks for paying the food", amount: "-23,00", randominformation: "blub" };
        const expected = { initiator: "FOOD SHOP 1", purpose: "Thanks for paying the food", value: -23, day: 1, month: 11, year: 2021 }

        test("Return null, if record is invalid", async () => {
            expect(parseRecordToTransaction({}, dataKeys)).toBeNull();
        });

        test("Return null, if can't match data keys to record", async () => {
            expect(parseRecordToTransaction({ example: "wow" }, dataKeys)).toBeNull();
        });

        test("Return transaction, if data keys match record", async () => {
            expect(parseRecordToTransaction(record, dataKeys)).toStrictEqual(expected);
        });

        test("Return null, if booking date has not the expected format", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "01-11-2021";
            expect(parseRecordToTransaction(recordCopy, dataKeys)).toBeNull();
        });

        test("Return null, if day of booking date can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "o1.11.2021";
            expect(parseRecordToTransaction(recordCopy, dataKeys)).toBeNull();
        });

        test("Return null, if month of booking date can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "01.II.2021";
            expect(parseRecordToTransaction(recordCopy, dataKeys)).toBeNull();
        });

        test("Return null, if year of booking date can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "1.11.asdf";
            expect(parseRecordToTransaction(recordCopy, dataKeys)).toBeNull();
        });

        test("Return null, if amount can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.amount = "1.O1";
            expect(parseRecordToTransaction(recordCopy, dataKeys)).toBeNull();
        });
    });

    describe("Loading transaction data", () => {

        test("Stop loading data, when file does not exist", async () => {
            const transactionData = await loadTransactionData({ path: __dirname + "/samples/sample1_.csv", dataKeys: { date: "", initiator: "", purpose: "", value: "" }, columns: [] });
            expect(transactionData).toHaveLength(0);
        });

        test("Load data from existing sample file and generate transaction array", async () => {
            const transactionData = await loadTransactionData({ path: __dirname + "/samples/sample1.csv", dataKeys: { date: "booking", initiator: "initiator", purpose: "use", value: "amount" }, columns: ["booking", "valuta", "initiator", "bookingtext", "randominformation", "use", "balance", "currency", "amount", "currency"] });
            expect(transactionData).toHaveLength(3);
            expect(transactionData[0]).toStrictEqual({ initiator: "FOOD SHOP 1", purpose: "Thanks for paying the food", value: -23, day: 1, month: 11, year: 2021 });
            expect(transactionData[1]).toStrictEqual({ initiator: "ONLINE SHOP 3", purpose: "Good choice mate 2345452", value: -57.21, day: 2, month: 11, year: 2021 });
            expect(transactionData[2]).toStrictEqual({ initiator: "ONLINE SHOP 3", purpose: "Good choice mate 2344534", value: -7.99, day: 3, month: 11, year: 2021 });
        });

        test("Load data from sample file, with german and american decimals, and generate transaction array", async () => {
            const transactionData = await loadTransactionData({ path: __dirname + "/samples/sample2.csv", dataKeys: { date: "booking", initiator: "initiator", purpose: "use", value: "amount" }, columns: ["booking", "valuta", "initiator", "bookingtext", "randominformation", "use", "balance", "currency", "amount", "currency"] });
            expect(transactionData).toHaveLength(10);
            expect(transactionData[0]).toStrictEqual({ initiator: "FOOD SHOP 1", purpose: "Thanks for paying the food", value: -23, day: 1, month: 11, year: 2021 });
            expect(transactionData[1]).toStrictEqual({ initiator: "ONLINE SHOP 3", purpose: "Good choice mate 2345452", value: -57.21, day: 2, month: 11, year: 2021 });
            expect(transactionData[2]).toStrictEqual({ initiator: "ONLINE SHOP 3", purpose: "Good choice mate 2344534", value: -7.99, day: 3, month: 11, year: 2021 });
            expect(transactionData[3]).toStrictEqual({ initiator: "Rent for my crib", purpose: "Thanks landlord", value: -650, day: 1, month: 6, year: 2021 });
            expect(transactionData[4]).toStrictEqual({ initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: -12.99, day: 1, month: 6, year: 2021 });
            expect(transactionData[5]).toStrictEqual({ initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: -109.56, day: 7, month: 7, year: 2021 });
            expect(transactionData[6]).toStrictEqual({ initiator: "Rent for my crib", purpose: "Thanks landlord", value: -650, day: 1, month: 9, year: 2021 });
            expect(transactionData[7]).toStrictEqual({ initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: -14.99, day: 3, month: 9, year: 2021 });
            expect(transactionData[8]).toStrictEqual({ initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: -88.86, day: 11, month: 8, year: 2021 });
            expect(transactionData[9]).toStrictEqual({ initiator: "Rent for my crib", purpose: "Thanks landlord", value: -650, day: 1, month: 8, year: 2021 });
        });
    });
});

// --- CSV Connector ---
// use date format function, instead of splitting the date
// load and merge raw transactions from multiple files
// load parsed transactions from one file
// stop parsed raw transactions when file does not exist
// load and merge parsed transactions from multiple files
// save parsed transactions into a new file
// load report from one file
// stop loading report when file does not exist
// save report into a new file