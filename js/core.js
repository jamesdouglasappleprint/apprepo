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
  var core = this;

  core.currentMood = 'happy';
  core.petNamedType = ""; //current pet type as a name
  core.petLevel = 1; //current pet type as a name
  core.userID = 0; //Pet Name
  core.debug = 0; //1 enabled, 0 disabled

  $('.menuMusic').get(0).play()

  core.loadPanelContent();//Load panels with content
  core.loginOrRegister(); //Load form options
  core.init();//Initial load checks
  core.logOut()



  if (core.debug == 0){
    //core.initPushwoosh()
    window.plugin.notification.badge.clear(); //clear badge notifications
  }

}

//Initialiser
Core.prototype.init = function (x) {
  var core = this

  $('.deadCover').hide()

  document.addEventListener("resume", onResume, false);
  function onResume() {
    core.updateActionLevels(localStorage.getItem('userID'),null)
    core.loadLeaderboard()
    window.plugin.notification.badge.clear(); //clear badge notifications
    //navigator.notification.alert('Totes some goats!', null, 'Resumed', 'Continue')
  }

};

//Leaderboard
Core.prototype.loadLeaderboard = function(){
  $.ajax({
    type: 'POST',
    data: 't=5',
    async: false,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://applegotchi.co.uk/Ajax/ghLeaderboard.ashx',
    success: function(data){
      console.log(data);

      $('.leaderboardData').empty()

      $.each(data, function(e){
        var petTypeName = ''

        if (data[e].pt == 2){
          petTypeName = 'ringo'
        }else if (data[e].pt == 1){
          petTypeName = 'insatsu'
        }else{
          petTypeName = 'noneSpecified'
        }

        $('.leaderboardData').append('<li><div class="leaderboardEntryContainer"><img src="img/Leaderboard/leaderboardPetIMG_'+petTypeName+'_'+data[e].pl+'.png"><div class="leaderboardDetails"><p class="leaderboardBold">'+data[e].pos+'.'+data[e].pname+'</p><p>Owner: '+data[e].name+'</p></div><div class="leaderboardScore">'+data[e].p+'</div></div></li>')

        // console.log(data[e].name) //user
        // console.log(data[e].p) //score
        // console.log(data[e].pl) //Pet level
        // console.log(data[e].pname) //Pet name
        // console.log(data[e].pos) //leaderboard position
        // console.log(data[e].pt) //pet type
      })

    },
    error: function(){
      console.log('Error registering user.')
    }
  });
}

