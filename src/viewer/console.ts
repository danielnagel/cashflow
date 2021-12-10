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
    const dateFormat = configuration.viewer?.dateFormat ? configuration.viewer.dateFormat : "dd.MM.yyyy";
    const currency = configuration.viewer?.currency ? configuration.viewer.currency : "€$";
    for (const fixCost of report.fixCosts) {
        const lastBookingDate = formatDate(new Date(getTimeStampFromTransaction(fixCost.fixCost.transactions[fixCost.fixCost.transactions.length - 1])), dateFormat);
        tabularData.push({
            category: fixCost.name,
            paid: fixCost.fixCost.isPaidThisMonth,
            bookingDay: fixCost.fixCost.averageBookingDay,
            cost: `${round(fixCost.fixCost.value)} ${currency}`,
            lastBookingDate
        });
    }
    tabularData.push({ category: "Sum", paid: null, bookingDay: null, cost: `${round(-report.sum)} ${currency}`, lastBookingDate: null });
    tabularData.push({ category: "Unpaid", paid: null, bookingDay: null, cost: `${round(-report.unpaidSum)} ${currency}`, lastBookingDate: null });
    return tabularData;
}