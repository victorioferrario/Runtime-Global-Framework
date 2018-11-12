# ts-menu

The application in typescript generates the entire global ui per render in the client portal. The application that this runs in was built in 
ruby on rails.  

I developed an entire ui, that had to re-render on every page load in typescript, knockoutjs and jquery.  The result of that requirment is this nifty tiny typescript application, that uses jquery, knockoutjs, and runs so fast that users don't even realize the entire UI is getting regenerated on the fly, per page request. 

If you take a moment, and go through the typescript code, you can see, i like to organize my typescript applications in a similar fashion as I would organize a C# Solution in Visual Studio.

Speed, optimization and clean code was essential. The result has been amazing, and been in production for over 3 years.
