namespace Views.Controls.Shared {
    export class PageLoader {
        constructor() {}
        render() {
            return `<div class="page-loader">
                     <div class="cw-loader-control fadeIn animated-300" id="searchLoadIndicatorControl">
                       <div class="anim">
                         <div class="colored"></div></div>
                     </div>
                   </div>`;
        }
    }
}