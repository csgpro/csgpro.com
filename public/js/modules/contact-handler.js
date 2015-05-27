(function(){
  'use strict';

  // binding onchange on inputs for all forms routing to contact
  $('form').each(function(){
    if($(this).attr("action") === "/contact"){
      var form = $(this);

      $(this).find(":input").each(function(){
        $(this).on("change", function(){
          valid(form);
          $(this).addClass('dirty');
        });
      });
    }
  });

  $('.ajaxSubmit').on('click', function(event){
    event.preventDefault();

    $(this.form).addClass("dirty");

    var that = this;

    var name = "",
        phoneNumber = "",
        emailAddress = "",
        comments = "";

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

            if(window.location.pathname.split("/")[1] === "landing"){
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
    var validity = true;

    $(form).find(':input').each(function(index){
      if($(this).attr("required") === "required"){
        // Check email fields
        if($(this).attr("type") === 'email'){
          if(!IsEmail(this.value)){
            if($(this).hasClass("dirty") || $(form).hasClass("dirty")){
              $(this).addClass("invalid");
            }
            validity = false;
          }
          else{
            $(this).removeClass("invalid");
          }
        }

        // catch all (mainly text)
        // just verifies that there is a value
        else{
          if(!this.value){
            if($(this).hasClass("dirty") || $(form).hasClass("dirty")){
              $(this).addClass("invalid");
            }
            validity = false;
          }
          else{
            $(this).removeClass("invalid");
          }
        }
      }
    });

    return validity;
  }

  function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
})();
