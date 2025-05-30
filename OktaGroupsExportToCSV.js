// ==UserScript==
// @name         Okta Groups - Export to CSV
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @description  Provides an "Export to CSV" button to the Okta Groups menu
// @author       github.com/dwilliamsuk
// @match        https://*.okta.com/admin/groups
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okta.com
// @grant        none
// @require      https://gist.githubusercontent.com/dwilliamsuk/7f549807be627b37e958a566e1166d92/raw/087a22fef7bc5e6eff7efb6f4dae98d45ec828e1/waitForKeyElements.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

function downloadCsvCallback() {
    // '(type eq "OKTA_GROUP" or type eq "BUILT_IN" or type eq "APP_GROUP")'
    // const searchQuery = document.getElementsByClassName("advanced-search-box-input")[0].value

    let groupsArray = [
        ["groupId", "groupName", "groupDescription", "userCount", "appCount"]
    ];

    const rows = document.querySelectorAll('tbody');

    rows.forEach(row => {
        const columns = row.querySelectorAll('td');

        const groupId = ((columns[0].childNodes[0].childNodes[1].childNodes[0].href).split("/"))[5];
        const groupName = columns[0].childNodes[0].childNodes[1].childNodes[0].innerText;
        const groupDesc = columns[0].childNodes[0].childNodes[1].childNodes[1].innerText;

        const groupUserCount = columns[1].innerText;

        const groupApplicationCount = columns[2].innerText;

        const rowArray = [groupId, groupName, groupDesc, groupUserCount, groupApplicationCount];

        groupsArray.push(rowArray);
    });

    let csvContent = '';

    groupsArray.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'data:text/csv;charset=utf-8'});
    const fileURL = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = fileURL;
    downloadLink.download = 'Groups Export.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(fileURL);
}

(function() {
    'use strict';
    waitForKeyElements (".button-primary.add-group-button.link-button.link-button-icon", actionFunction);

    function actionFunction (jNode) {
        const csvButton = jNode.before('<a data-se="button" class="download-csv allow-in-read-only allow-in-safe-mode link-button link-button-icon" style="" id="downloadCsvBtn"><span class="icon download-16"></span>Download CSV</a>');
        document.getElementById("downloadCsvBtn").addEventListener (
            "click", downloadCsvCallback, false
        );
    }
})();