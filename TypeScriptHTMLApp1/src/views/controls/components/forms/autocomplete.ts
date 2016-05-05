// namespace Views.Controls.Components.Forms {
//     export class AutoCompleteControl {
//         isInputFocused: KnockoutObservable<boolean>;
//         isInputFocusedComputed: KnockoutComputed<boolean>;
//         selectedItemList: KnockoutObservableArray<any>;
//         selectedItem: KnockoutObservable<any>;
//         selectedItemValue: KnockoutObservable<any>;

//         constructor() {
//             const self = this;
//             self.initBindHandler();
//             self.selectedItem = ko.observable("");
//             self.selectedItemValue = ko.observable("");

//             self.selectedItemList = ko.observableArray();

//             self.isInputFocused = ko.observable(false);
//             self.isInputFocusedComputed = ko.computed(() => {
//                 if (self.selectedItemList().length > 0) {
//                 } else if (self.selectedItemList().length === 0) {
//                 }
//                 if (this.isInputFocused()) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             });
           
//         }
//         searchOnFocus(data: any, event: any) {
//             console.log(data);
//         }
//         searchOnBlur(data: any, event: any) {
//             console.log(data);
//         }
//         initBindHandler() {
//             var self = this;
//             ko.bindingHandlers.autoComplete = {
//                 init(element, valueAccessor, allBiindings, viewModel, bindingContext) {
//                     var settings = valueAccessor();
//                     var selectedItem = settings.selected;
//                     var updateElementValueWithLabel = (event:any, ui:any) => {
//                         event.preventDefault();
//                         $(element).val(ui.item.label);
//                         if (typeof ui.item !== "undefined") { selectedItem(ui.item); }
//                     };
//                     $(element).autocomplete({
//                         minLength: 3,
//                         source(request:any, response:any) {
//                             let arrayResult = [
//                                 {
//                                     label: "Hello",
//                                     value: 1
//                                 },
//                                 {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }
//                             ];
//                             response(arrayResult);
//                         },
//                         select(event:any, ui:any) {
//                             if (ui.item) {
//                                 updateElementValueWithLabel(event, ui);
//                             }
//                         },
//                         focus(event:any, ui:any) {
//                             console.log("focus");
//                             if (ui.item) {
//                                 updateElementValueWithLabel(event, ui);
//                             }
//                         },
//                         change(event:any, ui:any) {
//                             if (ui.item) {
//                                 updateElementValueWithLabel(event, ui);
//                             }
//                         }
//                     });
//                 }
//             };
//         }

//     }

// }
// // let searchApp = window["searchApp"] || {};
// // window["searchApp"].autoCompleteControl = new Views.Controls.Components.Forms.AutoCompleteControl();
// // $(document).ready(() => {    
// //     console.log(window["searchApp"].autoCompleteControl)
// //     ko.applyBindings(window["searchApp"]);
// // });