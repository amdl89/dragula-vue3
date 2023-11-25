import DragulaContainer from "./components/DragulaContainer.vue";
import DragulaList from "./components/DragulaList.vue";
import DragulaListItem from "./components/DragulaListItem.vue";

export default {
    install(app) {
        app.component("dragula-container", DragulaContainer);
        app.component("dragula-list", DragulaList);
        app.component("dragula-list-item", DragulaListItem);
    },
};
