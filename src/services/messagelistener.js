import {authWithTokenRequester} from "./requester";

/*
Message listener provides action methods for communicating with parent window when booking engine is embedded in iframe
 */
export default {
    init : ()=> {
        window.addEventListener("message", (e)=> {
            try {
                let message = JSON.parse(e.data);
                switch(message.action) {
                    case "auth":
                        authWithTokenRequester(message.data, ()=> {
                            // reload window
                            window.location.reload();
                        });
                        break;
                }
            } catch (e) {
                //Ignore
            }
        })
    }
}