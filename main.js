$(document).ready(function () {
  $("input[name='number']").focus();
  $("input[name='number']").keypress(function() {
    if ($(this).val().length > 3) {
      return false;
    }
  });

});
