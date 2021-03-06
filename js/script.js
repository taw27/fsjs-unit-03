$(window).on("DOMContentLoaded", inititaliseForm); // initialises all the form when DOM was loaded

/* 
  Initialises the page by focusing on the name input, hiding the other text input and color selection, 
  and initialises all other event handlers for selections and validation 
 */
function inititaliseForm() {
  $("#name").focus();
  $('#other-title, label[for = "other-title"], #colors-js-puns').hide();
  $("#design").on("input", showColorOptionsForDesign);
  $(".activities").on("input", "input", handleActivitySelection());
  $("#payment").on("input", handlePaymentSelection());
  $("#title").on("input", handleJobSelection);
  initialiseValidations();
}

/* 
  Takes in the event object for the input change event of design selection and displays the appropiate
  color options based on the design selection
 */
function showColorOptionsForDesign(event) {
  const designSelected = $(event.target).val();
  const $heartJsColorOptions = $(
    "option[value = 'tomato'], option[value = 'steelblue'], option[value = 'dimgrey']"
  );
  const $jsPunColorOptions = $(
    "option[value = 'cornflowerblue'], option[value = 'darkslategrey'], option[value = 'gold']"
  );
  const $colorDropDown = $("#colors-js-puns");
  if (designSelected === "js puns") {
    showAndHideOptions($jsPunColorOptions, $heartJsColorOptions);
    $colorDropDown.fadeIn(500);
  } else if (designSelected === "heart js") {
    showAndHideOptions($heartJsColorOptions, $jsPunColorOptions);
    $colorDropDown.fadeIn(500);
  } else {
    $heartJsColorOptions.show();
    $jsPunColorOptions.show();
    $($jsPunColorOptions["0"]).prop("selected", true);
    $colorDropDown.fadeOut(500);
  }
}

/* 
  Takes in two jquery objects. One jquery object containing color option elements to display 
  and another jquery object containing color option elements to hide. Displays the appropriate
  elemts and hides the appropriate elemtns
 */
function showAndHideOptions($optionsToShow, $optionstoHide) {
  $optionstoHide.hide();
  $optionsToShow.show();
  $($optionsToShow["0"]).prop("selected", true);
}
/*
  Initialises the total container firs then returns an event handler function 
  to handle the logic of activity selection. Disable conflicting
  events upon selection and displays the totals as activities are being selected
 */
function handleActivitySelection() {
  const $totalContainer = initialiseTotalCounter();
  return function(event) {
    const $changedActivity = $(event.target);
    const isChecked = $changedActivity.prop("checked");
    const $conflictingActivities = getConflictingEvents($changedActivity);

    if (isChecked) {
      if ($changedActivity.attr("name") !== "all") {
        disableConflictingEvents($changedActivity, $conflictingActivities);
        changeTotal(100, $totalContainer);
      } else {
        changeTotal(200, $totalContainer);
      }
    } else {
      if (!jQuery.isEmptyObject($conflictingActivities)) {
        $conflictingActivities.prop("disabled", false);
        $conflictingActivities.parent().css("color", "#000");
      }
      $changedActivity.attr("name") === "all"
        ? changeTotal(-200, $totalContainer)
        : changeTotal(-100, $totalContainer);
    }
  };
}

/* 
  Takes in a jQuery object which contains an activity check box with changed states. Checks if the activity has 
  other conflicting activities and returns a jQuery Object containing them. If no conflicting activity is found
  then returns an empty object
 */
function getConflictingEvents($changedActivity) {
  let $conflictingActivities = {};
  const $events9To12 = $(
    "input[name = 'js-frameworks'], input[name = 'express']"
  );
  const $events1To4 = $("input[name = 'js-libs'], input[name = 'node']");

  if ($events9To12.is($changedActivity)) {
    $conflictingActivities = $events9To12;
  } else if ($events1To4.is($changedActivity)) {
    $conflictingActivities = $events1To4;
  }

  return $conflictingActivities;
}
/*
  Takes in the selected activity element and a jQuery object containing conflicting activities.
  Disables the activities conflicting the selected activity and enables the selected activity
 */
function disableConflictingEvents(selectedActivity, $conflictingActivities) {
  if (!jQuery.isEmptyObject($conflictingActivities)) {
    $conflictingActivities.map(eventIndex => {
      const $activity = $($conflictingActivities[eventIndex]);
      if (!$activity.is(selectedActivity)) {
        $activity.prop("disabled", true);
        $activity.parent().css({ color: "#A9A9A9" });
      } else {
        $activity.prop("disabled", false);
      }
    });
  }
}

/* 
  Creates the total counter container, appends it to the activities container and
  hides the counter container
 */
function initialiseTotalCounter() {
  $totalContainer = $(`<div class = "Total"> Total: $ <span>0<span>  </div>`);

  $totalContainer.hide();
  $(".activities").append($totalContainer);

  return $totalContainer;
}

