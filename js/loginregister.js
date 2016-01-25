


$('#loginForm').submit(function(){
	var postData = $(this).serialize();
	console.log(postData)

	// $.ajax({
	// 	type: 'POST',
	// 	data: postData+'&amp;lid='+landmarkID,
	// 	url: 'http://your-domain.com/comments/save.php',
	// 	success: function(data){
	// 		console.log(data);
	// 		alert('Your comment was successfully added');
	// 	},
	// 	error: function(){
	// 		console.log(data);
	// 		alert('There was an error adding your comment');
	// 	}
	// });

	return false;
});
