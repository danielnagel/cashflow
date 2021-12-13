describe("Test report/trend", () => {
    describe("Generate trend", () => {
        test("stub", async () => {
            expect(null).toBeNull();
        });
    });
});

// generate a trend for transactions, that are grouped as a transaction type
// -- TransactionType { Income, Fixed, Variable, Special }
// -- Trend {bookingDate, value}
// generarte a trend report for every transaction type; { TransactionType, Trend[] }