/* 
  takes in a number and a jQuery object of the container as parameters.
  Changes the number in the container by the number. Runs animation to display/hide
  the total at the end

 */
function changeTotal(numberToChangeBy, $container) {
  let $totalSpan = $container.find("span");
  let total = parseInt($totalSpan.text());

  total += numberToChangeBy;
    
  if(!(total < 0)){
    $totalSpan.text(total);
    runTotalAnimation(total, $totalSpan, $container);
  }
}

/* 
  Takes in the total, the jQuery object containing the total span and jQuery containing
  the total container as parameters. Hides the total span and container if the total is 0
  and shows the total if total is greater than 0 with fade and slide animations
 */
function runTotalAnimation(total, $textSpan, $container) {
  if (total === 0) {
    $textSpan.fadeOut();
    $container.slideUp(500);
  } else {
    $textSpan.fadeIn(600);
    $container.slideDown(500);
  }
}

/*
  Set's the default payment method to credit card.
  returns a fucntion that handles the payment selection process by displaying the payment option 
  selected and hiding the other options
 */
function handlePaymentSelection() {
  const $paymentOptions = $("#payment");
  const $creditCard = $("#credit-card");
  const $otherPayments = $creditCard.siblings("div");

  setDefaultPaymentMethod($paymentOptions, $creditCard, $otherPayments);

  return function(event) {
    paymentSelection = $(event.target).val();
    displaySelectedPaymentMethod(paymentSelection, $creditCard, $otherPayments);
  };
}

/* 
  takes in the jquery objects containing the payment selection options, the credit card container and 
  the other payment option containers. It sets the default payment option to credit card, displays
  it, and hide the rest of the payment containers
 */
function setDefaultPaymentMethod($options, $creditCard, $otherPayments) {
  $options.find("option[value = 'credit card']").prop("selected", true);
  $options.find("option[value = 'select_method']").hide();
  $creditCard.show();
  $otherPayments.hide();
}

/* 
  Displays the payment option selected and hides the rest with slide animation
 */
function displaySelectedPaymentMethod(
  selectedOption,
  $creditCard,
  $otherPayments
) {
  if (selectedOption === "credit card") {
    $creditCard.slideDown();
    $otherPayments.slideUp();
  } else {
    $creditCard.slideUp();

    hideValidationMessages(
      $("#cc-num, #zip, #cvv"),
      $("#cc-num-validation, #zip-validation, #cvv-validation, #cc-num-validation-pass, #zip-validation-pass, #cvv-validation-pass")
    );

    $otherPayments.map(index => {
      const chosenPayment = new RegExp(`${selectedOption}`, "i").test(
        $($otherPayments[index])
          .find("p")
          .text()
      );
      chosenPayment
        ? $($otherPayments[index]).slideDown()
        : $($otherPayments[index]).slideUp();
    });
  }
}

/* 
  Initialises all the validation containers for name, email, activity, and credit card with 
  validation messages and hides them after
 */
function initialiseValidationContainers() {
  createValidationContainerAndHide(
    "#name",
    "name-validation",
    "Name must be filled",
    "Name is filled"
  );
  createValidationContainerAndHide(
    "#mail",
    "mail-validation",
    "Email must be valid",
    "Email entered is valid"
  );

  initialiseAdditionalErrorMessage(`#mail-validation`, 'mail-validation-empty');


  createValidationContainerAndHide(
    ".activities",
    "activity-validation",
    "At least one activity must be selected",
    "Number of activities selected is valid"
  );
  createCreditValidationContainerAndHide();
}

function initialiseAdditionalErrorMessage(messageSiblingSelector, idOfNewError){
  $(`${messageSiblingSelector}`).after(
    `
    <li id = "${idOfNewError}" class = "validation">Email field cannot be blank</li>`
  );

  $(`#${idOfNewError}`).hide();
  $(`#${idOfNewError}`).css('color',"#F61C1C");
}

/* 
  Takes in the selector to select the element/container to create the validation for,
  take's in the id for the validation container to be created and also the message to display. 
  Creates the container and hides it
 */
function createValidationContainerAndHide(
  targetSelector,
  validationId,
  FailMessage,
  PassMessage
) {
  $(targetSelector).after(
    `<ol>
    <li id = "${validationId}" class = "validation">${FailMessage}</li>
    <li id = "${validationId+'-pass'}" class = "validation">${PassMessage}</li>
    </ol>`
  );
  $(`#${validationId}`).hide();
  $(`#${validationId}-pass`).hide();
  $(`#${validationId}`).css('color',"#F61C1C");
  $(`#${validationId}-pass`).css('color', "#7FFF00"); 
}

/* 
  Initialises the name, email, activity and credit card validation processes 
 */
