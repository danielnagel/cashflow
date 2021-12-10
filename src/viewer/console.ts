import { getTimeStampFromTransaction, formatDate } from "../utils/dates";
import { round } from "../utils/numbers";

export const generateReportAsTable = (configuration: Configuration, report: Report): FixCostsReportTableRow[] | ApplicationError => {

    switch (report.type) {
        case "fixcost":
            if (!report.report) {
                return { source: "viewer.ts", message: "Cannot print Fixcosts report! Report is null." }
            }
            return fixCostsReportAsTable(configuration, report.report);
        default:
            return { source: "viewer.ts", message: `Unkown report type: ${report.type}!` }
    }
}

const fixCostsReportAsTable = (configuration: Configuration, report: CategorizedFixCosts): FixCostsReportTableRow[] => {
    const tabularData: FixCostsReportTableRow[] = [];
    for (const fixCost of report.fixCosts) {
        const lastBookingDate = formatDate(new Date(getTimeStampFromTransaction(fixCost.fixCost.transactions[fixCost.fixCost.transactions.length - 1])), configuration.dateFormat);
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