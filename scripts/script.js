const buttonSettings = {
    title : "",
    link : "",
    alias : "",
    position : "",
    style : "",
    left : 0,
    right : 0,
    top : 0,
    bottom : 0,
    style1 : {
        fontColor : "#FFFFFF",
        backgroundColor: "#1f2e7a",
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily : "'EconSansOSBol', 'Segoe UI', Helvetica, Arial, sans-serif"
    },
    style2 : {
        fontColor : "#FFFFFF",
        backgroundColor: "#0D0D0D",
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily : "'EconSansOSBol', 'Segoe UI', Helvetica, Arial, sans-serif"
    }
}

const buttonTitle__input = document.querySelector('.buttonTitle__input');
const link__select = document.querySelector('.link__select');
const buttonLink__input = document.querySelector('.buttonLink__input');
const buttonAlias__input = document.querySelector('.buttonAlias__input');
const buttonPosition__select = document.querySelector('.buttonPosition__select');
const buttonStyle__select = document.querySelector('.buttonStyle__select');
const topMargin__select = document.querySelector('.topMargin__select');
const bottomMargin__select = document.querySelector('.bottomMargin__select');
const leftMargin__select = document.querySelector('.leftMargin__select');
const rightMargin__select = document.querySelector('.rightMargin__select');


const initSelectElements = () => {

    const selectEntries = {
        position: ['left', 'center', 'right'],
        style:['style1', 'style2'],
        topMargin:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','30','40'],
        bottomMargin:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','30','40'],
        leftMargin:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','30','40'],
        rightMargin:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','30','40']
    }

    const assignSelectOption = (element, optionArr) => {
        optionArr.forEach(pos => {
            let option = document.createElement('option');
            option.value = pos;
            option.innerHTML = pos;
            element.appendChild(option);
        })
    }

    assignSelectOption(buttonPosition__select, selectEntries.position)
    assignSelectOption(buttonStyle__select, selectEntries.style)
    assignSelectOption(topMargin__select, selectEntries.topMargin)
    assignSelectOption(bottomMargin__select, selectEntries.bottomMargin)
    assignSelectOption(leftMargin__select, selectEntries.leftMargin)
    assignSelectOption(rightMargin__select, selectEntries.rightMargin)
}

function initButtonSettings(){
    sdk.getData((data)=> {

        buttonSettings.title = data.used ? data.title : "Please click here";
        buttonSettings.link = data.used ? data.link : "https://www.economist.com/";
        buttonSettings.alias = data.used ? data.alias : "Button1";
        buttonSettings.position = data.used ? data.position : "center";
        buttonSettings.style = data.used ? data.style : "style1";
        buttonSettings.top = data.used ? data.top : "40";
        buttonSettings.bottom =  data.used ? data.bottom : "40";
        buttonSettings.left = data.used ? data.left : "0";
        buttonSettings.right = data.used ? data.right : "0";

        // Assign values to input ui 
        buttonTitle__input.value = buttonSettings.title;
        buttonLink__input.value = buttonSettings.link;
        buttonAlias__input.value = buttonSettings.alias;
        buttonPosition__select.value = buttonSettings.position;
        buttonStyle__select.value = buttonSettings.style;
        topMargin__select.value = buttonSettings.top;
        bottomMargin__select.value = buttonSettings.bottom;
        leftMargin__select.value = buttonSettings.left;
        rightMargin__select.value = buttonSettings.right;

        setButton();
    })
}

function initUiListeners(){

    const inputListener = (element, buttonSettings, key) => {
        element.addEventListener('input', ()=>{
            buttonSettings[key] = element.value;
            setButton();
        })
    }

    const changeListener = (element, buttonSettings, key) => {
        element.addEventListener('change', ()=>{
            buttonSettings[key] = element.value;
            setButton();
        })
    }

    inputListener(buttonTitle__input,buttonSettings,'title');
    changeListener(buttonLink__input,buttonSettings,'link');
    changeListener(buttonAlias__input,buttonSettings,'alias');
    changeListener(buttonPosition__select,buttonSettings,'position');
    changeListener(buttonStyle__select,buttonSettings,'style');
    changeListener(topMargin__select,buttonSettings,'top');
    changeListener(bottomMargin__select,buttonSettings,'bottom');
    changeListener(leftMargin__select,buttonSettings,'left');
    changeListener(rightMargin__select,buttonSettings,'right');

}

function setButton(){

    ({backgroundColor, fontColor, fontWeight, fontSize, fontFamily} = buttonSettings[buttonSettings.style]);

    const button = `
    <!-- CTA -->
    <table border="0" cellpadding="0" cellspacing="0" style="max-width:600px;" width="100%">
    <tr>
        <td height="${buttonSettings.top}"></td>
    </tr>
    <tr>
        <td align="center" style="padding: 0 ${buttonSettings.right}px 0 ${buttonSettings.left}px" valign="middle">
        <a alias="${buttonSettings.alias}" href="${ensureHttps(buttonSettings.link)}" target="_blank" title="${buttonSettings.title}">
            <table align="${buttonSettings.position}" bgcolor="${backgroundColor}" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:initial !important; border:2px solid ${backgroundColor}; border-radius:32px;">
                <tr>
                    <td style="padding: 8px 16px; text-align: center;" valign="top">
                        <b style="font-family:${fontFamily};color:${fontColor};font-size:${fontSize};font-weight:${fontWeight};text-decoration:none;">${buttonSettings.title}</b>
                    </td>
                </tr>
            </table>
        </a>
        </td>
    </tr>
    <tr>
        <td height="${buttonSettings.bottom}"></td>
    </tr>
    </table>
    <!-- //CTA -->
    `

    sdk.setData({
        used : true
        ,title : buttonSettings.title
        ,link : buttonSettings.link
        ,alias : buttonSettings.alias
        ,position : buttonSettings.position
        ,style : buttonSettings.style
        ,top : buttonSettings.top
        ,bottom : buttonSettings.bottom
        ,left : buttonSettings.left
        ,right : buttonSettings.right
    })

    sdk.setContent(button);
}

initSelectElements();
initButtonSettings();
initUiListeners();

function ensureHttps(url) {

    // Find what protocol is currently used
    const protocols = ['https://', 'http://', 'mailto:'];
    let matchedProtocol = protocols.find(protocol => url.startsWith(protocol)) || "https://";

    // Match protocol with select element
    link__select.value = matchedProtocol;

    // Appends protocol if non is applied
    url = url.startsWith(matchedProtocol) ? url : matchedProtocol + url;

    return url;
}

link__select.addEventListener('change', () => {
    
    const selectedProtocol = link__select.value;
    let linkValue = buttonLink__input.value.trim();

    const protocols = ['https://', 'http://', 'mailto:'];

    if(linkValue){

        // Remove any existing protocol from the link
        protocols.forEach(protocol => {
            if (linkValue.startsWith(protocol)) {
                linkValue = linkValue.substring(protocol.length);
            }
        });

        // Update the input field with the selected protocol
        buttonLink__input.value = selectedProtocol + linkValue;
    }
})