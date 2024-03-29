<script setup lang="ts">
import { computed, watch, ref, onMounted } from "vue";
import { isApplicationError } from "../../../utils/typeguards";
import { formatDate } from "../../../utils/dates";
import { roundToString } from "../../../utils/numbers";
import { getApi } from "../utilities/api";

const props = defineProps<{
    visible?: boolean;
}>();

const error = ref("");
const fixedPayDayReport = ref(
    null as CategorizedFixedPayDays | ApplicationError | null,
);

const loadApiData = async () => {
    error.value = "";
    try {
        const result = await getApi("/fixedpayday");
        fixedPayDayReport.value = result as CategorizedFixedPayDays;
    } catch (e: any) {
        if (typeof e === "string") error.value = e;
    }
};

const categorizedFixedPayDay = computed((): CategorizedFixedPayDays | null => {
    if (fixedPayDayReport.value === null) return null;

    if (isApplicationError(fixedPayDayReport.value)) {
        error.value = fixedPayDayReport.value.message;
        return null;
    }

    return fixedPayDayReport.value;
});

const namedFixedPayDays = computed((): NamedFixedPayDay[] => {
    if (categorizedFixedPayDay.value === null) return [];

    return categorizedFixedPayDay.value.namedFixedPayDays;
});

const lastBookingDate = (fixedPayDay: FixedPayDay): string => {
    if (
        !fixedPayDay ||
        fixedPayDay.transactions.length === 0 ||
        !fixedPayDay.transactions[fixedPayDay.transactions.length - 1].date
    )
        return "invalid date";

    const date = formatDate(
        new Date(
            fixedPayDay.transactions[fixedPayDay.transactions.length - 1].date,
        ),
    );
    if (date === null) return "invalid date";
    return date;
};

const isPaidStyle = (nfpd: NamedFixedPayDay): string[] => {
    const styles: string[] = [
        "border-b",
        "dark:border-gray-700",
        "bg-gray-100",
        "dark:bg-gray-800",
    ];

    if (nfpd && nfpd.fixedPayDay && nfpd.fixedPayDay.isPaid) {
        styles.pop();
        styles.pop();
        styles.push("bg-green-300");
        styles.push("dark:bg-green-700");
        styles.push("text-gray-900");
        styles.push("dark:text-gray-300");
    }

    return styles;
};

const setup = () => {
    if (props.visible && fixedPayDayReport.value === null) {
        loadApiData();
    }
};

onMounted(() => setup());
watch(
    () => props.visible,
    () => setup(),
);
</script>

<template>
    <div
        id="fixedpayday-root"
        class="relative overflow-x-auto shadow-md"
        v-show="visible"
    >
        <alert :message="error" data-testid="alert"></alert>
        <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-6 py-3">Name</th>
                    <th class="px-6 py-3">Value</th>
                    <th class="px-6 py-3">Paid</th>
                    <th class="px-6 py-3">Date</th>
                </tr>
            </thead>
            <tbody data-testid="table-body">
                <tr
                    v-for="fixed of namedFixedPayDays"
                    :key="fixed.name"
                    :class="isPaidStyle(fixed)"
                    data-testid="fixedpayday"
                >
                    <th
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                        {{ fixed.name }}
                    </th>
                    <td class="px-6 py-4">
                        {{ roundToString(fixed.fixedPayDay.value) }}
                    </td>
                    <td class="px-6 py-4">{{ fixed.fixedPayDay.isPaid }}</td>
                    <td class="px-6 py-4">
                        {{ lastBookingDate(fixed.fixedPayDay) }}
                    </td>
                </tr>
                <tr
                    class="bg-gray-300 text-gray-700 border-b dark:bg-gray-700 dark:border-gray-700 dark:text-white"
                    data-testid="summary"
                >
                    <td class="px-6 py-4 font-medium whitespace-nowrap">
                        Sum (all)
                    </td>
                    <td class="px-6 py-4">
                        {{
                            categorizedFixedPayDay
                                ? roundToString(categorizedFixedPayDay.sum)
                                : "invalid number"
                        }}
                    </td>
                    <td class="px-6 py-4 font-medium whitespace-nowrap">
                        Sum (unpaid)
                    </td>
                    <td class="px-6 py-4">
                        {{
                            categorizedFixedPayDay
                                ? roundToString(
                                      categorizedFixedPayDay.unpaidSum,
                                  )
                                : "invalid number"
                        }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
