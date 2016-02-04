/* APPLE PRINT & CREATIVE //////////////////////////////////////////////////////////////////////////////////////////////////
// APPLEGOTCHI /////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SITE: APPLEGOTCHI ///////////////////////////////////////////////////////////////////////////////////////////////////////
// DEV: JAMES DOUGLAS //////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILD: 2016 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////.d888888////////////////////dP//////////////888888ba///////////oo////////////dP//////dP////////d888888P/888888ba///////
////d8'////88////////////////////88//////////////88////`8b////////////////////////88//////88///////////88////88////`8b//////
////88aaaaa88a/88d888b./88d888b./88/.d8888b.////a88aaaa8P'/88d888b./dP/88d888b./d8888P////88///////////88////88/////88//////
////88/////88//88'//`88/88'//`88/88/88ooood8/////88////////88'//`88/88/88'//`88///88//////88///////////88////88/////88//////
////88/////88//88.//.88/88.//.88/88/88.//.../////88////////88///////88/88////88///88//////88///////////88////88////.8P//////
////88/////88//88Y888P'/88Y888P'/dP/`88888P'/////dP////////dP///////dP/dP////dP///dP//////88888888P////dP////8888888P///////
///////////////88///////88//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////dP///////dP//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/


function Core(){
  console.log('Core Loaded');
  var self = this;
  //initPushwoosh();

  self.currentMood = 'happy';
  self.petNamedType = ""; //current pet type as a name
  self.petLevel = 0; //current pet type as a name
  self.userID = 0; //Pet Name


  self.loadPanelContent();//Load panels with content
  self.loginOrRegister(); //Load form options
  self.buildFunctionsDelete(); //Load temp files +++ DELETE THIS +++
  self.init();//Initial load checks
  self.logOut()
}

//Initialiser
Core.prototype.init = function (x) {
  var self = this

  if (localStorage.getItem("remainLoggedIn") == 'true' && localStorage.getItem("userID") !== null){
    //get up to date pet data
    self.loadPet(localStorage.getItem("userID"))
  }else{

  }

};

//Load HTML into panels
Core.prototype.loadPanelContent = function(){
  var self = this
  console.log('Loading Panel Content')

  $('.registerLoginPanel').load("registerlogin.html")
  $('.storyboardPanel').load("storyboard.html")
  $('.mainPanel').load("main.html")
  $('.menuPanel').load("menu.html")
  $('.contactDetailsPanel').load("contactdetails.html")

  //Click to feed!
  $(document).on("click",".buttonFeed",function(e){
    e.preventDefault()
    self.actionFeed(localStorage.getItem('petLevel'))
  })

  //Click to feed!
  $(document).on("click",".buttonClean",function(e){
    e.preventDefault()
    self.actionClean(localStorage.getItem('petLevel'))
  })

  //Click to Entertain!
  $(document).on("click",".buttonEntertain",function(e){
    e.preventDefault()
    self.actionEntertain(localStorage.getItem('petLevel'))
  })

  //Click to open contact details menu
  $(document).on("click",".updateContactDeets",function(e){
    e.preventDefault()
    $('.contactDetailsPanel').show()
  })

  //Click to close contact details menu
  $(document).on("click",".closeContactDetails",function(e){
    e.preventDefault()
    $('.contactDetailsPanel').hide()
  })



  //Click to Entertain!
  $(document).on("click",".menuTrigger",function(e){
    e.preventDefault()

    $('.accountDeetsFirstName>span').html(localStorage.getItem('firstName'))
    $('.accountDeetsLastName>span').html(localStorage.getItem('lastName'))
    $('.accountDeetsAddressLine1>span').html(localStorage.getItem('AddressLine1'))
    $('.accountDeetsAddressLine2>span').html(localStorage.getItem('AddressLine2'))
    $('.accountDeetsAddressLine3>span').html(localStorage.getItem('AddressLine3'))
    $('.accountDeetsTown>span').html(localStorage.getItem('town'))
    $('.accountDeetsPostcode>span').html(localStorage.getItem('postcode'))
    $('.accountDeetsEmailAddress>span').html(localStorage.getItem('emailaddress'))

    $('.menuPanel').show()
  })

  //Click to close contact details menu
  $(document).on("click",".closeMenu",function(e){
    e.preventDefault()
    $('.menuPanel').hide()
  })
}

//Log out and clear all local data
Core.prototype.logOut = function(){
  //Click to Entertain!
  $(document).on("click",".logOut",function(e){
    e.preventDefault()
    localStorage.clear();
    $('.menuPanel').hide()
    $('.mainPanel').hide()
    $('.storyboardPanel').hide()
    $('.registerLoginPanel').removeClass('displaceBackgroundLogin')
    $('.registerLoginContainer').removeClass('registerLoginReduce')
    $('.slideLogin').hide()
  })
}

//Login and Register Functions
Core.prototype.loginOrRegister = function(){
  var self = this
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

  //REGISTER USER
  $(document).on("click",".submitRegister",function(e){
  	e.preventDefault()
    localStorage.clear();
  	console.log('Submit Register has been clicked')
  	var postData = $('form#registerForm').serialize();
    var fakeDetailsRemoved = postData.replace('&fakeusernameremembered=&fakepasswordremembered=','');

  	$.ajax({
  		type: 'POST',
  		data: fakeDetailsRemoved,
      dataType:'jsonp',
      jsonp: 'callback',
  		url: 'http://applegotchi.co.uk/Ajax/ghRegister.ashx',
  		success: function(data){
        localStorage.setItem("userID", data.userID);
        console.log('Register Success! We need to fire a notification here')

        $('.registerLoginContainer').removeClass('registerLoginReduceMax')
        $('.slideRegister').hide()
        $('.registerLoginPanel').removeClass('displaceBackgroundRegister')
  		},
  		error: function(){
        console.log('Error registering user.')
  		}
    });

  });

  //USER LOGIN
  $(document).on("click",".submitLogin",function(e){
  	e.preventDefault()
  	console.log('Submit Login has been clicked')
  	var postData = $('form#loginForm').serialize();
    var fakeDetailsRemoved = decodeURIComponent(postData.replace('fakeusernameremembered=&fakepasswordremembered=&',''));
  	$.ajax({
  		type: 'POST',
  		data: fakeDetailsRemoved,
      dataType:'jsonp',
      jsonp: 'callback',
  		url: 'http://applegotchi.co.uk/Ajax/ghLogon.ashx',
  		success: function(data){
  			console.log(data);
        self.userID = data.uid

        localStorage.setItem('firstName', data.firstname)
        localStorage.setItem('lastName', data.lastname)
        localStorage.setItem('postcode', data.postcode)
        localStorage.setItem('AddressLine1', data.add1)
        localStorage.setItem('AddressLine2', data.add2)
        localStorage.setItem('AddressLine3', data.add3)
        localStorage.setItem('emailaddress', data.emailaddress)
        localStorage.setItem('town', data.town)
        localStorage.setItem('password', data.password)

        //TODO: if we get a retrn of 'user not found' do something here

        if (localStorage.getItem("hasPet") != 'true'){
          console.log('No local storage hasPet, either user hasn\t got a pet or they\'e got one but had deleted the app')

          //Check to see if user already has login, but has cleared localstorage
          $.ajax({
            type: 'POST',
            data: 'uid='+data.uid,
            dataType:'jsonp',
            jsonp: 'callback',
            url: 'http://applegotchi.co.uk/Ajax/ghPets.ashx',
            success: function(data){
              console.log(data);

              //If pet data exists
              if (data.length == 1){
                console.log('No localstorage was present, but the user has a pet. Loading Pet...')
                self.loadPet(self.userID)
              }else{
                //Start creation story
                self.creationStory();
                $('.storyboardPanel').show()
              }



            },
            error: function(){
              console.log('Error registering user.')
            }
          });
        }else{
          console.log('You have signed in and already have a pet!')
          //skip to creature
          self.loadPet(self.userID)
        }

  		},
  		error: function(){
        console.log('Error registering user.')
  		}
    });

  });
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

  function createPet(petType){
    console.log('Create Pet function Firing')

    $.ajax({
  		type: 'POST',
  		data: 'uid='+localStorage.getItem("userID")+'&pn='+$('#petname').val()+'&pt='+petType,
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghCreatePet.ashx',
  		success: function(data){
  			console.log(data);
        console.log('pet created')
        localStorage.setItem("petName", $('#petname').val());
        localStorage.setItem("petType", petType);
        localStorage.setItem("hasPet", true);
        self.loadPet(localStorage.getItem("userID"))
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

  }

  //Create Ringo
  $(document).on("click",".createRingo",function(e){
    e.preventDefault()
    console.log('creating ringo')
    createPet(1)
  })

  //Create Insatsu
  $(document).on("click",".createInsatsu",function(e){
    e.preventDefault()
    console.log('creating insatsu')
    createPet(2)
  })

}

//Load pet data
Core.prototype.loadPet = function(uid){
  var self = this

  console.log('Loading Pet')

  $.ajax({
    type: 'POST',
    data: 'uid='+uid,
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://applegotchi.co.uk/Ajax/ghPets.ashx',
    success: function(data){
      console.log(data);
      if (data.length == 1){
        if (data[0].pt == 1){
          //Ringo
          self.petNamedType = 'ringo'
        }else{
          //Insatsu
          self.petNamedType = 'insatsu'
        }

        $('.mainPanel').show().addClass(self.petNamedType+'Background')
        $('.petMain').attr('src', 'img/'+self.petNamedType+'/'+self.petNamedType+'-'+self.currentMood+'-stage'+data[0].pl+'.png').addClass('stage'+data[0].pl)
        self.updateActionLevels(uid)
      }else{
        console.log('retreievePetData has been fired, but there\'s no pet data to recall')
      }

    },
    error: function(){
      console.log('Error registering user.')
    }
  });
};

//Update current action levels of pet (and score)
Core.prototype.updateActionLevels = function(uid){
  var self = this

  $.ajax({
    type: 'POST',
    data: 'uid='+uid,
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://applegotchi.co.uk/Ajax/ghPets.ashx',
    success: function(data){
      console.log(data);
      if (data.length == 1){
        localStorage.setItem("cleanStatus", data[0].cs)
        localStorage.setItem("foodStatus", data[0].fs)
        localStorage.setItem("funStatus", data[0].ps)
        localStorage.setItem("petLevel", data[0].pl)
        localStorage.setItem("petPoints", data[0].pp)
        localStorage.setItem("petType", data[0].pt)
        localStorage.setItem("petName", data[0].pn)
        localStorage.setItem("petID", data[0].pid)
        localStorage.setItem("userID", data[0].uid)
        localStorage.setItem("hasPet", true);

        //TODO: score is not updating

        $('.statusFood>.statusLevel').css({height:data[0].fs+'%'})
        $('.statusEntertain>.statusLevel').css({height:data[0].ps+'%'})
        $('.statusClean>.statusLevel').css({height:data[0].cs+'%'})
        $('.currentScore').html(data[0].pp)


      }else{
        console.log('retreievePetData has been fired, but there\'s no pet data to recall')
      }

    },
    error: function(){
      console.log('Error registering user.')
    }
  });
}

//Pet Action: Feeding
Core.prototype.actionFeed = function(stage){
  var self =  this
  var petStage = stage
  $('.buttonContainer a').addClass('killLink')
  $('.petFood').show()
  $('.petFood').addClass('stage'+petStage+'_foodDrop')
  setTimeout(function(){
    $('.petFood').hide()
    $('.petFood').removeClass('stage'+petStage+'_foodDrop')
    $('.buttonContainer a').removeClass('killLink')

    $.ajax({
  		type: 'POST',
  		data: 'pid='+localStorage.getItem('petID')+'&t=f',
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghAction.ashx',
  		success: function(data){
  			console.log(data);
        self.updateActionLevels(localStorage.getItem('userID'))
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

  },2000)


}

//Pet Action: Cleaning
Core.prototype.actionClean = function(stage){
  var self =  this
  var petStage = stage
  $('.buttonContainer a').addClass('killLink')
  $('.cleaningBubblesLayer1').fadeIn()
  $('.cleaningBubblesLayer1').addClass('animateBubbles1')
  setTimeout(function(){
    $('.cleaningBubblesLayer4').fadeIn()
    $('.cleaningBubblesLayer4').addClass('animateBubbles4')
  },300)
  setTimeout(function(){
    $('.cleaningBubblesLayer5').fadeIn()
    $('.cleaningBubblesLayer5').addClass('animateBubbles5')
  },400)
  setTimeout(function(){
    $('.cleaningBubblesLayer2').fadeIn()
    $('.cleaningBubblesLayer2').addClass('animateBubbles2')
  },300)
  setTimeout(function(){
    $('.cleaningBubblesLayer3').fadeIn()
    $('.cleaningBubblesLayer3').addClass('animateBubbles1')
  },500)
  setTimeout(function(){
    $.ajax({
  		type: 'POST',
  		data: 'pid='+localStorage.getItem('petID')+'&t=c',
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghAction.ashx',
  		success: function(data){
  			console.log(data);
        self.updateActionLevels(localStorage.getItem('userID'))
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

    $('.animateBubbles1').removeClass('animateBubbles1')
    $('.animateBubbles2').removeClass('animateBubbles2')
    $('.animateBubbles4').removeClass('animateBubbles4')
    $('.animateBubbles5').removeClass('animateBubbles5')
    $('.buttonContainer a').removeClass('killLink')
  },4000)

}

//Pet Action: Entertain
Core.prototype.actionEntertain = function(stage){
  var self =  this
  var petStage = stage
  $('.entertainStreamers img').show()
  $('.buttonContainer a').addClass('killLink')
  setTimeout(function(){
    $.ajax({
  		type: 'POST',
  		data: 'pid='+localStorage.getItem('petID')+'&t=p',
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghAction.ashx',
  		success: function(data){
  			console.log(data);
        self.updateActionLevels(localStorage.getItem('userID'))
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

    $('.entertainStreamers img').hide()
    $('.buttonContainer a').removeClass('killLink')
  },4000)


}

//TEMP SHIT DELETE THIS WHEN YO DONE
Core.prototype.buildFunctionsDelete = function(){
  var self = this
  // +++ DELETE THIS FOR PRODUCTION +++

  $(document).on("click",".skipLoading",function(e){
    $('.registerLoginPanel').show()
  })


}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        console.log('device initialise')
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log('device ready')
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

document.addEventListener("deviceready", OnDeviceReady, false);

function OnDeviceReady()    {
  console.log('device is ready')
  //Let's make a pet!
  function initPushwoosh() {
      console.log('pushwoosh init')

      var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

      //set push notifications handler
      document.addEventListener('push-notification', function(event) {
        var notification = event.notification;
        alert(notification.aps.alert);
        pushNotification.setApplicationIconBadgeNumber(0);

        console.log('Push notification recieved!')
      });

      //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
      pushNotification.onDeviceReady({ projectid: "", pw_appid : "4FF24-5ACEC" });

      //register for pushes
      pushNotification.registerDevice(
          function(status) {
              var pushToken = status;
              console.warn('push token: ' + pushToken);
          },
          function(status) {
              console.warn(JSON.stringify(['failed to register ', status]));
          }
      );
  }

  initPushwoosh()
}

var Core = new Core();