function initialiseValidations() {
  initialiseValidationContainers();
  initialiseNameValidation();
  initialiseEmailValidation();
  initialiseCardValidation();
  initialiseActivityValidation();
  $("form").submit(validateAll);
}

/* 
  Initialises the name validation process 
 */
function initialiseNameValidation() {
  $("#name").on("click input", event =>
    validateNameAndDisplay($(event.target))
  );
}

/* 
  Initialises the email validation process 
 */
function initialiseEmailValidation() {
  $("#mail").on("input focus", event =>
    validateEmailAndDisplay($(event.target))
  );
}

/* 
  Initialises the card validation process 
 */
function initialiseCardValidation() {
  $("#cc-num, #zip, #cvv").on("input focus", event => {
    validateCardNumberAndDisplay($("#cc-num"));
    validateCvvNumberAndDisplay($("#cvv"));
    validateZipNumberAndDisplay($("#zip"));
  });

}

/* 
  Initialises the activity selection validation process 
 */
function initialiseActivityValidation() {
  $(".activities").on("input", "input", event => {
    validateActivitySelectionAndDisplay($(".activities"));
  });
}

/* 
  Creates validation container for the credit card along with the messages and hides it
 */
function createCreditValidationContainerAndHide() {
  $("#credit-card").after(
    `<ol id = "card-validation">
            <li id = "cc-num-validation" class = "validation">Credit Card field number between 13 and 16 digits</li>
            <li id = "zip-validation" class = "validation">Zip Code should be  5 digits</li>
            <li id = "cvv-validation" class = "validation">CVV should be 3 digits</li>
            <li id = "cc-num-validation-pass" class = "validation">Card number is valid</li>
            <li id = "zip-validation-pass" class = "validation">Zip code is valid</li>
            <li id = "cvv-validation-pass" class = "validation">Cvv is valid</li>
         </ol>`
  );
  $(`#card-validation li`).hide();
  $(`#cc-num-validation, #zip-validation, #cvv-validation `).css('color',"#F61C1C");
  $(`#cc-num-validation-pass, #cvv-validation-pass, #zip-validation-pass`).css('color', "#7FFF00"); 
  
}

/* 
  Takes in a jQuery object container the name input. Checks if the value is not empty, displays the validation messages
  and returns true if it is valid
 */
function validateNameAndDisplay($nameConatiner) {
  const validName = validateName($nameConatiner.val());
  displayValidationResultStyle(
    $nameConatiner,
    $("#name-validation"),
    $("#name-validation-pass"),
    validName
  );

  return validName;
}

/* 
  Takes in a string name input. Checks if the value is not empty and returns true if it is valid and false if not
 */
function validateName(name) {
  const validName = name.trim() !== "";
  return validName;
}

/* 
  Takes in a jQuery object container the email input. Checks if the email is valid, displays the validation messages
  and returns true if it is valid and false if not
*/
function validateEmailAndDisplay($emailConatiner) {
  const validEmail = validateEmail($emailConatiner.val());

  if($emailConatiner.val().trim() === ''){
    displayValidationResultStyle(
      $emailConatiner,
      $("#mail-validation-empty"),
      $("#mail-validation-pass, #mail-validation"),
      validEmail
    );
  }else{
    $("#mail-validation-empty").hide();
    displayValidationResultStyle(
      $emailConatiner,
      $("#mail-validation"),
      $("#mail-validation-pass"),
      validEmail
    );
  }
  
  return validEmail;
}

/* 
  Takes in an email input string. Checks if the email is valid and returns true if it is valid and false if not
*/
function validateEmail(email) {
  // regex from https://www.w3resource.com/javascript/form/email-validation.php for validating emails
  const validatorRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const validEmail = validatorRegex.test(email);

  return validEmail;
}

/* 
  Takes in the Jquery object validation target & the validation mesage containers, and a boolean
  indicating if validsation passed. Displays the validation messages. If the container does not have the activity class then changes the border color to green if passed
  and red if not passed

  Style visuals inspiration https://ireade.github.io/form-validation-realtime/
 */
function displayValidationResultStyle(
  $validationTarget,
  $validationFailMessageContainer,
  $validationPassMessageContainer,
  validationPassed
) {

  if (validationPassed) {
    $validationPassMessageContainer.show();
    $validationFailMessageContainer.hide();
    if ($validationTarget.className !== "activities") {
      $validationTarget.css("border-color", "#2ecc71");
    }
  } else {
    $validationFailMessageContainer.show();
    $validationPassMessageContainer.hide();
    if ($validationTarget.className !== "activities") {
      $validationTarget.css("border-color", "#FD5858");
    }
  }
}

/* 
  takes in jQuery object of the validation target, the validation message containers, and a boolean indicating
  if the validation has passed. If validation has passed Hides the message containers and changes the input 
  borders to original color if it does not have the activity class
 */
