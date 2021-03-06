import { LoggedInUser } from "../classes/loggedInUser";

export class Helper {

    static setBodyClass(classString: string) {
        var element = document.getElementsByTagName("body")[0];
        element.className = "";
        if (!LoggedInUser.getLoggedInUser()) {
            element.classList.add("loginPage");
        }

        classString.split(' ').forEach((item) => {
            element.classList.add(item);
        })

    }

    static detectAndCreateLinks(text: string) {
        //  detect links in post
        var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/ig

        text = text.replace(regex, "<a target='_blank' class='anchorClass' href='//$1'>$1</a> ");
        return text.replace("//http://", "http://").replace("//https://", "https://");
    }

   static convertHTMLToText(html)
    {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }   

}
export const Constants = {
    PostContentMaxlength: 2000
};
