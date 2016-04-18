namespace Views.Controls.Header {    
    export interface ILogoProps{
        alt:string;
        src:string;
        className:string;        
    }    
    export interface ILogoControlProps{                
        className:string;
        small?:ILogoProps;
        large?:ILogoProps;        
    }
    export class LogoControl {
        el:JQuery;
        lnk:JQuery;
        smallLogo:HTMLImageElement;
        largeLogo:HTMLImageElement;      
        searchControl:Views.Controls.Header.SearchControl;  
        constructor(props:ILogoControlProps){  
            const self = this;
            self.el = $("<div/>", {              
               class:props.className              
            });         
            self.lnk = $("<a/>", {
               href:"javascript:void(0);",
               class:"navbar-brand navbar-blue"               
            });   
            self.searchControl = new Views.Controls.Header.SearchControl();
            self.smallLogo = Views.Controls.StaticElementBuilder.createImage(props.small);
            self.largeLogo = Views.Controls.StaticElementBuilder.createImage(props.large);              
            self.lnk.append(self.smallLogo);
            self.lnk.append(self.largeLogo);     
        }
        render(){
            const self = this;
            self.el.append(self.lnk); 
            self.el.append(Views.Controls.Header.StringTemplates.toggleMenu);
            self.el.append(self.searchControl.render());            
            self.el.append(Views.Controls.Header.StringTemplates.toggleSearch);
            return self.el;
        }
    }    
    
}