function hideValidationMessages(
  $validationTarget,
  $validationMessageContainer
) {
  $validationMessageContainer.hide();
  if ($validationTarget.className !== "activities") {
    $validationTarget.css("border-color", "#5e97b0");
  }
}

/* 
  Takes in jQuery object of the card number container. Checks if the credit number is valid, displays the validation messages
  and returns true if it is valid and false if not
 */
function validateCardNumberAndDisplay($numberContainer) {
  const validNumber = validateCardNumber($numberContainer.val());

  displayValidationResultStyle(
    $numberContainer,
    $("#cc-num-validation"),
    $("#cc-num-validation-pass"),
    validNumber
  );

  return validNumber;
}

/* 
  Takes card number string. Checks if the credit number is valid and returns true if it is valid and false if not
 */
function validateCardNumber(number) {
  const validatorRegex = /^\d{13,16}$/; // regex to check if the number is between 13 and 16 number
  const validNumber = validatorRegex.test(number);

  return validNumber;
}

/* 
  Takes in jQuery object of the zip number container. Checks if the zip number is valid, displays the validation messages
  and returns true if it is valid and false if not
 */
function validateZipNumberAndDisplay($numberContainer) {
  const validNumber = validateZipNumber($numberContainer.val());

  displayValidationResultStyle(
    $numberContainer,
    $("#zip-validation"),
    $("#zip-validation-pass"),
    validNumber
  );

  return validNumber;
}

/* 
  Takes in jQuery object of the zip number container. Checks if the zip number is valid, displays the validation messages
  and returns true if it is valid and false if not
 */
function validateZipNumber(number) {
  const validatorRegex = /^\d{5}$/; // regex to check if number contains exactly 5 digits
  const validNumber = validatorRegex.test(number);

  return validNumber;
}

/* 
  Takes in jQuery object of the cvv number container. Checks if the cvv number is valid, displays the validation messages
  and returns true if it is valid and false if not
 */
function validateCvvNumberAndDisplay($numberContainer) {
  const validNumber = validateCvvNumber($numberContainer.val());

  displayValidationResultStyle(
    $numberContainer,
    $("#cvv-validation"),
    $("#cvv-validation-pass"),
    validNumber
  );

  return validNumber;
}

/* 
  Takes in a cvv number. Checks if cvv number is valid returns true if it is valid and false
  if not
 */

function validateCvvNumber(number) {
  const validatorRegex = /^\d{3}$/; // regex to check is number contains exactly 3 digits
  const validNumber = validatorRegex.test(number);

  return validNumber;
}

/* 
  Takes in jQuery object of the activity container. Checks if the  number of activity selected is atleast one for validation, displays the validation messages
  and returns true if it is valid and false if not
 */
function validateActivitySelectionAndDisplay($activitiesContainer) {
  const activitySelectionValid = validateActivitySelection(
    $activitiesContainer
  ); // checks if atleast one activity is selected

  displayValidationResultStyle(
    $activitiesContainer,
    $("#activity-validation"),
    $("#activity-validation-pass"),
    activitySelectionValid
  );

  return activitySelectionValid;
}

/* 
  Takes in jQuery object of the activity container. Checks if the  number of activity selected is atleast one for validation
  and returns true if it is valid and false if not
 */
function validateActivitySelection($activitiesContainer) {
  const activitySelectionValid =
    $activitiesContainer.find("input:checked").length > 0; // checks if atleast one activity is selected

  return activitySelectionValid;
}

/* 
  validates name, email, activity selection and credit card (if it is selected) at once and displays 
  the appropriate validation messages 
*/

function validateAll(event) {
  const validActivity = validateActivitySelectionAndDisplay($(".activities"));
  const validName = validateNameAndDisplay($("#name"));
  const validEmail = validateEmailAndDisplay($("#mail"));
  let validCard = true;

  if ($("#payment").val() === "credit card") {
    const validCardNumber = validateCardNumberAndDisplay($("#cc-num"));
    const validCardZip = validateZipNumberAndDisplay($("#zip"));
    const validCardCvv = validateCvvNumberAndDisplay($("#cvv"));
    validCard = validCardNumber && validCardCvv && validateZipNumberAndDisplay;
  }

  if (!(validActivity && validName && validEmail && validCard)) {
    event.preventDefault();
  }
}

/* 
  Displays the other text box if the other job option is selected and hides it if it is
  not selected
 */
function handleJobSelection(event) {
  $titleContainer = $(event.target);
  selectedTitle = $titleContainer.val();
  if (selectedTitle === "other") {
    $('#other-title, label[for = "other-title"').slideDown();
  } else {
    $('#other-title, label[for = "other-title"').slideUp();
  }
}
