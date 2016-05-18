namespace Views.Controls.Components {
    export class SearchButtons {
        search: JQuery;
        searchButton: JQuery;
        buttonToggle: JQuery;
        parent: Views.Controls.MasterLayout;
        constructor(ref: Views.Controls.MasterLayout) {
            const self = this;
            self.parent = ref;
            self.search = $("#search-box");
            self.searchButton = $("#trigger-search");
            self.buttonToggle = $("#btn-toggle");
            self.init();
        }
        init() {
            const self = this;
            self.buttonToggle.on("click", (evt: any) => {
                self.parent.toggle();
            });
            self.searchButton.on("click", (evt: any) => {
                self.search.addClass("active");
                $("body").addClass("search-active");
                $(".search-result-popout").addClass("active");
                self.parent.header.leftControl.searchControl.triggerEvent();
            });
        }
    }
}