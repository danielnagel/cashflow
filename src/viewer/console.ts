import { getTimeStampFromTransaction } from "../utils/dates";
import { round } from "../utils/numbers";

export const printReportAsTable = (configuration: Configuration, report: Report): void => {
    if (!report) {
        console.error("Given object is not a report!");
        return;
    }

    switch (report.type) {
        case "fixcost":
            if (!report.report) {
                console.error("Cannot print Fixcosts report! Report is null.");
                return;
            }
            console.table(fixCostsReportAsTable(configuration, report.report));
            break;
        default:
            console.log(`Unkown report type: ${report.type}!`);
    }
}

const fixCostsReportAsTable = (configuration: Configuration, report: CategorizedFixCosts): FixCostsReportTableRow[] => {
    const tabularData: FixCostsReportTableRow[] = [];
    for (const fixCost of report.fixCosts) {
        const lastBookingDate = new Date(getTimeStampFromTransaction(fixCost.fixCost.transactions[fixCost.fixCost.transactions.length - 1])).toLocaleDateString(configuration.locale);
        tabularData.push({
            category: fixCost.name,
            paid: fixCost.fixCost.isPaidThisMonth,
            bookingDay: fixCost.fixCost.averageBookingDay,
            cost: `${round(fixCost.fixCost.value)} ${configuration.currency}`,
            lastBookingDate
        });
    }
    tabularData.push({ category: "Sum", paid: null, bookingDay: null, cost: `${round(-report.sum)} ${configuration.currency}`, lastBookingDate: null });
    tabularData.push({ category: "Unpaid", paid: null, bookingDay: null, cost: `${round(-report.unpaidSum)} ${configuration.currency}`, lastBookingDate: null });
    return tabularData;
}