//Load HTML into panels
Core.prototype.loadPanelContent = function(){
  var core = this
  console.log('Loading Panel Content')
  $('.menuPanel').load("menu.html")
  $('.registerLoginPanel').load("registerlogin.html")
  $('.storyboardPanel').load("storyboard.html")
  $('.mainPanel').load("main.html")
  $('.levelupPanel').load("levelup.html")
  $('.contactDetailsPanel').load("contactdetails.html")
  $('.leaderboardPanel').load("leaderboard.html")
  $('.scoreboostPanel').load("scoreboost.html")
  $('.creditsPanel').load("credits.html")
  $('.aboutPanel').load("about.html")
  $('.ressPanel').load("isded.html")
  $('.gumphPanel').load("gumph.html")

  if (localStorage.getItem("remainLoggedIn") == 'true' && localStorage.getItem("userID") !== null){
    console.log('remain logged in is true')
    //get up to date pet data
    core.loadPet(localStorage.getItem("userID"))
  }else{

  }

  $(document).on('click',".buttonPhoto", function(e){
    e.preventDefault()

    //NOTE: this code was used to save a screenshot and then share it to social media
    //NOTE: but it looks like iOS has issues taking the returned filepath and doing anything
    //NOTE: meaningful with it, so we can't use it. Works fine in Android...

    // navigator.screenshot.save(function(error,res){
    //   if(error){
    //     console.error(error);
    //   }else{
    //     window.plugins.socialsharing.share('Message and image', null, 'file://'+res.filePath, null)
    //     console.log(res.filePath);
    //   }
    // },'jpg',100,'myPet');

    $('.scoreboostPanel').show()
  })

  $(document).on("click", ".closeScoreBoost", function(e){
    e.preventDefault()
    $('.scoreboostPanel').hide()
  })

  $(document).on("click", ".resPet", function(e){
    e.preventDefault()
    core.zombiefy()
  })

  $(document).on("click", ".about", function(e){
    e.preventDefault()
    $('.aboutPanel').show()
  })

  $(document).on("click", ".closeGumph", function(e){
    e.preventDefault()
    $('.gumphPanel').hide()
    $('.dropFocus').removeClass('dropFocus')
    $('.bringToFront').removeClass('bringToFront')
  })

  $(document).on("click", ".closeAbout", function(e){
    e.preventDefault()
    $('.aboutPanel').hide()
  })

  //Click to feed!
  $(document).on("click",".buttonFeed",function(e){
    e.preventDefault()
    core.actionFeed(localStorage.getItem('petLevel'))
  })

  $(document).on("click", ".submitScoreIncrement", function(e){
    e.preventDefault()
    var toSend = $('#scoreboost').val()
    console.log(toSend)
    $.ajax({
      type: 'POST',
      data: 'uid='+localStorage.getItem('userID')+'&c='+toSend,
      async: false,
      dataType:'jsonp',
      jsonp: 'callback',
      url: 'http://applegotchi.co.uk/Ajax/ghApplyCode.ashx',
      success: function(data){
        console.log(data)
        //Test codes
        //zxcv -- vcxz -- abcd -- 1234 -- 5656

        if (data.StatusCode == 2){
          navigator.notification.alert('Code already redeemed!', null, 'Code failed', 'Continue')
        }else if (data.StatusCode == 3){
          console.log('code error')
          navigator.notification.alert('Code in-correct', null, 'Code failed', 'Continue')
        }else{
          core.updateActionLevels(localStorage.getItem('userID'),null)
          navigator.notification.alert('We\'ve boosted your points to say thank you for playing!', null, 'Code accepted!', 'Continue')
        }
      },
      error: function(){
        console.log('Error registering user.')
      }
    });
  })

  //Click to open credits
  $(document).on("click",".credits",function(e){
    e.preventDefault()
    $('.creditsPanel').show()
  })

  //Click to close credits
  $(document).on("click",".closeCredits",function(e){
    e.preventDefault()
    $('.creditsPanel').hide()
  })

  //Click to feed!
  $(document).on("click",".buttonClean",function(e){
    e.preventDefault()
    core.actionClean(localStorage.getItem('petLevel'))
  })

  //Click to feed!
  $(document).on("click",".externalLink",function(e){
    e.preventDefault()
    var link = $(this).attr('href')
    window.open(link, '_system')
  })

  //Click to Entertain!
  $(document).on("click",".buttonEntertain",function(e){
    e.preventDefault()
    core.actionEntertain(localStorage.getItem('petLevel'))
  })

  //Click to open contact details menu
  $(document).on("click",".updateContactDeets",function(e){
    e.preventDefault()
    $('.contactDetailsPanel').show()
    $('#updateContactDetailsForm #userID').val(localStorage.getItem('userID'))
    $('#updateContactDetailsForm #forename').val(localStorage.getItem('firstName'))
    $('#updateContactDetailsForm #surname').val(localStorage.getItem('lastName'))
    $('#updateContactDetailsForm #email').val(localStorage.getItem('emailaddress'))
    $('#updateContactDetailsForm #a1').val(localStorage.getItem('AddressLine1'))
    $('#updateContactDetailsForm #a2').val(localStorage.getItem('AddressLine2'))
    $('#updateContactDetailsForm #a3').val(localStorage.getItem('AddressLine3'))
    $('#updateContactDetailsForm #t').val(localStorage.getItem('town'))
    $('#updateContactDetailsForm #pc').val(localStorage.getItem('postcode'))
    $('#updateContactDetailsForm #password').val(localStorage.getItem('password'))
  })

  //Update contact Details after filling in
  $(document).on("click",".submitUpdate",function(e){
    e.preventDefault()

    console.log('Submit Update has been clicked')
  	var postData = $('form#updateContactDetailsForm').serialize();
    var fakeDetailsRemoved = postData.replace('&fakeusernameremembered=&fakepasswordremembered=','');
  	$.ajax({
  		type: 'POST',
  		data: fakeDetailsRemoved,
      dataType:'jsonp',
      jsonp: 'callback',
  		url: 'http://applegotchi.co.uk/Ajax/ghUpdateUser.ashx',
  		success: function(data){
        console.log('Success! User updated.')
        console.log(data)
        navigator.notification.alert('Thanks for updating! Your details are now updated.', null, 'Details updated!', 'Continue')

        localStorage.setItem('firstName',$('#updateContactDetailsForm #forename').val())
        localStorage.setItem('lastName',$('#updateContactDetailsForm #surname').val())
        localStorage.setItem('emailaddress',$('#updateContactDetailsForm #email').val())
        localStorage.setItem('AddressLine1',$('#updateContactDetailsForm #a1').val())
        localStorage.setItem('AddressLine2',$('#updateContactDetailsForm #a2').val())
        localStorage.setItem('AddressLine3',$('#updateContactDetailsForm #a3').val())
        localStorage.setItem('town',$('#updateContactDetailsForm #t').val())
        localStorage.setItem('postcode',$('#updateContactDetailsForm #pc').val())
        localStorage.setItem('password',$('#updateContactDetailsForm #password').val())
  		},
  		error: function(){
        console.log('Error registering user.')
        navigator.notification.alert('Oops! It looks like something went wrong...', null, 'Details not updated :(', 'ok')
  		}
    });

  })

  //Kill your pet
  $(document).on("click",".petMurder",function(e){
    e.preventDefault()
    core.petMurder()
  })

  //Show Leaderboard
  $(document).on("click",".leaderBoardButton",function(e){
    e.preventDefault()
    $('.menuPanel').hide()
    $('.leaderboardPanel').show()
    $('.leaderboardData').html('')
    core.loadLeaderboard()
  })

  //Click to close contact details menu
  $(document).on("click",".closeleaderboard",function(e){
    e.preventDefault()
    $('.leaderboardPanel').hide()
    $('.menuPanel').show()
  })


  //Click to close contact details menu
  $(document).on("click",".closeContactDetails",function(e){
    e.preventDefault()
    $('.contactDetailsPanel').hide()
  })

  //Click to close contact details menu
  $(document).on("click",".closeLevelUp",function(e){
    e.preventDefault()
    $('.levelupPanel').hide()
  })


  //Click to close contact details menu
  $(document).on("click",".toggleMusic",function(e){
    e.preventDefault()
    console.log('toggling')

    if (localStorage.getItem('music') == '1'){
      $('.gameMusic').get(0).play()
      localStorage.removeItem('music')
      $('.toggleMusic').removeclass('disabledAudio')
    }else if (localStorage.getItem('music') == null){
      localStorage.setItem('music', '1')
      $('.gameMusic').get(0).pause()
      $('.toggleMusic').addClass('disabledAudio')
    }else{
    }

  })
  //Click to close contact details menu
  $(document).on("click",".toggleSound",function(e){
    e.preventDefault()
    console.log('toggling')

    if (localStorage.getItem('sound') == '1'){
       localStorage.removeItem('sound')
       $('.toggleSound').removeClass('disabledAudio')
    }else if (localStorage.getItem('sound') == null){
       localStorage.setItem('sound', '1')
       $('.toggleSound').addClass('disabledAudio')
    }else{

    }


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
    $('.dropFocus').removeClass('dropFocus')
    $('.bringToFront').removeClass('bringToFront')
  })

  //Click to close contact details menu
  $(document).on("click",".closeMenu",function(e){
    e.preventDefault()
    $('.menuPanel').hide()
  })
}

