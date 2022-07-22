<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";

const props = defineProps<{
    items?: string[];
    selected?: string;
    label?: string;
    noSelectionText?: string;
}>();

const emit = defineEmits(["change"]);

const selected = ref("");
const label = ref("");
const noSelectionText = ref("Please choose an option");

const handleChange = (event: Event) => {
    event.preventDefault();

    const value = (event.target as HTMLSelectElement).value;
    if (typeof value === "string") emit("change", value);
};

watch(
    () => props.selected,
    () => {
        if (typeof props.selected === "string") selected.value = props.selected;
    },
);
watch(
    () => props.label,
    () => {
        if (typeof props.label === "string") label.value = props.label;
    },
);
watch(
    () => props.noSelectionText,
    () => {
        if (typeof props.noSelectionText === "string")
            noSelectionText.value = props.noSelectionText;
    },
);

onBeforeMount(() => {
    if (typeof props.selected === "string") selected.value = props.selected;
    if (typeof props.label === "string") label.value = props.label;
    if (typeof props.noSelectionText === "string")
        noSelectionText.value = props.noSelectionText;
});
</script>

<template>
    <div class="combo-box my-4">
        <label
            for="combo-box-selection"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >{{ label }}</label
        >
        <select
            v-model="selected"
            id="combo-box-selection"
            class="block p-2 mb-6 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            @change="handleChange"
        >
            <option disabled value="">{{ noSelectionText }}</option>
            <option v-for="i of items" :value="i">{{ i }}</option>
        </select>
    </div>
</template>
