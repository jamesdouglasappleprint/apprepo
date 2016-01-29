//APPLE PRINT 2016

function Core(){
  console.log('Core Loaded');
  var self = this;

  self.currentMood = '';
  self.currentStage = '';


  self.loadPanelContent();//Load panels with content
  self.loginOrRegister(); //Load form options
  self.buildFunctionsDelete(); //Load temp files +++ DELETE THIS +++
  self.creationStory();
  self.init();//Load panels with content

}

Core.prototype.init = function (x) {
  var self = this

  //Click to feed!
  $(document).on("click",".buttonFeed",function(e){
    e.preventDefault()
    self.actionFeed(self.currentStage)
  })
};

Core.prototype.loadPanelContent = function(){
  console.log('Loading Panel Content')

  $('.registerLoginPanel').load("registerlogin.html")
  $('.storyboardPanel').load("storyboard.html")
  $('.mainPanel').load("main.html")
}

//Login and Register Functions
Core.prototype.loginOrRegister = function(){
  console.log('Loading Panel Content')

  //If remmber me button clicked
  $(document).on("click",".rememberMeButton",function(e){
    if ($(this).data('status') == 'forget'){
      console.log('toggling to remember')
      $(this).addClass('statusRemember')
      $(this).data('status', 'remember')
      localStorage.setItem("remainLoggedIn", "true");
    }else{
      $(this).data('status', 'forget')
      $(this).removeClass('statusRemember')
      console.log('toggle to forget')
      localStorage.removeItem("remainLoggedIn", "true");
    }
  })

  //Login Opened
  $(document).on("click",".loginButton",function(e){
    $('.registerLoginContainer').addClass('registerLoginReduce')
    $('.slideLogin').show()
    $('.slideRegister').hide()
    $('.registerLoginPanel').addClass('displaceBackgroundLogin')
  })

  //Login closed
  $(document).on("click",".hideSlideLogin",function(e){
    $('.registerLoginContainer').removeClass('registerLoginReduce')
    $('.slideLogin').hide()
    $('.registerLoginPanel').removeClass('displaceBackgroundLogin')
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
    $('.registerLoginPanel').addClass('displaceBackgroundRegister')
  })

  //Login closed
  $(document).on("click",".hideSlideRegister",function(e){
    $('.registerLoginContainer').removeClass('registerLoginReduceMax')
    $('.slideRegister').hide()
    $('.registerLoginPanel').removeClass('displaceBackgroundRegister')
  })


}//END

//Assigns global mood to whatever you feed it
Core.prototype.assignMood = function(mood){
  var self = this;
  var thisMood = mood;
  self.currentMood = thisMood;
}

//All code for creation story, including assigning which pet you've picked
Core.prototype.creationStory = function(){
  //this code is probably temporary...
  var self = this

  function createRingo(){
    var userPetName = $('#petname').val();
    var userPetType = "Ringo";
    localStorage.setItem("petName", userPetName);
    localStorage.setItem("petType", userPetType);
    $('.mainPanel').show().addClass('ringoBackground')
    $('.petMain').attr('src', 'img/ringo-'+self.currentMood+'-stage1.png')
  }

  function createInsatsu(){
    var userPetName = $('#petname').val();
    var userPetType = "Insatsu";
    localStorage.setItem("petName", userPetName);
    localStorage.setItem("petType", userPetType);
    $('.mainPanel').show().addClass('insatsuBackground')
    $('.petMain').attr('src', 'img/insatsu-'+self.currentMood+'-stage1.png')
  }

  //Create Ringo
  $(document).on("click",".createRingo",function(e){
    createRingo()
  })

  //Create Insatsu
  $(document).on("click",".createInsatsu",function(e){
    createInsatsu()
  })




}

//Pet Action: Feeding
Core.prototype.actionFeed = function(stage){
  var self =  this
  var petStage = stage

  //If egg stage
  if (petStage == 1){
    $('.petFood').show()
    $('.petFood').addClass('stage1_foodDrop')
    setTimeout(function(){
      $('.petFood').hide()
      $('.petFood').removeClass('stage1_foodDrop')
    },2000)
  }


}

Core.prototype.buildFunctionsDelete = function(){
  var self = this
  // +++ DELETE THIS FOR PRODUCTION +++
  console.log('Loading Pointless functions')
  self.assignMood('happy');//Assign default mood - this will probbably change once we ajax..
  self.currentStage = 1

  $(document).on("click",".skipLoading",function(e){
    $('.registerLoginPanel').show()
  })

  $(document).on("click",".bypasslogin",function(e){
    $('.storyboardPanel').show()
  })

}


var Core = new Core();
