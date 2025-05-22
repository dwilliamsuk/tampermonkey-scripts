// ==UserScript==
// @name         Customer Service Desk Admin Button
// @namespace    https://github.com/dwilliamsuk/tampermonkey-scripts
// @version      2025-05-22
// @description  Inserts a button to let you hop to the internal view of a customer ticket from Jira Service Desk
// @author       https://github.com/dwilliamsuk
// @match        https://*.atlassian.net/servicedesk/customer/portal/*/*
// @icon         https://www.atlassian.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const ticketId = (window.location.href).match(/[A-Za-z]+-[0-9]+/g);
    const adminUrl = "https://" + window.location.hostname + "/browse/"

    function wrap(elem, wrapper) {
        elem.parentNode.insertBefore(wrapper, elem)
        wrapper.appendChild(elem)
    }

    window.addEventListener('load', function() {
        const buttons = document.querySelectorAll("button > span")
        buttons.forEach((button) => {
            if (button.childNodes[0].data == "Hide details") {
                const div = document.createElement("div")
                const btn = document.createElement("button")
                btn.textContent = "Open in Admin View"
                btn.addEventListener("click", () =>
                                     window.open(adminUrl+ticketId, '_blank').focus()
                                    )

                div.appendChild(btn)
                wrap(button.parentElement, div)
            }
        })
    }, false);

})();