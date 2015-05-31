$(document).ready(function() {

	$('#btsubmit').click(function() {
		$.ajax({
			type : "POST",
			url : "/submit",
			data : {
				"name" : $('#name').val(),
				"age" : $('#age').val()
			},
			success : function(result) {
				alert(result);

			}
		});
	});


});