//Log out and clear all local data
Core.prototype.logOut = function(){
  var core = this
  var save = localStorage.getItem('music')
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
    //Hide the floating arms so everythings not broken in creation
    $('.petStage6ArmLeft_insatsu').hide()
    $('.petStage6ArmRight_insatsu').hide()
    $('.petStage6ArmLeft_ringo').hide()
    $('.petStage6ArmRight_ringo').hide()

      localStorage.removeItem('isLoggedIn')

    //Call unregister
    core.initPushwoosh(null, null, false, true)
  })
}

//Script for logging in
Core.prototype.fireLoginScript = function(deets){
  var core = this
  console.log(deets)
  $.ajax({
    type: 'POST',
    data: deets,
    dataType:'jsonp',
    jsonp: 'callback',
    url: 'http://applegotchi.co.uk/Ajax/ghLogon.ashx',
    success: function(data){
      console.log(data);

      localStorage.setItem('isLoggedIn',1)

      //Initialiser
      function firstRun(){
        console.log('running...')
        $('.firstTimeFeed').show()
      }

      if(localStorage.getItem("firstTimeFeed") == 'true'){
        //console.log('true')
      }else if(localStorage.getItem("firstTimeFeed") == null){
        //console.log('null')
        localStorage.setItem("firstTimeFeed", 'true')
        firstRun()
      }else{

      }

      function loginFailure(buttonIndex) {
        console.log('login failure loop'+buttonIndex)
        if (buttonIndex == 1){
          $('.submitLogin').trigger('click')
        }
      }

      if (data.error == "user not found"){
        console.log('user not found')
        navigator.notification.confirm('User not found. Please check your login details and try again!', loginFailure, 'Login failure', ['Retry','Cancel'])
      }else{
        console.log('user found')
        core.userID = data.uid

        localStorage.setItem('userID', data.uid)
        localStorage.setItem('firstName', data.firstname)
        localStorage.setItem('lastName', data.lastname)
        localStorage.setItem('postcode', data.postcode)
        localStorage.setItem('AddressLine1', data.add1)
        localStorage.setItem('AddressLine2', data.add2)
        localStorage.setItem('AddressLine3', data.add3)
        localStorage.setItem('emailaddress', data.emailaddress)
        localStorage.setItem('town', data.town)
        localStorage.setItem('password', data.password)

        //TODO:: renable
        //core.initPushwoosh(data.emailaddress, null, false)

        if (localStorage.getItem("hasPet") != 'true'){
          console.log('No local storage hasPet, either user hasn\t got a pet or they\'e got one but had deleted the app')

          //Check to see if user already has login, but has cleared localstorag
          console.log(data.uid)
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
                core.loadPet(core.userID)
              }else{
                //Start creation story
                core.creationStory();
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
          core.loadPet(core.userID)
        }
      }
    },
    error: function(){
      console.log('Error registering user.')
    }
  });
}

