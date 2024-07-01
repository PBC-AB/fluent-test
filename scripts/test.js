async function initialize(){

    try {

        const response = await fetch('/credentials', { method: 'POST' });

        const credentials = await response.text();
    
        console.log(JSON.parse(credentials));
        return;
      } catch(e){
        console.log(e);
        return;
      }

}


initialize();