// ==UserScript==
// @name         Okta People - Export to CSV
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @description  Provides an "Export to CSV" button to the Okta People menu
// @author       github.com/dwilliamsuk
// @match        https://*.okta.com/admin/users
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okta.com
// @grant        none
// @require      https://gist.githubusercontent.com/dwilliamsuk/7f549807be627b37e958a566e1166d92/raw/087a22fef7bc5e6eff7efb6f4dae98d45ec828e1/waitForKeyElements.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

function downloadCsvCallback() {
    // '(type eq "OKTA_GROUP" or type eq "BUILT_IN" or type eq "APP_GROUP")'
    // const searchQuery = document.getElementsByClassName("advanced-search-box-input")[0].value

    let usersArray = [
        ["person", "username", "primaryEmail", "status"]
    ];

    const rows = document.querySelectorAll('tbody');

    rows.forEach(row => {
        const columns = row.querySelectorAll('td');

        const person = columns[0].childNodes[0].childNodes[0].innerText;
        const username = columns[0].childNodes[0].childNodes[1].innerText;

        const primaryEmail = columns[1].innerText;

        const status = columns[2].innerText;

        const rowArray = [person, username, primaryEmail, status];

        usersArray.push(rowArray);
    });

    let csvContent = '';

    usersArray.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'data:text/csv;charset=utf-8'});
    const fileURL = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = fileURL;
    downloadLink.download = 'Users Export.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(fileURL);
}

(function() {
    'use strict';
    waitForKeyElements (".advanced-search-box", actionFunction);

    function actionFunction (jNode) {
        const csvButton = jNode.after('<div class="advanced-search-submit-button-wrapper"> <a data-se="button" class="download-csv allow-in-read-only allow-in-safe-mode link-button link-button-icon" style="" id="downloadCsvBtn"><span class="icon download-16"></span>Download CSV</a> </div>');
        document.getElementById("downloadCsvBtn").addEventListener (
            "click", downloadCsvCallback, false
        );
    }
})();