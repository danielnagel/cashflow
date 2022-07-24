import { getAllByTestId, render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import Transactions from "../components/Transactions.vue";

describe("Transactions component test", () => {
    // test mock data
    const mockedTransactions: Transaction[] = [
        {
            purpose: "test-transaction1",
            date: new Date(2002, 5, 13),
            initiator: "friendly-test-mock",
            value: 11.11,
        },
        {
            purpose: "test-transaction2",
            date: new Date(2020, 6, 12),
            initiator: "friendly-test-mock",
            value: 22.22,
        },
        {
            purpose: "test-transaction3",
            date: new Date(2022, 3, 29),
            initiator: "friendly-test-mock",
            value: 33.33,
        },
    ];

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

    test("loads transactions on mount", async () => {
        // mock fetch()
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockedTransactions),
            }),
        ) as jest.Mock;

        const { getByTestId } = await render(Transactions, {
            props: { visible: true },
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("http://test-server/transactions");

        const tableBody = getByTestId("table-body");

        await waitFor(() => {
            const transactions = getAllByTestId(tableBody, "transaction");
            expect(transactions).toHaveLength(3);
            expect(transactions[0]).toHaveTextContent("test-transaction1");
            expect(transactions[1]).toHaveTextContent("test-transaction2");
            expect(transactions[2]).toHaveTextContent("test-transaction3");
        });
    });

    test("show error message when backend is not reachable", async () => {
        // mock fetch()
        global.fetch = jest.fn(() =>
            Promise.reject("Error backend is down!"),
        ) as jest.Mock;

        const { getByTestId } = await render(Transactions, {
            props: { visible: true },
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("http://test-server/transactions");

        await waitFor(() => {
            const alert = getByTestId("alert");
            expect(alert).toHaveAttribute(
                "message",
                "Backend server is unreachable.",
            );
        });
    });
});
