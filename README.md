# highly performant application framework

The application in typescript generates the entire global ui per render in the client portal. The application that this runs in was built in 
ruby on rails.  

I developed an entire ui, that had to re-render on every page load in typescript, knockoutjs and jquery.  The result of that requirment is this nifty tiny typescript application, that uses jquery, knockoutjs, and runs so fast that users don't even realize the entire UI is getting regenerated on the fly, per page request. 

If you take a moment, and go through the typescript code, you can see, i like to organize my typescript applications in a similar fashion as I would organize a C# Solution in Visual Studio.

Speed, optimization and clean code was essential. The entire menu system was dynamic depending on the authorized user type.  So it was essential to make use of caching and local storage.

```
export class DataKeys {
        static menu: string = "data:keys:payload:menu";
        static user: string = "data:keys:payload:user";
        static notifications: string = "data:keys:payload:notifications";
        static search: string = "data:keys:payload:search";
}
```

The create a custom local storage "service", in addition I also extended the event dispatch capabilities of the browser, and implemented it as a base class, for many of my components. 

The result has been amazing, and the entire global ui that wraps the application, and is re-rendered and re-generate per page call is almost instant!

Typescript, JQuery, Knockoutjs and good fundamental understanding of these technologies can make for a highly performant application framework even today.   
