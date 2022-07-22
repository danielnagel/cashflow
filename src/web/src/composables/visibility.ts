import { watch } from "vue";

// TODO: dummes beispiel, aber eventuell ander verwendbar...
// https://vuejs.org/guide/reusability/composables.html#what-is-a-composable

export function useVisiblity() {
    const props = defineProps<{
        visible?: boolean;
    }>();

    // watch(() => props.visible, async () => {
    //     if(props.visible && trendReportTable.value === null) {
    //         await setup();
    //         generateChart();
    //     }
    // })
}
