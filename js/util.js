Number.prototype.format = function(n, x, s, c) {
    var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")",
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace(".", c) : num).replace(new RegExp(re, "g"), "$&" + (s || ","));
};
shinobi.util = {

    internetConnection: true,
    addEventInternetConnection: function() {
        var container;
        if (!document.querySelector('#connectingNetworkContainer')) {
            container = document.createElement('div');
            container.setAttribute('class', 'connecting-network');
            container.setAttribute('id', 'connectingNetworkContainer');

            container.innerHTML = `
            <style>
                .connecting-network{
                    position: fixed;
                    z-index: 100;
                    width: 15rem;
                    height: 4rem;
                    bottom: 1rem;
                    left: 1rem;
                    background: white;
                    display: none;
                    border-radius: 6px;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
                }
                .connecting-network.is-active{
                    display: block;
                }
                .spinner {
                    top: calc( 50% - 0.75rem );
                    left: 50%;
                    text-align: center;
                    position: absolute;
                    transform: translate(-50%, -50%);
                }
                .spinner-content{
                    top: calc( 50% + 0.75rem );
                    left: 50%;
                    text-align: center;
                    position: absolute;
                    transform: translate(-50%, -50%);
                    color: #504f4f;
                    font-size: 1rem;
                }

                .spinner > div {
                    width: 0.75rem;
                    height: 0.75rem;
                    background-color: #504f4f;
                    border-radius: 100%;
                    display: inline-block;
                    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                }

                .spinner .bounce1 {
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
                }

                .spinner .bounce2 {
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
                }

                @-webkit-keyframes sk-bouncedelay {
                0%, 80%, 100% { -webkit-transform: scale(0) }
                40% { -webkit-transform: scale(1.0) }
                }

                @keyframes sk-bouncedelay {
                0%, 80%, 100% { 
                    -webkit-transform: scale(0);
                    transform: scale(0);
                } 40% { 
                    -webkit-transform: scale(1.0);
                    transform: scale(1.0);
                }
                }
            </style>
            <div class=" spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
            <div class=" spinner-content">
                Đang kết nối
            </div>
            </div>
         `;
            document.body.appendChild(container);
        } else {
            container = document.querySelector('#connectingNetworkContainer');
        }
        window.addEventListener('online', function() {
            console.log('Became online');
            shinobi.util.internetConnection = true;
            container.classList.remove('is-active');
        });
        window.addEventListener('offline', function() {
            console.log('Became offline');
            shinobi.util.internetConnection = false;
            container.classList.add('is-active');
        });
        return container;
    },
    hiddenModifyAvatarLinkButton: function(selector) {
        var fileLabel = document.querySelector(selector + " .file-label");
        fileLabel.querySelector(".button").classList.add("is-hidden");
    },
    renderUnEscap: function(elem, value, all) {

        elem.innerHTML = shinobi.util.renderUncapContent(value);
    },
    renderUncapContent: function(data) {
        return String(data).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    },
    convertEscap: function(data) {
        return String(data).replace(/\.\s/g, '.').replace(/alt\=\"([A-Za-z0-9 _]*)\"/g, "").replace(/width\=\"([A-Za-z0-9 _]*)\"/g, "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').trim();

    },
    showAvatarLinkAndPreventModify: function(selector, json) {
        var data = JSON.parse(json);

        var img = document.querySelector(selector + ' [snb-render="shinobi.render.renderChangeAvatarImageContainer"]');
        var fileLabel = document.querySelector(selector + " .file-label");
        var modifyButton = fileLabel.querySelector(".button");

        if (data.hasOwnProperty("avatarlink") && data.avatarlink != null && data.avatarlink != "") {
            img.classList.remove("is-hidden");
            modifyButton.classList.add("is-hidden");
        } else {
            img.classList.add("is-hidden");
            modifyButton.classList.remove("is-hidden");
        }
    },
    getAvatarLink: function(container) {
        return container.querySelector('[snb-key="avatarlink"]').src;
    },

    hiddenModalFooter: function(selector) {
        var confirmPanel = document.querySelector(selector);
        confirmPanel.querySelector(".modal-card-foot").classList.add("is-hidden");
    },

    renderCollapseButton: function(callback) {
        var pageTitle = document.querySelector(".section-title");

        pageTitle.classList = [];

        pageTitle.innerHTML =
            `
		<div class="level panel-heading has-background-white-bis">
			<div class="level-left">
				<div class="level-item"><button class="button is-primary is-collapse-button">
						<i class="fa fa-list-ul"></i>
					</button></div>
				<div class="level-item"><p class=" title is-4 section-title">` +
            pageTitle.innerText +
            `</p></div>
			</div>
			<div class="level-right">
			</div>
		</div>`;

        callback();
    },

    addCollapseButtonEvent: function(callback) {
        var collapseButton = document.querySelector(".is-collapse-button");
        collapseButton.onclick = function() {
            var panel = document.querySelectorAll(".panel");

            var firstPanel = panel[0].parentElement;
            if (firstPanel.classList.contains("is-hidden")) {
                firstPanel.classList.remove("is-hidden");
            } else {
                firstPanel.classList.add("is-hidden");
            }

            var secondPanel = panel[1].parentElement;
            if (!secondPanel.classList.contains("is-12")) {
                secondPanel.classList.remove("is-8");
                secondPanel.classList.add("is-12");
            } else {
                secondPanel.classList.add("is-8");
                secondPanel.classList.remove("is-12");
            }
        };
        callback();
    },

    abledInput: function(selector) {
        var input = document.querySelector(selector);
        input.removeAttribute("disabled");
    },

    disableAllInput: function(selector) {
        var container = document.querySelector(selector);
        var allInputs = container.querySelectorAll(".input");
        allInputs.forEach(function(input) {
            input.setAttribute("disabled", "");
        });
        var allTextArea = container.querySelectorAll(".textarea");
        allTextArea.forEach(function(input) {
            input.setAttribute("disabled", "");
        });
    },

    hiddenUploadFileInDetailForm: function(selector) {
        var container = document.querySelector(selector);
        var upfileList = container.querySelectorAll(".file-cta");
        for (var i = 0; i < upfileList.length; i++) {
            upfileList[i].classList.add("is-hidden");
        }
    },

    disabledAllUserInfoInput: function() {
        var userInfoSection = document.getElementById("userInfoSection");
        var allInput = userInfoSection.querySelectorAll(".input");
        allInput.forEach(function(input) {
            input.setAttribute("disabled", "");
        });
    },

    disabledAllBankInfoInput: function() {
        var userBankInfoSection = document.getElementById("userBankInfoSection");
        var allInput = userBankInfoSection.querySelectorAll(".input");
        allInput.forEach(function(input) {
            input.setAttribute("disabled", "");
        });
    },

    showIdentityLabel: function(selector) {
        var container = document.querySelector(selector);
        var frontIdentity = container.querySelector('[snb-key="frontidentity"]');
        frontIdentity.parentElement.parentElement.parentElement.parentElement.previousElementSibling.classList.remove(
            "is-hidden"
        );
        var backidentity = container.querySelector('[snb-key="backidentity"]');
        backidentity.parentElement.parentElement.parentElement.parentElement.previousElementSibling.classList.remove(
            "is-hidden"
        );
    },

    getCurrentSystemModule: function() {
        var menuModuleHeader = document.querySelector("#menuModuleHeader");
        return menuModuleHeader.querySelector(".navbar-link").lastElementChild.innerText;
    },

    renderReadMoneyAmountInVietnamese: function(selector) {
        var infoContainer = document.querySelector(selector);
        var amount = infoContainer.querySelector('[snb-key="amount"]');
        amount.addEventListener("input", function() {
            shinobi.mapping.getValue(selector, function(json) {
                var numInString = docso(json.amount).trim();
                infoContainer.querySelector('[snb-key="vietnamesemoneyinput"]').innerText =
                    numInString.charAt(0).toUpperCase() + numInString.slice(1) + " đồng";
            });
        });
    },

    buildSearchUserRecommendFieldElement: function(field, option) {
        if (option.hasOwnProperty("callback")) {
            shinobi.util.addCallbackEvent(field, option);
        }

        if (option.hasOwnProperty("buttonSearchEvent")) {
            shinobi.util.addButtonSearchEvent(field, option);
        }

        if (option.hasOwnProperty("selectItem")) {
            shinobi.util.addSelectItemEvent(field, option);
        }
    },

    addCallbackEvent: function(field, option) {
        var input = field.querySelector(".input");

        input.addEventListener("input", function() {
            var input = field.querySelector(".input");
            var searchKey = input.value.trim();
            if (searchKey != "") {
                var request = {
                    searchkey: searchKey,
                };

                if (option.showloadingnotification) {
                    shinobi.notification.notification.loading();
                }

                shinobi.api.request(shinobi.coreapi.loggedUserApi + "searchUser", JSON.stringify(request), function(response) {
                    if (option.showloadingnotification) {
                        shinobi.notification.notification.loaded();
                    }
                    option.callback(response);
                });
            }
        });
    },

    addSelectItemEvent: function(field, option) {
        var input = field.querySelector(".input");

        input.addEventListener("change", function() {
            var input = field.querySelector(".input");
            var searchKey = input.value.trim();
            if (searchKey != "") {
                var request = {
                    searchkey: searchKey,
                    type: "=",
                };

                if (option.showloadingnotification) {
                    shinobi.notification.notification.loading();
                }

                shinobi.api.request(shinobi.coreapi.loggedUserApi + "searchUser", JSON.stringify(request), function(response) {
                    if (option.showloadingnotification) {
                        shinobi.notification.notification.loaded();
                    }

                    option.selectItem(response);
                });
            }
        });
    },

    addButtonSearchEvent: function(field, option) {
        var button = field.querySelector(".button.is-search");

        button.addEventListener("click", function() {
            var input = field.querySelector(".input");
            var searchKey = input.value.trim();
            if (searchKey != "") {
                var request = {
                    searchkey: searchKey,
                    type: "=",
                };

                if (option.showloadingnotification) {
                    shinobi.notification.notification.loading();
                }

                shinobi.api.request(shinobi.coreapi.loggedUserApi + "searchUser", JSON.stringify(request), function(response) {
                    if (option.showloadingnotification) {
                        shinobi.notification.notification.loaded();
                    }

                    option.buttonSearchEvent(response);
                });
            }
        });
    },

    hexEncode: function(str) {
        var hex, i;

        var result = "";
        for (i = 0; i < str.length; i++) {
            hex = str.charCodeAt(i).toString(16);
            result += ("000" + hex).slice(-4);
        }

        return result;
    },

    hexDecode: function(str) {
        var j;
        var hexes = str.match(/.{1,4}/g) || [];
        var back = "";
        for (j = 0; j < hexes.length; j++) {
            back += String.fromCharCode(parseInt(hexes[j], 16));
        }

        return back;
    },

    onScreenDisable: function(callback) {
        var preStatus = false;
        var currentStatus = false;
        setInterval(function() {
            preStatus = currentStatus;
            currentStatus = document.hidden;

            if (currentStatus == false && preStatus == true) {
                if (typeof callback == "function") {
                    callback();
                }
            }
        }, 1000);
    },

    sumAllDataAndKeyJson: function(result, json) {
        var entriesResult = Object.entries(result);
        var entriesJson = Object.entries(json);
        entriesJson.forEach(function(entriesJsonItem) {
            if (result.hasOwnProperty(entriesJsonItem[0])) {
                if (!isNaN(result[entriesJsonItem[1]])) {
                    result[entriesJsonItem[0]] += entriesJsonItem[1];
                }
            } else {
                result[entriesJsonItem[0]] = entriesJsonItem[1];
            }
        });
    },
    checkMobile: function() {
        const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    },

    countNumberInInput: function(input) {
        if (input.match(/\d/g) == null) {
            return 0;
        } else {
            var numbers = input.match(/\d/g).map(Number);

            return numbers.length;
        }
    },
    countTextCharacterInInput: function(input) {
        if (input.match(/[a-zA-Z]/g) == null) {
            return 0;
        } else {
            var textCharaters = input.match(/[a-zA-Z]/g).map(String);

            return textCharaters.length;
        }
    },

    countSpecialCharacterInInput: function(input) {
        if (input.match(/[^0-9a-zA-Z]/g) == null) {
            return 0;
        } else {
            var specialCharaters = input.match(/[^0-9a-zA-Z]/g).map(String);

            return specialCharaters.length;
        }
    },

    hasSendRequestToAdmin: function(response, callback) {
        if (response == "update success") {
            shinobi.notification.notification.info("Đã tiếp nhận yêu cầu. Vui lòng đợi kiểm duyệt.");
            if (typeof callback == "function") {
                callback();
            }
        }
    },

    getCurrentDate: function(option) {
        var date = new Date();
        return shinobi.util.formatDate(date, option);
    },

    getFormatDate: function(dateInput, option) {
        dateInput = shinobi.util.preProcessDateInput(dateInput);
        var date = new Date(dateInput);
        return shinobi.util.formatDate(date, option);
    },

    preProcessDateInput: function(dateInput) {
        if (typeof dateInput == "string") {
            dateInput = dateInput.replace(/-/g, "/");
        }
        return dateInput;
    },

    addLoopAnimate: function(option) {
        var listElem = document.querySelectorAll("[animate-loop]");
        for (var i = 0; i < listElem.length; i++) {
            shinobi.util.addLoopAnimateProcess(listElem[i], option);
        }
    },

    getRandomInt: function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    addLoopAnimateProcess: function(elem, option) {
        if (!(elem.hasAttribute("stop-animate") && elem.getAttribute("stop-animate") == "true")) {
            var classList = elem.getAttribute("animate-loop").split(" ");
            var className = shinobi.util.randomInList(classList);
            elem.classList.add(className);
            elem.classList.add("animate__animated");
            setTimeout(function() {
                elem.classList.remove(className);
                setTimeout(function() {
                    shinobi.util.addLoopAnimateProcess(elem, option);
                }, 200);
            }, 1000);
        } else {
            setTimeout(function() {
                shinobi.util.addLoopAnimateProcess(elem, option);
            }, 1000);
        }
    },

    addAnimate: function(selector, option) {
        var itemList = document.querySelectorAll(selector);
        for (var i = 0; i < itemList.length; i++) {
            shinobi.util.addAnimateProcess(itemList[i], option);
        }
    },
    addAnimateProcess: function(item, option) {
        var listClassAppend = ["animated", "inifinite"];
        var classItem = option.hasOwnProperty("classItem") ? option["classItem"] : "bounce";
        listClassAppend.push(classItem);
        listClassAppend.forEach(function(itemClass) {
            item.classList.add(itemClass);
        });

        if (option.hasOwnProperty("infinity")) {
            setTimeout(function() {
                listClassAppend.forEach(function(itemClass) {
                    item.classList.remove(itemClass);
                });
                setTimeout(function() {
                    shinobi.util.addAnimateProcess(item, option);
                }, 2000);
            }, 2000);
        }
    },

    reverseFormatDate: function(dateInput, option) {
        var reverseFormat = option["reverseFormat"];
        var dd = dateInput.slice(reverseFormat.indexOf("dd"), reverseFormat.lastIndexOf("dd") + 2);
        var MM = dateInput.slice(reverseFormat.indexOf("MM"), reverseFormat.lastIndexOf("MM") + 2);
        var yyyy = dateInput.slice(reverseFormat.indexOf("yyyy"), reverseFormat.lastIndexOf("yyyy") + 4);
        var dateString = yyyy + "/" + MM + "/" + dd;
        var date = new Date(dateString);
        return shinobi.util.formatDate(date, option);
    },
    formatDate: function(date, options) {
        var dd = shinobi.util.getTwoDigit(date.getDate());
        var MM = shinobi.util.getTwoDigit(date.getMonth() + 1);
        var yyyy = date.getFullYear();
        var hh = shinobi.util.getTwoDigit(date.getHours());
        var mm = shinobi.util.getTwoDigit(date.getMinutes());
        var ss = shinobi.util.getTwoDigit(date.getSeconds());
        var dayOfWeek = shinobi.util.getDayOfWeek(date, options);
        var dayOfWeekShort = shinobi.util.getDayOfWeekShort(date, options);

        var returnValue = options && options.hasOwnProperty("format") ? options["format"] : "yyyy-MM-dd";
        returnValue = returnValue
            .replace("yyyy", yyyy)
            .replace("MM", MM)
            .replace("dd", dd)
            .replace("hh", hh)
            .replace("mm", mm)
            .replace("ss", ss)
            .replace("dayOfWeekShort", dayOfWeekShort).replace("dayOfWeek", dayOfWeek);
        return returnValue;
    },

    getDayOfWeek: function(date, options) {
        var lang = options && options.hasOwnProperty("language") ? options["language"] : "vn";
        var mapping = {
            vn: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
            en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        };
        var day = date.getDay();
        return mapping[lang][day];
    },
    getDayOfWeekShort: function(date, options) {
        var lang = options && options.hasOwnProperty("language") ? options["language"] : "vn";
        var mapping = {
            vn: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
            en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        };
        var day = date.getDay();
        return mapping[lang][day];
    },

    getTagInputMappingElem: function(elem) {
        var returnElem;
        if (typeof shinobi.initbulma.tagsInput == "object") {
            shinobi.initbulma.tagsInput.forEach(function(item) {
                if (item["element"] == elem) {
                    returnElem = item;
                }
            });
        }
        return returnElem;
    },

    addEventEnter: function(elem, callback) {
        elem.addEventListener("keypress", function(e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                e.preventDefault();
                callback();
            }
        });
        var isMobile = shinobi.util.checkMobile();
        if (isMobile) {
            elem.addEventListener("focusout", function(e) {
                callback();
            });
        }
    },

    jsonToSearchParam: function(json) {
        var search = "";
        for (let key in json) {
            search += `&${key}=${json[key]}`;
        }

        return "?" + search.slice(1, search.length);
    },

    getCalendarMappingElem: function(elem) {
        var returnElem;
        if (typeof shinobi.initbulma.calendars == "object") {
            shinobi.initbulma.calendars.forEach(function(item) {
                if (item["element"] == elem) {
                    returnElem = item;
                }
            });
        }
        return returnElem;
    },

    getDateAfterCurrentDate: function(numberDate, elementAfter) {
        var currentDate = new Date();

        switch (elementAfter) {
            case "day":
                currentDate.setDate(currentDate.getDate() + numberDate);
                break;

            case "month":
                currentDate.setMonth(currentDate.getMonth() + numberDate);
                break;

            case "year":
                currentDate.setFullYear(currentDate.setFullYear() + numberDate);
                break;

            default:
                break;
        }

        var year = currentDate.getFullYear();
        var month = shinobi.util.getTwoDigit(currentDate.getMonth() + 1);
        var day = shinobi.util.getTwoDigit(currentDate.getDate());

        return year + "-" + month + "-" + day;
    },

    getDateAfterDate: function(date, numberDate, elementAfter) {
        date = shinobi.util.preProcessDateInput(date);
        var currentDate = new Date(date);

        switch (elementAfter) {
            case "day":
                currentDate.setDate(currentDate.getDate() + numberDate);
                break;

            case "month":
                currentDate.setMonth(currentDate.getMonth() + numberDate);
                break;

            case "year":
                currentDate.setFullYear(currentDate.setFullYear() + numberDate);
                break;

            default:
                break;
        }

        var year = currentDate.getFullYear();
        var month = shinobi.util.getTwoDigit(currentDate.getMonth() + 1);
        var day = shinobi.util.getTwoDigit(currentDate.getDate());

        return year + "-" + month + "-" + day;
    },

    getSearchKey: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    getSearchParam: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    renderUserInfo: function(selector) {
        var elem = document.querySelector(selector);
        shinobi.util.renderUserInfoElement(elem);
    },

    renderUserInfoElement: function(elem) {
        shinobi.coreapi.getLoggedUserInfo(function(response) {
            var jsonArr = JSON.parse(response);
            shinobi.mapping.renderElement(elem, jsonArr);
        });
    },

    buildSearchUserField: function(selector, option) {
        var field = document.querySelector(selector);
        shinobi.util.buildSearchUserFieldElement(field, option);
    },

    isEmpty: function(object) {
        return Object.keys(object).length === 0 && object.constructor === Object ? true : false;
    },

    uniqueArray: function(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    },
    buildUpfileButton: function(selector, option) {
        var element = document.querySelector(selector);
        var uploadUrl = option && option.hasOwnProperty("uploadUrl") ? option.uploadUrl : "uploadfile";
        shinobi.fileupload.registerElement(
            element,
            "change",
            uploadUrl,
            function() {
                return 0;
            },
            function(jsonResponse) {
                if (jsonResponse.result == "success") {
                    shinobi.notification.notification.info("Upload thành công");
                    var url = jsonResponse.content.url;
                    shinobi.render.renderImageFileInput(element, url, {});

                    // var link = document.getElementById('link');
                    // link.innerHTML = url;
                } else {
                    shinobi.notification.notification.error("Có lỗi vui lòng thử lại");
                }
            },
            option
        );
    },

    checkEmptyJson: function(json, callback, option) {
        if (option) {
            var entries = Object.entries(json);
            var listNotEmpty = option.hasOwnProperty("listNotEmpty") ? option.listNotEmpty : Object.keys(json);
            var listEmpty = option.hasOwnProperty("listEmpty") ? option.listEmpty : [];
            var hasEmpty = false;
            for (var i = 0; i < entries.length; i++) {
                var item = entries[i];
                if (!listEmpty.includes(item[0])) {
                    if (listNotEmpty.includes(item[0]) && item[1] == "") {
                        hasEmpty = true;
                    }
                }
            }
            hasEmpty ? shinobi.util.fillInputMessage() : callback();
        } else {
            Object.values(json).includes("") ? shinobi.util.fillInputMessage() : callback();
        }
    },

    getParentElementHasAttribute: function(item, option) {
        var parentNode = item.parentNode;
        var isFound = false;
        var returnElement = null;
        var type = option["type"];
        var value = option["value"];
        switch (type) {
            case "class":
                if (parentNode.classList.contains(value)) {
                    isFound = true;
                    returnElement = parentNode;
                }
                break;
            case "id":
                if (parentNode.id == value) {
                    isFound = true;
                    returnElement = parentNode;
                }
                break;
            case "tagName":
                if (parentNode.tagName == value) {
                    isFound = true;
                    returnElement = parentNode;
                }

            default:
                break;
        }

        if (parentNode.tagName == "BODY") {
            return returnElement;
        } else {
            return isFound ? returnElement : shinobi.util.getParentElementHasAttribute(parentNode, option);
        }
    },

    buildSearchUserFieldElement: function(field, option) {
        var input = field.querySelector(".input");
        var button = field.querySelector(".button");
        button.onclick = function() {
            var searchKey = input.value.trim();
            if (searchKey == "") {
                input.classList.add("is-danger");
                shinobi.util.fillInputMessage();
            } else {
                input.classList.remove("is-danger");
                var request = {
                    searchkey: searchKey,
                };
                shinobi.notification.notification.loading();
                shinobi.api.request(shinobi.coreapi.loggedUserApi + "searchUser", JSON.stringify(request), function(response) {
                    shinobi.notification.notification.loaded();
                    if (option.hasOwnProperty("callback")) {
                        option.callback(response);
                    }
                });
            }
        };
    },

    buildAutoSuggestProvince: function(selector, submitFunction) {
        var inputElem = document.querySelector(selector);

        if (inputElem.hasAttribute("build-autocomplete")) {
            inputElem.nextElementSibling.remove();

            var newInput = document.createElement("input");
            newInput.setAttribute("id", inputElem.id);
            newInput.setAttribute("class", "input");
            inputElem.parentNode.replaceChild(newInput, inputElem);
            inputElem = newInput;
        }

        inputElem.classList.add("select-symbol-input");
        inputElem.classList.add("autocomplete-input");
        inputElem.setAttribute("placeholder", "Tỉnh/Thành phố");
        inputElem.setAttribute("build-autocomplete", "true");
        var parentNode = inputElem.parentNode;
        parentNode.classList.add("autocomplete");

        var ul = document.createElement("ul");
        ul.setAttribute("class", "autocomplete-result-list ");
        shinobi.util.insertAfterElem(ul, inputElem);

        shinobi.cacheapi.request(shinobi.coreapi.locationApi + "getAllVietNamProvince", "{}", function(response) {
            var jsonData = JSON.parse(response);

            var data = [];

            jsonData.forEach(function(json) {
                data.push(json["provincename"]);
            });

            var selectSymbolObject = new Autocomplete(parentNode, {
                search: function(input) {
                    var result = [];
                    if (input.length > 0) {
                        result = data.filter(function(item) {
                            return item.toUpperCase().includes(input.toUpperCase());
                        });
                    }

                    return result;
                },
                onSubmit: function(value) {
                    shinobi.a = selectSymbolObject;
                    if (typeof submitFunction == "function") {
                        submitFunction(value, selectSymbolObject);
                    }
                },
                autoSelect: true,
            });

            return selectSymbolObject;
        });
    },

    convertTextToElement: function(text) {
        var div = document.createElement("div");
        div.innerHTML = text;
        var content = div.firstElementChild;
        return content;
    },
    buildAutoSuggestBankName: function(selector, submitFunction) {
        var inputElem = document.querySelector(selector);

        if (inputElem.hasAttribute("build-autocomplete")) {
            inputElem.nextElementSibling.remove();

            var newInput = document.createElement("input");
            newInput.setAttribute("id", inputElem.id);
            newInput.setAttribute("class", "input");
            inputElem.parentNode.replaceChild(newInput, inputElem);
            inputElem = newInput;
        }

        inputElem.classList.add("autocomplete-input");
        inputElem.setAttribute("placeholder", "Ngân hàng");
        inputElem.setAttribute("build-autocomplete", "true");
        var parentNode = inputElem.parentNode;
        parentNode.classList.add("autocomplete");

        var ul = document.createElement("ul");
        ul.setAttribute("class", "autocomplete-result-list ");
        shinobi.util.insertAfterElem(ul, inputElem);

        shinobi.cacheapi.request(shinobi.coreapi.locationApi + "getAllBankName", "{}", function(response) {
            var jsonData = JSON.parse(response);

            var data = [];

            jsonData.forEach(function(json) {
                data.push(json["bankfullname"]);
            });

            var selectSymbolObject = new Autocomplete(parentNode, {
                search: function(input) {
                    var result = [];
                    if (input.length > 0) {
                        result = data.filter(function(item) {
                            return item.toUpperCase().includes(input.toUpperCase());
                        });
                    }

                    return result;
                },
                onSubmit: function(value) {
                    shinobi.a = selectSymbolObject;
                    if (typeof submitFunction == "function") {
                        submitFunction(value, selectSymbolObject);
                    }
                },
                autoSelect: true,
            });

            return selectSymbolObject;
        });
    },

    addClass: function(locationId, className) {
        var location = document.getElementById(locationId);
        location.classList.add(className);
    },
    removeClass: function(locationId, className) {
        var location = document.getElementById(locationId);
        location.classList.remove(className);
    },

    removeClassOfList: function(listId, className) {
        listId.forEach(function(itemId) {
            shinobi.aladinUtil.removeClass(itemId, className);
        });
    },

    getAllSearchInPath: function() {
        const params = {};
        document.location.search
            .substr(1)
            .split("&")
            .forEach((pair) => {
                [key, value] = pair.split("=");
                params[key] = value;
            });
        return params;
    },

    swapKeyAndValueJson: function(json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    },

    addClassOfList: function(listId, className) {
        listId.forEach(function(itemId) {
            shinobi.aladinUtil.addClass(itemId, className);
        });
    },

    addClassOfListClass: function(classNameOfListClass, className) {
        var listElem = document.getElementsByClassName(classNameOfListClass);

        for (var i = 0; i < listElem.length; i++) {
            var item = listElem[i];

            item.classList.add(className);
        }
    },
    removeClassOfListClass: function(classNameOfListClass, className) {
        var listElem = document.getElementsByClassName(classNameOfListClass);

        for (var i = 0; i < listElem.length; i++) {
            var item = listElem[i];

            item.classList.remove(className);
        }
    },
    removeAllClass: function(locationId, classNameLocation, className) {
        var location = document.getElementById(locationId);
        var listClassLocation = location.getElementsByClassName(classNameLocation);

        var length = listClassLocation.length;
        for (var i = 0; i < length; i++) {
            listClassLocation[i].classList.remove(className);
        }
    },

    decodeValue: function(input) {
        var txt = document.createElement("textarea");
        txt.innerHTML = input;
        return txt.value;
    },

    loadListAds: function(option) {
        var request = option["request"];
        shinobi.cacheapi.request("/api/UserRankingOverviewApi/getListAds", JSON.stringify(request), function(response) {
            var array = JSON.parse(response);
            if (array) {
                option.callback(array);
            }
        });
    },

    convertCSVToArray: function(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = strDelimiter || ",";

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            // Delimiters.
            "(\\" +
            strDelimiter +
            "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            '(?:"([^"]*(?:""[^"]*)*)"|' +
            // Standard fields.
            '([^"\\' +
            strDelimiter +
            "\\r\\n]*))",
            "gi"
        );

        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
            []
        ];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;

        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while ((arrMatches = objPattern.exec(strData))) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
            } else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }

            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return arrData;
    },

    insertAfterElem: function(newElem, elem) {
        elem.parentNode.insertBefore(newElem, elem.nextSibling);
    },

    createNumberCleaveInput: function(selector, options) {
        var formatCharacter = shinobi.util.getFormatCharacters();
        var numberFormatCharacter = formatCharacter.numberFormatCharacter;
        var decimalFormatCharacter = formatCharacter.decimalFormatCharacter;
        var optionsCleave = Object.assign({
                numeral: true,
                numeralDecimalMark: decimalFormatCharacter,
                delimiter: numberFormatCharacter,
            },
            options
        );
        return new Cleave(selector, optionsCleave);
    },
    getValueNumberCleaveFormat: function(elem) {
        return shinobi.render.removeFormatNumber(elem.value.trim());
    },

    getRecordNumber: function(paginationContainerId) {
        var containerId;
        var paginationContainer;
        if (paginationContainerId) {
            var container = document.getElementById(paginationContainerId);
            paginationContainer = container.nextElementSibling.classList.contains("table-pagination") ?
                container.nextElementSibling :
                container.nextElementSibling.getElementsByClassName("table-pagination")[0];
        } else {
            containerId = "table-pagination";
            paginationContainer = document.getElementById(containerId);
        }
        var parentNodePaginationContainer = paginationContainer.parentElement;
        var recordNum;
        var recodeNumAttr = "record-num";
        if (parentNodePaginationContainer.hasAttribute(recodeNumAttr)) {
            recordNum = parentNodePaginationContainer.getAttribute(recodeNumAttr);
        } else {
            var recordNumSelect = paginationContainer.getElementsByClassName("shinobi-recordperpage")[0];
            recordNum = recordNumSelect.value;
        }
        shinobi.util.customRecordPerPagePagination(paginationContainer, recordNum);
        return recordNum;
    },
    customRecordPerPagePagination: function(container, recordNum) {
        var selectRecordNum = container.getElementsByClassName("shinobi-recordperpage")[0];
        var listOptionSelect = selectRecordNum.getElementsByTagName("option");
        for (var i = 0; i < listOptionSelect.length; i++) {
            var j = parseInt(i) + 1;
            var currentPageNum = j * recordNum;
            listOptionSelect[i].innerHTML = currentPageNum;
            listOptionSelect[i].value = currentPageNum;
        }
    },

    updateSuccess: function(callback) {
        shinobi.notification.notification.info("Cập nhật thành công");
        if (typeof callback == "function") {
            callback();
        }
    },

    fillInputMessage: function(callback) {
        shinobi.notification.notification.error("Vui lòng nhập đầy đủ thông tin");
        if (typeof callback == "function") {
            callback();
        }
    },

    checkValueEmpty: function(json, callback) {
        var values = Object.values(json);
        if (!values.includes("")) {
            if (typeof callback == "function") {
                callback();
            }
        } else {
            shinobi.util.fillInputMessage();
        }
    },

    getLoggedUser: function() {
        shinobi.util.checkAuthen();
    },
    checkAuthen: function(callback) {
        var request = {};
        shinobi.cacheapi.request(shinobi.coreapi.userApi + "checkAuthen", JSON.stringify(request), function(response) {
            var data = JSON.parse(response);

            if (typeof callback == "function") {
                data ? callback(data["username"]) : callback(false);
            }
        });
    },

    requestAuthen: function(callback) {
        shinobi.coreapi.checkAuthen(function(username) {
            if (typeof callback == "function") {
                username ? callback(username) : shinobi.notification.notification.error("Vui lòng đăng nhập để thao tác");
            }
        });
    },
    reCheckAuthen: function(callback) {
        var key = shinobi.coreapi.userApi + "checkAuthen";
        if (typeof shinobi.cacheapi.cache == "object") {
            shinobi.cacheapi.clearKey(key);
        }
        shinobi.util.checkAuthen(callback);
    },
    getSessionId: function(callback) {
        var request = {};
        shinobi.api.request(shinobi.coreapi.systemUserApi + "getSessionId", JSON.stringify(request), function(response) {
            if (typeof callback == "function") {
                var data = JSON.parse(response);
                if (data.hasOwnProperty("sessionid")) {
                    data["sessionid"] != -1 ? callback(data["sessionid"]) : callback(false);
                } else {
                    callback(false);
                }
            }
        });
    },
    getUserInfo: function(callback, option) {
        var userInfoRequest;
        if (!option) {
            shinobi.util.checkAuthen(function(username) {
                userInfoRequest = {
                    username: username,
                };
                shinobi.cacheapi.request(
                    shinobi.coreapi.userApi + "getAllUserInfo",
                    JSON.stringify(userInfoRequest),
                    function(response) {
                        if (typeof callback == "function") {
                            callback(response);
                        }
                    }
                );
            });
        } else {
            if (option.hasOwnProperty("username")) {
                userInfoRequest = {
                    username: option.username,
                };
                shinobi.cacheapi.request(
                    shinobi.coreapi.loggedUserApi + "getUserInfo",
                    JSON.stringify(userInfoRequest),
                    function(response) {
                        if (typeof callback == "function") {
                            callback(response);
                        }
                    }
                );
            }
        }
    },
    getLoggedUserInfo: function(callback) {
        shinobi.util.checkAuthen(function(username) {
            var userInfoRequest = {
                username: username,
            };
            shinobi.cacheapi.request(
                shinobi.coreapi.loggedUserApi + "getAllUserInfo",
                JSON.stringify(userInfoRequest),
                function(response) {
                    if (typeof callback == "function") {
                        callback(response);
                    }
                }
            );
        });
    },

    checkUpdateSuccess: function(response, callback, option) {
        if (["insert success", "update success"].includes(response)) {
            if (!(option && !option["showNotification"])) {
                var showContent =
                    option && option.hasOwnProperty("showContent") ? option["showContent"] : "Cập nhật thành công";
                shinobi.notification.notification.info(showContent);
            }

            if (typeof callback == "function") {
                callback();
            }
        }
    },

    getFormatCharacters: function() {
        var numberFormatCharacter = ",";
        var decimalFormatCharacter = ".";

        if (typeof shinobi.utilconfig == "object") {
            if (shinobi.utilconfig.hasOwnProperty("numberFormatCharacter")) {
                if (shinobi.utilconfig.numberFormatCharacter.hasOwnProperty("numberCharacter")) {
                    numberFormatCharacter = shinobi.utilconfig.numberFormatCharacter.numberCharacter;
                }
                if (shinobi.utilconfig.numberFormatCharacter.hasOwnProperty("numberCharacter")) {
                    decimalFormatCharacter = shinobi.utilconfig.numberFormatCharacter.decimalCharacter;
                }
            }
        }

        return {
            numberFormatCharacter: numberFormatCharacter,
            decimalFormatCharacter: decimalFormatCharacter,
        };
    },

    getAllStorage: function() {
        var entries = Object.entries(window.localStorage);
        var result = {};
        entries.forEach(function(item) {
            result[item[0]] = item[1];
        });
        return result;
    },

    setAllStorage: function(json) {
        var entries = Object.entries(json);
        entries.forEach(function(item) {
            window.localStorage.setItem(item[0], item[1]);
        });
    },
    formatNumber: function(value) {
        var formatCharacter = shinobi.util.getFormatCharacters();
        var numberFormatCharacter = formatCharacter.numberFormatCharacter;
        var decimalFormatCharacter = formatCharacter.decimalFormatCharacter;
        return Number(value).format(0, 3, numberFormatCharacter, decimalFormatCharacter);
    },

    getContentIframe: function(selector) {
        shinobi.util.getContentIframeElement(document.querySelector(selector));
    },

    getContentIframeElement: function(iframe) {
        var content = iframe.contentDocument || iframe.contentWindow.document;
        return content;
    },
    getTwoDigit: function(number) {
        return (number < 10 ? "0" : "") + number;
    },

    getInternationalTelephoneCode: function(intlTelInput) {
        var data = intlTelInput.getSelectedCountryData();
        return data["dialCode"];
    },
    getInternationalTelephoneCountry: function(intlTelInput) {
        var data = intlTelInput.getSelectedCountryData();
        return data["iso2"];
    },
    setRangeCalendar: function(selector, start, end) {
        var calendar = shinobi.util.getCalendarMappingElem(document.querySelector(selector));
        calendar.datePicker.start = start;
        calendar.datePicker.end = end;
        calendar.save();
    },
    addEventJumpToId: function() {
        var jumpId = shinobi.util.getSearch("jumpid");
        if (jumpId) {
            var elem = document.getElementById(jumpId);
            var newOffset = elem.offsetTop - Number(shinobi.util.getFontSize()) * 4;
            var offset = newOffset > 0 ? newOffset : 0;
            document.body.scrollTop = offset;
            document.documentElement.scrollTop = offset;
        }
    },

    randomInList: function(list) {
        return list[Math.floor(Math.random() * list.length)];
    },

    jumpTo: function(selector) {
        var elem = document.querySelector(selector);
        shinobi.util.jumpToElement(elem);
    },

    jumpToElement: function(elem) {
        if (elem) {
            var newOffset = elem.offsetTop - Number(shinobi.util.getFontSize()) * 4;
            var offset = newOffset > 0 ? newOffset : 0;
            document.body.scrollTop = offset;
            document.documentElement.scrollTop = offset;
        }
    },
    getStorage: function(key, option) {
        var storage = window.localStorage.getItem(key);
        var nullValue = "";
        return storage ? storage : nullValue;
    },
    setStorage: function(key, value, option) {
        window.localStorage.setItem(key, value);
    },

    getLoggedName: function(callback) {
        shinobi.util.getUserInfo(function(response) {
            var data = JSON.parse(response);
            var loggedName = "";
            if (data) {
                if (data.hasOwnProperty("firstname") && data.hasOwnProperty("lastname")) {
                    loggedName = data["firstname"] + " " + data["lastname"];
                }

                if (typeof callback == "function") {
                    callback(loggedName);
                }
            }
        });
    },

    getSearch: function(searchKey) {
        var search = window.location.search;
        var split = search.split("?");
        var value = null;
        var searchPatern = searchKey + "=";
        split.forEach(function(searchItem) {
            value = searchItem.includes(searchPatern) ? searchItem.replace(searchPatern, "") : value;
        });
        return value;
    },

    getFontSize: function(elem) {
        return shinobi.util.getComputedProperty(elem, "font-size").replace("px", "");
    },

    getComputedProperty: function(elem, property) {
        return elem ?
            window.getComputedStyle(elem, null).getPropertyValue(property) :
            window.getComputedStyle(document.body, null).getPropertyValue(property);
    },

    getValueInput: function(elem) {
        var type = elem.getAttribute("type");
        var value;
        switch (type) {
            case "checkbox":
                value = elem.checked;
                break;
            case "text":
            case "password":
            default:
                value = elem.value.trim();
                break;
        }

        value = elem.hasAttribute("snb-preprocess") ? eval(elem.getAttribute("snb-preprocess"))(value) : value;
        return value;
    },
    sha256: function(ascii) {
        var mathPow = Math.pow;
        var maxWord = mathPow(2, 32);
        var lengthProperty = "length";
        var i, j; // Used as a counter across the whole file
        var result = "";

        var words = [];
        var asciiBitLength = ascii[lengthProperty] * 8;

        var hash = (shinobi.util.sha256.h = shinobi.util.sha256.h || []);

        var k = (shinobi.util.sha256.k = shinobi.util.sha256.k || []);
        var primeCounter = k[lengthProperty];

        var isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }

        ascii += "\x80"; // Append Ƈ' bit (plus zero padding)
        while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero
        // padding
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return; // ASCII check: only accept characters in
            // range 0-255
            words[i >> 2] |= j << (((3 - i) % 4) * 8);
        }
        words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
        words[words[lengthProperty]] = asciiBitLength;

        // process each chunk
        for (j = 0; j < words[lengthProperty];) {
            var w = words.slice(j, (j += 16)); // The message is expanded
            // into 64 words as part of
            // the iteration
            var oldHash = hash;
            // This is now the undefinedworking hash", often labelled as
            // variables a...g
            // (we have to truncate as well, otherwise extra entries at the
            // end accumulate
            hash = hash.slice(0, 8);

            for (i = 0; i < 64; i++) {
                var i2 = i + j;
                // Expand the message into 64 words
                // Used below if
                var w15 = w[i - 15],
                    w2 = w[i - 2];

                // Iterate
                var a = hash[0],
                    e = hash[4];
                var temp1 =
                    hash[7] +
                    (shinobi.util.rightRotate(e, 6) ^ shinobi.util.rightRotate(e, 11) ^ shinobi.util.rightRotate(e, 25)) + // S1
                    ((e & hash[5]) ^ (~e & hash[6])) + // ch
                    k[i] +
                    // Expand the message schedule if needed
                    (w[i] =
                        i < 16 ?
                        w[i] :
                        (w[i - 16] +
                            (shinobi.util.rightRotate(w15, 7) ^ shinobi.util.rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                            w[i - 7] +
                            (shinobi.util.rightRotate(w2, 17) ^ shinobi.util.rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
                        0);
                // This is only used once, so *could* be moved below, but it
                // only saves 4 bytes and makes things unreadble
                var temp2 =
                    (shinobi.util.rightRotate(a, 2) ^ shinobi.util.rightRotate(a, 13) ^ shinobi.util.rightRotate(a, 22)) + // S0
                    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

                hash = [(temp1 + temp2) | 0].concat(hash); // We don't

                hash[4] = (hash[4] + temp1) | 0;
            }

            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                var b = (hash[i] >> (j * 8)) & 255;
                result += (b < 16 ? 0 : "") + b.toString(16);
            }
        }
        return result;
    },
    rightRotate: function(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    },
    removeUnicode: function(str) {
        return shinobi.util.remove_unicode(str);
    },

    listAudio: {},

    playAudio: function(url) {
        var snd = shinobi.util.listAudio.hasOwnProperty(url) ? shinobi.util.listAudio[url] : new Audio(url);
        snd.play();
        shinobi.util.listAudio[url] = snd;
    },

    remove_unicode: function remove_unicode(str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");

        str = str.replace(/-+-/g, "-");
        str = str.replace(/^\-+|\-+$/g, "");

        return str;
    },

    changeActiveElement: function(generalId, differentEleList, activeClass, eleActiveId) {
        for (var i = 0; i < differentEleList.length; i++) {
            var eleId = generalId + differentEleList[i];
            if (eleId == eleActiveId) {
                document.getElementById(eleId).classList.add(activeClass);
            } else {
                document.getElementById(eleId).classList.remove(activeClass);
            }
        }
    },
    modalEventListener: function(modal) {
        var closeButtonList = modal.getElementsByClassName("delete");
        var closeButton = closeButtonList[0];
        if (closeButton) {
            closeButton.onclick = function() {
                modal.classList.toggle("is-active");
            };
        }

        var cancelModalButtonList = modal.getElementsByClassName("cancel-modal-button");
        if (cancelModalButtonList) {
            for (var i = 0; i < cancelModalButtonList.length; i++) {
                cancelModalButtonList[i].onclick = function() {
                    modal.classList.toggle("is-active");
                };
            }
        }

        var modalBackground = modal.getElementsByClassName("modal-background");

        for (var j = 0; j < modalBackground.length; j++) {
            modalBackground[j].onclick = function() {
                modal.classList.toggle("is-active");
            };
        }

        window.addEventListener(
            "keydown",
            function(event) {
                if (event.key == "Escape") {
                    modal.classList.remove("is-active");
                }
            },
            true
        );

        var footer = modal.getElementsByTagName("footer")[0];

        if (footer) {
            var buttonFooterList = footer.getElementsByTagName("button");

            for (var j in buttonFooterList) {
                buttonFooterList[j].onclick = function() {
                    modal.classList.toggle("is-active");
                };
            }
        }

        if (modal.hasAttribute("control-button-list")) {
            var controlButtonList = modal.getAttribute("control-button-list").split("|");

            for (var k = 0; k < controlButtonList.length; k++) {
                var item = document.getElementById(controlButtonList[k]);

                item.onclick = function() {
                    modal.classList.add("is-active");

                    if (item.hasAttribute("snb-render")) {
                        var value = item.getAttribute("snb-key");

                        var render = item.getAttribute("snb-render");

                        eval(render)(item, value);
                    }
                };
            }
        }
    },

    createFireWork: function(option) {
        // Options
        var options = {
            /* Which hue should be used for the first batch of rockets? */
            startingHue: 120,
            /*
             * How many ticks the script should wait before a new firework gets
             * spawned, if the user is holding down his mouse button.
             */
            clickLimiter: 5,
            /* How fast the rockets should automatically spawn, based on ticks */
            // timerInterval: 40,
            timerInterval: 20,
            /* Show pulsing circles marking the targets? */
            // showTargets: true,
            showTargets: false,
            /* Rocket movement options, should be self-explanatory */
            rocketSpeed: 4,
            rocketAcceleration: 1.03,
            /* Particle movement options, should be self-explanatory */
            particleFriction: 0.95,
            particleGravity: 1,
            /* Minimum and maximum amount of particle spawns per rocket */
            particleMinCount: 25,
            particleMaxCount: 40,
            /* Minimum and maximum radius of a particle */
            particleMinRadius: 3,
            particleMaxRadius: 5,
        };

        // Local variables
        var fireworks = [];
        var particles = [];
        var mouse = { down: false, x: 0, y: 0 };
        var currentHue = options.startingHue;
        var clickLimiterTick = 0;
        var timerTick = 0;
        var cntRocketsLaunched = 0;

        // Helper function for canvas animations
        window.requestAnimFrame = (function() {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(cb) {
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        })();

        // Helper function to return random numbers within a specified range
        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Helper function to calculate the distance between 2 points
        function calculateDistance(p1x, p1y, p2x, p2y) {
            var xDistance = p1x - p2x;
            var yDistance = p1y - p2y;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }

        // Setup some basic variables
        // var canvas = document.getElementById('canvas');
        var canvas = document.createElement("canvas");
        var canvasContainer = option && option.hasOwnProperty("container") ? option["container"] : document.body;
        canvasContainer.appendChild(canvas);
        var canvasCtx = canvas.getContext("2d");
        var canvasWidth = window.innerWidth;
        var canvasHeight = window.innerHeight;

        // Resize canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Firework class
        function Firework(sx, sy, tx, ty) {
            // Set coordinates (x/y = actual, sx/sy = starting, tx/ty = target)
            this.x = this.sx = sx;
            this.y = this.sy = sy;
            this.tx = tx;
            this.ty = ty;

            // Calculate distance between starting and target point
            this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
            this.distanceTraveled = 0;

            // To simulate a trail effect, the last few coordinates will be
            // stored
            this.coordinates = [];
            this.coordinateCount = 3;

            // Populate coordinate array with initial data
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }

            // Some settings, you can adjust them if you'd like to do so.
            this.angle = Math.atan2(ty - sy, tx - sx);
            this.speed = options.rocketSpeed;
            this.acceleration = options.rocketAcceleration;
            this.brightness = random(50, 80);
            this.hue = currentHue;
            this.targetRadius = 1;
            this.targetDirection = false; // false = Radius is getting bigger,
            // true = Radius is getting smaller

            // Increase the rockets launched counter
            cntRocketsLaunched++;
        }

        // This method should be called each frame to update the firework
        Firework.prototype.update = function(index) {
            // Update the coordinates array
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            // Cycle the target radius (used for the pulsing target circle)
            if (!this.targetDirection) {
                if (this.targetRadius < 8) this.targetRadius += 0.15;
                else this.targetDirection = true;
            } else {
                if (this.targetRadius > 1) this.targetRadius -= 0.15;
                else this.targetDirection = false;
            }

            // Speed up the firework (could possibly travel faster than the
            // speed of light)
            this.speed *= this.acceleration;

            // Calculate the distance the firework has travelled so far (based
            // on velocities)
            var vx = Math.cos(this.angle) * this.speed;
            var vy = Math.sin(this.angle) * this.speed;
            this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

            // If the distance traveled (including velocities) is greater than
            // the initial distance
            // to the target, then the target has been reached. If that's not
            // the case, keep traveling.
            if (this.distanceTraveled >= this.distanceToTarget) {
                createParticles(this.tx, this.ty);
                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        };

        // Draws the firework
        Firework.prototype.draw = function() {
            var lastCoordinate = this.coordinates[this.coordinates.length - 1];

            // Draw the rocket
            canvasCtx.beginPath();
            canvasCtx.moveTo(lastCoordinate[0], lastCoordinate[1]);
            canvasCtx.lineTo(this.x, this.y);
            canvasCtx.strokeStyle = "hsl(" + this.hue + ",100%," + this.brightness + "%)";
            canvasCtx.stroke();

            // Draw the target (pulsing circle)
            if (options.showTargets) {
                canvasCtx.beginPath();
                canvasCtx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
                canvasCtx.stroke();
            }
        };

        // Particle class
        function Particle(x, y) {
            // Set the starting point
            this.x = x;
            this.y = y;

            // To simulate a trail effect, the last few coordinates will be
            // stored
            this.coordinates = [];
            this.coordinateCount = 5;

            // Populate coordinate array with initial data
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }

            // Set a random angle in all possible directions (radians)
            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 10);

            // Add some friction and gravity to the particle
            this.friction = options.particleFriction;
            this.gravity = options.particleGravity;

            // Change the hue to a random number
            this.hue = random(currentHue - 20, currentHue + 20);
            this.brightness = random(50, 80);
            this.alpha = 1;

            // Set how fast the particles decay
            this.decay = random(0.01, 0.03);
        }

        // Updates the particle, should be called each frame
        Particle.prototype.update = function(index) {
            // Update the coordinates array
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            // Slow it down (based on friction)
            this.speed *= this.friction;

            // Apply velocity to the particle
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;

            // Fade out the particle, and remove it if alpha is low enough
            this.alpha -= this.decay;
            if (this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        };

        // Draws the particle
        Particle.prototype.draw = function() {
            var lastCoordinate = this.coordinates[this.coordinates.length - 1];
            var radius = Math.round(random(options.particleMinRadius, options.particleMaxRadius));

            // Create a new shiny gradient
            var gradient = canvasCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
            gradient.addColorStop(0.0, "white");
            gradient.addColorStop(0.1, "white");
            gradient.addColorStop(0.1, "hsla(" + this.hue + ",100%," + this.brightness + "%," + this.alpha + ")");
            gradient.addColorStop(1.0, "black");

            // Draw the gradient
            canvasCtx.beginPath();
            canvasCtx.fillStyle = gradient;
            canvasCtx.arc(this.x, this.y, radius, Math.PI * 2, false);
            canvasCtx.fill();
        };

        // Create a bunch of particles at the given position
        function createParticles(x, y) {
            var particleCount = Math.round(random(options.particleMinCount, options.particleMaxCount));
            while (particleCount--) {
                particles.push(new Particle(x, y));
            }
        }

        // Add an event listener to the window so we're able to react to size
        // changes
        window.addEventListener("resize", function(e) {
            canvas.width = canvasWidth = window.innerWidth;
            canvas.height = canvasHeight = window.innerHeight;
        });

        // Add event listeners to the canvas to handle mouse interactions
        canvas.addEventListener("mousemove", function(e) {
            e.preventDefault();
            mouse.x = e.pageX - canvas.offsetLeft;
            mouse.y = e.pageY - canvas.offsetTop;
        });

        canvas.addEventListener("mousedown", function(e) {
            e.preventDefault();
            mouse.down = true;
        });

        canvas.addEventListener("mouseup", function(e) {
            e.preventDefault();
            mouse.down = false;
        });

        // Main application / script, called when the window is loaded
        function gameLoop() {
            // This function will rund endlessly by using requestAnimationFrame
            // (or fallback to setInterval)
            requestAnimFrame(gameLoop);

            // Increase the hue to get different colored fireworks over time
            currentHue += 0.5;

            // 'Clear' the canvas at a specific opacity, by using
            // 'destination-out'. This will create a trailing effect.
            canvasCtx.globalCompositeOperation = "destination-out";
            canvasCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
            canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
            canvasCtx.globalCompositeOperation = "lighter";

            // Loop over all existing fireworks (they should be updated & drawn)
            var i = fireworks.length;
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }

            // Loop over all existing particles (they should be updated & drawn)
            var i = particles.length;
            while (i--) {
                particles[i].draw();
                particles[i].update(i);
            }

            // Draw some text
            // canvasCtx.fillStyle = 'white';
            // canvasCtx.font = '14px Arial';
            // canvasCtx.fillText('Rockets launched: ' + cntRocketsLaunched, 10,
            // 24);

            // Launch fireworks automatically to random coordinates, if the user
            // does not interact with the scene
            if (timerTick >= options.timerInterval) {
                if (!mouse.down) {
                    fireworks.push(
                        new Firework(canvasWidth / 2, canvasHeight, random(0, canvasWidth), random(0, canvasHeight / 2))
                    );
                    timerTick = 0;
                }
            } else {
                timerTick++;
            }

            // Limit the rate at which fireworks can be spawned by mouse
            if (clickLimiterTick >= options.clickLimiter) {
                if (mouse.down) {
                    fireworks.push(new Firework(canvasWidth / 2, canvasHeight, mouse.x, mouse.y));
                    clickLimiterTick = 0;
                }
            } else {
                clickLimiterTick++;
            }
        }
        canvas.setAttribute("style", "position: fixed;top: 0;left: 0;");
        if (option && option.hasOwnProperty("onClick")) {
            if (typeof option.onClick == "function") {
                canvas.onclick = function() {
                    option.onClick();
                };
            }
        } else {
            if (option && option.hasOwnProperty("href")) {
                canvas.classList.add("has-cursor-pointer");
                canvas.onclick = function() {
                    window.location.href = option.href;
                };
            }
        }

        window.onload = gameLoop();
        return canvas;
    },

    createCoinFall: function(option) {
        var container = option.container;

        // var exists = document.getElementsByClassName('coinContainer')[0];
        // if (exists) {
        // exists.parentNode.removeChild(exists);
        // return false;
        // }

        var element = document.createElement("div");
        element.setAttribute("style", "position: fixed;");
        container.appendChild(element);
        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            focused = false;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.id = "gimmick";

        var coin = new Image();
        coin.src = option.hasOwnProperty("imageSrc") ? option.imageSrc : "http://i.imgur.com/5ZW2MT3.png";
        // 440 wide, 40 high, 10 states
        coin.onload = function() {
            element.appendChild(canvas);
            focused = true;
            drawloop();
        };
        var coins = [];

        function drawloop() {
            if (focused) {
                requestAnimationFrame(drawloop);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.3) {
                coins.push({
                    x: (Math.random() * canvas.width) | 0,
                    y: -50,
                    dy: 3,
                    s: 0.5 + Math.random(),
                    state: (Math.random() * 10) | 0,
                });
            }
            var i = coins.length;
            while (i--) {
                var x = coins[i].x;
                var y = coins[i].y;
                var s = coins[i].s;
                var state = coins[i].state;
                coins[i].state = state > 9 ? 0 : state + 0.1;
                coins[i].dy += 0.3;
                coins[i].y += coins[i].dy;

                ctx.drawImage(coin, 44 * Math.floor(state), 0, 44, 40, x, y, 44 * s, 40 * s);

                if (y > canvas.height) {
                    coins.splice(i, 1);
                }
            }
        }

        return element;
    },
    renderListPost: function(id, typepost = "news") {
        var dataList = null;
        if (id) {
            var parentID = id;
            var url = shinobi.coreapi.blogOverviewApi + "findDataList";
            var request = {
                recordPerPage: shinobi.util.getRecordNumber(parentID),
            };

            // shinobi.newspagerender.dataList = new
            // shinobi.datalist(parentID);
            // shinobi.newspagerender.dataList.staticfilters = [{ "colname":
            // "posttype", "operator": "like", "value": typepost }];
            // shinobi.newspagerender.dataList.staticsorts = [{ "colname":
            // "id", "value": "desc" }];
            // shinobi.newspagerender.dataList.initLoadApi(url, request);
            dataList = new shinobi.datalist(parentID);
            dataList.staticfilters = [{ colname: "posttype", operator: "like", value: typepost }];
            dataList.staticsorts = [{ colname: "id", value: "desc" }];
            dataList.initLoadApi(url, request);
        }
        return dataList;
    },
};