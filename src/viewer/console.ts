import { getTimeStampFromTransaction } from "../utils/dates";

export const printReportAsTable = (configuration: Configuration, report: Report): void => {
    if(!report) {
        console.error("Given object is not a report!");
         return;
    }

    switch(report.type) {
        case "fixcost":
            if(!report.report) {
                console.error("Cannot print Fixcosts report! Report is null.");
                return;
            }
            printFixCostsReportAsTable(configuration, report.report);
            break;
        default:
            console.log(`Unkown report type: ${report.type}!`);
    }
}

const printFixCostsReportAsTable = (configuration: Configuration, report: CategorizedFixCosts) => {
    console.log(`Report Date: ${new Date(report.date).toLocaleDateString(configuration.locale)}`);
    console.log(`Sum of all fix costs: ${-report.sum} ${configuration.currency}`);
    console.log(`Still to pay this month: ${report.unpaidSum} ${configuration.currency}`);
    console.log("\n\nCategories:\n\n");

    const tabularData = [];
    for(const fixCost of report.fixCosts) {
        const lastBookingDate = new Date(getTimeStampFromTransaction(fixCost.fixCost.transactions[fixCost.fixCost.transactions.length - 1])).toLocaleDateString(configuration.locale);
        tabularData.push({category: fixCost.name, paid: fixCost.fixCost.isPaidThisMonth, bookingDay: fixCost.fixCost.averageBookingDay, cost: fixCost.fixCost.value, lastBookingDate});
    }
    console.table(tabularData);
}