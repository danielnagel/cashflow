import { createApp } from "vue";
import "./index.css";
import "billboard.js/dist/theme/insight.css"; // TODO: verschieben
import App from "./App.vue";
import {
    Alert,
    ComboBox,
    FixedPayDay,
    NavBar,
    Transactions,
    Trend,
    TrendDetail,
    TrendSummary,
} from "./components";

const app = createApp(App);

app.component("Alert", Alert)
    .component("ComboBox", ComboBox)
    .component("FixedPayDay", FixedPayDay)
    .component("NavBar", NavBar)
    .component("Transactions", Transactions)
    .component("Trend", Trend)
    .component("TrendDetail", TrendDetail)
    .component("TrendSummary", TrendSummary);

app.mount("#app");
