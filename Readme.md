Root
    css - stylings for your app / lightning-design-system
    functions   
        credentials.js - Reads out environment variables from hosting platform and makes them available for the frontend scripts as variables - (See authentication.js)
        load-ui.js - utility script, that handles display for authenticated / non authenticated scenarios. 
                     After auth,  switches loading app with "real" ui app
        submit-auth.js - utility script for authentication workflow. Using triggerAuth2 function, authenticates with the marketing cloud environment the app is running on
    scripts
        authentication.js
        blocksdk.js - Salesforce function from documentation:
                    https://github.com/salesforce-marketingcloud/blocksdk
        script.js - Client side javascript (business case specific - handles frontend)

    index.html - Loading Ui (Without business functionality)
    ccb-ui.html - Real UI (With functionality)
    icon.png - Icon 60x60 that is displayed in marketing cloud as custom content block
    dragIcon.png - Typically same icon when hover or drag and dropping 


    

