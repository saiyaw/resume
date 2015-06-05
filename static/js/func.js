$(document).ready(function(){
	$('#btnget').click(function() {
			$.ajax({
				type : "GET",
				url : "/demo",
				data : {
					"name" : $('#name').val(),
					"age" : $('#age').val(),
					"email" : $('#email').val()

				},
				success : function(result) {
					alert(result);

				}
			});
		});


$('#btnpost').click(function() {
			$.ajax({
				type : "POST",
				url : "/demo",
				data : {
					"name" : $('#name').val(),
					"age" : $('#age').val(),
					"email" : $('#email').val()
				},
				success : function(result) {
					alert(result);
				}
			});
		});

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



});