
$(window).on('DOMContentLoaded', inititaliseForm);

function inititaliseForm() {

    $('#other-title, #colors-js-puns').hide();
    $('#design').on('input', showColorOptionsForDesign);
    $('.activities').on('input', 'input', handleActivitySelection());
    $('#payment').on('input', handlePaymentSelection());
    initialiseValidations();
}

function showColorOptionsForDesign(event) {
    const designSelected = $(event.target).val();
    const $heartJsColorOptions = $("option[value = 'tomato'], option[value = 'steelblue'], option[value = 'dimgrey']");
    const $jsPunColorOptions = $("option[value = 'cornflowerblue'], option[value = 'darkslategrey'], option[value = 'gold']");
    const $colorDropDown = $('#colors-js-puns');
    if (designSelected === "js puns") {
        showAndHideOptions($jsPunColorOptions, $heartJsColorOptions);
        $colorDropDown.fadeIn(500);
    } else if (designSelected === "heart js") {
        showAndHideOptions($heartJsColorOptions, $jsPunColorOptions);
        $colorDropDown.fadeIn(500);
    } else {
        $heartJsColorOptions.show();
        $jsPunColorOptions.show();
        $($jsPunColorOptions["0"]).prop('selected', true);
        $colorDropDown.fadeOut(500);
    }
}

function showAndHideOptions($optionsToShow, $optionstoHide) {
    $optionstoHide.hide();
    $optionsToShow.show();
    $($optionsToShow["0"]).prop('selected', true);
}

function handleActivitySelection() {
    const $events9To12 = $("input[name = 'js-frameworks'], input[name = 'express'], input[name = 'build-tools']");
    const $events1To4 = $("input[name = 'js-libs'], input[name = 'node'], input[name = 'npm']");
    const $totalContainer = initialiseTotalCounter();
    return function (event) {
        const $changedEvent = $(event.target);
        const isChecked = $changedEvent.prop('checked');
        const $conflictingEvents = $events9To12.is($changedEvent) ? $events9To12 : $events1To4;

        if (isChecked) {
            if ($changedEvent.attr('name') !== 'all') {
                disableConflictingEvents($changedEvent, $conflictingEvents)
                changeTotal(100, $totalContainer);
            } else {
                changeTotal(200, $totalContainer);
            }
        } else {
            $conflictingEvents.prop("disabled", false);
            $conflictingEvents.parent().css('color', '#000')
            $changedEvent.attr('name') === 'all' ? changeTotal(-200, $totalContainer) : changeTotal(-100, $totalContainer);
        }

    }
}

function disableConflictingEvents($selectedEvent, $disableConflictingEvents) {
    $disableConflictingEvents.map((eventIndex) => {
        const $activity = $($disableConflictingEvents[eventIndex]);
        if (!$activity.is($selectedEvent)) {
            $activity.prop('disabled', true);
            $activity.parent().css({ color: "#A9A9A9" });
        } else {
            $activity.prop("disabled", false);
        }
    })
}

function initialiseTotalCounter() {
    $totalContainer = $(`<div class = "Total"> Total: $ <span>0<span>  </div>`);

    $totalContainer.hide();
    $('.activities').append($totalContainer);

    return $totalContainer;
}

function changeTotal(numberToChangeBy, $container) {
    let $totalSpan = $container.find('span');
    let total = parseInt($totalSpan.text());

    total += numberToChangeBy;
    $totalSpan.text(total);
    runTotalAnimation(total, $totalSpan, $container);
}

function runTotalAnimation(total, $textSpan, $container) {
    if (total === 0) {
        $textSpan.fadeOut();
        $container.slideUp(500);
    } else {
        $textSpan.fadeIn(600);
        $container.slideDown(500);
    }
}

function handlePaymentSelection() {
    const $paymentOptions = $('#payment');
    const $creditCard = $('#credit-card');
    const $otherPayments = $creditCard.siblings('div');

    setDefaultPaymentMethod($paymentOptions, $creditCard, $otherPayments);

    return function (event) {
        paymentSelection = $(event.target).val();
        displaySelectedPaymentMethod(paymentSelection, $creditCard, $otherPayments);
    }
}

function setDefaultPaymentMethod($options, $creditCard, $otherPayments) {
    $options.find("option[value = 'credit card']").prop('selected', true);
    $options.find("option[value = 'select_method']").hide();
    $creditCard.show();
    $otherPayments.hide()
}

function displaySelectedPaymentMethod(selectedOption, $creditCard, $otherPayments) {
    if (selectedOption === 'credit card') {
        $creditCard.slideDown()
        $otherPayments.slideUp();
    } else {
        $creditCard.slideUp();

        $otherPayments.map((index) => {
            const chosenPayment = new RegExp(`${selectedOption}`, "i").test($($otherPayments[index]).find('p').text());
            chosenPayment ? $($otherPayments[index]).slideDown() : $($otherPayments[index]).slideUp();
        });
    }
}

function initialiseValidationContainers() {
    createValidationContainerAndHide('#name', 'name-validation', "Name must be filled");
    createValidationContainerAndHide('#mail', 'mail-validation', "Email must be valid");
    createValidationContainerAndHide('.activities', 'activity-validation', "At least one activity must be selected");
    createCreditValidationContainerAndHide();
}

