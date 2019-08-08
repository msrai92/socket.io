const username = prompt("what is your username");
//const socket = io('http://localhost:9000'); // the / namespace/endpoint
const socket = io('http://localhost:9000', {
    query: {
        username
    }
}); // the / namespace/endpoint
let nsSocket= "";
// listen of nsList (list of all namespaces)
socket.on('nsList', (nsData) => {
    console.log('The list of namespaces had arrived!');
    //console.log(nsData);

    //update DOM
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns) =>{
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`
    });

    // Add a clicklistener for each NS
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) =>{
        elem.addEventListener('click', (e) =>{
            const nsEndpoint = elem.getAttribute('ns');
            //console.log(`${nsEndpoint} I should og to now`);
            joinNs(nsEndpoint);
        });
    });

    joinNs('/wiki');

});