//Login and Register Functions
Core.prototype.loginOrRegister = function(){
  var core = this
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

    function isValidEmailAddress(emailAddress) {
      var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      return pattern.test(emailAddress);
    };

    function validationCheck(){

      var fields = true
      var email = false

      var emailaddress = $("#registerForm #email").val()

      $("#registerForm input").each(function(){
        if ($(this).val() == '' && !$(this).hasClass('ignoreField')){
          $(this).addClass('missingField')
          fields = false
        }else if (!$(this).val() == '' && !$(this).hasClass('ignoreField')){
          $(this).removeClass('missingField')
        }

      })

      if( !isValidEmailAddress( emailaddress )) {
        email = false
        $("#registerForm #email").addClass('missingField')
      }else{
        $("#registerForm #email").removeClass('missingField')
        email = true
      }

      if (fields == true && email == true){
        return true
      }else{
        return false
      }


    }


    if (validationCheck() == true){
      console.log('validation true')
      var postData = $('form#registerForm').serialize();
      var fakeDetailsRemoved = postData.replace('&fakeusernameremembered=&fakepasswordremembered=','');
    	$.ajax({
    		type: 'POST',
    		data: fakeDetailsRemoved,
        dataType:'jsonp',
        jsonp: 'callback',
    		url: 'http://applegotchi.co.uk/Ajax/ghRegister.ashx',
    		success: function(data){
          console.log('Success! User registered.')
          localStorage.setItem("userID", data.userID);
          navigator.notification.alert('Thanks for registering! Now it\'s time to choose your pet!', null, 'Registration Success!', 'Continue')

          $('.registerLoginContainer').removeClass('registerLoginReduceMax')
          $('.slideRegister').hide()
          $('.registerLoginPanel').removeClass('displaceBackgroundRegister')
          core.fireLoginScript(fakeDetailsRemoved)
    		},
    		error: function(){
          console.log('Error registering user.')
          navigator.notification.alert('Oops! It looks like something went wrong...', null, 'Registration Failure :(', 'ok')
    		}
      });
    }else{
      navigator.notification.alert('Please check you have filled out all fields correctly!', null, 'Registration Error!', 'Ok')
    }


  });

  //USER LOGIN
  $(document).on("click",".submitLogin",function(e){
  	e.preventDefault()
  	console.log('Submit Login has been clicked')
  	var postData = $('form#loginForm').serialize();
    var fakeDetailsRemoved = decodeURIComponent(postData.replace('fakeusernameremembered=&fakepasswordremembered=&',''));
    core.fireLoginScript(fakeDetailsRemoved)
  });
}//END

//Assigns global mood to whatever you feed it
Core.prototype.assignMood = function(mood){
  var core = this;
  var thisMood = mood;
  core.currentMood = thisMood;
}

