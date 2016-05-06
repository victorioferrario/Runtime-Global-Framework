namespace Views.Components.Grid {
    export interface IGridMetrics {
        limit: number;
        totalPages: number;
        totalCount: number;
        update: (pageCount: number) => void;
    }
    export class GridMetrics implements IGridMetrics {
        limit: number;
        totalPages: number;
        totalCount: number;
        constructor(dsLength: number) {
            var self = this;
            self.limit = 10;
            self.totalCount = dsLength;
            self.totalPages = Math.ceil(self.totalCount / self.limit);
            console.log(self.totalCount / self.limit, self.totalPages);
        }
        update(pageCount: number) {
            var self = this;
            self.limit = pageCount;
            self.totalPages = Math.ceil(self.totalCount / self.limit);
        }
    }
    export class GridPagerButton {
        label: KnockoutObservable<number>;
        value: KnockoutObservable<number>;
        isActive: KnockoutComputed<string>;
        pageIndex: KnockoutObservable<number>;
        constructor(ref: number, arg: number) {
            var self = this;
            self.label = ko.observable(arg);
            self.value = ko.observable(arg);
            self.pageIndex = ko.observable(ref);
            self.isActive = ko.pureComputed(
                () => self.pageIndex() === self.value() ? "active" : "no", self);
        }
    }
}