<script setup lang="ts">
import "billboard.js/dist/theme/insight.css";
import bb, { area } from "billboard.js";
import { onMounted, ref } from "vue";
import { isApplicationError } from "../../../utils/typeguards";
import { TransactionType } from "../../../types/enums";
import Alert from "./Alert.vue";

const error = ref("");
const trendReportTable = ref(
    null as TrendReportTableRow[] | ApplicationError | null,
);

const setup = async () => {
    error.value = "";

    const url = `http://${process.env.BACKEND_ADDRESS}/trend`;
    let response = null;
    try {
        response = await fetch(url);
    } catch (e: any) {
        error.value = `Backend server is unreachable.`;
        return;
    }

    try {
        trendReportTable.value = await response.json();
    } catch (e: any) {
        error.value = `Couldn't parse JSON data. Expected fixed pay day report json, got unparsable object.`;
    }

    if (isApplicationError(trendReportTable.value)) {
        error.value = trendReportTable.value.message;
    }
};

const getData = (transactionType: string): Array<string | number> => {
    const table = trendReportTable.value;

    const result: Array<string | number> = [];

    if (isApplicationError(table) || table === null) {
        return result;
    }

    for (const row of table) {
        if (row.category === transactionType) {
            result.push(row.category);
            for (const value of Object.values(row)) {
                if (value === transactionType || value === null) continue;
                let number = parseFloat(value.substring(0, value.length - 2));
                if (number < 0) number *= -1;
                result.push(number);
            }
        }
    }
    return result;
};

const getX = (): string[] => {
    const result = ["x"];
    const table = trendReportTable.value;

    if (isApplicationError(table) || table === null) {
        return result;
    }

    const firstRow = table[0];
    for (const key of Object.keys(firstRow)) {
        if (key === "category") continue;
        result.push(key);
    }
    return result;
};

onMounted(async () => {
    await setup();

    const xAxis = getX();
    const incomeData = getData(TransactionType.Income);
    const fixedData = getData(TransactionType.Fixed);
    const variableData = getData(TransactionType.Variable);

    bb.generate({
        data: {
            x: "x",
            columns: [xAxis, incomeData, fixedData, variableData],
            types: {
                [incomeData[0]]: area(),
                [fixedData[0]]: area(),
                [variableData[0]]: area(),
            },
            groups: [
                [incomeData[0].toString()],
                [fixedData[0].toString(), variableData[0].toString()],
            ],
        },
        bindto: "#stackedAreaChart",
    });
});
</script>

<template>
    <div id="trend-root" class="relative overflow-x-auto">
        <alert :message="error"></alert>
        <div id="stackedAreaChart"></div>
    </div>
</template>
