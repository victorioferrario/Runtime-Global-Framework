/// <reference path="../../typings/tsd.d.ts" />
namespace Services {
    export class Http {
        static loadJson(url?: string): JQueryXHR {
            return $.getJSON(url !== "" ? url : "data.json");
        }
    }
}