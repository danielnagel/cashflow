import { render } from "@testing-library/vue";
import "@testing-library/jest-dom";
import NavBar from "../components/NavBar.vue";
import { ReportType } from "../utilities/enums";

const selected =
    "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
const unselected =
    "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

describe("NavBar component test", () => {
    test("Initialize with selection", () => {
        const { getByText } = render(NavBar, {
            props: {
                selection: ReportType.FixedPayDay,
                options: Object.values(ReportType),
            },
        });

        for (const text of Object.values(ReportType)) {
            const button = getByText(text);
            expect(button).toHaveClass(
                text === ReportType.FixedPayDay ? selected : unselected,
            );
        }
    });
});
