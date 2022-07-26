<script setup lang="ts">
const props = defineProps<{
    selection?: string;
    options?: string[];
}>();

const isSelected = (name: string): string => {
    const selected =
        "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
    const unselected =
        "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

    if (name === props.selection) {
        return selected;
    }

    return unselected;
};
</script>

<template>
    <nav class="bg-gray-800">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div class="relative flex items-center justify-between h-16">
                <div
                    class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
                >
                    <div class="flex-shrink-0 flex items-center">
                        <img
                            src="/cashflow-logo.png"
                            class="mr-3 h-6 sm:h-9"
                            alt="Flowbite Logo"
                        />
                        <h1
                            class="h-auto w-auto text-xl font-bold text-green-300 dark:text-green-700"
                        >
                            cashflow
                        </h1>
                    </div>
                    <div class="hidden sm:block sm:ml-6">
                        <div class="flex space-x-4">
                            <button
                                v-for="(option, index) of options"
                                :key="`${index}_${option}`"
                                @click="$emit('selection', option)"
                                :class="isSelected(option)"
                            >
                                {{ option }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
