/*const buttonSettings = {
    title : "",
    link : "",
    alias : "",
    position : "",
    style : "",
    top : 0,
    bottom : 0,
    style1 : "font-family: 'EconSansOSReg',Arial, sans-serif; width:200px;height:35px;line-height:35px;text-align:center;background-color: #1F2E7A; color:white; font-weight:bold; border-radius: 32px;",
    style2 : "font-family: Arial, sans-serif; width:200px;height:35px;line-height:35px;text-align:center;background-color: #f34747; color:white; font-weight:bold; border-radius: 30px;",
    style3 : "width:200px;height:40px;line-height:40px;text-align:center;background-color: #329632; color:white; font-weight:bold; border-radius: 30px;"
}*/

const buttonSettings = {
    title : "",
    link : "",
    alias : "",
    position : "",
    style : "",
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
const buttonLink__input = document.querySelector('.buttonLink__input');
const buttonAlias__input = document.querySelector('.buttonAlias__input');
const buttonPosition__select = document.querySelector('.buttonPosition__select');
const buttonStyle__select = document.querySelector('.buttonStyle__select');
const topMargin__select = document.querySelector('.topMargin__select');
const bottomMargin__select = document.querySelector('.bottomMargin__select');

const initSelectElements = () => {

    const selectEntries = {
        position: ['left', 'center', 'right'],
        style:['style1', 'style2'],
        topMargin:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','30','40'],
        bottomMargin:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','30','40']
    }

    const buttonPositon = document.querySelector('#buttonPosition_select');
    const buttonStyle = document.querySelector('#buttonStyle__select');
    const topMargin = document.querySelector('#topMargin__select');
    const bottomMargin = document.querySelector('#bottomMargin__select');

    const assignSelectOption = (element, optionArr) => {
        optionArr.forEach(pos => {
            let option = document.createElement('option');
            option.value = pos;
            option.innerHTML = pos;
            element.appendChild(option);
        })
    }

    assignSelectOption(buttonPositon, selectEntries.position)
    assignSelectOption(buttonStyle, selectEntries.style)
    assignSelectOption(topMargin, selectEntries.topMargin)
    assignSelectOption(bottomMargin, selectEntries.bottomMargin)
}

function initButtonSettings(){
    sdk.getData((data)=>{
        buttonSettings.title = data.title || "Please click here";
        buttonSettings.link = data.link || "https://www.economist.com/";
        buttonSettings.alias = data.alias || "";
        buttonSettings.position = data.position || "center";
        buttonSettings.style = data.style || "style1";
        buttonSettings.top = data.top || "40";
        buttonSettings.bottom =  data.bottom || "40";

        // Assign values to input ui 
        buttonTitle__input.value = buttonSettings.title;
        buttonLink__input.value = buttonSettings.link;
        buttonAlias__input.value = buttonSettings.alias;
        buttonPosition__select.value = buttonSettings.position;
        buttonStyle__select.value = buttonSettings.style;
        topMargin__select.value = buttonSettings.top;
        bottomMargin__select.value = buttonSettings.bottom;

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
        <td align="center" style="padding: 0 16px" valign="middle">
            <table align="${buttonSettings.position}" bgcolor="${backgroundColor}" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:initial !important; border:2px solid ${backgroundColor}; border-radius:32px;">
                <tr>
                    <td style="padding: 8px 16px; text-align: center;" valign="top">
                        <b><a alias="${buttonSettings.alias}" href="${ensureHttps(buttonSettings.link)}" style="font-family:${fontFamily};color:${fontColor};font-size:${fontSize};font-weight:${fontWeight};text-decoration:none;" target="_blank" title="${buttonSettings.title}">${buttonSettings.title}</a></b>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td height="${buttonSettings.bottom}"></td>
    </tr>
    </table>
    <!-- //CTA -->
    `

    sdk.setData({
        title : buttonSettings.title
        ,link : buttonSettings.link
        ,alias : buttonSettings.alias
        ,position : buttonSettings.position
        ,style : buttonSettings.style
        ,top : buttonSettings.top
        ,bottom : buttonSettings.bottom
    })

    sdk.setContent(button);
}

initSelectElements();
initButtonSettings();
initUiListeners();

function ensureHttps(url) {
    // Regular expression to check if the URL starts with "http://" or "https://"
    const regex = /^(http:\/\/|https:\/\/)/i;

    // Check if the URL matches the regular expression
    if (!regex.test(url)) {
        // If it doesn't, prepend "https://"
        url = 'https://' + url;
    }

    return url;
}