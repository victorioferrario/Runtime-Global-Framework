# ts-menu

The application in typescript generates the entire global ui per render in the client portal. The application that this runs in was built in 
ruby on rails.  

I developed an entire ui, that had to re-render on every page load.  The result of that requirment is this nifty tiny typescript application, 
that uses jquery, knockjs, and runs so fast that users don't even realize the entire UI is getting regenerated on the fly, per page request. 

Speed, optimization and clean code was essential. The result has been amazing, and been in production for over 3 years.
