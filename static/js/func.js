$(document).ready(function(){
	$('#btnuploadresume').click(function() {
		var file = $('#uploadresume').prop("files")[0];
		var form_data = new FormData();
		form_data.append("uploadresume", file);

		$.ajax({
			type : "POST",
			url : "/uploadresume",
			data : form_data,
			contentType : false,
			processData : false,
			success : function(result) {
				alert(result);
			}
		});

	});

	$('#btnsubmit').click(function() {
		$.ajax({
			type : "POST",
			url : "/submit",
			data : {
				"name" : $('#name').val(),
				"age" : $('#age').val(),
				"email" : $('#email').val(),
				"education" : $('#education').val(),
				"experience" : $('#experience').val(),
				"phone" : $('#phone').val(),
				"mobile" : $('#mobile').val(),
				"comment" : $('#comment').val()
			},
			success : function(result) {
				alert(result);
			}
		});
	});





});