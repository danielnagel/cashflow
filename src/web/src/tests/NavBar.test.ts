import { render } from "@testing-library/vue";
import "@testing-library/jest-dom";
import NavBar from "../components/NavBar.vue";
import { fireEvent } from "@testing-library/dom";

const selected =
    "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
const unselected =
    "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

describe("NavBar test", () => {
    test("Initial state", () => {
        const { getByText } = render(NavBar);

        const button1 = getByText("FixedPayDay");
        expect(button1).toHaveClass(unselected);
        const button2 = getByText("Transactions");
        expect(button2).toHaveClass(unselected);
    });

    test("Initialize with selection", () => {
        const { getByText } = render(NavBar, {
            props: {
                selection: "FixedPayDay",
            },
        });

        const button1 = getByText("FixedPayDay");
        expect(button1).toHaveClass(selected);
        const button2 = getByText("Transactions");
        expect(button2).toHaveClass(unselected);
    });
});
