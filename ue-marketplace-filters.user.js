// ==UserScript==
// @name         Unreal Engine Marketplace Additional Asset Filters
// @namespace    https://github.com/Drakmyth/ue-marketplace-filters
// @version      0.1
// @author       Drakmyth
// @description  A Tampermonkey userscript to add additional asset filters to the Unreal Engine Marketplace
// @homepage     https://github.com/Drakmyth/ue-marketplace-filters
// @updateURL    https://github.com/Drakmyth/ue-marketplace-filters/raw/master/ue-marketplace-filters.user.js
// @downloadURL  https://github.com/Drakmyth/ue-marketplace-filters/raw/master/ue-marketplace-filters.user.js
// @supportURL   https://github.com/Drakmyth/ue-marketplace-filters/issues
// @license      MIT
// @match        https://www.unrealengine.com/marketplace/*
// @run-at       document-body
// @grant        none
// ==/UserScript==

(function() {
    `use strict`;

    var hideOwned = false;
    var hideExternal = false;

    function doControlsExist() {
        var sortContainer = getSortContainer();
        return sortContainer.querySelector(`span.filter-controls`);
    }

    function addControls() {
        var controlsElement = document.createElement(`span`);
        controlsElement.className = `filter-controls`;

        var hideOwnedCheckbox = createCheckbox(`Hide Owned`, hideOwned, toggleHideOwned);
        controlsElement.appendChild(hideOwnedCheckbox);

        var hideExternalCheckbox = createCheckbox(`Hide External`, hideExternal, toggleHideExternal);
        controlsElement.appendChild(hideExternalCheckbox);

        var sortContainer = getSortContainer();
        sortContainer.appendChild(controlsElement);
    }

    function getSortContainer() {
        return document.getElementsByClassName(`sort-select`)[0];
    }

    function createCheckbox(text, initial, onChange) {
        var labelElement = document.createElement(`label`);
        labelElement.style.marginLeft = `5px`;
        labelElement.style.marginRight = `5px`;

        var checkboxElement = document.createElement(`input`);
        checkboxElement.type = `checkbox`;
        checkboxElement.checked = initial;
        checkboxElement.style.marginRight = `3px`;
        checkboxElement.addEventListener(`change`, onChange);
        labelElement.appendChild(checkboxElement);

        var textElement = document.createTextNode(text);
        labelElement.appendChild(textElement);

        return labelElement;
    }

    function toggleHideOwned(event) {
        hideOwned = event.target.checked;
        onBodyChange();
    }

    function toggleHideExternal(event) {
        hideExternal = event.target.checked;
        onBodyChange();
    }

    function isContainerOwned(container) {
        return container.querySelector(`article.asset--owned`);
    }

    function isContainerExternal(container) {
        return !container.querySelector(`span.btn`);
    }

    function onBodyChange(mut) {

        if (!doControlsExist()) {
            addControls();
        }

        var assetContainers = document.getElementsByClassName(`asset-container`);

        for (let container of assetContainers) {
            var isOwned = isContainerOwned(container);
            var isExternal = isContainerExternal(container);
            if ((hideOwned && isOwned) || (hideExternal && isExternal)) {
                container.style.display = `none`;
            } else {
                container.style.display = null;
            }
        }
    }


    var mo = new MutationObserver(onBodyChange);
    mo.observe(document.body, {childList: true, subtree: true});
})();
