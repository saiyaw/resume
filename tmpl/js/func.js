$(document).ready(function() {

	$('#btnsubmit').click(function() {
		$.ajax({
			type : "POST",
			url : "/submit",
			data : {
				"name" : $('#name').val(),
				"age" : $('#age').val(),
				"education" :$('#education').val(),
				"mobile":$('#mobile').val(),
				"experience":$('#experience').val()
			},
			success : function(result) {
				alert(result);

			}
		});
	});


});