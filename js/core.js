//APPLE PRINT 2016

function Core(){
  console.log('Core Loaded');
  var self = this;

  self.loadPanelContent();//Load panels with content
  self.loginOrRegister(); //Load form options
  self.buildFunctionsDelete(); //Load temp files +++ DELETE THIS +++

}

Core.prototype.loadPanelContent = function(){
  console.log('Loading Panel Content')

  $('.registerLoginPanel').load("registerlogin.html")
  $('.storyboardPanel').load("storyboard.html")
}

Core.prototype.loginOrRegister = function(){
  console.log('Loading Panel Content')

  //If remmber me button clicked
  $(document).on("click",".rememberMeButton",function(e){
    if ($(this).data('status') == 'forget'){
      console.log('toggling to remember')
      $(this).find('i').removeClass('fa-square-o').addClass('fa-square')
      $(this).data('status', 'remember')
    }else{
      $(this).data('status', 'forget')
      $(this).find('i').removeClass('fa-square').addClass('fa-square-o')
      console.log('toggle to forget')
    }
  })

  //Login Opened
  $(document).on("click",".loginButton",function(e){
    $('.registerLoginContainer').addClass('registerLoginReduce')
    $('.slideLogin').show()
    $('.slideRegister').hide()
  })

  //Login closed
  $(document).on("click",".hideSlideLogin",function(e){
    $('.registerLoginContainer').removeClass('registerLoginReduce')
    $('.slideLogin').hide()
  })

  $(document).on("click",".submitLogin",function(e){
    e.preventDefault()
    console.log('yup')

    var postData = $('form#loginForm').serialize();
  	console.log(postData)

  	$.ajax({
  		type: 'POST',
  		data: postData,
  		url: 'http://applegochi.apple-dev.co.uk/Ajax/ghTest.ashx?e='+postData,
  		success: function(data){
  			console.log(data);
  			alert(data);
  		},
  		error: function(){
  			console.log(data);
  			alert('There was an error adding your comment');
  		}
  	});

  });

  //Login Opened
  $(document).on("click",".registerButton",function(e){
    $('.registerLoginContainer').addClass('registerLoginReduceMax')
    $('.slideRegister').show()
    $('.slideLogin').hide()
  })

  //Login closed
  $(document).on("click",".hideSlideRegister",function(e){
    $('.registerLoginContainer').removeClass('registerLoginReduceMax')
    $('.slideRegister').hide()
  })


}//END

Core.prototype.buildFunctionsDelete = function(){
  // +++ DELETE THIS FOR PRODUCTION +++
  console.log('Loading Pointless functions')

  $(document).on("click",".skipLoading",function(e){
    $('.registerLoginPanel').show()
  })

  $(document).on("click",".bypasslogin",function(e){
    $('.storyboardPanel').show()
  })
}


var Core = new Core();