//All code for creation story, including assigning which pet you've picked
Core.prototype.creationStory = function(){
  //this code is probably temporary...
  var core = this
  var flag1 = ''; //first stage check
  var flag2 = ''; //second stage check
  var flag3 = ''; //third stage check

  $('.storyboardContainer').css({left:'-100%', top:'0'})


  $(document).on("click",".option_a",function(e){
    e.preventDefault()
    console.log('option A')
    $('.storyboardContainer').css({left:'0'})
    flag1 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  $(document).on('click', '.firstOption', function(){
    $('.storyboardStart').hide()
  })

  $(document).on("click",".option_b",function(e){
    e.preventDefault()
    console.log('option B')
    $('.storyboardContainer').css({left:'-200%'})
    flag1 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_c",function(e){
    e.preventDefault()
    console.log('option C')
    $('.storyboardContainer').css({left:'0', top:'-100%'})
    flag2 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_d",function(e){
    e.preventDefault()
    console.log('option d')
    $('.storyboardContainer').css({left:'0', top:'-100%'})
    flag2 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_e",function(e){
    e.preventDefault()
    console.log('option e')
    $('.storyboardContainer').css({left:'-200%', top:'-100%'})
    flag2 = 'insatsu'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_f",function(e){
    e.preventDefault()
    console.log('option f')
    $('.storyboardContainer').css({left:'-200%', top:'-100%'})
    flag2 = 'ringo'
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create insatsu
  $(document).on("click",".option_g",function(e){
    e.preventDefault()
    console.log('option g')
    flag3 = 'insatsu'
    if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else{
      console.log('error, you\'ve somehow chosen an option I didn\'t think of.')
    }
    $('.storyboardContainer').css({left:'-100%', top:'-100%'})
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_h",function(e){
    e.preventDefault()
    console.log('option h')
    flag3 = 'ringo'
    if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else{
      console.log('error, you\'ve somehow chosen an option I didn\'t think of.')
    }
    $('.storyboardContainer').css({left:'-100%', top:'-100%'})
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create insastsu
  $(document).on("click",".option_i",function(e){
    e.preventDefault()
    console.log('option i')
    flag3 = 'insatsu'
    if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else{
      console.log('error, you\'ve somehow chosen an option I didn\'t think of.')
    }
    $('.storyboardContainer').css({left:'-100%', top:'-100%'})
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })

  //Create Ringo
  $(document).on("click",".option_j",function(e){
    e.preventDefault()
    console.log('option j')
    flag3 = 'ringo'
    if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'ringo'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-84.png">')
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'insatsu'){
      $('.selectedEgg').html('<img src="img/storyboard/Choosen_Egg-85.png">')
    }else{
      console.log('error, you\'ve somehow chosen an option I didn\'t think of.')
    }
    $('.storyboardContainer').css({left:'-100%', top:'-100%'})
    console.log('Flag1: '+flag1+' Flag2: '+flag2+' Flag3: '+flag3)
  })



  function createPet(petType){
    console.log('Create Pet function Firing')
    var nameofpet = ''
    $('.petname').each(function(){
      console.log($(this).val())
      if ($(this).val() == ''){

      }else{
        nameofpet = $(this).val()
        return false;
      }
    })

    $.ajax({
  		type: 'POST',
  		data: 'uid='+localStorage.getItem("userID")+'&pn='+nameofpet+'&pt='+petType,
      dataType:'jsonp',
      jsonp: 'callback',
      async: false,
  		url: 'http://applegotchi.co.uk/Ajax/ghCreatePet.ashx',
  		success: function(data){
  			console.log(data);
        console.log('pet created')
        localStorage.setItem("petName", nameofpet);
        localStorage.setItem("petType", petType);
        localStorage.setItem("hasPet", true);
        core.loadPet(localStorage.getItem("userID"))
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

  }

  //Create Ringo
  $(document).on("click",".createPet",function(e){
    e.preventDefault()
    if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'insatsu' && flag2 == 'insatsu' && flag3 == 'ringo'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'insatsu'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'insatsu' && flag2 == 'ringo' && flag3 == 'ringo'){
      console.log('Create Pet RINGO //')
      createPet(2)
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'ringo'){
      console.log('Create Pet RINGO //')
      createPet(2)
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'ringo'){
      console.log('Create Pet RINGO //')
      createPet(2)
    }else if (flag1 == 'ringo' && flag2 == 'insatsu' && flag3 == 'insatsu'){
      console.log('Create Pet INSATSU //')
      createPet(1)
    }else if (flag1 == 'ringo' && flag2 == 'ringo' && flag3 == 'insatsu'){
      console.log('Create Pet RINGO')
      createPet(2)
    }else{
      console.log('error, you\'ve somehow chosen an option I didn\'t think of.')
    }
  })
}

//Load pet data
Core.prototype.deadPet = function(){
  var core = this
  console.log('Pet is Dead !! :(')
  core.currentMood = 'dead'
  localStorage.setItem('hasded', "isdied")
  $('.petStage6ArmLeft_insatsu').hide()
  $('.petStage6ArmRight_insatsu').hide()
  $('.petStage6ArmLeft_ringo').hide()
  $('.petStage6ArmRight_ringo').hide()

  $('.deadCover').show()
  $('.buttonContainer').hide()

  core.speechBubble('...eughghg')

  setTimeout(function(){
    $('.ressPanel').show()
  },4000)


}

//Load pet data
Core.prototype.zombiefy = function(){
  var core = this

  $.ajax({
    type: 'POST',
    data: 'pid='+localStorage.getItem('petID')+'&uid='+localStorage.getItem('userID'),
    dataType:'jsonp',
    jsonp: 'callback',
    async: false,
    url: 'http://applegotchi.co.uk/Ajax/ghAnimatePet.ashx',
    success: function(data){
      console.log(data);
      console.log('Pet is alive again!')
      core.currentMood = 'meh'
      localStorage.removeItem('hasded')
      $('.deadCover').hide()
      $('.buttonContainer').show()
      $('.ressPanel').hide()

      core.loadPet(localStorage.getItem('userID'))
    },
    error: function(){
      console.log('Error creating pet.')
    }
  });
}

//Load pet data
Core.prototype.loadPet = function(uid){
  var core = this

  $('.menuMusic').get(0).pause()

  if (localStorage.getItem('music') == '1'){
    console.warn('Stopping Music')
    $('.gameMusic').get(0).pause()
    setTimeout(function(){
      $('.toggleMusic').addClass('disabledAudio')
    },2000)

  }else if (localStorage.getItem('music') == null){
    console.warn('Playing Music')
    $('.gameMusic').get(0).play()
    setTimeout(function(){
      $('.toggleMusic').removeClass('disabledAudio')
    },2000)
  }else{

  }

  if (localStorage.getItem('sound') == '1'){
    setTimeout(function(){
      $('.toggleSound').addClass('disabledAudio')
    },2000)

  }else if (localStorage.getItem('sound') == null){
    setTimeout(function(){
      $('.toggleSound').removeClass('disabledAudio')
    },2000)
  }else{

  }

  console.log('Loading Pet'+uid)
  core.updateActionLevels(uid,'firstload')

};

Core.prototype.firstLoad = function(){
  var core = this

  if (localStorage.getItem('petPoints') > 100){
    //If user already has some pet points, assume they won't want to see the firstLoad crap
    //because they're not a new user - maybe they had signed out? Who knows.
  }else{
    $('.gumphPanel').show()
    //Step 1
    $('.buttonContainer').addClass('bringToFront')
    $('.buttonEntertain').addClass('dropFocus')
    $('.buttonClean').addClass('dropFocus')
    $('.buttonPhoto').addClass('dropFocus')
    $('.step1 .bouncyHand').show()

    $('.advanceStep').click(function(){
      var step = $(this).attr('data-step')
      $('.dropFocus').removeClass('dropFocus')
      $('.bringToFront').removeClass('bringToFront')
      $('.gumphStep').hide()
      $('.'+step).show()

      if (step == 'step2'){
        $('.buttonContainer').addClass('bringToFront')
        $('.buttonFeed').addClass('dropFocus')
        $('.buttonEntertain').addClass('bringToFront')
        $('.buttonClean').addClass('dropFocus')
        $('.buttonPhoto').addClass('dropFocus')
        $('.step2 .bouncyHand').show()
      }else if (step == 'step3'){
        $('.buttonContainer').addClass('bringToFront')
        $('.buttonFeed').addClass('dropFocus')
        $('.buttonEntertain').addClass('dropFocus')
        $('.buttonClean').addClass('bringToFront')
        $('.buttonPhoto').addClass('dropFocus')
        $('.step3 .bouncyHand').show()
      }else if (step == 'step4'){
        $('.statusContainer').addClass('bringToFront')
        $('.step4 .bouncyHand').show()
      }else if (step == 'step5'){
        $('.levelUpBar').addClass('bringToFront')
        $('.step5 .bouncyHand').show()
      }else if (step == 'step6'){
        $('.menuButtonContainer').addClass('bringToFront')
        $('.step6 .bouncyHand').show()
      }else if (step == 'step7'){
        $('.gumphPanel').remove()
      }
    })
  }

}

//
Core.prototype.popupMessage = function(type){
  var core = this
  var randomiser = Math.floor(Math.random() * 5) + 1

  if (type == 'food'){
    var foodArr = ['I\'m stuffed!','Thanks for the food!','That was tasty!','SO. MUCH. FOOD.','OMG stuffed!','FOOD!!!']
    core.speechBubble(foodArr[randomiser])
  }else if(type == 'fun'){
    var funArr = ['Yay!!','BEST. PARTY. EVER.','That was fun!','You throw the best parties!','I need a rest now!','Boogie!']
    core.speechBubble(funArr[randomiser])
  }else if(type == 'clean'){
    var cleanArr = ['Squeeky Clean!','Bubbles!','I\'m like a fish now!','SO. CLEAN.','Ahoy!','Blub blub blub!']
    core.speechBubble(cleanArr[randomiser])
  }else{
    console.log('core.popupMessage type not set or an error has occured.')
  }


}

//Update current action levels of pet (and score)
Core.prototype.updateActionLevels = function(uid,firstLoad){
  var core = this
  console.log('update action levels firing')

  var prevPetLevel = localStorage.getItem("petLevel")

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
        localStorage.setItem("userPoints", data[0].up)
        localStorage.setItem("petType", data[0].pt)
        localStorage.setItem("petName", data[0].pn)
        localStorage.setItem("petID", data[0].pid)
        localStorage.setItem("userID", data[0].uid)
        localStorage.setItem("hasPet", true);

        if (localStorage.getItem('firstTime') == null && localStorage.getItem('isLoggedIn') == 1 && data[0].pp < 100){
          localStorage.setItem('firstTime', true)
          core.firstLoad()
        }else{
          //$('.gumphPanel').remove()
        }

        if (core.debug == 0 && localStorage.getItem("notifications") == null){
          core.initPushwoosh(localStorage.getItem("emailaddress"),data[0].pl,true)
        }

        if (data[0].pt == 2){
          //Ringo
          core.petNamedType = 'ringo'
          localStorage.setItem("petNamedType", "ringo")
        }else{
          //Insatsu
          localStorage.setItem("petNamedType", "insatsu")
          core.petNamedType = 'insatsu'
        }

        $('.speechBubble').attr('src','img/'+core.petNamedType+'-speech.png')
        $('.petName').html(data[0].pn)

        $('.mainPanel').show().removeClass('insatsuBackground').removeClass('ringoBackground').addClass(core.petNamedType+'Background')

        if (prevPetLevel != data[0].pl && data[0].pl > 1 && firstLoad != 'firstload'){
          $('.levelupPanel').show()

          if (data[0].pl == 6 && core.petNamedType == 'insatsu'){
            $('.petStage6ArmLeft_insatsu').show()
            $('.petStage6ArmRight_insatsu').show()
            $('.petStage6ArmLeft_ringo').hide()
            $('.petStage6ArmRight_ringo').hide()

          }else if (data[0].pl == 6 && core.petNamedType == 'ringo'){
            $('.petStage6ArmLeft_insatsu').hide()
            $('.petStage6ArmRight_insatsu').hide()
            $('.petStage6ArmLeft_ringo').show()
            $('.petStage6ArmRight_ringo').show()
          }else{

          }
        }

        //Display message at 100%, unless one has already been shown at 100%
        //If that's the case, don't let it show again until it's dropped below 100%
        if (data[0].fs == 100 && localStorage.getItem('food100') != 1){
          core.popupMessage('food')
          localStorage.setItem('food100',1)
        }else if (data[0].fs < 100){
          localStorage.removeItem('food100')
        }

        if (data[0].ps == 100 && localStorage.getItem('fun100') != 1){
          core.popupMessage('fun')
          localStorage.setItem('fun100',1)
        }else if(data[0].ps < 100){
          localStorage.removeItem('fun100')
        }

        if (data[0].cs == 100 && localStorage.getItem('clean100') != 1){
          core.popupMessage('clean')
          localStorage.setItem('clean100',1)
        }else if (data[0].cs < 100){
          localStorage.removeItem('clean100')
        }


        if(data[0].pa == 0){
          core.deadPet()
        }else if ((data[0].cs + data[0].fs + data[0].ps) >= 200){
          core.currentMood = 'happy';
        }else if ((data[0].cs + data[0].fs + data[0].ps) > 100 && (data[0].cs + data[0].fs + data[0].ps) < 200 ){
          core.currentMood = 'meh';
        }else{
          core.currentMood = 'sad';
        }

        if(data[0].pa == 0){
          $('.petMain').attr('src', 'img/'+localStorage.getItem("petNamedType")+'/'+localStorage.getItem("petNamedType")+'-'+core.currentMood+'-stage'+data[0].pl+'.png')
        }else{
          $('.petMain').attr('src', 'img/'+localStorage.getItem("petNamedType")+'/'+localStorage.getItem("petNamedType")+'-'+core.currentMood+'-stage'+data[0].pl+'.png').addClass('stage'+data[0].pl)
        }

        $('.petMain').removeClass('stage'+(data[0].pl-1))
        $('.petMain').removeClass('stage'+(data[0].pl-2))
        $('.petMain').removeClass('stage'+(data[0].pl-3))
        $('.petMain').removeClass('stage'+(data[0].pl-4))
        $('.petMain').removeClass('stage'+(data[0].pl-5))

        $('.statusFood>.statusLevel').css({height:data[0].fs+'%'})
        $('.statusEntertain>.statusLevel').css({height:data[0].ps+'%'})
        $('.statusClean>.statusLevel').css({height:data[0].cs+'%'})
        $('.currentScore').html(data[0].up)
        $('.levelUpStatus').css({height:data[0].pcil+'%'})


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
  var core =  this
  var petStage = stage
  $('.buttonContainer a').addClass('killLink')
  $('.petFood').show()
  $('.petFood').addClass('stage'+petStage+'_foodDrop')

  if (localStorage.getItem('sound') == '1'){

  }else if (localStorage.getItem('sound') == null){
    var audio = new Audio('audio/eat.mp3');
    audio.play();
  }else{

  }

  setTimeout(function(){
    $('.petFood').hide()
    //$('.petFood').removeClass('stage'+petStage+'_foodDrop')
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
        core.updateActionLevels(localStorage.getItem('userID'),null)

  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

  },2000)


}

//Pet Action: Cleaning
Core.prototype.actionClean = function(stage){
  var core =  this
  var petStage = stage

  //1 == play
  //0 == stop
  if (localStorage.getItem('sound') == '1'){

  }else if (localStorage.getItem('sound') == null){
    var audio = new Audio('audio/bubbles.mp3');
    audio.play();
  }else{

  }

  $('.buttonContainer a').addClass('killLink')
  $('.water').show()
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
        core.updateActionLevels(localStorage.getItem('userID'),null)
        $('.water').hide()
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
  var core =  this
  var petStage = stage
  $('.entertainStreamers img').show()
  $('.buttonContainer a').addClass('killLink')

  //1 == play
  //0  == stop
  if (localStorage.getItem('sound') == null && core.currentMood == 'happy' || localStorage.getItem('sound') == null && core.currentMood == 'meh'){
    var audio = new Audio('audio/happy.mp3');
    audio.play();
  }else if (localStorage.getItem('sound') == null && core.currentMood == 'sad'){
    var audio = new Audio('audio/sad.mp3');
    audio.play();
  }else if (localStorage.getItem('sound') == '1'){

  }else{

  }

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
        core.updateActionLevels(localStorage.getItem('userID'),null)
  		},
  		error: function(){
        console.log('Error creating pet.')
  		}
    });

    $('.entertainStreamers img').hide()
    $('.buttonContainer a').removeClass('killLink')
  },3000)


}

//omg kill yo pet
Core.prototype.petMurder = function(){

  //NOTE: don't need this, this is something to manually trigger the death animation
  // localStorage.setItem('isKill', 1)
  // core.currentMood = 'dead';

  function kill(buttonIndex) {
    console.log('Attempting to kill pet'+buttonIndex)
    if (buttonIndex == 2){
      console.log('button 2')
      var petID = localStorage.getItem('petID')
      $.ajax({
        type: 'POST',
        data: 'pid='+petID+'&uid='+localStorage.getItem('userID'),
        async: false,
        dataType:'jsonp',
        jsonp: 'callback',
        url: 'http://applegotchi.co.uk/Ajax/ghKillPet.ashx',
        success: function(data){
          console.log(data)
          console.log('success')

          localStorage.clear();
          $('.menuPanel').hide()
          $('.mainPanel').hide()
          $('.storyboardPanel').hide()
          $('.registerLoginPanel').removeClass('displaceBackgroundLogin')
          $('.registerLoginContainer').removeClass('registerLoginReduce')
          $('.slideLogin').hide()
          //Hide the floating arms so everythings not broken in creation
          $('.petStage6ArmLeft_insatsu').hide()
          $('.petStage6ArmRight_insatsu').hide()
          $('.petStage6ArmLeft_ringo').hide()
          $('.petStage6ArmRight_ringo').hide()

          //1 == play
          //0  == stop
          //if music is set to on, play
          if (save == '1'){
            $('.menuMusic').get(0).play()
            $('.gameMusic').get(0).pause()
            localStorage.setItem('music', "1")

          //else if music is set to off, pause both
          }else if (save == '0'){
            $('.menuMusic').get(0).pause()
            $('.gameMusic').get(0).pause()
            $('.toggleMusic').addClass('disabledAudio')
            localStorage.setItem('music', "0")
          }else{
            $('.menuMusic').get(0).pause()
            $('.gameMusic').get(0).pause()
          }
        },
        error: function(data){
          console.log('Pet immortal - murder failure '+data)
        }
      });
    }
  }

  //kill(2)
  navigator.notification.confirm('Please don\'t kill your pet. Just feed them, entertain them and keep them clean and they will be happy!', kill, 'Commit peticide', ['I\'ve changed my mind!','Kill my pet'])


}

Core.prototype.speechBubble = function(message,action){

  //Remove all speechbubble shiz in there's already one on screen.
  $('.speechBubble').addClass('shrinkBubble')
  $('.speechBubbleText').removeClass('showSpeechText')
  $('.closeSpeechBubble').hide()
  $('.speechBubble').hide()
  $('.speechBubble').removeClass('shrinkBubble')

  var core = this
  $('.speechBubble').show()
  $('.closeSpeechBubble').show()
  $('.speechBubbleText').addClass('showSpeechText').html(message)

  setTimeout(function(){
    $('.speechBubble').addClass('shrinkBubble')
    $('.speechBubbleText').removeClass('showSpeechText')
    $('.closeSpeechBubble').hide()
    setTimeout(function(){
      $('.speechBubble').hide()
      $('.speechBubble').removeClass('shrinkBubble')
    },1000)
  },5000)


  $(document).on("click",".speechBubbleContainer",function(e){

    $('.speechBubble').addClass('shrinkBubble')
    $('.speechBubbleText').removeClass('showSpeechText')
    $('.closeSpeechBubble').hide()
    setTimeout(function(){
      $('.speechBubble').hide()
      $('.speechBubble').removeClass('shrinkBubble')
    },1000)

  })


}

Core.prototype.initPushwoosh = function(email,petLevel,setTags,unRegister){
  var core = this

  //FYI ///////////////////////////////////////////////////////////////
  //Email = users email, petLevel = pets level and setTags = true/false
  //If setTags == true, it will set the tags
  //If setTags == false, register device will fire && tags will be set.
  //If unRegister == true, un-register the user

  //navigator.notification.alert('Success!', null, 'Pushwoosh CORE Initialised', 'ok')
  console.log('line711: '+email+'_'+petLevel+'_'+setTags+'_'+unRegister)

  //Cancel first load highlighting if the user closed the app during the tutorial and signed out
  $('.dropFocus').removeClass('dropFocus')
  $('.bringToFront').removeClass('bringToFront')

  var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

  //TRIGGERED WHEN NOTIFICATIONS RECIEVED IN APP
  document.addEventListener('push-notification', function(event) {
    var notification = event.notification;
    console.log('push message recieved');
    //pushNotification.setApplicationIconBadgeNumber(0);
    core.speechBubble(notification.aps.alert)
    //navigator.notification.alert(notification.aps.alert, null, 'Your pet says...', 'OK')
  });

  pushNotification.onDeviceReady({
    projectid: "364045976404", // GOOGLE_PROJECT_ID
    pw_appid : "4FF24-5ACEC" // PUSHWOOSH_APP_ID
  });

  console.log('register device?')
  //register for pushes
  pushNotification.registerDevice(
    function(status) {
      var deviceToken = status['deviceToken'];
      console.log('registerDevice: ' + deviceToken);
      localStorage.setItem("notifications",true)
      setTagsFunc(email)
    },
    function(status) {
      navigator.notification.alert('Connection error', null, 'Error', 'Continue')

      console.log('failed to register : ' + JSON.stringify(status));
      alert(JSON.stringify(['failed to register ', status]));
    }
  );

  function setTagsFunc(email,petLevel){
    console.log(email+' : '+petLevel)
    pushNotification.setTags(
    {
      "emailaddress":email,
      "petlevel":petLevel
    },
      function(status) {
          console.log('setTags success '+status);

          pushNotification.getTags(function(tags) {
            console.log('Returned Tags: ' + JSON.stringify(tags));
            },
            function(error) {
              console.warn('get tags error: ' + JSON.stringify(error));
            }
          );
      },
      function(status) {
          console.warn('setTags failed'+status);
      }
    );
  }//end func

  //If we're calling set tags only set tags, don't call register etc
  if (setTags === true){
    setTagsFunc(email,petLevel)

  //else assume we're registering
  }else if(unRegister === true){
    console.log('Attempting unregister...')
    pushNotification.unregisterDevice (
      function(token){
          console.log("unregistered success!" + token);
      },
      function(status){
          console.log("unregistered failed!" + status);
      })
  }else{

  }

}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        console.log('device initialise')

        setTimeout(function(){
          $('.registerLoginPanel').show()
        },2000)

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

////////FIRE ON DEVICE READY
document.addEventListener("deviceready", OnDeviceReady, false);
function OnDeviceReady()    {
  console.log('device is ready')
  window.plugin.notification.badge.clear();//clear notification badges
}

////////FIRE ON DEVICE OFFLINE
document.addEventListener("offline", onOffline, false);
function onOffline() {
  navigator.notification.alert('Uhoh, it looks like you\'re offline! Please re-connect to the internet!', null, 'Connectivity error', 'Continue')
}

////////BOOT CORE
var Core = new Core();
