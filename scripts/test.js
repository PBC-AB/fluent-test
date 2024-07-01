async function initialize(){

    try {
      
        const response = await fetch('/credentials', { 
          method: 'POST', 
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify({url : window.location.origin + '/'})
        });

        const credentials = await response.text();
    
        console.log('credentials', JSON.stringify(credentials, null, 2));
        return;
      } catch(e){
        console.log(e);
        return;
      }

}


initialize();