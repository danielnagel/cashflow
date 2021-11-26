describe("Test Interactor", () => {

    describe("Test generating reports with CSV connector", () => {

        describe("Test falsy parameters", () => {

            test("Unimplemented type returns null", () => {
                expect(null).toBeNull();
            });

        });

    });

});

// reports with the data from connector
// generateReport(ConnectorType, ConnectorOptions, ReportType, ReportOptions)
// generateReport(ConnectorOptions, ReportOptions) {type: CSV, options: CSVOptions} ; {type: CategeorizedFixCost, options: CategorizedFixCosttOptions}