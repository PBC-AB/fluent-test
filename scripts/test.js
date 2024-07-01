async function initialize(){

    try {
        const response = await fetch('/credentials');
        const credentials = await response.text();
    
        console.log('credentials', credentials);
        return;
      } catch(e){
        console.log(e);
        return;
      }

}


initialize();