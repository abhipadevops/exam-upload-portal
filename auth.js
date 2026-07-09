const msalConfig = {

    auth:{

        clientId:"eb1233ca-c094-49ef-bf22-6f2f28b4c89e",

        authority:"https://login.microsoftonline.com/156c941c-7388-4f00-bd7a-cf68a1fbf463",

        redirectUri:window.location.origin

    }

};

const loginRequest={

    scopes:["User.Read"]

};

const msalInstance=new msal.PublicClientApplication(msalConfig);

async function signIn(){

    try{

        const loginResponse=
        await msalInstance.loginPopup(loginRequest);

        sessionStorage.setItem(
            "account",
            JSON.stringify(loginResponse.account)
        );

        document.getElementById("loginSection").style.display="none";

        document.getElementById("uploadSection").style.display="block";

    }
    catch(err){

        alert(err);

    }

}

function logout(){

    sessionStorage.clear();

    msalInstance.logoutPopup();

}

window.onload=function(){

    const account=sessionStorage.getItem("account");

    if(account){

        document.getElementById("loginSection").style.display="none";

        document.getElementById("uploadSection").style.display="block";

    }

}