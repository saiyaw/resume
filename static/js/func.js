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




});