function createValidationContainerAndHide(targetSelector, validationId, message) {
    $(targetSelector).after(`<ol><li id = "${validationId}" class = "validation">${message}</li></ol>`);
    $(`#${validationId}`).hide();
}

function initialiseValidations() {
    initialiseValidationContainers();
    initialiseNameValidation();
    initialiseEmailValidation();
    initialiseCardValidation();
    initialiseActivityValidation();
    $('form').submit(validateAll);
}

function initialiseNameValidation() {
    $('#name').on('focus input', (event) => validateName($(event.target)));
    $('#name').on('focusout', (event) => {
        hideValidationMessages($(event.target), $('#name-validation'));
    });
}

function initialiseEmailValidation() {
    $('#mail').on('input focus', (event) => validateEmail($(event.target)));
    $('#mail').on('focusout', (event) => {
        hideValidationMessages($(event.target), $('#mail-validation'));
    });
}

function initialiseCardValidation() {
    $('#cc-num, #zip, #cvv').on('input focus', (event) => {
        validateCardNumber($('#cc-num'));
        validateCvvNumber($('#cvv'));
        validateZipdNumber($('#zip'));
    });

    $('#cc-num, #zip, #cvv').on('focusout', (event) => {
        hideValidationMessages($('#cc-num, #zip, #cvv'), $('#cc-num-validation, #zip-validation, #cvv-validation'));
    });
}

function initialiseActivityValidation() {
    $('.activities').on('input', 'input', (event) => {
        validateActivitySelection($('.activities'));
    });

    $('.activities').on('mouseover', (event) => {
        validateActivitySelection($('.activities'));
    });

    $('.activities').on('mouseout', (event) => {
        hideValidationMessages($('.activities'), $('#activity-validation'));
    });
}

function createCreditValidationContainerAndHide() {
    $('#credit-card').after(
        `<ol id = "card-validation">
            <li id = "cc-num-validation" class = "validation">Credit Card field number between 13 and 16 digits</li>
            <li id = "zip-validation" class = "validation">Zip Code should be  5 digits</li>
            <li id = "cvv-validation" class = "validation">CVV should be 3 digits</li>
         </ol>`
    );
    $(`#card-validation li`).hide();
}

function validateName($nameConatiner) {
    const validName = $nameConatiner.val().trim() !== '';
    displayValidationResultStyle($nameConatiner, $('#name-validation'), validName);

    return validName;
}

// regex from https://www.w3resource.com/javascript/form/email-validation.php
function validateEmail($emailConatiner) {
    const emailEntered = $emailConatiner.val();
    const validatorRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const validEmail = validatorRegex.test(emailEntered);

    displayValidationResultStyle($emailConatiner, $('#mail-validation'), validEmail);

    return validEmail;
}

// Style visuals inspiration https://ireade.github.io/form-validation-realtime/
function displayValidationResultStyle($validationTarget, $validationMessageContainer, validationPassed) {
    $validationMessageContainer.show();

    if (validationPassed) {
        $validationMessageContainer.css('color', '#7FFF00');
        if ($validationTarget.className !== 'activities') {
            $validationTarget.css('border-color', '#2ecc71');
        }
    } else {
        $validationMessageContainer.css('color', '#F61C1C');
        if ($validationTarget.className !== 'activities') {
            $validationTarget.css('border-color', '#FD5858');
        }
    }
}

function hideValidationMessages($validationTarget, $validationMessageContainer) {
    $validationMessageContainer.hide();

    if ($validationTarget.className !== 'activities') {
        $validationTarget.css('border-color', '#5e97b0');
    }
}

function validateCardNumber($numberContainer) {
    const numberEntered = $numberContainer.val();
    const validatorRegex = /^\d{13,16}$/;
    const validNumber = validatorRegex.test(numberEntered);

    displayValidationResultStyle($numberContainer, $('#cc-num-validation'), validNumber);

    return validNumber;
}

function validateZipdNumber($numberContainer) {
    const numberEntered = $numberContainer.val();
    const validatorRegex = /^\d{5}$/;
    const validNumber = validatorRegex.test(numberEntered);

    displayValidationResultStyle($numberContainer, $('#zip-validation'), validNumber);

    return validNumber;
}

function validateCvvNumber($numberContainer) {
    const numberEntered = $numberContainer.val();
    const validatorRegex = /^\d{3}$/;
    const validNumber = validatorRegex.test(numberEntered);

    displayValidationResultStyle($numberContainer, $('#cvv-validation'), validNumber);

    return validNumber;
}

function validateActivitySelection($activitiesContainer) {
    const activitySelectionValid = $activitiesContainer.find('input:checked').length > 0;

    displayValidationResultStyle($activitiesContainer, $('#activity-validation'), activitySelectionValid);

    return activitySelectionValid;
}

function validateAll(event) {
    const validActivity = validateActivitySelection($('.activities'));
    const validName = validateName($('#name'));
    const validEmail = validateEmail($('#mail'));
    let validCard = true;

    if ($('#payment').val() === 'credit card' ) {
        const validCardNumber = validateCardNumber($('#cc-num'));
        const validCardZip = validateZipdNumber($('#zip'))
        const validCardCvv = validateCvvNumber($('#cvv'));
        validCard = validCardNumber && validCardCvv && validateZipdNumber;
    }

    if (!(validActivity && validName && validEmail && validCard)){
        event.preventDefault();
    }
}




