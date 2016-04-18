namespace Views.Controls.Header{
    export class SearchControl {        
        el:JQuery;
        elSearchWrapper:JQuery;
        elSearchInput:JQuery;
        constructor(){
            const self = this;
            self.el = $("<div/>",
            {
                id: "search-box"
            });     
            self.elSearchWrapper = $("<div/>",{
                class:"form-group is-empty"
            })       
            self.elSearchInput = $("<input/>",
            {
                id: "search-input",
                class:"form-control",
                placeholder : "Search...",
                attr:{                    
                },
                blur: (evt:any)=> {
                    console.log(evt);                 
                }
            });            
           
            self.elSearchWrapper.append(self.elSearchInput);
            self.el.append(self.elSearchWrapper);      
            $("#button-search-close").click((evt)=>{
                console.log("test");
                self.el.removeClass("active");
                  self.elSearchInput.val("");   
                $('body #topnav').toggleClass('search-active');      
            }) ;
                  
            
        }     
        render(){
            const self =this;
            return self.el;
        }   
        triggerEvent(){  
            const self = this;          
            $("#search-input").focus();         
            $('body #topnav').toggleClass('search-active');                          
            $("#button-search-close").click((evt)=> {            
                self.el.removeClass("active");
                $('body #topnav').removeClass('search-active');                
            }) ;
        }
        cleanEvent(){
            const self = this;
            $("#button-search-close").off("click");
        }
    }
}