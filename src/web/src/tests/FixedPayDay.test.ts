import { getAllByTestId, render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import FixedPayDay from "../components/FixedPayDay.vue";

describe("Transactions component test", () => {
    // test mock data
    const mockedCategorizedFixedPayDays: CategorizedFixedPayDays = {
        namedFixedPayDays: [
            {
                name: "category1",
                fixedPayDay: { value: 100, isPaid: false, transactions: [] },
            },
            {
                name: "category2",
                fixedPayDay: { value: 100, isPaid: false, transactions: [] },
            },
            {
                name: "category3",
                fixedPayDay: { value: 100, isPaid: true, transactions: [] },
            },
        ],
        sum: 300,
        unpaidSum: 200,
    };

    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            BACKEND_ADDRESS: "test-server",
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    test("loads fixedpayday report on mount", async () => {
        // mock fetch()
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockedCategorizedFixedPayDays),
            }),
        ) as jest.Mock;

        const { getByTestId } = await render(FixedPayDay, {
            props: { visible: true },
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("http://test-server/fixedpayday");

        const tableBody = getByTestId("table-body");

        await waitFor(() => {
            const categories = getAllByTestId(tableBody, "fixedpayday");
            expect(categories).toHaveLength(3);
            expect(categories[0]).toHaveTextContent("category1");
            expect(categories[0]).not.toHaveClass("bg-green-300");
            expect(categories[1]).toHaveTextContent("category2");
            expect(categories[1]).not.toHaveClass("bg-green-300");
            expect(categories[2]).toHaveTextContent("category3");
            expect(categories[2]).toHaveClass("bg-green-300"); // is paid

            const summary = getByTestId("summary");
            expect(summary).toHaveTextContent("300");
            expect(summary).toHaveTextContent("200");
        });
    });

    test("show error message when backend is not reachable", async () => {
        // mock fetch()
        global.fetch = jest.fn(() =>
            Promise.reject("Error backend is down!"),
        ) as jest.Mock;

        const { getByTestId } = await render(FixedPayDay, {
            props: { visible: true },
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("http://test-server/fixedpayday");

        await waitFor(() => {
            const alert = getByTestId("alert");
            expect(alert).toHaveTextContent("Backend server is unreachable.");
        });
    });
});
