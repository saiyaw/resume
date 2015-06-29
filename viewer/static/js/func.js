function InitSkillPool(){
	$.ajax({
			type : 'POST',
			url : '/getskillpool',
			async :false,
			success : function(result) {
				
				arr = eval(result);
//				alert(arr);
				for (var i = 0; i< arr.length; i++){
					str = "<span class='button-checkbox'>	<button type='button' class='btn' data-color='primary' id=skill_" + arr[i].Id + ">"+ arr[i].Skill + "</button>	<input type='checkbox' class='hidden'/>	</span>";

					$("#skillpool").append(str);
				}
			}
		});
}

$(document).ready(function(){
	InitSkillPool();

	$('#btnuploadresume').click(function() {
		
		var file = $('#uploadresume').prop("files")[0];
		var form_data = new FormData();
		form_data.append('uploadresume', file);

		$.ajax({
			type : 'POST',
			url : '/uploadresume',
			data : form_data,
			contentType : false,
			processData : false,
			enctype:'multipart/form-data',
			success : function(result) {
				alert(result);
			}
		});




		
 /*

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

*/

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

    $('.button-checkbox').each(function () {

        // Settings
        var $widget = $(this),
            $button = $widget.find('button'),
            $checkbox = $widget.find('input:checkbox'),
            color = $button.data('color'),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        // Event Handlers
        $button.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();

            if ($checkbox.is(':checked')) {
     //       	alert($button.text());
            }

            
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $button.data('state', (isChecked) ? "on" : "off");
/*
            // Set the button's icon
            $button.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$button.data('state')].icon);
*/
            // Update the button's color
            if (isChecked) {
                $button
                    .removeClass('btn-default')
                    .addClass('btn-' + color + ' active');
            }
            else {
                $button
                    .removeClass('btn-' + color + ' active')
                    .addClass('btn-default');
            }
        }

        // Initialization
        function init() {

            updateDisplay();
/*
            // Inject the icon if applicable
            if ($button.find('.state-icon').length == 0) {
                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
            }
*/
        }
        init();
    });




});