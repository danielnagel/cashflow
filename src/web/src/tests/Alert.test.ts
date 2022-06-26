import { render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import Alert from "../components/Alert.vue";

describe("Alert component test", () => {
    test("Initial state", () => {
        const { getByTestId } = render(Alert);

        const alert = getByTestId("alert");
        expect(alert).not.toBeVisible();
    });

    test("Given message prop should be displayed", async () => {
        const { getByTestId } = render(Alert, {
            props: {
                message: "Some really important text!",
            },
        });

        await waitFor(() => {
            const alert = getByTestId("alert");
            expect(alert).toBeVisible();
            expect(alert).toHaveTextContent("Some really important text!");
        });
    });
});
