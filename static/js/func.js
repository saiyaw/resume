$(document).ready(function(){
	$('#btnuploadresume').click(function() {
		/*
		var file = $('#uploadresume').prop("files")[0];
		var form_data = new FormData();
		form_data.append('uploadresume', file);

		$.ajax({
			type : 'POST',
			url : '/uploadresume',
			data : form_data,
			contentType : false,
			processData : false,
	//		enctype:'multipart/form-data',
			success : function(result) {
				alert(result);
			}
		});

		*/
 

		var form_data = new FormData($('form')[0]);
		$.ajax({
			url : '/uploadresume',
			type : 'POST',
			xhr:function(){
				var myxhr = $.ajaxSettings.xhr();
				if(myxhr.upload){
					myxhr.upload.addEventListener('progress', progressHandlingFunction, false);
				}
				return myxhr;
			},
	//		beforeSend:beforeSendHandler,
			success: function(result){
				alert(result);
			},
			error: function(err){
				alert(err);
			},
			data: form_data,
			cache: false,
			contentType: false,
			processData: false

		});

	});

	function progressHandlingFunction(e){
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded,max:e.total});
    }
}


	$('#uploadresume').change(function() {
		var file = this.files[0];
		var name = file.name;
		var size = file.size;
		var type = file.type;
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
				"comment" : $('#comment').val(),
				"resumefile" :$('#uploadresume').prop("files")[0].name
			},
			success : function(result) {
				alert(result);
			}
		});
	});





});