(function(){
  'use strict';

  $('.ajaxSubmit').on('click', function(event){
    event.preventDefault();

    var that = this;

    var name,
        phoneNumber,
        emailAddress,
        comments;

    if(this.form.name.value){
      name = this.form.name.value;
    }else if(this.form.firstName || this.form.lastName){
      name = this.form.firstName.value + " " +this.form.lastName.value;
    }
    if(this.form.phoneNumber.value){
      phoneNumber = this.form.phoneNumber.value;
    }
    if(this.form.emailAddress.value){
      emailAddress = IsEmail(this.form.emailAddress.value) ? this.form.emailAddress.value : '';
    }
    if(this.form.comments.value){
      comments = this.form.comments.value;
    }
    var cryptoTime = this.form.cryptoTime.value;
    var hpizzle = this.form.hpizzle.value;
    var type;

    var dataString = 'name='+ name
                   + '&phoneNumber=' + phoneNumber
                   + '&emailAddress=' + emailAddress
                   + '&cryptoTime=' + cryptoTime
                   + '&hpizzle=' + hpizzle
                   + '&comments=' + comments;

    if (this.form.hasOwnProperty('type')) {
      type = this.form.type.value;

      if (type)
        dataString += '&type=' + type;
    }
    if(valid(this.form)){
      $.ajax({
        type: "POST",
        url: "/contact",
        data: dataString,
        success: function(result) {
          // $('#simplemodal-container .form-header').text('Message received. Thanks!');
          var header = $(that.form.querySelector('.status-header'));
          var toClear = $(that.form.querySelectorAll('.clearable'));


          if (result === 'success') {
            header.text('Message received!');
            header.css('color', '#468847'); // green
            header.fadeTo(90, 0.3);
            header.fadeTo(90, 1);
            header.fadeTo(90, 0.3);
            header.fadeTo(90, 1);

            toClear.val('');

            setTimeout(function(){ $.modal.close(); },2000);

            if(window.location.pathname === "/landing/modern-web-apps/"){
              window.location.href = "./thankyou.html";
            }

          } else {
            header.text('Something went wrong, try again.');
            header.css('color', '#b94a48'); // red
            header.fadeTo(90, 0.3);
            header.fadeTo(90, 1);
            header.fadeTo(90, 0.3);
            header.fadeTo(90, 1);
          }
        },
      });
    }
    else{
      var header = $(that.form.querySelector('.status-header'));
      header.text('The form is incomplete');
      header.css('color', '#b94a48'); // red
      header.fadeTo(90, 0.3);
      header.fadeTo(90, 1);
      header.fadeTo(90, 0.3);
      header.fadeTo(90, 1);
    }

    return false;

  });

  function valid(form){


    var hasName = false
    var hasLastOrFirstName = false;
    var hasEmail = false;
    var hasComments = false;

    // Checking for names, firstNames, and lastNames
    if(form.name){
      if(form.name.value){
        hasName = true;
        $(form.name).removeClass("invalid");
      }
      else{
        hasName = false;
        $(form.name).addClass("invalid");
      }
    }
    if(form.firstName){
      if(form.firstName.value){
        hasLastOrFirstName = true;
        $(form.firstName).removeClass("invalid");
      }
      else{
        $(form.firstName).addClass("invalid");
      }
    }
    if(form.lastName){
      if(form.lastName.value){
        hasLastOrFirstName = true;
        $(form.lastName).removeClass("invalid");
      }
      else{
        $(form.lastName).addClass("invalid");
      }
    }


    // Checking for emails
    if(form.emailAddress){
      if(IsEmail(form.emailAddress.value)){
        hasEmail = true;
        $(form.emailAddress).removeClass("invalid");
      }
      else{
        hasEmail = false;
        $(form.emailAddress).addClass("invalid");
      }
    }

    // Checking for comments
    if(form.comments){
      if(form.comments.value){
        hasComments = true;
        $(form.comments).removeClass("invalid");
      }
      else{
        hasComments = false;
        $(form.comments).addClass("invalid");
      }
    }

    if((hasName || hasLastOrFirstName) && hasEmail && hasComments){
      return true;
    }
    else{
      return false;
    }


  }

  function IsEmail(email) {
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
  }
})();
