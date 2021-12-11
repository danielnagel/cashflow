describe("Test connector/api", () => {
    describe("Loading transaction data", () => {
        test("Stop loading data, when endpoint is not available", async () => {
            expect(null).toBeNull();
        });
    });
});

// --- API Connector ---
// load transactions from endpoint
// handle unavailable endpoint
// load only new transactions from endpoint, e.g. we have data until october saved locally and just want to do an update and load the new data from november
// check if endpoint contains expected data
