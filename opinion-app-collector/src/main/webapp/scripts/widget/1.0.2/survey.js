/*
* Inqwise
* http://www.inqwise.com
*
* Copyright 2011, 2013 Inqwise, Ltd. and other contributors
*
*/
;
(function () {
        
	var protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
	function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
	
	if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.8.2') {
		loadScript(protocol + "ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", function () {
	
			/*
	    	if (window.console) {
	    		window.console.log("jquery loaded");
	    	}
	    	*/
			
	    	//jQuery.noConflict();
	    	window.$ = jQuery.noConflict();
	    	
	    	if(!JSON) {
				loadScript(protocol + "yandex.st/json2/2011-10-19/json2.min.js", function () {
					init();
				});
			} else {
				init();
			}
	    	
		});
	} else {
		if(!JSON) {
			loadScript(protocol + "yandex.st/json2/2011-10-19/json2.min.js", function () {
				init();
			});
		} else {
			init();
		}
	}
	
	function findScript(target) {
		return $('script').filter(function() { return this.src.match(target); });
	};
	
	function evalConfig(html) {
		if (html) {
			// ignore CDATA in script tags
			var inner = html.replace(/^[\s\xA0]*(\/\/\s?\<\!\[CDATA\[)?/, '').replace(/(\/\/\s?\]\]\>)?[\s\xA0]*$/, '');
			if (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]+$/.test(inner.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
				try {
					return eval( '(' + inner + ')' );
				} catch(err) {  }
			}
		}

		return {};
	};
	
	
	// global
	var servletUrl = "";
	var messages = {};
	
	var getDetails = function(params) {
		
		var obj = {
			opinions : {
				getDetails : { 
					guidTypeId : params.guidTypeId,
					guid : params.guid,
					modeId : params.modeId,
					themeId : params.themeId,
					ref : params.ref,
					target : params.target,
					respondent : params.respondent,
					urlParams : params.urlParams 
				}
			}
		};
		
		$.ajax({ 
			 type: "GET", 
			 url : servletUrl,  
			 /*dataType : "json",*/
			 dataType: "jsonp",
			 jsonp: "callback",
			 data : { 
			 	rq : JSON.stringify(obj), 
			 	timestamp : $.getTimestamp()
			 },
			 success : function(data){
				 if(data.opinions.getDetails != undefined) {
					if(data.opinions.getDetails.error != undefined) {
						if(params.error != undefined 
								&& typeof params.error == "function") {
							params.error(data.opinions.getDetails);
						}
						
					} else {
						if(params.success != undefined 
								&& typeof params.success == "function") {
							params.success(data.opinions.getDetails);
						}
					}
				 }
			 }, 
			 error: function (XHR, textStatus, errorThrow) {
				 // error
			 }
		});
		
	};
	
	
	//var config = {};
	var _data = {}; 
	var _el = null;
	var survey = {
		controls : {
			list : [],
			startIndex : 0
		}
	};
	
	var defaultValidator = null;
	var validateGroup = []; // fix for matrix/likert
	var validateElements = {
		elements : []
	};
	
		
	var getControls = function(params) {
		
		var get = function() {
			
			var obj = {
				opinions : {
					getControls : {
						guidTypeId : params.guidTypeId,
						guid : params.guid,
						modeId : params.modeId,
						lastSelected : params.lastSelected,
						sheetId : params.sheetId,
						respondent : params.respondent
					}
				}
			};
			
			$.ajax({ 
				type: "GET", 
				 url : servletUrl,  
				 /*dataType : "json",*/
				 dataType: "jsonp",
				 jsonp: "callback",
				 data : { 
					rq : JSON.stringify(obj), 
					timestamp : $.getTimestamp()
				 },
				 success : function(data){
					 
					 if(data.opinions.getControls != undefined) {
						if(data.opinions.getControls.error != undefined) {
							if(params.error != undefined 
									&& typeof params.error == "function") {
								params.error(data.opinions.getControls);
							}
						} else {
							if(params.success != undefined 
									&& typeof params.success == "function") {
								params.success(data.opinions.getControls);
							}
						}
					 }
					 
				 },
				 error: function (XHR, textStatus, errorThrow) {
					// error
				}
			});
			
		};

		if(params.index > 0) {
			
			var obj2 = { 
				opinions : { 
					getStartIndexOfSheet : { 
						guidTypeId : params.guidTypeId, 
						guid : params.guid, 
						modeId : params.modeId, 
						sheetId : params.sheetId 
					} 
				}
			};
			
			$.ajax({ 
				type: "GET", 
				 url : servletUrl,  
				 /*dataType : "json",*/
				 dataType: "jsonp",
				 jsonp: "callback",
				 data : { 
					rq : JSON.stringify(obj2), 
					timestamp : $.getTimestamp()
				 },
				 success : function(data){
					
					if(data.opinions.getStartIndexOfSheet.error != undefined) {
						
					} else {
						if(data.opinions.getStartIndexOfSheet != undefined) {
							survey.controls.startIndex = data.opinions.getStartIndexOfSheet.startIndex;
							get();
						}
					}
					
					 
				 },
				 error: function (XHR, textStatus, errorThrow) {
						// error
				 }
			});
			
		} else {
			
			// startIndex
			survey.controls.startIndex = 1;
			
			get();
			
		}
	};
	
	
	
	
	var responseType = {
		startOpinion : 1,
		finishOpinion : 2,
		nextSheet : 3,
		prevSheet : 4,
		control: 5,
		option : 6,
		authorize : 7
	};
	
	var isSendClientInfo = false;
	
	var createResponse = function(params) {
		
		var obj = {};
		
		// ? isSendClientInfo
		if(isSendClientInfo) {
			
			obj = {
				opinions : {
					createResponse : { 
						guidTypeId : params.guidTypeId,
						guid : params.guid,
						modeId : params.modeId,
						responseTypeId : params.responseTypeId,
						responseData : params.responseData,
						password : params.password,
						os : {
							name: $.client.os.name,
							platform: $.client.os.platform,
							language: $.client.os.systemLanguage,
							timeZone: $.client.os.timeZone
						},
						screen : {
							width : $.client.screen.width,
							height: $.client.screen.height,
							color: $.client.screen.color
						},
						browser : {
							name : $.client.browser.name,
							appName: $.client.browser.appName,
							version : $.client.browser.version,
							isCookieEnabled : $.client.browser.cookieEnabled,
							isJavaInstalled : $.client.browser.java.isInstalled,
							isFlashInstalled : $.client.browser.flash.isInstalled,
							flashVersion : $.client.browser.flash.version
						},
						ref : document.referrer,
						target : location.href
					}
				}
			};
			
		} else {
			
			obj = {
				opinions : {
					createResponse : { 
						guidTypeId : params.guidTypeId,
						guid : params.guid,
						modeId : params.modeId,
						responseTypeId : params.responseTypeId,
						responseData : params.responseData,
						password : params.password,
						ref : document.referrer,
						target : location.href
					}
				}
			};

		}
		
		$.ajax({ 
			 type: "GET", 
			 url : servletUrl,  
			 /*dataType : "json",*/
			 dataType: "jsonp",
			 jsonp: "callback",
			 data : { 
				rq : JSON.stringify(obj), 
				timestamp : $.getTimestamp()
			 },  
			 async : (params.async || false),
			 success : function(data){
				if(data.opinions.createResponse != undefined) {
					if(data.opinions.createResponse.error != undefined) {				
						if(params.error != undefined 
								&& typeof params.error == 'function') {
							params.error(data.opinions.createResponse);
						}
					} else {
						if(params.success != undefined 
							&& typeof params.success == 'function') {
							params.success(data.opinions.createResponse);
						}
					}
				 }
			 }  
		});

		if(isSendClientInfo) {
			isSendClientInfo = false;
		}
		
	};
	
	function fromConfig(config, callback) {
		
		// fix
		if(config.guidTypeId == undefined) {
			config.guidTypeId = 1;
		}
		
		// fix
		if(config.modeId == undefined) {
			config.modeId = 1;
		}
		
		// variables
		servletUrl = (config.collectorUrl != undefined ? config.collectorUrl : "http://localhost:8080/opinion-opinion-collector") + "/servlet/DataPostmaster";
		
		// TODO:
		getDetails({
			guidTypeId : config.guidTypeId,
			guid : (config.guid != undefined ? config.guid : ""),
			modeId : config.modeId,
			themeId : (config.themeId != undefined ? config.themeId : null),
			ref : document.referrer,
			target : location.href,
			respondent : null, // TODO:
			urlParams : null, // TODO:
			success : function(data) {
				
				isSendClientInfo = data.isSendClientInfo;
				
				
				// global messages
				messages = {
					thanks : "Thank you for taking the survey.",
					completed : "Survey has already been completed",
					notFound : "Survey not found",
					closed : "Survey Closed",
					month : "Month",
					day : "Day",
					year : "Year",
					hours : "Hours",
					minutes : "Minutes",
					timeZone : "Time Zone",
					defaultNoneSelectedOption : "Please choose",
					other : "Other, (please specify)",
					defaultAdditionalDetails : "Additional details or comments",
					days : new function() {
						var days = [];
						for(var i = 0; i <= 31; i++) {
							var obj = {
								value: i,
								caption: (i == 0 ? "" : i)
							};
							days.push(obj);
						}
						return days;
					},
					months : [
						{value: 0, caption: ""}, 
				        {value: 1, caption: "Jan"},
				        {value: 2, caption: "Feb"},
				        {value: 3, caption: "Mar"},
				        {value: 4, caption: "Apr"},
				        {value: 5, caption: "May"},
				        {value: 6, caption: "Jun"},
				        {value: 7, caption: "Jul"},
				        {value: 8, caption: "Aug"},
				        {value: 9, caption: "Sep"},
				        {value: 10, caption: "Oct"},
				        {value: 11, caption: "Nov"},
				        {value: 12, caption: "Dec"}
				    ],
				    hours : new function() {
						var hours = [];
						for(var i = 0; i <= 24; i++) {
							var obj = {
								value: (i > 0 ? jQuery.pad((i - 1), 2) : i),
								caption: (i == 0 ? "" : jQuery.pad((i - 1), 2))
							};
							hours.push(obj);
						}
						return hours;
					},
				    minutes : new function() {
						var minutes = [];
						for(var i = 0; i <= 60; i++) {
							var obj = {
								value: (i > 0 ? jQuery.pad((i - 1), 2) : i),
								caption: (i == 0 ? "" : jQuery.pad((i - 1), 2))
							};
							minutes.push(obj);
						}
						return minutes;
					},
				    timeZones : [
				    	{value: 0, caption: ""},
				    	{value: "-12.0", caption: "(GMT -12:00) Eniwetok, Kwajalein"}, 
				       	{value: "-11.0", caption: "(GMT -11:00) Midway Island, Samoa"}, 
				       	{value: "-10.0", caption: "(GMT -10:00) Hawaii"}, 
				       	{value: "-9.0", caption: "(GMT -9:00) Alaska"}, 
				       	{value: "-8.0", caption: "(GMT -8:00) Pacific Time (US & Canada)"}, 
				       	{value: "-7.0", caption: "(GMT -7:00) Mountain Time (US & Canada)"}, 
				       	{value: "-6.0", caption: "(GMT -6:00) Central Time (US & Canada), Mexico City"}, 
				       	{value: "-5.0", caption: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima"}, 
				       	{value: "-4.0", caption: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz"}, 
				       	{value: "-3.5", caption: "(GMT -3:30) Newfoundland"}, 
				       	{value: "-3.0", caption: "(GMT -3:00) Brazil, Buenos Aires, Georgetown"}, 
				       	{value: "-2.0", caption: "(GMT -2:00) Mid-Atlantic"},
				       	{value: "-1.0", caption: "(GMT -1:00 hour) Azores, Cape Verde Islands"},
				       	{value: "0.0", caption: "(GMT) Western Europe Time, London, Lisbon, Casablanca"},
				       	{value: "1.0", caption: "(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris"},
				       	{value: "2.0", caption: "(GMT +2:00) Kaliningrad, South Africa"},
				       	{value: "3.0", caption: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg"},
				       	{value: "3.5", caption: "(GMT +3:30) Tehran"},
				       	{value: "4.0", caption: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi"},
				       	{value: "4.5", caption: "(GMT +4:30) Kabul"},
				       	{value: "5.0", caption: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent"},
				       	{value: "5.5", caption: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi"},
				       	{value: "5.75", caption: "(GMT +5:45) Kathmandu"},
				       	{value: "6.0", caption: "(GMT +6:00) Almaty, Dhaka, Colombo"},
				       	{value: "7.0", caption: "(GMT +7:00) Bangkok, Hanoi, Jakarta"},
				       	{value: "8.0", caption: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong"},
				       	{value: "9.0", caption: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk"},
				       	{value: "9.5", caption: "(GMT +9:30) Adelaide, Darwin"},
				       	{value: "10.0", caption: "(GMT +10:00) Eastern Australia, Guam, Vladivostok"},
				       	{value: "11.0", caption: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia"},
				       	{value: "12.0", caption: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka"}
					]
				};
				
				$.extend(data, config);
				
				// set globals;
				
				_data = data;
				
				// callback data
				callback(config, data);
				
			},
			error: function(error) {
				
				// callback error
				// alert(JSON.stringify(error.error));
				
				switch(error.error) {
					case "NoResults": {
						
						// not found
						
						break;
					}
					case "NotExist" : {
						
						// not found
						
						break;
					}
					case "ArgumentNull" : {
						
						// not found
						
						break;
					}
				}
				
				
			}
		});
		
		
	};
	
	function updatePageNumber(el, config, data) {
		
		
		el.find(".label-start-page-number").text((data.sheets.lastSelected + 1));
		el.find(".label-end-page-number").text(data.sheets.list.length);
		
		
		// header-page-title
		if(data.sheets.list[data.sheets.lastSelected].title != null) {
			el.find(".header-page-title").show();
			el.find("#label_page_number").html(data.usePageNumbering ? (data.sheets.lastSelected + 1) + ".&nbsp;" : "");
			el.find("#label_page_title").text((data.sheets.list[data.sheets.lastSelected].title != null ? data.sheets.list[data.sheets.lastSelected].title : ""));
		} else {
			el.find(".header-page-title").hide();
		}
		
		// description
		if(data.sheets.list[data.sheets.lastSelected].description != null) {
			el.find("#paragraph_page_description")
				.show()
				.html($.replaceURLWithHTMLLinks(data.sheets.list[data.sheets.lastSelected].description.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>"), true));
		} else {
			el.find("#paragraph_page_description").hide();
		}
		
		// fix for empty description
		if(data.sheets.list[data.sheets.lastSelected].title != null 
			&& data.sheets.list[data.sheets.lastSelected].description == null) {
			
			el.find("#paragraph_page_description")
			.empty()
			.show();
			
		}
		
	};
	
	function j(t) {
		
        var s = false,
            r;
        t = parseInt(survey.controls.startIndex);
        s = t;
        _el.find("ul.list-controls li.control").each(function (i, el) {
        	r = $(this).find(".label-control-number");
            r.each(function () {
                //$(this).text((s < 10) ? "0" + s : s);
                $(this).html(s + ".&nbsp;");
            });
            if (r.length > 0 && s !== false) {
                s++;
            }
        });
    };
	
	function getSheetControls(el, config, data, sheetId, index, callback) {
		
		getControls({
			guidTypeId : config.guidTypeId,
			guid : (config.guid != undefined ? config.guid : ""),
			modeId : config.modeId,
			lastSelected : data.sheets.lastSelected,
			sheetId : sheetId,
			index : index,
			respondent : "", // params.respondent,
			success : function(controls) {
			
				el.find("ul.list-controls").empty();
				
				if(controls.list.length != 0) {
					
					// clear previous validateElements
					validateElements.elements = [];
					
					var controlCount = 0;
					for (var i = 0; i < controls.list.length; i++) {
						if (controls.list[i].parentId == sheetId) {
							
							var c = controls.list[i];
							

							el.find("ul.list-controls").append("<li class=\"theme-question ui-question-a\" data-theme=\"a\" data-form=\"ui-question-a\"/>");
							
							var v;
							v = el.find("ul.list-controls > li:last");
							v.addClass("control");
							
							
							v.control({
								controlId : c.controlId,
								controlTypeId : c.controlTypeId,
								controlIndex : i,
								controlCount : controlCount,
								control : c,
								complete : function(count) {
									controlCount += count;
								}
							});
							
							v.attr({ "controlid" : c.controlId, "controlindex" : i });
							
							
						}
					}
					
					if(data.useQuestionNumbering) {
						j();
					}
					
					if(validateElements.elements.length != 0) {
						// declare validator if needed
						defaultValidator = new validator({
							elements : validateElements.elements
						});
					} else {
						defaultValidator = null;
					}
					
				}
				
				
				
				
				
				
				// previous
				if(data.enablePrevious && data.sheets.lastSelected != 0 && data.sheets.lastSelected != ((data.sheets.list.length - 1))) {
					el.find(".container-previous").show();
				} else if (data.enablePrevious && data.sheets.lastSelected == ((data.sheets.list.length - 1)) && data.sheets.lastSelected != 0) {
					el.find(".container-previous").show();
				} else {
					el.find(".container-previous").hide();
				}
				
				
				if (data.sheets.lastSelected == ((data.sheets.list.length - 1))) {
					
					el.find(".container-next").hide();
					el.find(".container-finish").show();
					
					// set key 13 on submit button
					$(document)
						.unbind('keydown')
						.keydown(function (event) {
						
							if (event.which == 13) {
								el.find(".button-finish-survey").trigger('click');
								event.preventDefault();
							}
							
					});
					
					
				} else {
					
					el.find(".container-next").show();
					
					// set key 13 on submit button
					$(document)
						.unbind('keydown')
						.keydown(function(event) {
						
						if (event.which == 13) {
							el.find(".button-next-page").trigger('click');
							event.preventDefault();
						
						}
							
					});
					
					el.find(".container-finish").hide();
				}
				
				
				updatePageNumber(el, config, data); // 1 of ...
				
				
				
				if(callback != undefined 
						&& typeof callback == 'function') {
					callback();
				}
				
				
			},
			error: function(error) {
				
				
				
				el.find("ul.list-controls").empty();
				
				defaultValidator = null;
				
				
				// alert("ERROR CONTROLS");
				
				
				// previous
				if(data.enablePrevious && data.sheets.lastSelected != 0 && data.sheets.lastSelected != ((data.sheets.list.length - 1))) {
					el.find(".container-previous").show();
				} else if (data.enablePrevious && data.sheets.lastSelected == ((data.sheets.list.length - 1)) && data.sheets.lastSelected != 0) {
					el.find(".container-previous").show();
				} else {
					el.find(".container-previous").hide();
				}
				
				
				if (data.sheets.lastSelected == ((data.sheets.list.length - 1))) {
					
					el.find(".container-next").hide();
					el.find(".container-finish").show();
					
					// set key 13 on submit button
					$(document)
						.unbind('keydown')
						.keydown(function (event) {
						
							if (event.which == 13) {
								el.find(".button-finish-survey").trigger('click');
								event.preventDefault();
							}
							
					});
					
					
				} else {
					
					el.find(".container-next").show();
					
					// set key 13 on submit button
					$(document)
						.unbind('keydown')
						.keydown(function(event) {
						
						if (event.which == 13) {
							el.find(".button-next-page").trigger('click');
							event.preventDefault();
						
						}
							
					});
					
					el.find(".container-finish").hide();
				}
				
				
				updatePageNumber(el, config, data); // 1 of ...
				
				
				if(callback != undefined 
						&& typeof callback == 'function') {
					callback();
				}
				
				
				
			}
		});
		
	};
	
	function bind(el, config, data) {
		
		if(data.sheets.list.length > 0) {
			
			
			el.find(".theme-page").empty();
			
			$("<div>" +
				"<h2 class=\"theme-page-heading ui-page-heading-a header-page-title\" data-theme=\"a\" data-form=\"ui-page-heading-a\" style=\"display: none\"><span id=\"label_page_number\"></span><span id=\"label_page_title\">Page Title</span></h2>" +
				"<div class=\"theme-page-description ui-page-description-a\" data-theme=\"a\" data-form=\"ui-page-description-a\" id=\"paragraph_page_description\" style=\"display: none\">Page Description</div>" +
				"<div>" +
					"<ul class=\"list-controls\"></ul>" +
				"</div>" +
				"<div class=\"theme-page-actions ui-page-actions-a\" data-theme=\"a\" data-form=\"ui-page-actions-a\">" +
					"<div class=\"container-previous\" style=\"display: none;\">" +
						"<a href=\"#\" title=\"" + data.messages.back + "\" class=\"theme-button ui-button-a button-previous-page\" data-theme=\"a\" data-form=\"ui-button-a\"><span>" + data.messages.back + "</span></a>" +
					"</div>" +
					"<div class=\"container-next\" style=\"display: none\">" +
						"<a href=\"#\" title=\"" + data.messages.next + "\" class=\"theme-button ui-button-a button-next-page\" data-theme=\"a\" data-form=\"ui-button-a\"><span>" + data.messages.next + "</span></a>" +
					"</div>" +
					"<div class=\"container-finish\" style=\"display: none\">" +
						"<a href=\"#\" title=\"" + data.messages.finish + "\" class=\"theme-button ui-button-a button-finish-survey\" data-theme=\"a\" data-form=\"ui-button-a\"><span>" + data.messages.finish + "</span></a>" +
					"</div>" +
					"<div class=\"container-paging\">Page <b class=\"label-start-page-number\">1</b> of <b class=\"label-end-page-number\">...</b></div>" +
				"</div>" +
			"</div>").appendTo(el.find(".theme-page"));
			
			
			// prev
			el.find(".button-previous-page").click(function(event) {
				
				el.find(".button-previous-page").focus();

				if(data.sheets.lastSelected > 0) {
					var currentSelected = data.sheets.lastSelected;
					data.sheets.lastSelected--;
					
					if(data.guidTypeId == 1 && data.modeId == 1) {
						var sheetId = data.sheets.list[data.sheets.lastSelected].sheetId;
						var lastSelected = data.sheets.lastSelected;
						var obj = {
							sheetIndex : currentSelected,
							sheetId : data.sheets.list[currentSelected].sheetId,
							targetIndex : lastSelected,
							targetId : sheetId
						};
						
						createResponse({
							guidTypeId : data.guidTypeId,
							guid : data.guid,
							modeId : data.modeId,
							responseTypeId : responseType.prevSheet,
							async : true,
							responseData : obj,
							success : function() {
								
								// Get Controls
								getSheetControls(el, config, data, data.sheets.list[data.sheets.lastSelected].sheetId, data.sheets.lastSelected, function() {
									// anchor top
									location.href = "#top";
									
									// inspector
									initInspector();
									
								});
								
							}
						});
						
					} else {
						
						// Get Controls
						getSheetControls(el, config, data, data.sheets.list[data.sheets.lastSelected].sheetId, data.sheets.lastSelected, function() {
							// anchor top
							location.href = "#top";
							
							// inspector
							initInspector();
							
						});
						
					}
					
				}
				
				
				event.preventDefault();
				
			});
			
			// next
			el.find(".button-next-page").click(function(event) {
				
				el.find(".button-next-page").focus();
				
				var nextPage = function() {
					
					var currentSelected = data.sheets.lastSelected;
					data.sheets.lastSelected++;
					
					if(data.sheets.lastSelected <= ((data.sheets.list.length - 1))) {
						
						if(data.guidTypeId == 1 && data.modeId == 1) {
							var sheetId = data.sheets.list[data.sheets.lastSelected].sheetId;
							var lastSelected = data.sheets.lastSelected;
							
							var obj = {
								sheetIndex : currentSelected,
								sheetId : data.sheets.list[currentSelected].sheetId,
								targetIndex : lastSelected,
								targetId : sheetId
							};
							
							createResponse({
								guidTypeId : data.guidTypeId,
								guid : data.guid,
								modeId : data.modeId,
								responseTypeId : responseType.nextSheet,
								async : true,
								responseData : obj,
								success : function() {
									
									
									// get controls
									// getControls(options.survey.sheets.list[options.survey.sheets.lastSelected].sheetId, options.survey.sheets.lastSelected, function() {
									getSheetControls(el, config, data, data.sheets.list[data.sheets.lastSelected].sheetId, data.sheets.lastSelected, function() {
										// anchor top
										location.href = "#top";
										
										// inspector
										initInspector();
										
									});
									
									
								}
							});
							
						} else {
							
							
							// get controls
							// getControls(options.survey.sheets.list[options.survey.sheets.lastSelected].sheetId, options.survey.sheets.lastSelected, function() {
							getSheetControls(el, config, data, data.sheets.list[data.sheets.lastSelected].sheetId, data.sheets.lastSelected, function() {
								// anchor top
								location.href = "#top";
								
								// inspector
								initInspector();
								
							});
							
							
						}
						
					}
					
					
					
				};
				
				if(defaultValidator) {
					
					defaultValidator.validate({
						accept : function() {
							nextPage();	
						},
						error: function() {
							//
						}
					});
				} else {
					nextPage();
				}
				
			
				
				
				event.preventDefault();
				
			});
			
			
			
			// finish
			el.find(".button-finish-survey").click(function(event) {
				
				el.find(".button-finish-survey").focus(); // fix
				
				var finishSurvey = function() {
					
					if(data.guidTypeId == 1 && data.modeId == 1) {
						
						var sheetId = data.sheets.list[data.sheets.lastSelected].sheetId;
						var lastSelected = data.sheets.lastSelected;
						var obj = {
							sheetIndex : lastSelected,
							sheetId : sheetId
						};
						
						createResponse({
							guidTypeId : data.guidTypeId,
							guid : data.guid,
							modeId : data.modeId,
							responseTypeId : responseType.finishOpinion,
							async : true,
							responseData : obj,
							success : function() {
								
								if(data.customFinishBehaviour == 2) {
									// redirect url
									location.href = data.redirectUrl;
								}
								
								if(data.returnUrl != undefined) {
									// do redirect
									location.href = data.returnUrl;
								}
								
							}
						});
						
					}
					
					if(data.customFinishBehaviour != 0) {
						
						if(data.customFinishBehaviour == 1) {
							
							// finish message
							el.find(".theme-page").empty();
							$("<div>" +
								"<div class=\"theme-page-description ui-page-description-a\" data-theme=\"a\">" + (data.messages.finishMessage != null ? $.replaceURLWithHTMLLinks(data.messages.finishMessage.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>"), true) : "") + "</div>" +
							"</div>").appendTo(el.find(".theme-page"));
							
						}
						
					} else {
					
					
						// survey heading
						el.find(".theme-survey-heading").text(messages.thanks);
						
						
						el.find(".theme-page").empty();
						$("<div>" +
							"<div>" +
								"<h2 class=\"theme-page-heading ui-page-heading-a\" data-theme=\"a\" data-form=\"ui-page-heading-a\">Now create your own-it's free, quick &amp; easy!</h2>" +
								"<div class=\"theme-page-description ui-page-description-a\" data-theme=\"a\" data-form=\"ui-page-description-a\">" +
									"<ul class=\"ls\">" +
										"<li>Create free surveys in minutes, using drag and drop survey editor.</li>" +
										"<li>Share a link to your survey through email, Facebook, Twitter or your website.</li>" +
										"<li>View reports for your data live as it's being collected.</li>" +
									"</ul>" +
								"</div>" +
							"</div>" +
							"<div class=\"theme-page-actions ui-page-actions-a\" data-theme=\"a\" data-form=\"ui-page-actions-a\"><a data-form=\"ui-button-a\" data-theme=\"a\" class=\"theme-button ui-button-a\" title=\"Sign Up FREE\" href=\"http://www.inqwise.com/en-us/register?ref=collector\" target=\"_blank\"><span>Sign Up FREE</span></a> It's quick and easy to get started.</div>" +
						"</div>").appendTo(el.find(".theme-page"));
					
					}
					
			
					$(document).unbind('keydown');
					
					// anchor top
					location.href = "#top";
					
					
					// inspector
					initInspector();
					
					
				};
				
				if(defaultValidator) {
					defaultValidator.validate({
						accept : function() {
							finishSurvey();
						},
						error: function() {
							//
						}
					});
				} else {
					finishSurvey();
				}
				
				
				
				
				
				
				event.preventDefault();
				
			});
			
			getSheetControls(el, config, data, data.sheets.list[data.sheets.lastSelected].sheetId, data.sheets.lastSelected, function() {
				
				// inspector
				initInspector();
				
			});
			
			
		}
		
	};
	
	function bindPaging(el, config, data) {
		
		if(data.isEnableStartMessage 
				&& !data.isSessionStart) {
			
			el.find(".theme-page").empty();
			var s = $("<div>" +
					"<div class=\"theme-page-description ui-page-description-a\" data-theme=\"a\" data-form=\"ui-page-description-a\">" + $.replaceURLWithHTMLLinks(data.messages.startMessage.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>"), true) + "</div>" +
					"<div class=\"theme-page-actions ui-page-actions-a\" data-theme=\"a\" data-form=\"ui-page-actions-a\">" +
						"<a data-form=\"ui-button-a\" data-theme=\"a\" class=\"theme-button ui-button-a button-start-survey\" title=\"" + data.messages.start + "\" href=\"#\"><span>" + data.messages.start + "</span></a>" +
					"</div>" +
			"</div>").appendTo(el.find(".theme-page"));
			
			s.find(".button-start-survey").click(function(event) {
				
				$(this).focus();
				
				// anchor top
				location.href = "#top";
				
				bind(el, config, data);
				
				
				
				
				
				event.preventDefault();
				
			});
			
			
			$(document)
			.unbind('keydown')
			.keydown(function (event) {
				
				if (event.which == 13) {
					s.find(".button-start-survey").trigger('click');
					event.preventDefault();
				}
						
						
			});
			
				
			
		} else {
			
			bind(el, config, data);
			
		}
		
		
		
	};
	
	function retrieve(el, config, data) {
		
		
		var hackSession = ""; // = $.getTimestamp();
		
		// html
		var s = $("<div class=\"theme-wrapper ui-wrapper-a\" data-theme=\"a\" data-form=\"ui-wrapper-a\">" +
				"<div class=\"theme-header ui-header-a\" data-theme=\"a\" data-form=\"ui-header-a\">" +
					"<div class=\"theme-logo ui-logo-a\" data-theme=\"a\" data-form=\"ui-logo-a\" id=\"logo\" style=\"display: none;\"></div>" +
				"</div>" +
				"<div class=\"theme-content ui-content-a\" data-theme=\"a\" data-form=\"ui-content-a\">" +
					"<div>" +
						"<h1 class=\"theme-survey-heading ui-survey-heading-a\" data-theme=\"a\" data-form=\"ui-survey-heading-a\">Survey Heading</h1>" +
						"<div class=\"theme-page ui-page-a\" data-theme=\"a\" data-form=\"ui-page-a\"></div>" +
					"</div>" +
				"</div>" +
				"<div class=\"theme-footer ui-footer-a\" data-theme=\"a\" data-form=\"ui-footer-a\">Powered by <a title=\"Online Survey Tool\" href=\"http://www.inqwise.com\" target=\"_blank\">Inqwise</a></div>" +
			"</div>");
		
		s.appendTo(el);
		
		
		
		if(data.isRtl) {
			el.addClass("oposite-direction");
		}
		
		if(data.noStyle) { // != undefined) {
			// TODO:
		} else {
		
			// style
			var style = $("<style type=\"text/css\" />").appendTo(el);
			if (style[0].styleSheet !== undefined && style[0].styleSheet.cssText !== undefined) { 
			    style[0].styleSheet.cssText = data.styleBlock; //IE
			} else {
			    style.text(data.styleBlock);
			}
			
		}
		
		if(config.embed != undefined) {
			if(!config.embed) {
				document.title = data.name;
			}
		}
		
		// google analytics
		_gaq.push(["_set", "title", data.name]);
		_gaq.push(['_trackPageview']);
		
		// logo
		if(data.logoUrl) {
			s.find('#logo')
				.show()
				.append("<img src=\"" + data.logoUrl + "\" alt=\"" + data.name + "\"/>");
		}
		
		if(!data.isClosed) {
			
			if(data.isPasswordRequired) {
				
				s.find(".theme-survey-heading").text(data.name);
				
				var s = $("<div>" +
						"<div class=\"theme-page-description ui-page-description-a\" data-theme=\"a\" data-form=\"ui-page-description-a\">" +
							"<div>This survey requires a password before you can continue. <br/>If you forget or lose the password, or you don't know the password, contact the author of this survey for further assistance.</div>" +
							"<div class=\"params\">" +
								"<div class=\"param-name\"><label>* Password:</label></div>" +
								"<div class=\"param-value\">" +
									"<div><input type=\"password\" id=\"text_password\" name=\"text-password\" class=\"text-field\" maxlength=\"12\" autocomplete=\"off\" /></div>" +
									"<div><label id=\"status_text_password\"></label></div>" +
								"</div>" +
							"</div>" +
							"<div style=\"clear: both;\">" +
								"<ul class=\"error-message\">" +
									"<li style=\"display: none;\" class=\"status\" id=\"error_message_invalid_password\">The password you entered is incorrect.</li>" +
								"</ul>" +
							"</div>" +
						"</div>" +
						"<div class=\"theme-page-actions ui-page-actions-a\" data-theme=\"a\" data-form=\"ui-page-actions-a\">" +
							"<a data-form=\"ui-button-a\" data-theme=\"a\" class=\"theme-button ui-button-a\" title=\"Continue\" href=\"#\" id=\"button_continue\"><span>Continue</span></a>" +
						"</div>" +
				"</div>").appendTo(el.find(".theme-page"));
				
				
				s.find("#text_password").focus();
				
				var internalValidator = new validator({
					elements : [
						{
							name : "text-password",
							status : s.find("#status_text_password"),
							rules : [
								{ method : "required", message : "This field is required." },
								{ method : "rangelength", pattern : [6,12] }
							]
						}
					],
					submitElement : s.find("#button_continue"),
					messages : null,
					accept : function () {

						createResponse({
							guidTypeId : _data.guidTypeId,
							guid : _data.guid,
							modeId : _data.modeId,
							responseTypeId : responseType.authorize,
							async : false,
							responseData : null,
							password : $.removeHTMLTags(s.find("#text_password").val()).replace(/\r/g, ""),
							success : function() {
							
								$(document).unbind('keydown');
								
								if(data.sheets.list.length != 0) {
									bindPaging(el, config, data);
								}
							
							},
							error : function(error) {
								
								if(error.error == "InvalidPassword") {
									s.find("#error_message_invalid_password").show();	
								}
							}
						});
						
					}
					
				});

				// default button
				$(document).bind('keydown', function(e) {
					var code;
			        if (!e) var e = window.event;
			        if (e.keyCode) code = e.keyCode;
			        else if (e.which) code = e.which;

			     	// enter
			        if(code == 13) {
			        	if(!s.find("#button_continue").is(":focus")) {
			        		internalValidator.validate();
						}
			        }
			        
				});
				
				
			} else if (data.answersAreFinished) {
				
				
				if(data.closedUrl != undefined) {
					location.href = data.closedUrl;
				} else {
					
					s.find(".theme-survey-heading").text(data.name); // data.name
					
					var s = $("<div>" +
							"<div class=\"theme-page-description ui-page-description-a\" data-theme=\"a\" data-form=\"ui-page-description-a\">" + messages.completed + "</div>" +
							"<div class=\"theme-page-actions ui-page-actions-a\" data-theme=\"a\" data-form=\"ui-page-actions-a\">" +
								"<a data-form=\"ui-button-a\" data-theme=\"a\" class=\"theme-button ui-button-a\" title=\"Sign Up FREE\" href=\"http://www.inqwise.com/en-us/register?ref=collector\" target=\"_blank\"><span>Sign Up FREE</span></a> It's quick and easy to get started." +
							"</div>" +
					"</div>").appendTo(el.find(".theme-page"));
					
				}
				
			} else {
			
				s.find(".theme-survey-heading").text(data.name);
				
				if(data.sheets.list.length != 0) {
					bindPaging(el, config, data);
				}
				
			}
			
			/*
			if (window.console) {
	    		window.console.log("This survey is open");
	    	}
			*/
			
		} else {
			
			
			if(data.closedUrl != undefined) {
				location.href = data.closedUrl;
			} else {
			
				
				if(data.closeMessage != undefined){
					
					// survey heading
					s.find(".theme-survey-heading").text(data.name);
					
					$("<div>" +
						"<div class=\"theme-page-description ui-page-description-a\" data-theme=\"a\" data-form=\"ui-page-description-a\">" + $.replaceURLWithHTMLLinks(data.closeMessage.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>"), true) + "</div>" +
						"<div class=\"theme-page-actions ui-page-actions-a\" data-theme=\"a\" data-form=\"ui-page-actions-a\">" +
							"<a data-form=\"ui-button-a\" data-theme=\"a\" class=\"theme-button ui-button-a\" title=\"Sign Up FREE\" href=\"http://www.inqwise.com/en-us/register?ref=collector\" target=\"_blank\"><span>Sign Up FREE</span></a> It's quick and easy to get started." +
						"</div>" +
					"</div>").appendTo(el.find(".theme-page"));
					
				}
				
			
			}
			
			/*
			if (window.console) {
	    		window.console.log("This survey is closed");
	    	}
	    	*/
			
		}
		
		
		
		// inspector
		initInspector();
		
		
	};
	
	var enableInspector = false;
	function initInspector() {
		if(enableInspector) {
			if(parent.editor != undefined) {
				parent.editor.initInspector();
			}
		}
	};
	
	function render(el, config, data) {
		
		if(config.guidTypeId == 1) {
			
			if(config.modeId == 1) {
				
				retrieve(el, config, data);
				
			} else if (config.modeId == 0) {
				
				if(!config.noStyle) {
					// collector preview
					$('#notification_box').show();
				}
				
				retrieve(el, config, data);
			}
			
		} else {
			
			
			// inspector
			if(config.noStyle) {
				
				/*
				if (!window.location.href.match(/localhost/gi)) {
				    document.domain = config.domain; // inqwise.com
				}
				*/
				
				/*el.css("height", "auto");*/
				
				enableInspector = true;
				
			}
			
			// draft
			if(!config.noStyle) {
				$('#notification_box').show();
			}
			
			retrieve(el, config, data);
			
			/*
			if (window.console) {
	    		window.console.log("draft");
	    	}
			*/
			
			
		}
	};
	
	function init() {
		
		
		// extends
		jQuery.extend({
			num : function(v) {
				var n = parseInt(v);
				return n == null || isNaN(n) ? 0 : n;
			},
			toUniqArr : function(arr) {
				var r = [], d = {};
				for ( var i = 0, l = arr.length; i < l; i++) {
					var id = arr[i];
					if (!done[id]) {
						done[id] = true;
						r.push(arr[i]);
					}
				}
				return r;
			},
			isArray : function(v) {
				return typeof (v) == 'object' && v != null
						&& typeof (v.length) == 'number';
			},
			isNullOrEmpty : function(o) {
				if (o == null && o == '')
					return true;
				return false
			},
			isNull : function(o) {
				if (o == null && o == undefined) {
					return true;
				}
				return false
			},
			addCommas : function(num) {
				num += '';
				x = num.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? '.' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1))
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				return x1 + x2;
			},
			getUrlParam : function(name) {
				name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
				var res = (new RegExp("[\\?&]" + name + "=([^&#]*)"))
						.exec(window.location.href);
				return res ? decodeURIComponent(res[1]) : '';
			},
			removeHTMLTags : function(s){
				s = s.replace(/&(lt|gt);/g, function (strMatch, p1){
				 	return (p1 == "lt")? "<" : ">";
				});
				return s.replace(/<\/?[^>]+(>|$)/g, "");
			},
			getTimestamp : Date.now || function() {
			  	return + (new Date).getTime();
			},
			pad : function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			},
			replaceURLWithHTMLLinks : function(text, isBlank) {
			    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			    return text.replace(exp,"<a href=\"$1\" " + (isBlank != undefined ? "target=\"_blank\"" : "") + ">$1</a>"); 
			}
		});
		
		/*
		(function($) {
			$.each( {
				focus : 'focusin',
				blur : 'focusout'
			}, function(original, fix) {
				$.event.special[fix] = {
					setup : function() {
						if ($.browser.msie)
							return false;
						this.addEventListener(original, $.event.special[fix].handler,
								true);
					},
					teardown : function() {
						if ($.browser.msie)
							return false;
						this.removeEventListener(original,
								$.event.special[fix].handler, true);
					},
					handler : function(e) {
						arguments[0] = $.event.fix(e);
						arguments[0].type = fix;
						return $.event.handle.apply(this, arguments);
					}
				};
			});
		})(jQuery);
		*/
		
		;(function($) {
			validator = function(givenOptions) {
					var successList = [];
					var disallowedList = [];
					var accepted = false;
					
					var options = $.extend({
						elements : [],
						errorList : null,
						errorTemplate : null,
						submitElement : null,
						accept : null,
						error : null
					}, givenOptions);
					
					var messages = {
						required: 'This field is required.',
						remote: 'Please fix this field.',
						email: 'Please enter a valid email address.',
						url: 'Please enter a valid URL.',
						date: 'Please enter a valid date.',
						dateISO: 'Please enter a valid date (ISO).',
						number: 'Please enter a valid number.',
						digits: 'Please enter only digits.',
						creditcard: 'Please enter a valid credit card number.',
						equalTo: 'Please enter the same value again.',
						maxlength: 'Please enter no more than {0} characters.',
						minlength: 'Please enter at least {0} characters.',
						rangelength: 'Please enter a value between {0} and {1} characters long.',
						range: 'Please enter a value between {0} and {1}.',
						max: 'Please enter a value less than or equal to {0}.',
						min: 'Please enter a value greater than or equal to {0}.',
						equal: 'The value is not equal {0}.'
					};
		
					var methods = function(method, el, value, pattern, parent) {
						switch (method) {
							case 'required' : 
								switch( el[0].nodeName.toLowerCase() ) {
									case 'select':
										// could be an array for select-multiple or a string, both are fine this way
										return (value != "0") && value.length > 0;
									case 'input':
										if ( checkable(el) )
											return getLength(value, el) > 0;
									default:
										return $.trim(value).length > 0;
								}
							case 'digits':
								return /^\d+$/.test(value);
							case 'number' :
								return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
							case 'email':
								return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
							case 'emailISO':
								return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/i.test(value);
							case 'url' :
								return /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/i.test(value);
								//return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
							case 'minlength' :
								var p = pattern ? pattern : 0;
								if(getLength($.trim(value), el) >= p) {
									return true
								}
								return false;
							case 'maxlength' : 
								var p = pattern ? pattern : 0;
								if(getLength($.trim(value), el) <= p)
									return true
								return false;
							case 'min' : 
								if(parseFloat(value) >= parseFloat(pattern))
									return true;
								return false;
							case 'max' : 
								if(parseFloat(value) <= parseFloat(pattern)) 
									return true;
								return false;
							case 'rangelength' : 
								
								var length = getLength($.trim(value), el);
								var min = pattern[0] ? pattern[0] : 0;
								var max = pattern[1] ? pattern[1] : 0;
								if(( length >= min && length <= max ))
									return true;
								return false;
								
							case 'range' : 
								
								var min = pattern[0] ? pattern[0] : 0;
								var max = pattern[1] ? pattern[1] : 0;
								
								if(value >= min && value <= max)
									return true;
								return false;
								
							case 'date' :
								return !/Invalid|NaN/.test(new Date(value));
							case 'dateISO' :
								return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
							case 'creditcard' :
								
								// accept only digits and dashes
								if (/[^0-9-]+/.test(value))
									return false;
								var nCheck = 0,
									nDigit = 0,
									bEven = false;
		
								value = value.replace(/\D/g, "");
		
								for (var n = value.length - 1; n >= 0; n--) {
									var cDigit = value.charAt(n);
									var nDigit = parseInt(cDigit, 10);
									if (bEven) {
										if ((nDigit *= 2) > 9)
											nDigit -= 9;
									}
									nCheck += nDigit;
									bEven = !bEven;
								}
		
								return (nCheck % 10) == 0;
							case 'equalTo' :
								if(parent) {
									// equal to element
									var target = parent;
									
									/*
			                   		 q.unbind('change')
			                   		 .bind('change', function () {
			                   		 */
									
									target
										.unbind('blur')
										.bind('blur', function() {
											// target blur
											validate(el);
										});
									
									if($.trim((value != null ? (value.replace(/\r/g, "")) : value)).length != 0) {
										if(value == target.val())
											return true;
									}
								} else {
									if(pattern != undefined) {
										if(pattern instanceof RegExp) {
											if($.trim((value != null ? (value.replace(/\r/g, "")) : value)).length != 0) {
												var exp = new RegExp(pattern);
												if(exp.test(value)) 
													return true;
											}
										} else if (typeof pattern == 'function') {
											if(pattern())
												return true;
										}
									}
								}
								return false;
								
							case 'notEqualTo' :
								if(parent) {
									// equal to element
									var target = parent;
									
									/*
			                   		 q.unbind('change')
			                   		 .bind('change', function () {
			                   		 */
									
									target
										.unbind('blur')
										.bind('blur', function() {
											// target blur
											validate(el);
										});
									
									if($.trim((value != null ? (value.replace(/\r/g, "")) : value)).length != 0) {
										if(value != target.val())
											return true;
									}
								} else {
									if(pattern != undefined) {
										if(pattern instanceof RegExp) {
											if($.trim((value != null ? (value.replace(/\r/g, "")) : value)).length != 0) {
												var exp = new RegExp(pattern);
												if(!exp.test(value)) 
													return true;
											}
										} else if(typeof pattern == 'function') {
											if(!pattern())
												return true;
										}
									}
								}
								return false;
								
							default:
								// custom methods
								return (value == pattern);
						}
					};
					
					var isExist = function (name) {
						if (successList.length > 0) {
							for (var i = 0; i < successList.length; i++) {
								if (successList[i] == name) {
									return true;
								}
							}
						}
						return false;
					};
		
					var removeElement = function (name) {
						if (successList.length > 0) {
							for (var i = 0; i < successList.length; i++) {
								if (successList[i] == name) {
									successList.remove(i);
									break;
								}
							}
						}
					};
					
					var checkable = function( element ) {
						return /radio|checkbox/i.test(element[0].type);
					};
					
					var clean = function( selector ) {
						return $( selector )[0];
					};
					
					var getLength = function(value, element) {
						switch( element[0].nodeName.toLowerCase() ) {
						case 'select':
							return $("option:selected", element).length;
						case 'input':
							if( checkable( element) )
								return findByName(element[0].name).filter(':checked').length;
							
						}
						return value.length;
					};
		
					
					
					var lastActive = null;
					var lastElement = null;
					var elements = options.elements;
		
					var groups = [];
					
					var getGroup = function(groupName) {
						for(var i = 0; i < groups.length; i++) {
							if(groups[i].groupName == groupName) {
								return groups[i];
							}
						}
						return null;
					};
					
					var getElement = function(el) {
						for(var i = 0; i < elements.length; i++) {
							if(elements[i].element) {
								if(elements[i].element.attr('name') == el.attr('name')) {
									return elements[i];
								}
							}
						}
						return null;
					};
		
					var findByName = function(name) {
						// select elements by name
						return $(document.getElementsByName(name)).map(function(index, element) {
							return element.name == name && element || null;
						});
					};
					
					// start here
					if (elements.length > 0) {
						
						for(var i = 0; i < elements.length; i++) {
							
							// handling names
							if(elements[i].name) {
								
								var name = elements[i].name;
								var el = findByName(name);
								
								elements[i].element = $(el);
								elements[i]
									.element
									.removeClass('invalid valid predefined')
									.validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", function(event) {
										delegate($(this), event.type);
									})
									.validateDelegate(":radio, :checkbox, select, option", "click change", function(event) {				
										delegate($(this), event.type); // .replace(/^validate/, "")
									});
								
								// errors
								var errorLabel = null;
								if(options.errorTemplate) {
									errorLabel = options.errorTemplate()
										.addClass('status validator-' + name)
										.hide();
								} else {
									errorLabel = $("<label class=\"status validator-" + name + "\" style=\"display: none\"></label>");
								}
								
								// errorList
								if(options.errorList) {
									if(options.errorList.placeholder) {
										if(!isExist(name)) {
											if(options.errorList.errorTemplate) {
												options.errorList.errorTemplate()
													.addClass('status validator-' + name)
													.hide()
													.appendTo(options.errorList.placeholder);
											} else {
												errorLabel
													.appendTo(options.errorList.placeholder);
											}
										}
									}
								} else {
									if(!isExist(name)) {
										if(elements[i].status) {
											elements[i].status
												.addClass('status validator-' + name)
												.hide();
										} else {
											if(elements[i].showError != undefined) {
												if(elements[i].showError) {
													elements[i].element.after(errorLabel);
												}
											} else {
												elements[i].element.after(errorLabel);
											}
										}
									}
								}
								
								//
								successList.push(name);
								  
							}
							
							// handling groups
							if(elements[i].group) {
								
								var groupName = null;
								var lastGroupElement = null;
								
								elements[i].group = findByName(elements[i].group);
								elements[i].group.each(function(y, el) {
									
									// find last group element
									if(y == (elements[i].group.length - 1)) {
										lastGroupElement = $(el);
										groupName = lastGroupElement.attr('name');
									}
									
									// helper for get element from some group by groupName
									// check performace
									groups.push({ 
										groupName : groupName, 
										group : elements[i].group, 
										rules : elements[i].rules, 
										error : elements[i].error, 
										success : elements[i].success 
									});
									
									// for each element of the group --> check all group
									$(el)
										.removeClass('invalid valid predefined')
										.validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", function(event) {
											var group = getGroup($(this).attr('name'));
											delegate($(this), event.type, group);
										})
										.validateDelegate(":radio, :checkbox, select, option", "click change", function(event) {				
											var group = getGroup($(this).attr('name'));
											delegate($(this), event.type, group);
										});
								});
								
								// push to success list
								successList.push(groupName);
								
								
								// errors
								var errorLabel = null;
								if(options.errorTemplate) {
									errorLabel = options.errorTemplate()
										.addClass('status validator-' + groupName)
										.hide();
								} else {
									errorLabel = $("<label class=\"status validator-" + groupName + "\" style=\"display: none\"></label>");
								}
								
								// errorList
								if(options.errorList) {
									if(options.errorList.placeholder) {
										if(options.errorList.errorTemplate) {
											options.errorList.errorTemplate()
												.addClass('status validator-' + groupName)
												.hide()
												.appendTo(options.errorList.placeholder);
										} else {
											errorLabel
												.appendTo(options.errorList.placeholder);
										}
									}
								} else {
									if(elements[i].status) {
										elements[i].status
											.addClass('status validator-' + groupName)
											.hide();
									} else {
										if(elements[i].showError != undefined) {
											if(elements[i].showError) {
												lastGroupElement.after(errorLabel);
											}
										} else {
											lastGroupElement.after(errorLabel);
										}
									}
								}
							}
							
						}
					}
					
					var validateForm = function () {
		
						disallowedList = [];
						
						
						
						
						if (elements.length > 0) {
							for(var i = 0; i < elements.length; i++) {
							
								
								// check elements
								if(elements[i].element) {
								
									var t = elements[i];
									var v = true;
									var el = t.element;
									
									if(t.validate) {
										if(typeof t.validate == 'function') {
											v = t.validate();
										} else {
											v = t.validate();
										}
									}
									
									if(v) {
										el.addClass("predefined");
									}
									
									validate(el);
									
								}
								
								// check groups
								if(elements[i].group) {
								
									elements[i].group.addClass("predefined");
									
									validateGroup(elements[i])
									
								}
								
							}
						}
						
					};
					
					// validate group
					var validateGroup = function(group) {
						
						var f = group;
						if(f) {
						
							var group = f.group;
							var rules = f.rules;
							
							
							
							var isCheckable = false;
							var groupName = null;
							
							var k = 0;
							var r = 0;
							
							
							
							
							var check = function(el) {
								
								var u = 0;
								for(var i = 0; i < rules.length; i++) {
									if(methods(rules[i].method, el, el.val(), rules[i].pattern, rules[i].element)) {
										// valid
										u++;
									} else {
										break;
									}
								}
								
								if(isCheckable) {
									if(u != rules.length) {
										
										k++;
										r = u;
									}
									
								} else {
									// others
									if(u != rules.length) {
										
										//el.css({'background':'red'});
										
										el
											.addClass('invalid')
											.removeClass('valid');
										
										k++;
										
										r = u;
										
									} else {
										
										//el.css({'background':'white'});
										
										el
											.removeClass('invalid')
											.addClass('valid');
										
									}
								
								}
								
							};
						
							if(rules) {
		
								group.each(function(y, el) {
									if(y == (group.length - 1)) {
										groupName = $(el).attr('name');
									}
									
									if(checkable($(el))) {
										if(isCheckable != true)
											isCheckable = true;
									}
									
									check($(el));
									
									
									
								});
								
								var errorLabel = $('.validator-' + groupName);
								
								if(isCheckable) {
									// radio, checkbox
									if(k == group.length) {
									
										// error
										if (isExist(groupName) != true) 
												successList.push(groupName);
											
										disallowedList.push(groupName);
										
										
										group
											.addClass('invalid')
											.removeClass('valid');
											
										
										// message
										var message = (rules[r].message ? rules[r].message : messages[rules[r].method]);
										if(rules[r].pattern) {
											var pattern = rules[r].pattern;
											if ( pattern.constructor != Array ) {
												pattern = [ pattern ];
											}
											$.each(pattern, function(i, n) {
												message = message.replace(new RegExp("\\{" + i + "\\}", "g"), n);
											});
										}
										
										
										// fix for showError
										if(!(f.showError != undefined && !f.showError)) {
											
												errorLabel
													.text(message)
													.show();
												
										}
										
										// error callback
										if(f.error) {
											if(typeof f.error == 'function')
												f.error(message);
										}
										
									} else {
									
										// succ
										if (isExist(groupName) == true)
												removeElement(groupName);
									
									
										group
											.removeClass('invalid')
											.addClass('valid');
									
										// success
										
										
										errorLabel
											.text('')
											.hide();
											
										
										if(f.success) {
											if(typeof f.success == 'function')
												f.success();
										}
										
										
									}
									
								} else {
								
									// text, textarea, select	
									if(k != 0) {
									
										if (isExist(groupName) != true) 
												successList.push(groupName);
											
										disallowedList.push(groupName);
										
										// message
										var message = (rules[r].message ? rules[r].message : messages[rules[r].method]);
										if(rules[r].pattern) {
											var pattern = rules[r].pattern;
											if ( pattern.constructor != Array ) {
												pattern = [ pattern ];
											}
											$.each(pattern, function(i, n) {
												message = message.replace(new RegExp("\\{" + i + "\\}", "g"), n);
											});
										}
										
										// fix for showError
										if(!(f.showError != undefined && !f.showError)) {
											
											errorLabel
												.text(message)
												.show();
																						
										}
										
										// error callback
										if(f.error) {
											if(typeof f.error == 'function')
												f.error(message);
										}
												
									} else {
									
										if (isExist(groupName) == true)
												removeElement(groupName);
									
									
										// success
										
										errorLabel
											.text('')
											.hide();
												
										
										if(f.success) {
											if(typeof f.success == 'function')
												f.success();
										}
									}
								}
							}
						}
					};
					
					// validate element
					var validate = function(element) {
						
						var t = getElement(element);
						
						if(t) {
							
							var el = t.element;
							var name = el.attr('name');
							var rules = t.rules;
							var v = true;
							
							
							
							if(t.validate) {
								if(typeof t.validate == 'function') {
									v = t.validate();
								} else {
									v = t.validate();
								}
							} 
							
							var errorLabel = $('.validator-' + name);
							
							if(v) {
							
							
							
								
								// seek rules
								if(rules) {
								
									var u = 0;
									var G = function() {
										for(var y = 0; y < rules.length; y++) {
											if(methods(rules[y].method, el, el.val(), rules[y].pattern, rules[y].element)) {
												// hide error
												u++;
											} else {
												break;
											}
										}
									}
									G();
									
									if(u != rules.length) {
										
										// show error
										if (isExist(name) != true) 
											successList.push(name);
										
										disallowedList.push(name);	
										
										//el.css({'background':'red'});
										el
											.addClass('invalid')
											.removeClass('valid');
										
										
										
										
										
										var message = ( rules[u].message ? rules[u].message : messages[rules[u].method] );
										
										if(rules[u].pattern) {
											var pattern = rules[u].pattern;
											if ( pattern.constructor != Array )
												pattern = [ pattern ];
											
											$.each(pattern, function(i, n) {
												message = message.replace(new RegExp("\\{" + i + "\\}", "g"), n);
											});
										}
											
										// fix for show error
										if(!(t.showError != undefined 
											&& !t.showError)) {
																					
											errorLabel	
												.text(message)
												.show();
												
										}
										
										if(t.error) {
											if(typeof t.error == 'function')
												t.error(message);
										}
										
									} else {
										
										if (isExist(name) == true)
											removeElement(name);
											
										//el.css({'background':'white'});
										el
											.removeClass('invalid')
											.addClass('valid');
											
											
										errorLabel
											.text('')
											.hide();
											
											
										if(t.success) {
											if(typeof t.success == 'function')
												t.success();
										}
									}
								}
							
							} else {
							
								if (isExist(name) == true)
									removeElement(name);
								
								el
									.removeClass('invalid')
									.addClass('valid');
								
								
								errorLabel
									.text('')
									.hide();
								
											
							}
							
						}
					};
					
					// delegate events
					var delegate = function(element, eventType, group) {	
						
						if(eventType == "focusin") {
							if(lastActive != null && lastActive != element) {
								//lastActive.css({'background' : 'white'});
							}
							lastActive = element;
							
							if(element.hasClass('predefined')) {
								if(group) {
									validateGroup(group)
								} else {
									validate(element);
								}
							}
						}
						
						if(eventType == "focusout") {
							if(element.val().length != 0) {
								element.addClass("predefined");
							}
							
							if(element.hasClass('predefined')) {
								if(group) {
									validateGroup(group)
								} else {
									validate(element);
								}
							}
						}
						
						if(eventType == "keyup") {
							if(element.hasClass('predefined')) {
								if(group) {
									validateGroup(group)
								} else {
									validate(element);
								}
							}
						}
						
						// click on selects, radiobuttons and checkboxes
						if(eventType == "click" || eventType == "change") {
							if(element.hasClass('predefined')) {
								if(group) {
									validateGroup(group)
								} else {
									validate(element);
								}
							}
						}
					};
					
					// submit element event
					if (options.submitElement != undefined) {
						options.submitElement
						.unbind('click')
						.click(function (event) {
							checkAll();
							event.preventDefault();
						});
					}
					
					var checkAll = function(callback) {
					
						// validate
						validateForm();
						
						if (disallowedList.length != 0) {
							disallowedList.reverse();
							
							// set focus on the first invalid and not hidden element
							findByName(disallowedList[disallowedList.length - 1])
								.filter('.invalid:first')
								.filter(':visible')
								.focus();
								
							if(options.errorList) {
								if(options.errorList.placeholder) {
									if(!options.errorList.placeholder.is(':visible'))
										options.errorList.placeholder.show();
								}
							}
							
							if(options.error != undefined 
								&& typeof options.error == 'function')
								options.error();
							
							// for external callback
							if(callback) {
								if(callback.error != undefined 
									&& typeof callback.error == 'function')
									callback.error();
							}
						}
						
						if (options.accept != undefined 
							&& typeof options.accept == 'function') {
							if (successList.length == 0)
								options.accept();
						}
						
						// for external callback
						if(callback) {
							if(callback.accept != undefined 
								&& typeof callback.accept == 'function') {
								if (successList.length == 0)
									callback.accept();
							}
						}
					};
					
					return {
						validate: function(callback) {
							checkAll(callback);
						}
					};
					
			};
		})(jQuery);

		
		
		// provides cross-browser focusin and focusout events
		// IE has native support, in other browsers, use event caputuring (neither bubbles)

		// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
		// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
		;(function($) {
			// only implement if not provided by jQuery core (since 1.4)
			// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
			if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
				$.each({
					focus: 'focusin',
					blur: 'focusout'
				}, function( original, fix ){
					
					$.event.special[fix] = {
						setup:function() {
							this.addEventListener( original, handler, true );
						},
						teardown:function() {
							this.removeEventListener( original, handler, true );
						},
						handler: function(e) {
							arguments[0] = $.event.fix(e);
							arguments[0].type = fix;
							return $.event.handle.apply(this, arguments);
						}
					};
					function handler(e) {
						e = $.event.fix(e);
						e.type = fix;
						return $.event.handle.call(this, e);
					}
				});
			};
			$.extend($.fn, {
				validateDelegate: function(delegate, type, handler) {
					return this.bind(type, function(event) {
						var target = $(event.target);
						if (target.is(delegate)) {
							return handler.apply(target, arguments);
						}
					});
				}
			});
		})(jQuery);
		
		(function($) {
		  $.fn.emptySelect = function() {
		    return this.each(function(){
		      if (this.tagName=='SELECT') this.options.length = 0;
		    });
		  }

		  $.fn.loadSelect = function(optionsDataArray) {
		    return this.emptySelect().each(function(){
		      if (this.tagName=='SELECT') {
		        var selectElement = this;
		        $.each(optionsDataArray,function(index,optionData){
		          var option = new Option(optionData.caption,
		                                  optionData.value);
		          if ($.browser.msie) {
		            selectElement.add(option);
		          }
		          else {
		            selectElement.add(option,null);
		          }
		        });
		      }
		    });
		  }
		})(jQuery);
		
		Array.prototype.remove = function (from, to) {
		    if ($.isArray(this)) {
		        var rest = this.slice((to || from) + 1 || this.length);
		        this.length = from < 0 ? this.length + from : from;
		        return this.push.apply(this, rest);
		    }
		};
		
		
		(function () {
		    var p = {
		        init: function () {
		            this.browser = this.browser();
		            this.screen = this._screen();
		            this.os = this.os();
		        },
		        timeZone: function () {
		            var f = function (a) {
		                var b = parseInt(a);
		                a -= parseInt(a);
		                a *= 60;
		                var c = parseInt(a);
		                a -= parseInt(a);
		                a *= 60;
		                var d = parseInt(a);
		                var e = b;
		                if (b == 0) {
		                    e = "00";
		                } else if (b > 0) {
		                    e = (b < 10) ? "+0" + b : "+" + b;
		                } else {
		                    e = (b > -10) ? "-0" + Math.abs(b) : b;
		                }
		                c = (c < 10) ? "0" + c : c;
		                return e + ":" + c;
		            };
		            var g = new Date();
		            var h = new Date(g.getFullYear(), 0, 1, 0, 0, 0, 0);
		            var i = new Date(g.getFullYear(), 6, 1, 0, 0, 0, 0);
		            var j = h.toGMTString();
		            var k = new Date(j.substring(0, j.lastIndexOf(" ") - 1));
		            j = i.toGMTString();
		            var l = new Date(j.substring(0, j.lastIndexOf(" ") - 1));
		            var m = (h - k) / (1000 * 60 * 60);
		            var n = (i - l) / (1000 * 60 * 60);
		            if (m == n) {} else {
		                var o = m - n;
		                if (o >= 0) 
		                	m = n;
		            }
		            return f(m);
		        },
		        os: function () {
		            var a = "Unknown OS";
		            var b = window.navigator.platform;
		            var c = navigator.userAgent;
		            if (c.indexOf("Win") != -1) {
		                if ((c.indexOf("Windows NT 5.1") != -1) || (c.indexOf("Windows XP") != -1)) a = "Win XP";
		                else if ((c.indexOf("Windows NT 7.0") != -1) || (c.indexOf("Windows NT 6.1") != -1)) a = "Win 7/Server 2008";
		                else if ((c.indexOf("Windows NT 6.0") != -1)) a = "Win Vista/Server 2008";
		                else if (c.indexOf("Windows ME") != -1) a = "Win ME";
		                else if ((c.indexOf("Windows NT 4.0") != -1) || (c.indexOf("WinNT4.0") != -1) || (c.indexOf("WinNT") != -1)) a = "Win NT";
		                else if ((c.indexOf("Windows NT 5.2") != -1)) a = "Win Server 2003";
		                else if ((c.indexOf("Windows NT 5.0") != -1) || (c.indexOf("Windows 2000") != -1)) a = "Win 2000";
		                else if ((c.indexOf("Windows 98") != -1) || (c.indexOf("Win98") != -1)) a = "Win 98";
		                else if ((c.indexOf("Windows 95") != -1) || (c.indexOf("Win95") != -1) || (c.indexOf("Windows_95") != -1)) a = "Win 95";
		                else if ((c.indexOf("Win16") != -1)) a = "Win 3.1";
		                else a = "Win Ver. Unknown";
		                if ((c.indexOf("WOW64") != -1) || (c.indexOf("x64") != -1) || (c.indexOf("Win64") != -1) || (c.indexOf("IA64") != -1)) a = a + " (x64)";
		                else a = a + " (x32)"
		            } else if (c.indexOf("Mac") != -1) a = "MacOS";
		            else if (c.indexOf("X11") != -1) a = "UNIX";
		            else if (c.indexOf("Linux") != -1) a = "Linux";
		            return {
		                name: a,
		                version: null,
		                platform: b,
		                cpuClass: ((navigator.cpuClass) ? navigator.cpuClass : ""),
		                oscpu: window.navigator.oscpu,
		                isOnline: window.navigator.onLine,
		                systemLanguage: ((window.navigator.systemLanguage != undefined) ? window.navigator.systemLanguage : window.navigator.language),
		                timeZone: this.timeZone()
		            }
		        },
		        _screen: function () {
		            return {
		                width: screen.width,
		                height: screen.height,
		                color: ((screen.pixelDepth != undefined) ? screen.pixelDepth : screen.colorDepth)
		            }
		        },
				searchString: function (d) {
					for (var i = 0; i < d.length; i++)	{
						var s = d[i].string;
						var p = d[i].prop;
						this.versionSearchString = d[i].versionSearch || d[i].identity;
						if (s) {
							if (s.indexOf(d[i].subString) != -1)
								return d[i].identity;
						}
						else if (p)
							return d[i].identity;
					}
				},
				searchVersion : function(d) {
					var i = d.indexOf(this.versionSearchString);
					if (i == -1) return;
					return parseFloat(d.substring(i+this.versionSearchString.length+1));
				},
				dataBrowser: [
					{
						string: navigator.userAgent,
						subString: "Chrome",
						identity: "Chrome"
					},
					{ 	string: navigator.userAgent,
						subString: "OmniWeb",
						versionSearch: "OmniWeb/",
						identity: "OmniWeb"
					},
					{
						string: navigator.vendor,
						subString: "Apple",
						identity: "Safari",
						versionSearch: "Version"
					},
					{
						prop: window.opera,
						identity: "Opera"
					},
					{
						string: navigator.vendor,
						subString: "iCab",
						identity: "iCab"
					},
					{
						string: navigator.vendor,
						subString: "KDE",
						identity: "Konqueror"
					},
					{
						string: navigator.userAgent,
						subString: "Firefox",
						identity: "Firefox"
					},
					{
						string: navigator.vendor,
						subString: "Camino",
						identity: "Camino"
					},
					{	
						string: navigator.userAgent,
						subString: "Netscape",
						identity: "Netscape"
					},
					{
						string: navigator.userAgent,
						subString: "MSIE",
						identity: "Explorer",
						versionSearch: "MSIE"
					},
					{
						string: navigator.userAgent,
						subString: "Gecko",
						identity: "Mozilla",
						versionSearch: "rv"
					},
					{ 		// for older Netscapes (4-)
						string: navigator.userAgent,
						subString: "Mozilla",
						identity: "Netscape",
						versionSearch: "Mozilla"
					}
				],
		        browser: function () {
		            var i = function () {
		                var a = false;
		                if (navigator.plugins && navigator.plugins.length) {
		                    for (x = 0; x < navigator.plugins.length; x++) {
		                        if (navigator.plugins[x].name.indexOf('Java(TM)') != -1) {
		                            a = true;
		                            break;
		                        }
		                    }
		                }
		                if (navigator.javaEnabled()) {
		                    a = true;
		                }
		                return {
		                    isInstalled: a
		                }
		            };
		            var j = function () {
		                var c = false;
		                u = 10;
		                h = '0.0';
		                if (navigator.plugins && navigator.plugins.length) {
		                    for (x = 0; x < navigator.plugins.length; x++) {
		                        if (navigator.plugins[x].name.indexOf('Shockwave Flash') != -1) {
		                            h = navigator.plugins[x].description.split('Shockwave Flash ')[1];
		                            c = true;
		                            break;
		                        }
		                    }
		                } else if (window.ActiveXObject) {
		                    for (x = 2; x <= u; x++) {
		                        try {
		                            oFlash = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + x + "');");
		                            if (oFlash) {
		                                c = true;
		                                h = x + '.0';
		                            }
		                        } catch (e) {}
		                    }
		                }
		                return {
		                    isInstalled: c,
		                    version: h
		                }
		            };
		            return {
						name : this.searchString(this.dataBrowser) || "An unknown browser",
		                appName: window.navigator.appName,
		                vendor: ((window.navigator.vendor) ? window.navigator.vendor : ""),
		                appCodeName: window.navigator.appCodeName,
		                appVersion: window.navigator.appVersion,
		                product: window.navigator.product,
		                buildNumber: ((window.opera) ? window.opera.buildNumber() : ((window.navigator.productSub) ? window.navigator.productSub : "")),
		                userAgent: window.navigator.userAgent,
		                cookieEnabled: window.navigator.cookieEnabled,
		                version: this.searchVersion(navigator.userAgent)
								|| this.searchVersion(navigator.appVersion)
								|| "an unknown version",
		                java: i(),
		                flash: j()
		            }
		        }
		    };
		    p.init();
		    window.$.client = {
		        os: p.os,
		        browser: p.browser,
		        screen: p.screen
		    }
		})();
		
		
		
		
		
		
		
		
		// controls
		jQuery.fn.control = function () {
		    if (arguments.length == 0) return [];
		    var I = arguments[0] || {};
		    var v = $(this);
		    var s = null;
		    var J = function (D, control) {
		    	
		    	
		        var E = $("<div>" +
		    			"<div><span class=\"label-status\"></span></div>" +
		    			"<div class=\"theme-question-heading ui-question-heading-a\" data-theme=\"a\" data-form=\"ui-question-heading-a\">" +
		    				"<span class=\"label-control-number\"></span>" +
		    				"<span class=\"label-control-mandatory asterisk\" style=\"display: none;\">*&nbsp;</span>"+
		    				"<span class=\"header-control-content\"></span>" + 
		    			"</div>" +
		    			"<div class=\"theme-question-content ui-question-content-a\" data-theme=\"a\" data-form=\"ui-question-content-a\">" +
			    			"<div class=\"container-embed-code q-image\" style=\"display: none\"></div>" +
							"<div class=\"label-control-note q-help\" style=\"display: none;\"></div>" + 
							"<ul class=\"container-control-includes\"></ul>" + 
							"<div class=\"container-control-other\"></div>" +
							"<div class=\"container-control-comment q-comment-container\" style=\"display: none\">" + 
								"<div class=\"q-comment\"><label class=\"label-control-comment\"></label></div>" + 
								"<div>" + 
									"<textarea class=\"textarea-field textarea-control-comment\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" ></textarea>" + 
								"</div>" + 
							"</div>" + 
		    			"</div>" +
		    		"</div>");
		        
		        
		        switch (D) {
		        case 2:
		            {
		                var c = E;
		                var link = null;
		                var g = c.find('.container-control-includes');
		                var otherContainer = c.find(".container-control-other");
		                var F = I.controlId;
		                var G = function () {
		                	
		                	/*
		                    for (var x = 0; x < survey.controls.list.length; x++) {
		                        if (survey.controls.list[x].controlId == F) {
		                        	*/
		                        	
		                        	// return i
		                            I.complete(1);
		                        	
		                            var u = control;
		                            c.find('.header-control-content').html(u.content.replace(/\n/g, "<br/>"));
		                            if (u.isMandatory) {
		                                
		                            	if(_data.highlightRequiredQuestions) {
		                            		c.find('.label-control-mandatory').show();
		                            	}
		                            	
		                                // mandatory validation
		                            	validateElements.elements.push({
		                            		group : String(F),
		                            		status : c.find('.label-status'),
		                            		rules : [
		                            		         { method : 'required', message : 'This question is required.' }
		                 					]
		                            	});
		                            	
		                                
		                            }
		                            
		                            if(u.link) {
		                            	link = u.link;
		                            }
		                            
		                            if (u.isEnableNote) {
		                            	if(u.note != null) {
		                            		c.find('.label-control-note').html(u.note.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>")).show();
		                            	}
		                            }
		                            if (u.isEnableComment) {
		                                var e = c.find('.container-control-comment');
		                                e.show();
		                                var j = e.find('.label-control-comment').text(u.comment);
		                                
		                                if(_data.guidTypeId == 1 && _data.modeId == 1) {
		                                	var f = e.find('.textarea-control-comment');
			                                if(u.answerComment != undefined) {
			                                	f.val(u.answerComment);
			                                }
			                                f.focusout(function () {
			                                    var a = {
			                                        controlId: F,
			                                        controlParentTypeId: u.parentTypeId,
			                                        controlParentId: u.parentId,
			                                        controlTypeId: u.controlTypeId,
			                                        inputTypeId: u.inputTypeId,
			                                        controlIndex : I.controlIndex,
			                                        controlContent: u.content,
			                                        comment: $.removeHTMLTags($(this).val()),
			                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
			                                        sheetIndex: _data.sheets.lastSelected
			                                    };
			                                    
												createResponse({
													guidTypeId : _data.guidTypeId,
													guid : _data.guid,
													modeId : _data.modeId,
													responseTypeId : responseType.control,
													async : true,
													responseData : a
												});
			                                });
		                                }
		                            }
		                            switch (u.inputTypeId) {
		                            case 0:
		                                {
		                                    if (u.options.list.length != 0) {
		                                        var P = null;
		                                        var j = 0;
		                                    	for (var i = 0; i < u.options.list.length; i++) {
		                                    		if(u.options.list[i].optionKindId == 0) {
			                                    		var k = $("<li class=\"choice\"><label><span><input type=\"radio\" class=\"radio-option\" id=\"" + u.options.list[i].optionId + "\" name=\"" + F + "\" optionindex=\"" + i + "\" optiontext=\"" + u.options.list[i].text + "\" optionkindid=\"" + u.options.list[i].optionKindId + "\" value=\"" + u.options.list[i].value + "\" /></span>" + u.options.list[i].text + "</label></li>");
			                                        	if(u.options.list[i].selectTypeId != undefined) {
			                                        		if(u.options.list[i].selectTypeId != 0) {
			                                        			k.find('input:radio').prop('checked', true);
			                                        		}
			                                        	}
			                                        	k.appendTo(g);
			                                        	j++;
		                                    		}
		                                    		if(u.options.list[i].optionKindId == 1) {
		                                    			P = u.options.list[i];
		                                    		}
		                                        }
		                                    	
		                                        if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                            var f = g.find('input:radio');
		                                            f.change(function () {
		                                                var a = {
		                                                    controlId: F,
		                                                    controlParentTypeId: u.parentTypeId,
		                                                    controlParentId: u.parentId,
		                                                    controlTypeId: u.controlTypeId,
		                                                    inputTypeId: u.inputTypeId,
		                                                    controlIndex : I.controlIndex,
		                                                    controlContent: u.content,
		                                                    sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                    sheetIndex: _data.sheets.lastSelected,
		                                                    optionId: parseInt($(this).attr('id')),
		                                                    optionKindId : parseInt($(this).attr('optionkindid')),
		                                                    optionIndex : parseInt($(this).attr('optionindex')),
		                                                    answerText: $(this).attr('optiontext'),
		                                                    answerValue: $(this).val()
		                                                };
		                                                
														createResponse({
															guidTypeId : _data.guidTypeId,
															guid : _data.guid,
															modeId : _data.modeId,
															responseTypeId : responseType.option,
															async : true,
															responseData : a
														});
		                                            })
		                                        }
		                                        
		                                        if(P != null) {
		                                    		var l = $("<div class=\"choice-other\"><label><span><input type=\"radio\" class=\"radio-other\" name=\"" + F + "\" optionid=\"" + P.optionId + "\" optionkindid=\"" + P.optionKindId +"\" optiontext=\"" + ((P.text != "" && P.text != null) ? P.text : messages.other) + "\" /></span>" + ((P.text != "" && P.text != null) ? P.text : messages.other) + "</label><div class=\"container-other\"><input type=\"text\" class=\"text-field input-control-other\" /></div></div>");
		                                            l.appendTo(otherContainer);
		                                            var m = l.find('.radio-other');
		                                            var n = l.find('.input-control-other');
		                                            
		                                            m.unbind("change").change(function () {
		                                                if ($(this).is(':checked')) {
		                                                    n.focus()
		                                                }
		                                            });
		                                            
		                                            if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                            	
		                                            	if(P.selectTypeId != undefined) {
		                                            		if(P.selectTypeId != 0) {
		                                            			m.prop('checked', true);
		                                                		n.val(P.answerValue);
		                                            		}
		                                                }
		                                            	
		                                                n.focusin(function () {
		                                                    if (!m.is(':checked')) {
		                                                        m.prop('checked', true);
		                                                    	m.change();
		                                                    }
		                                                }).focusout(function () {
		                                                    var a = {
		                                                        controlId: F,
		                                                        controlParentTypeId: u.parentTypeId,
		                                                        controlParentId: u.parentId,
		                                                        controlTypeId: u.controlTypeId,
		                                                        inputTypeId: u.inputTypeId,
		                                                        controlIndex : I.controlIndex,
		                                                        controlContent: u.content,
		                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                        sheetIndex: _data.sheets.lastSelected,
		                                                        optionId: parseInt(m.attr('optionid')),
		                                                        optionKindId : parseInt(m.attr('optionkindid')),
		                                                        optionIndex : j,
		                                                        answerText: m.attr('optiontext'),
		                                                        answerValue: $.removeHTMLTags($(this).val())
		                                                    };
		                                                    
															createResponse({
																guidTypeId : _data.guidTypeId,
																guid : _data.guid,
																modeId : _data.modeId,
																responseTypeId : responseType.option,
																async : true,
																responseData : a
															});
		                                                });
		                                            } else {
		                                                n.focusin(function () {
		                                                    if (!m.is(':checked')) {
		                                                        m.prop('checked', true);
		                                                    	m.change();
		                                                    }
		                                                });
		                                            }
		                                    	}
		                                        
		                                    }
		                                    
		                                    break
		                                }
		                            case 1:
		                                {
		                                    if (u.options.list.length != 0) {
		                                        var o = $("<div><select class=\"dropdown-" + F + "\" name=\"" + F + "\"></select></div>");
		                                        var p = o.find(".dropdown-" + F);
		                                        var q = p[0].options;
		                                        
		                                        
		                                        var L = null;
		                                        var P = null;
		                                        var R = null;
		                                        var Y = [];
		                                        var j = 0;
		                                        for (var i = 0; i < u.options.list.length; i++) {
		                                        	if(u.options.list[i].optionKindId == 2) {
		                                        		R = u.options.list[i];
		                                        	}
		                                        	if(u.options.list[i].optionKindId == 0) {
			                                        	Y.push(u.options.list[i]);
			                                        	j++;
		                                        	}
		                                        	if(u.options.list[i].optionKindId == 1) {
		                                    			P = u.options.list[i];
		                                    		}
		                                        }
		                                        
		                                        o.appendTo(otherContainer);
		                                        
		                                        if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                            p.change(function () {
		                                            	var a = $(this).find('option:selected');
		                                            	var b = {
		                                                    controlId: F,
		                                                    controlParentTypeId: u.parentTypeId,
		                                                    controlParentId: u.parentId,
		                                                    controlTypeId: u.controlTypeId,
		                                                    inputTypeId: u.inputTypeId,
		                                                    controlIndex : I.controlIndex,
		                                                    controlContent: u.content,
		                                                    selectTypeId : 1,
		                                                    isSelected : (parseInt(a.attr('optionindex')) != 0),
		                                                    sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                    sheetIndex: _data.sheets.lastSelected,
		                                                    optionId: parseInt(a.attr('optionid')),
		                                                    optionKindId : parseInt(a.attr('optionkindid')),
		                                                    optionIndex : parseInt(a.attr('optionindex')),
		                                                    answerText: a.text(),
		                                                    answerValue: a.attr('value')
		                                                };
		                                            	
														createResponse({
															guidTypeId : _data.guidTypeId,
															guid : _data.guid,
															modeId : _data.modeId,
															responseTypeId : responseType.option,
															async : true,
															responseData : b
														});
		                                            });
		                                        }
		                                        
		                                        if(R != null) {
		                                        	var t = new Option((R.text != null ? R.text : messages.defaultNoneSelectedOption), 0);
		                                            t.setAttribute("optionid", R.optionId);
		                                            t.setAttribute("optionindex", 0);
		                                            t.setAttribute("optionkindid", 2);
		                                            
		                                            try {
		                                                q.add(t)
		                                            } catch (ex) {
		                                                q.add(t, null)
		                                            }
		                                        }
		                                        
		                                        if(Y.length != 0) {
		                                        	for(var z = 0; z < Y.length; z++) {
		                                        		var k = new Option(Y[z].text, Y[z].value);
			                                        	k.setAttribute("optionid", Y[z].optionId);
			                                            k.setAttribute("optionindex", (z + 1));
			                                            k.setAttribute("optionkindid", Y[z].optionKindId);
			                                            
			                                        	if (_data.guidTypeId == 1 && _data.modeId == 1) {
				                                        	if(Y[z].selectTypeId != undefined) {
				                                        		if(Y[z].selectTypeId != 0) {
				                                        			L = (z + 1);
				                                        		}
				                                            }
			                                        	}
			                                            
			                                            try {
			                                                q.add(k)
			                                            } catch (ex) {
			                                                q.add(k, null)
			                                            }
		                                        	}
		                                        }
		                                        
		                                        if(L != null) {
		                                        	p[0].selectedIndex = L;
		                                        }
		                                        
		                                        /*
		                                        // need to remove other
		                                        if(P != null) {
		                                        	var l = $("<div class=\"row\"><div class=\"cell\">" + ((P.text != "" && P.text != null) ? P.text : contentDictionary.titles.title_Other) + "</div><div class=\"cell\"><input type=\"text\" class=\"text-field input-control-other\" optionid=\"" + P.optionId + "\" optionkindid=\"" + P.optionKindId + "\" optiontext=\"" + ((P.text != "" && P.text != null) ? P.text : contentDictionary.titles.title_Other) + "\" /></div></div>");
		                                            l.appendTo(otherContainer);
		                                            var n = l.find('.input-control-other');
		                                            
		                                            if (guidTypeId == 1 && modeId == 1) {
		                                            	
		                                            	if(P.selectTypeId != undefined) {
		                                                	n.val(P.answerValue);
		                                                }
		                                            	
		                                                n.focusout(function () {
		                                                    var a = {
		                                                        controlId: F,
		                                                        controlParentTypeId: u.parentTypeId,
		                                                        controlParentId: u.parentId,
		                                                        controlTypeId: u.controlTypeId,
		                                                        inputTypeId: u.inputTypeId,
		                                                        controlIndex : I.controlIndex,
		                                                        controlContent: u.content,
		                                                        sheetId: survey.sheets.list[survey.sheets.lastSelected].sheetId,
		                                                        sheetIndex: survey.sheets.lastSelected,
		                                                        optionId : parseInt($(this).attr('optionid')),
		                                                        optionKindId : parseInt($(this).attr('optionkindid')),
		                                                        optionIndex : (j + 1),
		                                                        answerText: $(this).attr('optiontext'),
		                                                        answerValue: $.removeHTMLTags($(this).val())
		                                                    };
		                                                    //createResponse(responseType.option, true, a)
															createResponse({
																responseTypeId : responseType.option,
																async : true,
																responseData : a
															});
		                                                })
		                                            }
		                                        }
		                                        */
		                                        
		                                        
		                                        
		                                    }
		                                    
		                                    break
		                                }
		                            case 2:
		                                {
		                                    if (u.options.list.length != 0) {
		                                        var P = null;
		                                        var j = 0;
		                                    	for (var i = 0; i < u.options.list.length; i++) {
		                                        	if(u.options.list[i].optionKindId == 0) {
			                                        	var k = $("<li class=\"choice\"><label><span><input type=\"checkbox\" class=\"checkbox-" + u.options.list[i].optionId + "\" id=\"" + u.options.list[i].optionId + "\" name=\"" + F + "\" optionindex=\"" + i + "\" optiontext=\"" + u.options.list[i].text + "\" value=\"" + u.options.list[i].value + "\" /></span>" + u.options.list[i].text + "</label></li>");
			                                            if ((u.options.list[i].isEnableAdditionalDetails != null ? (u.options.list[i].isEnableAdditionalDetails ? true : false) : false)) {
			                                                
			                                            	var y = $("<div " + (u.options.list[i].selectTypeId == undefined ? "style=\"display: none;\"" : (u.options.list[i].selectTypeId != 0 ? "" : "style=\"display: none\"") ) + " class=\"container-additional-details-or-comments container-additional-details-or-comments-" + u.options.list[i].optionId + "\"><div class=\"q-label\">" + (u.options.list[i].additionalDetailsTitle != null ? u.options.list[i].additionalDetailsTitle : messages.defaultAdditionalDetails) + "</div><div><input type=\"text\" class=\"text-field input-additional-details-or-comments\" " + (u.options.list[i].answerComment != undefined ? "value=\"" + u.options.list[i].answerComment + "\"" : "" ) + " optionid=\"" + u.options.list[i].optionId +"\" optionindex=\"" + i + "\" optiontext=\"" + u.options.list[i].text + "\" optionvalue=\"" + u.options.list[i].value + "\"  /></div></div>");
			                                                //var y = $("<div style=\"display: none;\"" class=\"container-additional-details-or-comments container-additional-details-or-comments-" + u.options.list[i].optionId + "\"><div class=\"row-desc\">" + (u.options.list[i].additionalDetailsTitle != null ? u.options.list[i].additionalDetailsTitle : contentDictionary.titles.title_DefaultAdditionalDetails) + "</div><div class=\"row-details\"><input type=\"text\" class=\"text-field input-additional-details-or-comments\" " + (u.options.list[i].answerComment != undefined ? "value=\"" + u.options.list[i].answerComment + "\"" : "" ) + "  /></div></div>");
			                                                k.append(y);
			                                                k.find('.checkbox-' + u.options.list[i].optionId).unbind('change').change(function () {
			                                                    
			                                                	var w = $(this);
			                                                    var b = $('.container-additional-details-or-comments-' + w.attr('id'));
			                                                    var d = b.find('.input-additional-details-or-comments');
			                                                   
			                                                    if (w.is(':checked')) {
			                                                        b.show();
			                                                        d.focus();
			                                                        if (_data.guidTypeId == 1 && _data.modeId == 1) {
			                                                            d.unbind('focusout').focusout(function () {
			                                                                var a = {
			                                                                    controlId: F,
			                                                                    controlParentTypeId: u.parentTypeId,
			                                                                    controlParentId: u.parentId,
			                                                                    controlTypeId: u.controlTypeId,
			                                                                    inputTypeId: u.inputTypeId,
			                                                                    controlIndex : I.controlIndex,
			                                                                    controlContent: u.content,
			                                                                    selectTypeId : 2 /*2 - multiSelect*/,
			                                                                    isSelected : true,
			                                                                    comment: $.removeHTMLTags(d.val()),
			                                                                    sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
			                                                                    sheetIndex: _data.sheets.lastSelected,
			                                                                    optionId: parseInt(w.attr('id')),
			                                                                    optionIndex: parseInt(w.attr('optionindex')),
			                                                                    answerText: w.attr('optiontext'),
			                                                                    answerValue: w.val()
			                                                                };
			                                                                
																			createResponse({
																				guidTypeId : _data.guidTypeId,
																				guid : _data.guid,
																				modeId : _data.modeId,
																				responseTypeId : responseType.option,
																				async : true,
																				responseData : a
																			});
			                                                            });
			                                                        }
			                                                    } else {
			                                                        b.hide();
			                                                        if (_data.guidTypeId == 1 && _data.modeId == 1) {
			                                                            var c = {
			                                                                controlId: F,
			                                                                controlParentTypeId: u.parentTypeId,
			                                                                controlParentId: u.parentId,
			                                                                controlTypeId: u.controlTypeId,
			                                                                inputTypeId: u.inputTypeId,
			                                                                controlIndex : I.controlIndex,
			                                                                controlContent: u.content,
			                                                                selectTypeId: 2,
			                                                                isSelected : false,
			                                                                comment: $.removeHTMLTags(d.val()),
			                                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
			                                                                sheetIndex: _data.sheets.lastSelected,
			                                                                optionId: parseInt(w.attr('id')),
			                                                                optionIndex: parseInt(w.attr('optionindex')),
			                                                                answerText: w.attr('optiontext'),
			                                                                answerValue: w.val()
			                                                            };
			                                                            
																		createResponse({
																			guidTypeId : _data.guidTypeId,
																			guid : _data.guid,
																			modeId : _data.modeId,
																			responseTypeId : responseType.option,
																			async : true,
																			responseData : c
																		});
			                                                        }
			                                                    }
			                                                    
			                                                }).addClass('checkbox-additional-details-or-comments');
			                                                
			                                                if(u.options.list[i].selectTypeId != undefined) {
			                                                	if(u.options.list[i].selectTypeId != 0) {
				                                                	y.find('.input-additional-details-or-comments')
				                                                	 .unbind('focusout').focusout(function () {
				                                                		
					                                                    var a = {
					                                                        controlId: F,
					                                                        controlParentTypeId: u.parentTypeId,
					                                                        controlParentId: u.parentId,
					                                                        controlTypeId: u.controlTypeId,
					                                                        inputTypeId: u.inputTypeId,
					                                                        controlIndex : I.controlIndex,
					                                                        controlContent: u.content,
					                                                        selectTypeId: 2,
					                                                        isSelected : true,
					                                                        comment: $.removeHTMLTags($(this).val()),
					                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
					                                                        sheetIndex: _data.sheets.lastSelected,
					                                                        optionId: parseInt($(this).attr('optionid')),
					                                                        optionIndex: parseInt($(this).attr('optionindex')),
					                                                        answerText: $(this).attr('optiontext'),
					                                                        answerValue: $(this).attr('optionvalue')
					                                                    };
					                                                    
																		createResponse({
																			guidTypeId : _data.guidTypeId,
																			guid : _data.guid,
																			modeId : _data.modeId,
																			responseTypeId : responseType.option,
																			async : true,
																			responseData : a
																		});
					                                                     
				                                                    });
			                                                	}
			                                                }
			                                                
			                                            }
			                                            if(u.options.list[i].selectTypeId != undefined) {
			                                            	if(u.options.list[i].selectTypeId != 0) {
			                                            		k.find('input:checkbox').prop('checked', true);
			                                            	}
			                                            }
			                                            k.appendTo(g);
			                                            
			                                            j++;
			                                        }

		                                        	if(u.options.list[i].optionKindId == 1) {
														P = u.options.list[i];
													}
		                                        }
												
												
												
												if (_data.guidTypeId == 1 && _data.modeId == 1) {
													var f = g.find('input:checkbox');
													f.change(function () {
														if (!$(this).hasClass('checkbox-additional-details-or-comments')) {
															var a = {
																controlId: F,
																controlParentTypeId: u.parentTypeId,
																controlParentId: u.parentId,
																controlTypeId: u.controlTypeId,
																inputTypeId: u.inputTypeId,
																controlIndex : I.controlIndex,
																controlContent: u.content,
																selectTypeId : 2,
																isSelected: $(this).is(':checked'),
																sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
																sheetIndex: _data.sheets.lastSelected,
																optionId: parseInt($(this).attr('id')),
																optionIndex: parseInt($(this).attr('optionindex')),
																answerText: $(this).attr('optiontext'),
																answerValue: $(this).val()
															};
															
															createResponse({
																guidTypeId : _data.guidTypeId,
																guid : _data.guid,
																modeId : _data.modeId,
																responseTypeId : responseType.option,
																async : true,
																responseData : a
															});
														}
													});
												}
												
												if (P != null) {
													var l = $("<div class=\"choice-other\"><label><span><input type=\"checkbox\" class=\"checkbox-other\" optionid=\"" + P.optionId + "\" name=\"" + F + "\" optionkindid=\"" + P.optionKindId + "\" optiontext=\"" + ((P.text != "" && P.text != null) ? P.text : messages.other) + "\" /></span>" + ((P.text != "" && P.text != null) ? P.text : messages.other) + "</label><div class=\"container-other\"><input type=\"text\" class=\"text-field input-control-other\" /></div></div>");
													l.appendTo(otherContainer);
													var z = l.find('.checkbox-other');
													var n = l.find('.input-control-other');
													
													if (_data.guidTypeId == 1 && _data.modeId == 1) {
														if(P.selectTypeId != undefined) {
															if(P.selectTypeId != 0) {
																z.prop('checked', true);
			                                            		n.val(P.answerValue);
															}
			                                            }
													}
													
													z.unbind("change").change(function () {
														if ($(this).is(':checked')) {
															n.focus()
														} else {
															// Send selectTypeId : 0
															if (_data.guidTypeId == 1 && _data.modeId == 1) {
																var a = {
																	controlId: F,
																	controlParentTypeId: u.parentTypeId,
																	controlParentId: u.parentId,
																	controlTypeId: u.controlTypeId,
																	inputTypeId: u.inputTypeId,
																	controlIndex : I.controlIndex,
																	controlContent: u.content,
																	selectTypeId: 2,
																	isSelected : false,
																	sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
																	sheetIndex: _data.sheets.lastSelected,
																	optionId : parseInt(z.attr('optionid')),
																	optionKindId : parseInt(z.attr('optionkindid')),
																	optionIndex : j,
																	answerText: z.attr('optiontext'),
																	answerValue: $.removeHTMLTags(n.val())
																};
																
																createResponse({
																	guidTypeId : _data.guidTypeId,
																	guid : _data.guid,
																	modeId : _data.modeId,
																	responseTypeId : responseType.option,
																	async : true,
																	responseData : a
																});
															}
														}
													});
													if (_data.guidTypeId == 1 && _data.modeId == 1) {
														n.focusin(function () {
															if (!z.is(':checked')) {
																z.prop('checked', true);
																z.change();
															}
														}).focusout(function () {
															var a = {
																controlId: F,
																controlParentTypeId: u.parentTypeId,
																controlParentId: u.parentId,
																controlTypeId: u.controlTypeId,
																inputTypeId: u.inputTypeId,
																controlIndex : I.controlIndex,
																controlContent: u.content,
																selectTypeId: 2,
																isSelected : true,
																sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
																sheetIndex: _data.sheets.lastSelected,
																optionId : parseInt(z.attr('optionid')),
																optionKindId : parseInt(z.attr('optionkindid')),
																optionIndex : j,
																answerText: z.attr('optiontext'),
																answerValue: $.removeHTMLTags($(this).val())
															};
															
															createResponse({
																guidTypeId : _data.guidTypeId,
																guid : _data.guid,
																modeId : _data.modeId,
																responseTypeId : responseType.option,
																async : true,
																responseData : a
															});
														});
													} else {
														n.focusin(function () {
															if (!z.is(':checked')) {
																z.prop('checked', true)
																z.change();
															}
														});
													}
												}

		                                    }
		                                    
		                                    break
		                                }
		                            }
		                            c.appendTo(v);
		                            
		                            
		                            if(link) {
		                            	
		                            	// image
		                            	if(u.linkTypeId == 1) {
		                            		c.find('.container-embed-code')
		                            			.html("<img src=" + u.link + " />")
		                            			.show();
		                            	}
		                            	
		                            	// embed code
		                            	if(u.linkTypeId == 2) {
			                            	c.find('.container-embed-code')
			                        			.html(u.link)
			                        			.show();
		                            	}
		                            }
		                            
		                            
		                            /*
		                            break
		                        }
		                    }
		                    */
		                            
		                            
		                };
		                G();
		                break
		            }
		        case 3:
		            {
		                var c = E;
		                var link = null;
		                var g = c.find('.container-control-includes');
		                var otherContainer = c.find(".container-control-other");
		                var F = I.controlId;
		                var G = function () {
		                    
		                	
		                	/*
		                	for (var x = 0; x < survey.controls.list.length; x++) {
		                        if (survey.controls.list[x].controlId == F) {
		                        	*/
		                	
		                	
		                        	// return i
		                            I.complete(1);
		                        	
		                            var u = control;
		                            c.find('.header-control-content').html(u.content.replace(/\n/g, "<br/>"));
		                            if (u.isMandatory) {
		                            	
		                            	if(_data.highlightRequiredQuestions) {
		                            		c.find('.label-control-mandatory').show();
		                            	}
		                            	
		                                // mandatory validation
		                                validateElements.elements.push({
		                            		name : String(F),
		                            		status : c.find('.label-status'),
		                            		rules : [
		                            		         { method : 'required', message : 'This question is required.' }
		                 					]
		                            	});
		                            	
		                                
		                            }
		                            
		                            if(u.link) {
		                            	link = u.link;
		                            }
		                            
		                            if (u.isEnableNote) {
		                            	if(u.note != null) {
		                            		c.find('.label-control-note').html(u.note.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>")).show();
		                            	}
		                            }
		                            switch (u.inputTypeId) {
		                            case 0:
		                                {
		                            		otherContainer.append("<div class=\"group\"><input type=\"text\" name=\"" + F + "\" class=\"input-single-line-field text-field\" /></div>");
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                        var f = otherContainer.find('.input-single-line-field'); // to remove
		                                        if(u.answerValue != undefined) {
		                                        	f.val(u.answerValue);
		                                        }
		                                        f.focusout(function () {
		                                            var a = {
		                                                controlId: F,
		                                                controlParentTypeId: u.parentTypeId,
		                                                controlParentId: u.parentId,
		                                                controlTypeId: u.controlTypeId,
		                                                inputTypeId: u.inputTypeId,
		                                                controlIndex : I.controlIndex,
		                                                controlContent: u.content,
		                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                sheetIndex: _data.sheets.lastSelected,
		                                                answerValue: $.removeHTMLTags($(this).val())
		                                            };
		                                            
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : a
													});
		                                        });
		                                    }
		                                    break
		                                }
		                            case 1:
		                                {
		                            		otherContainer.append("<div class=\"group\"><textarea name=\"" + F + "\" class=\"textarea-multi-line-field textarea-field\"></textarea></div>");
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                        var f = otherContainer.find('.textarea-multi-line-field');
		                                        if(u.answerValue != undefined) {
		                                        	f.val(u.answerValue);
		                                        }
		                                        f.focusout(function () {
		                                            var a = {
		                                                controlId: F,
		                                                controlParentTypeId: u.parentTypeId,
		                                                controlParentId: u.parentId,
		                                                controlTypeId: u.controlTypeId,
		                                                inputTypeId: u.inputTypeId,
		                                                controlIndex : I.controlIndex,
		                                                controlContent: u.content,
		                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                sheetIndex: _data.sheets.lastSelected,
		                                                answerValue: $.removeHTMLTags($(this).val())
		                                            };
		                                            
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : a
													});
		                                        });
		                                    }
		                                    break
		                                }
		                            case 2:
		                                {
		                            		otherContainer.append("<div class=\"group\"><input type=\"password\" name=\"" + F + "\" class=\"input-password-field text-field\" /></div>");
		                                    
		                            		if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                        var f = otherContainer.find('.input-password-field');
		                                        if(u.answerValue != undefined) {
		                                        	f.val(u.answerValue);
		                                        }
		                                        f.focusout(function () {
		                                            var a = {
		                                                controlId: F,
		                                                controlParentTypeId: u.parentTypeId,
		                                                controlParentId: u.parentId,
		                                                controlTypeId: u.controlTypeId,
		                                                inputTypeId: u.inputTypeId,
		                                                controlIndex : I.controlIndex,
		                                                controlContent: u.content,
		                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                sheetIndex: _data.sheets.lastSelected,
		                                                answerValue: $.removeHTMLTags($(this).val())
		                                            };
		                                            
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : a
													});
		                                        });
		                                    }
		                                    break
		                                }
		                            }
		                            c.appendTo(v);
		                            
		                            if(link) {
		                            	
		                            	// image
		                            	if(u.linkTypeId == 1) {
		                            		c.find('.container-embed-code')
		                            			.html("<img src=" + u.link + " />")
		                            			.show();
		                            	}
		                            	
		                            	// embed code
		                            	if(u.linkTypeId == 2) {
			                            	c.find('.container-embed-code')
			                        			.html(u.link)
			                        			.show();
		                            	}
		                            }
		                            
		                            /*
		                            break
		                        }
		                    }
		                    */
		                            
		                };
		                G();
		                break
		            }
		        case 4:
		            {
		            	
		            	// matrix/likert
		        	
		                var c = E;
		            	var link = null;
		                var g = c.find('.container-control-includes');
		                var otherContainer = c.find(".container-control-other");
		                var F = I.controlId;
		                var errorLabel = null;
		                var G = function () {
		                	
		                	/*
		                    for (var x = 0; x < survey.controls.list.length; x++) {
		                        if (survey.controls.list[x].controlId == F) {
		                        */
		                        	var u = control;
		                            c.find('.header-control-content').html(u.content.replace(/\n/g, "<br/>"));
		                            if (u.isMandatory) {
		                            	
		                            	if(_data.highlightRequiredQuestions) {
		                            		c.find('.label-control-mandatory').show();
		                            	}
		                            	
		                                // mandatory validation
		                                errorLabel = $("<label class=\"status\">This question is required.</label>").hide();
		                        			c.find('.label-status').append(errorLabel);
		                                
		                            }
		                            
		                            if(u.link) {
		                            	link = u.link;
		                            }
		                            
		                            if (u.isEnableNote) {
		                            	if(u.note != null) {
		                            		c.find('.label-control-note').html(u.note.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>")).show();
		                            	}
		                            }
		                            if (u.subControls.list.length != 0) {
		                                var a = $("<table cellpadding=\"0\" cellspacing=\"1\" border=\"0\" class=\"table-matrix\"></table>");
		                                var b = $("<tr class=\"table-matrix-header\"></tr>");
		                                var d = $("<td>&nbsp;</td>");
		                                b.append(d);
		                                for (var y = 0; y < u.options.list.length; y++) {
		                                    var e = $("<th>" + u.options.list[y].text + "</th>");
		                                    b.append(e);
		                                }
		                                a.append(b);
		                                
		                                
		                                // return i
		                                I.complete(u.subControls.list.length);
		                                
		                                
		                                //alert(u.subControls.list.length);
		                                
		                                
		                                for (var i = 0; i < u.subControls.list.length; i++) {
		                                    var f = $("<tr " + (i % 2 ? "class=\"active\"" : "") + "></tr>"); 
		                                    var h = $("<th>" + u.subControls.list[i].content + "</th>");
		                                    f.append(h);
		                                    
		                                    var _lastSubControl = null;
		                                    
		                                    for (var y = 0; y < u.options.list.length; y++) {
		                                        var j = null;
		                                        var actualOption = u.options.list[y];
		                                    	var actualSubControl = u.subControls.list[i];
		                                    	
		                                    	
		                                    	
		                                    	
		                                        if (u.inputTypeId == 0) {
		                                        	
		                                            j = $("<td><lable><input type=\"radio\" controlindex=\""+i+"\"  name=\"" + (u.controlId + "_" + actualSubControl.controlId) + "\" subcontrolid=\"" + actualSubControl.controlId + "\" subcontrolparenttypeid=\"" + actualSubControl.parentTypeId + "\" subcontrolparentid=\"" + actualSubControl.parentId + "\" subcontrolcontent=\"" + actualSubControl.content + "\" id=\"" + actualOption.optionId + "\" optiontext=\"" + actualOption.text + "\" optionindex=\"" + y + "\" value=\"" + actualOption.value + "\" /></label></td>");
		                                            
		                                            if(_lastSubControl != actualSubControl) {
		                                            	if (u.isMandatory) {
		                                            		
		                                                    // mandatory validation
		                                                    validateGroup.push({
		                                                    	controlId : u.controlId,
		                                                    	group: u.controlId + "_" + actualSubControl.controlId
		                                                    });
		                                                    
		    	                                        	validateElements.elements.push({
		    	                                        		group : (u.controlId + "_" + actualSubControl.controlId),
		    	                                        		showError : false,
		    	                                        		rules : [
		    	                                        		         { method : 'required', message : 'This question is required.' }
		    	                             					],
		    	                             					success : function() {
		    	                                        			var isApprove = true;
		    	                                        			for(var y = 0; y < validateGroup.length; y++) {
			    	                                        			
		    	                                        				if(validateGroup[y].controlId == u.controlId) {
			    	                                        				if($('input[name=' + validateGroup[y].group + ']').filter(':checked').length == 0) { 
				    	                                        				isApprove = false;
				    	                                        				break;
				    	                                        			}
		    	                                        				}
		    	                                        				
		    	                                        			}
		    	                                        			if(isApprove) {
		    	                                        				errorLabel.hide();
		    	                                        			}
		    	                                        		},
		    	                                        		error: function() {
		    	                                        			errorLabel.show();
		    	                                        		}
		    	                                        	});
		                                                }
		                                            }
		                                            _lastSubControl = actualSubControl;
		                                            
		                                            if(actualOption.answerSelectedControlsIds != undefined) {
		                                            	for(var selectedControlIdIndex in actualOption.answerSelectedControlsIds){
		                                            		if(parseInt(actualOption.answerSelectedControlsIds[selectedControlIdIndex]) == parseInt(actualSubControl.controlId)){
		                                            			j.find('input:radio').prop('checked', true);
		                                            		}
		                                            	}
		                                            }
		                                            
		                                            if (_data.guidTypeId == 1 && _data.modeId == 1) {
			                                            var r = j.find('input:radio');
			                                            r.change(function() {
			                                            	
			                                            	var a = {
			                                                    controlId : parseInt($(this).attr('subcontrolid')),
			                                                    controlParentTypeId : parseInt($(this).attr('subcontrolparenttypeid')),
			                                                    controlParentId : parseInt($(this).attr('subcontrolparentid')),
			                                                    controlTypeId : 9,
			                                                    inputTypeId : u.inputTypeId,
			                                                    controlIndex : parseInt($(this).attr('controlindex')),
			                                                    controlContent: $(this).attr('subcontrolcontent'),
			                                                    sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
			                                                    sheetIndex: _data.sheets.lastSelected,
			                                                    optionId: parseInt($(this).attr('id')),
			                                                    optionIndex : parseInt($(this).attr('optionindex')),
			                                                    answerText: $(this).attr('optiontext'),
			                                                    answerValue: $(this).val()
			                                                };
			                                                
															createResponse({
																guidTypeId : _data.guidTypeId,
																guid : _data.guid,
																modeId : _data.modeId,
																responseTypeId : responseType.option,
																async : true,
																responseData : a
															});
			                                            });
		                                            }
		                                        } else if (u.inputTypeId == 1) {
		                                        	
		                                        	j = $("<td><lable><input type=\"checkbox\" controlindex=\""+i+"\" name=\"" + (u.controlId + "_" + actualSubControl.controlId) + "\"  subcontrolid=\"" + actualSubControl.controlId + "\" subcontrolparenttypeid=\"" + actualSubControl.parentTypeId + "\" subcontrolparentid=\"" + actualSubControl.parentId + "\" subcontrolcontent=\"" + actualSubControl.content + "\" id=\"" + actualOption.optionId + "\" optiontext=\"" + actualOption.text + "\" optionindex=\"" + y + "\" value=\"" + actualOption.value + "\" /></label></td>");
		                                            
		                                        	if(_lastSubControl != actualSubControl) {
		                                            	if (u.isMandatory) {
		                                            		
		                                                    // mandatory validation
		                                                    validateGroup.push({
		                                                    	controlId : u.controlId,
		                                                    	group : u.controlId + "_" + actualSubControl.controlId
		                                                    });
		                                                    
		    	                                        	validateElements.elements.push({
		    	                                        		group : (u.controlId + "_" + actualSubControl.controlId),
		    	                                        		showError : false,
		    	                                        		rules : [
		    	                                        		         { method : 'required', message : 'This question is required.' }
		    	                             					],
		    	                             					success : function() {
		    	                                        			var isApprove = true;
		    	                                        			for(var y = 0; y < validateGroup.length; y++) {
			    	                                        			if(validateGroup[y].controlId == u.controlId) {
			    	                                        				if($('input[name=' + validateGroup[y].group + ']').filter(':checked').length == 0) { 
				    	                                        				isApprove = false;
				    	                                        				break;
				    	                                        			}
			    	                                        			}
		    	                                        			}
		    	                                        			if(isApprove) {
		    	                                        				errorLabel.hide();
		    	                                        			}
		    	                                        		},
		    	                                        		error: function() {
		    	                                        			errorLabel.show();
		    	                                        		}
		    	                                        	});
		    	                                        	
		                                                }
		                                            }
		                                            _lastSubControl = actualSubControl;
		                                            
		                                        	 if(actualOption.answerSelectedControlsIds != undefined) {
		                                             	for(var selectedControlIdIndex in actualOption.answerSelectedControlsIds){
		                                             		if(parseInt(actualOption.answerSelectedControlsIds[selectedControlIdIndex]) == parseInt(actualSubControl.controlId)){
		                                             			j.find('input:checkbox').prop('checked', true);
		                                             		}
		                                             	}
		                                             }
		                                            
		                                            if (_data.guidTypeId == 1 && _data.modeId == 1) {
			                                            var r = j.find('input:checkbox');
			                                            r.change(function() {
			                                            	
			                                            	var a = {
			                                                    controlId : parseInt($(this).attr('subcontrolid')),
			                                                    controlParentTypeId : parseInt($(this).attr('subcontrolparenttypeid')),
			                                                    controlParentId : parseInt($(this).attr('subcontrolparentid')),
			                                                    controlTypeId : 9,
			                                                    inputTypeId : u.inputTypeId,
			                                                    controlIndex : parseInt($(this).attr('controlindex')),
			                                                    controlContent: $(this).attr('subcontrolcontent'),
			                                                    selectTypeId : 2,
			                                                    isSelected : $(this).is(':checked'),
			                                                    sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
			                                                    sheetIndex: _data.sheets.lastSelected,
			                                                    optionId: parseInt($(this).attr('id')),
			                                                    optionIndex : parseInt($(this).attr('optionindex')),
			                                                    answerText: $(this).attr('optiontext'),
			                                                    answerValue: $(this).val()
			                                                };
			                                                
															createResponse({
																guidTypeId : _data.guidTypeId,
																guid : _data.guid,
																modeId : _data.modeId,
																responseTypeId : responseType.option,
																async : true,
																responseData : a
															});
			                                            	
			                                            });
		                                            }
		                                        }
		                                        f.append(j);
		                                    }
		                                    a.append(f);
		                                    
		                                    
		                                    
		                                    
		                                }
		                                otherContainer.append(a);
		                            }
		                            c.appendTo(v);
		                            
		                            if(link) {
		                            	
		                            	// image
		                            	if(u.linkTypeId == 1) {
		                            		c.find('.container-embed-code')
		                            			.html("<img src=" + u.link + " />")
		                            			.show();
		                            	}
		                            	
		                            	// embed code
		                            	if(u.linkTypeId == 2) {
			                            	c.find('.container-embed-code')
			                        			.html(u.link)
			                        			.show();
		                            	}
		                            }
		                            
		                            /*
		                            break
		                        }
		                    }
		                    */
		                            
		                };
		                G();
		                break
		            }
		        case 6:
		            {
		                var c = E;
		                var link = null;
		                var g = c.find('.container-control-includes');
		                var otherContainer = c.find(".container-control-other");
		                var F = I.controlId;
		                var G = function () {
		                    
		                	
		                	/*
		                	for (var x = 0; x < survey.controls.list.length; x++) {
		                        if (survey.controls.list[x].controlId == F) {
		                        	*/
		                        	
		                        	// return i
		                            I.complete(1);
		                        	
		                        	var u = control;
		                        	
		                            c.find('.header-control-content').html(u.content.replace(/\n/g, "<br/>"));
		                            if (u.isMandatory) {
		                            	
		                            	if(_data.highlightRequiredQuestions) {
		                            		c.find('.label-control-mandatory').show();
		                            	}
		                            	
		                                // mandatory validation
		                                validateElements.elements.push({
		                            		group : String(F),
		                            		status : c.find('.label-status'),
		                            		rules : [
		                            		         { method : 'required', message : 'This question is required.' }
		                 					]
		                            	});
		                                
		                                
		                            }
		                            
		                            if(u.link) {
		                            	link = u.link;
		                            }
		                            
		                            if (u.isEnableNote) {
		                            	if(u.note != null) {
		                            		c.find('.label-control-note').html(u.note.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>")).show();
		                            	}
		                            }
		                            switch (u.inputTypeId) {
		                            case 0:
		                                {
		                                    
		                            		// MMM / DD
		                                	
		                                	var a = $("<li>" +
                                				"<ul class=\"list-date\">" +
                                					"<li>" +
                                						"<div class=\"q-label\"><label>" + (u.monthTitle != null ? u.monthTitle : messages.month) + "</label></div>" +
                                						"<div><select name=\"" + F + "\" class=\"months-list\" /></div>" +
                                					"</li>" +
                                					"<li>" +
                                						"<div class=\"q-label\"><label>" + (u.dayTitle != null ? u.dayTitle : messages.day) + "</label></div>" +
                                						"<div><select name=\"" + F + "\" class=\"days-list\" /></div>" +
                                					"</li>" +
                                				"</ul>" +
                                			"</li>").appendTo(g);
		                                	
		                                	
		                                	
		                                	var M = a.find(".months-list");
		                                    	M.loadSelect(messages.months);
		                                    var Z = a.find(".days-list");
		                                    	Z.loadSelect(messages.days);
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < M[0].options.length; p++) {
		                                    			if(M[0].options[p].value == u.answerValue.month) {
		                                    				M[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < Z[0].options.length; p++) {
		                                    			if(Z[0].options[p].value == u.answerValue.day) {
		                                    				Z[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    	}
		                                    	
		                                    	
		                                    	/*
		                                    	var t = 0;
		                                    	a.filter('a').click(function (e) {
		                                    		t++;
		                                    		jQuery('body').unbind('click').click(function() {
		                                    			t++;
		                                    			if(t == 1) {
		                                    				jQuery('body').unbind('click');
		                                    				// Send request
		                                    				//alert("R" + "________" + a.find(".months-list").val() + "____" + a.find(".days-list").val())
		                                    				*/
		                                    				
		                                    	var f = a.find('select');
		                                        f.change(function () {
		                                        	
                                    				var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text },
                                                        answerValue: { month : M.val() , day : Z.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
															
		                                        });
															
															/*
		                                    			}
		                                    			t = 0;
		                                    		});
		                                    		
		                                    	});
		                                    	*/
		                                    	
		                                    }
		                                    
		                                    break
		                                }
		                            case 1:
		                                {
		                                	// MMM / DD / YYYY
		                            	
		                                	var a = $("<li>" +
	                                			"<ul class=\"list-date\">" +
	                            					"<li>" +
	                            						"<div class=\"q-label\"><label>" + (u.monthTitle != null ? u.monthTitle : messages.month) + "</label></div>" +
	                            						"<div><select name=\"" + F + "\" class=\"months-list\" /></div>" +
	                            					"</li>" +
	                            					"<li>" +
	                            						"<div class=\"q-label\"><label>" + (u.dayTitle != null ? u.dayTitle : messages.day) + "</label></div>" +
	                            						"<div><select name=\"" + F + "\" class=\"days-list\" /></div>" +
	                            					"</li>" +
	                            					"<li>" +
	                        							"<div class=\"q-label\"><label>" + (u.yearTitle != null ? u.yearTitle : messages.year) + "</label></div>" +
	                        							"<div><input name=\"" + F + "\" type=\"text\" maxlength=\"4\" size=\"4\" class=\"year-field text-field\" /></div>" +
	                        						"</li>" +
	                            				"</ul>" +
	                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	
		                                	var M = a.find(".months-list");
		                                    	M.loadSelect(messages.months);
		                                    var Z = a.find(".days-list");
		                                    	Z.loadSelect(messages.days);
		                                    var Y = a.find('.year-field');
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < M[0].options.length; p++) {
		                                    			if(M[0].options[p].value == u.answerValue.month) {
		                                    				M[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < Z[0].options.length; p++) {
		                                    			if(Z[0].options[p].value == u.answerValue.day) {
		                                    				Z[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		Y.val(u.answerValue.year);
		                                    	}
		                                    	
		                                    	
		                                    	/*
		                                    	var t = 0;
		                                    	a.filter('a').click(function (e) {
		                                    		t++;
		                                    		jQuery('body').unbind('click').click(function() {
		                                    			t++;
		                                    			if(t == 1) {
		                                    				jQuery('body').unbind('click');
		                                    				*/
		                                    	
		                                    	var f = a.find('select');
		                                        f.change(function () {
		                                        	
                                    				var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val() },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
															
		                                        });
		                                        
		                                        Y.focusout(function () {
		                                        	
		                                        	var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val() },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
		                                        	
		                                        });
		                                        
															/*
		                                    			}
		                                    			t = 0;
		                                    		});
		                                    		
		                                    	});
		                                    	*/
		                                    	
		                                    }
		                                    
		                                    break
		                                }
		                            case 2:
		                                {
		                                    
		                            		// MMM / DD / YYYY HH:MM
		                            		
		                                	var a = $("<li>" +
	                                			"<ul class=\"list-date\">" +
	                            					"<li>" +
	                            						"<div class=\"q-label\"><label>" + (u.monthTitle != null ? u.monthTitle : messages.month) + "</label></div>" +
	                            						"<div><select name=\"" + F + "\" class=\"months-list\" /></div>" +
	                            					"</li>" +
	                            					"<li>" +
	                            						"<div class=\"q-label\"><label>" + (u.dayTitle != null ? u.dayTitle : messages.day) + "</label></div>" +
	                            						"<div><select name=\"" + F + "\" class=\"days-list\" /></div>" +
	                            					"</li>" +
	                            					"<li>" +
	                        							"<div class=\"q-label\"><label>" + (u.yearTitle != null ? u.yearTitle : messages.year) + "</label></div>" +
	                        							"<div><input name=\"" + F + "\" type=\"text\" maxlength=\"4\" size=\"4\" class=\"year-field text-field\" /></div>" +
	                        						"</li>" +
	                        					"</ul>" +
	                        					"<ul class=\"list-time\">" +
	                        						"<li>" +
	                    								"<div class=\"q-label\"><label>" + (u.hoursTitle != null ? u.hoursTitle : messages.hours) + "</label></div>" +
	                    								"<div><select name=\"" + F + "\" class=\"hours-list\" /></div>" +
	                    							"</li>" +
	                    							"<li>" +
                										"<div class=\"q-label\">&nbsp;</div>" +
                										"<div>:</div>" +
                									"</li>" +
	                    							"<li>" +
	                									"<div class=\"q-label\"><label>" + (u.minutesTitle != null ? u.minutesTitle : messages.minutes) + "</label></div>" +
	                									"<div><select name=\"" + F + "\" class=\"minutes-list\" /></div>" +
	                								"</li>" +
	                            				"</ul>" +
	                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	var M = a.find(".months-list");
		                                    	M.loadSelect(messages.months);
		                                    var Z = a.find(".days-list");
		                                    	Z.loadSelect(messages.days);
		                                    var Y = a.find('.year-field');
		                                    var H = a.find(".hours-list");
		                                    	H.loadSelect(messages.hours);
		                                    var N = a.find(".minutes-list");
		                                    	N.loadSelect(messages.minutes);
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < M[0].options.length; p++) {
		                                    			if(M[0].options[p].value == u.answerValue.month) {
		                                    				M[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < Z[0].options.length; p++) {
		                                    			if(Z[0].options[p].value == u.answerValue.day) {
		                                    				Z[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		Y.val(u.answerValue.year);
		                                    		
		                                    		for(var p = 0; p < H[0].options.length; p++) {
		                                    			if(H[0].options[p].value == u.answerValue.hours) {
		                                    				H[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < N[0].options.length; p++) {
		                                    			if(N[0].options[p].value == u.answerValue.minutes) {
		                                    				N[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    	}
		                                    	
		                                    	
		                                    	
		                                    	/*
		                                    	var t = 0;
		                                    	a.filter('a').click(function (e) {
		                                    		t++;
		                                    		jQuery('body').unbind('click').click(function() {
		                                    			t++;
		                                    			if(t == 1) {
		                                    				jQuery('body').unbind('click');
		                                    	 			*/
		                                    	
		                                    	var f = a.find('select');
		                                        f.change(function () {
		                                        	
                                    				var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val(), hours : H[0].options[H[0].selectedIndex].text, minutes : N[0].options[N[0].selectedIndex].text },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val(), hours : H.val(), minutes : N.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
															
		                                        });
		                                        
		                                        Y.focusout(function () {
		                                        	
		                                        	var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val(), hours : H[0].options[H[0].selectedIndex].text, minutes : N[0].options[N[0].selectedIndex].text },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val(), hours : H.val(), minutes : N.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
		                                        	
		                                        });
		                                        
		                                        
															/*
		                                    			}
		                                    			t = 0;
		                                    		});
		                                    		
		                                    	});
		                                    	*/
		                                    	
		                                    }
		                                    
		                                    break
		                                }
		                            case 3:
		                                {
		                                	// DD / MMM
		                                	
		                                	var a = $("<li>" +
	                                			"<ul class=\"list-date\">" +
	                            					"<li>" +
	                            						"<div class=\"q-label\"><label>" + (u.dayTitle != null ? u.dayTitle : messages.day) + "</label></div>" +
	                            						"<div><select name=\"" + F + "\" class=\"days-list\" /></div>" +
	                            					"</li>" +
	                            					"<li>" +
	                        							"<div class=\"q-label\"><label>" + (u.monthTitle != null ? u.monthTitle : messages.month) + "</label></div>" +
	                        							"<div><select name=\"" + F + "\" class=\"months-list\" /></div>" +
	                        						"</li>" +
	                        					"</ul>" +
	                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	
		                                	var Z = a.find(".days-list");
		                                    	Z.loadSelect(messages.days);
		                                    var M = a.find(".months-list");
		                                    	M.loadSelect(messages.months);
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < Z[0].options.length; p++) {
		                                    			if(Z[0].options[p].value == u.answerValue.day) {
		                                    				Z[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < M[0].options.length; p++) {
		                                    			if(M[0].options[p].value == u.answerValue.month) {
		                                    				M[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    	}
		                                    	
		                                    	
		                                    	/*
		                                    	var t = 0;
		                                    	a.filter('a').click(function (e) {
		                                    		t++;
		                                    		jQuery('body').unbind('click').click(function() {
		                                    			t++;
		                                    			if(t == 1) {
		                                    				jQuery('body').unbind('click');
		                                    				*/
		                                    	
		                                    	var f = a.find('select');
		                                        f.change(function () {
		                                        	
                                    				var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text },
                                                        answerValue: { month : M.val() , day : Z.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
															
		                                        });
															
															/*
		                                    			}
		                                    			t = 0;
		                                    		});
		                                    		
		                                    	});
		                                    	*/
		                                    	
		                                    	
		                                    }
		                                    
		                                    break
		                                }
		                            case 4:
		                                {
		                                    // DD / MMM / YYYY
		                            		
		                                	var a = $("<li>" +
		                                			"<ul class=\"list-date\">" +
		                            					"<li>" +
		                            						"<div class=\"q-label\"><label>" + (u.dayTitle != null ? u.dayTitle : messages.day) + "</label></div>" +
		                            						"<div><select name=\"" + F + "\" class=\"days-list\" /></div>" +
		                            					"</li>" +
		                            					"<li>" +
		                        							"<div class=\"q-label\"><label>" + (u.monthTitle != null ? u.monthTitle : messages.month) + "</label></div>" +
		                        							"<div><select name=\"" + F + "\" class=\"months-list\" /></div>" +
		                        						"</li>" +
		                            					"<li>" +
		                        							"<div class=\"q-label\"><label>" + (u.yearTitle != null ? u.yearTitle : messages.year) + "</label></div>" +
		                        							"<div><input name=\"" + F + "\" type=\"text\" maxlength=\"4\" size=\"4\" class=\"year-field text-field\" /></div>" +
		                        						"</li>" +
		                        					"</ul>" +
		                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	var Z = a.find(".days-list");
		                                    	Z.loadSelect(messages.days);
		                                    var M = a.find(".months-list");
		                                    	M.loadSelect(messages.months);
		                                    var Y = a.find('.year-field');
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < Z[0].options.length; p++) {
		                                    			if(Z[0].options[p].value == u.answerValue.day) {
		                                    				Z[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < M[0].options.length; p++) {
		                                    			if(M[0].options[p].value == u.answerValue.month) {
		                                    				M[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		Y.val(u.answerValue.year);
		                                    	}
		                                    	
		                                    	/*
		                                    	var t = 0;
		                                    	a.filter('a').click(function (e) {
		                                    		t++;
		                                    		jQuery('body').unbind('click').click(function() {
		                                    			t++;
		                                    			if(t == 1) {
		                                    				jQuery('body').unbind('click');
		                                    				*/
		                                    	
		                                    	var f = a.find('select');
		                                        f.change(function () {
                                    				
		                                        	var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val() },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
															
		                                        });
		                                        
		                                        Y.focusout(function () {
		                                        	
		                                        	var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val() },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
		                                        	
		                                        });
		                                        
		                                        
		                                        
															/*
		                                    			}
		                                    			t = 0;
		                                    		});
		                                    		
		                                    	});
		                                    	*/
		                                    	
		                                    	
		                                    }
		                                    
		                                    break
		                                }
		                            case 5:
		                                {
		                                    
		                                	// DD / MMM / YYYY HH:MM
		                                	
		                                	var a = $("<li>" +
		                                			"<ul class=\"list-date\">" +
		                            					"<li>" +
		                            						"<div class=\"q-label\"><label>" + (u.dayTitle != null ? u.dayTitle : messages.day) + "</label></div>" +
		                            						"<div><select name=\"" + F + "\" class=\"days-list\" /></div>" +
		                            					"</li>" +
		                            					"<li>" +
		                        							"<div class=\"q-label\"><label>" + (u.monthTitle != null ? u.monthTitle : messages.month) + "</label></div>" +
		                        							"<div><select name=\"" + F + "\" class=\"months-list\" /></div>" +
		                        						"</li>" +
		                            					"<li>" +
		                        							"<div class=\"q-label\"><label>" + (u.yearTitle != null ? u.yearTitle : messages.year) + "</label></div>" +
		                        							"<div><input name=\"" + F + "\" type=\"text\" maxlength=\"4\" size=\"4\" class=\"year-field text-field\" /></div>" +
		                        						"</li>" +
		                        					"</ul>" +
		                        					"<ul class=\"list-time\">" +
		                        						"<li>" +
		                    								"<div class=\"q-label\"><label>" + (u.hoursTitle != null ? u.hoursTitle : messages.hours) + "</label></div>" +
		                    								"<div><select name=\"" + F + "\" class=\"hours-list\" /></div>" +
		                    							"</li>" +
		                    							"<li>" +
	                    									"<div class=\"q-label\">&nbsp;</div>" +
	                    									"<div>:</div>" +
	                    								"</li>" +
		                    							"<li>" +
		                									"<div class=\"q-label\"><label>" + (u.minutesTitle != null ? u.minutesTitle : messages.minutes) + "</label></div>" +
		                									"<div><select name=\"" + F + "\" class=\"minutes-list\" /></div>" +
		                								"</li>" +
		                            				"</ul>" +
		                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	var Z = a.find(".days-list");
		                                    	Z.loadSelect(messages.days);
		                                    var M = a.find(".months-list");
		                                    	M.loadSelect(messages.months);
		                                    var Y = a.find('.year-field');
		                                    var H = a.find(".hours-list");
		                                    	H.loadSelect(messages.hours);
		                                    var N = a.find(".minutes-list");
		                                    	N.loadSelect(messages.minutes);
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < Z[0].options.length; p++) {
		                                    			if(Z[0].options[p].value == u.answerValue.day) {
		                                    				Z[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < M[0].options.length; p++) {
		                                    			if(M[0].options[p].value == u.answerValue.month) {
		                                    				M[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		Y.val(u.answerValue.year);
		                                    		
		                                    		for(var p = 0; p < H[0].options.length; p++) {
		                                    			if(H[0].options[p].value == u.answerValue.hours) {
		                                    				H[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < N[0].options.length; p++) {
		                                    			if(N[0].options[p].value == u.answerValue.minutes) {
		                                    				N[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    	}
		                                    	
		                                    	/*
		                                    	var t = 0;
		                                    	a.filter('a').click(function (e) {
		                                    		t++;
		                                    		jQuery('body').unbind('click').click(function() {
		                                    			t++;
		                                    			if(t == 1) {
		                                    				jQuery('body').unbind('click');
		                                    				*/
		                                    	
		                                    	var f = a.find('select');
		                                        f.change(function () {
		                                        	
                                    				var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val(), hours : H[0].options[H[0].selectedIndex].text, minutes : N[0].options[N[0].selectedIndex].text },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val(), hours : H.val(), minutes : N.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
															
		                                        });
		                                        
		                                        Y.focusout(function () {
		                                        	
		                                        	var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { month : M[0].options[M[0].selectedIndex].text , day : Z[0].options[Z[0].selectedIndex].text, year : Y.val(), hours : H[0].options[H[0].selectedIndex].text, minutes : N[0].options[N[0].selectedIndex].text },
                                                        answerValue: { month : M.val() , day : Z.val(), year : Y.val(), hours : H.val(), minutes : N.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
		                                        	
		                                        });
		                                        
															/*
		                                    			}
		                                    			t = 0;
		                                    		});
		                                    		
		                                    	});
		                                    	*/
		                                    }
		                                    
		                                    break
		                                }
		                            case 6:
		                                {
		                                    
		                            		/*
		                                	var a = $("<div class=\"row-desc\">" +
		                                			"<div class=\"cell-desc-month\">" + (u.monthTitle != null ? u.monthTitle : contentDictionary.titles.title_Month) + "</div>" +
		                                		"</div>" + 
		                                		"<div class=\"row\"><div class=\"cell\"><select name=\"" + F + "\" class=\"months-list\" /></div></div>").appendTo(g);
		                                    */
		                            	
		                            		// MMM
		                                	
		                                	var a = $("<li>" +
		                                			"<ul class=\"list-date\">" +
		                            					"<li>" +
		                        							"<div class=\"q-label\"><label>" + (u.monthTitle != null ? u.monthTitle : messages.month) + "</label></div>" +
		                        							"<div><select name=\"" + F + "\" class=\"months-list\" /></div>" +
		                        						"</li>" +
		                        					"</ul>" +
		                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	
		                                	var M = a.find(".months-list");
		                                    	M.loadSelect(messages.months);
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < M[0].options.length; p++) {
		                                    			if(M[0].options[p].value == u.answerValue.month) {
		                                    				M[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    	}
		                                    	
		                                        var f = a.find('select');
		                                        f.change(function () {
		                                        	var m = {
		                                                controlId: F,
		                                                controlParentTypeId: u.parentTypeId,
		                                                controlParentId: u.parentId,
		                                                controlTypeId: u.controlTypeId,
		                                                inputTypeId: u.inputTypeId,
		                                                controlIndex : I.controlIndex,
		                                                controlContent: u.content,
		                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                sheetIndex: _data.sheets.lastSelected,
		                                                answerText: { month : $(this)[0].options[$(this)[0].selectedIndex].text },
		                                                answerValue: { month : $(this).val() }
		                                            };
		                                        	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
		                                        });
		                                    }
		                                    
		                                    break
		                                }
		                            case 7:
		                                {
		                                    
		                                	
		                            		/*
		                            		var a = $("<div class=\"row-desc\"><div class=\"cell-desc-month\">" + (u.dayTitle != null ? u.dayTitle : contentDictionary.titles.title_Day) + "</div></div>" + "<div class=\"row\"><div class=\"cell\"><select name=\"" + F + "\" class=\"days-list\" /></div></div>").appendTo(g);
		                                    */
		                            	
		                            		// DD
		                                	
		                                	var a = $("<li>" +
		                                			"<ul class=\"list-date\">" +
		                            					"<li>" +
		                            						"<div class=\"q-label\"><label>" + (u.dayTitle != null ? u.dayTitle : messages.day) + "</label></div>" +
		                            						"<div><select name=\"" + F + "\" class=\"days-list\" /></div>" +
		                            					"</li>" +
		                        					"</ul>" +
		                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	var Z = a.find(".days-list");
		                                    	Z.loadSelect(messages.days);
		                                    	
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
			                                    	for(var p = 0; p < Z[0].options.length; p++) {
			                                			if(Z[0].options[p].value == u.answerValue.day) {
			                                				Z[0].selectedIndex = p;
			                                				break;
			                                			}
			                                		}
		                                    	}
		                                    	
		                                        var f = a.find('select');
		                                        f.change(function () {
		                                        	var m = {
		                                                controlId: F,
		                                                controlParentTypeId: u.parentTypeId,
		                                                controlParentId: u.parentId,
		                                                controlTypeId: u.controlTypeId,
		                                                inputTypeId: u.inputTypeId,
		                                                controlIndex : I.controlIndex,
		                                                controlContent: u.content,
		                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                sheetIndex: _data.sheets.lastSelected,
		                                                answerText: { day : $(this)[0].options[$(this)[0].selectedIndex].text },
		                                                answerValue: { day : $(this).val() }
		                                            };
		                                        	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
		                                        });
		                                    }
		                                    
		                                    break
		                                }
		                            case 8:
		                                {
		                                    
		                                	/*
		                            		var a = $("<div class=\"row-desc\"><div class=\"cell-desc-month\">" + (u.yearTitle != null ? u.yearTitle : contentDictionary.titles.title_Year) + "</div></div>" + "<div class=\"row\"><div class=\"cell\"><input name=\"" + F + "\" type=\"text\" maxlength=\"4\" class=\"year-field text-field\" /></div></div>").appendTo(g);
		                                	*/
		                                	
		                            		// YYYY
		                            	
		                                	var a = $("<li>" +
		                                			"<ul class=\"list-date\">" +
		                            					"<li>" +
		                        							"<div class=\"q-label\"><label>" + (u.yearTitle != null ? u.yearTitle : messages.year) + "</label></div>" +
		                        							"<div><input name=\"" + F + "\" type=\"text\" maxlength=\"4\" size=\"4\" class=\"year-field text-field\" /></div>" +
		                        						"</li>" +
		                        					"</ul>" +
		                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	
		                                	var Y = a.find('.year-field');
		                                	
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                		
		                                        if(u.answerValue != undefined) {
		                                    		Y.val(u.answerValue.year);
		                                    	}
		                                        
		                                        Y.focusout(function () {
			                                        var m = {
			                                            controlId: F,
			                                            controlParentTypeId: u.parentTypeId,
			                                            controlParentId: u.parentId,
			                                            controlTypeId: u.controlTypeId,
			                                            inputTypeId: u.inputTypeId,
			                                            controlIndex : I.controlIndex,
			                                            controlContent: u.content,
			                                            sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
			                                            sheetIndex: _data.sheets.lastSelected,
			                                            answerValue: { year : $(this).val() },
			                                            answerValue: { year : $(this).val() }
			                                        };
			                                        
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
			                                    });
		                                	}
		                                    
		                                    break
		                                }
		                            case 9:
		                                {
		                                    
		                                	
		                            		
		                            		/*
		                                	var a = $("<div class=\"row-desc\"><div class=\"cell-desc-month\">" + (u.hoursTitle != null ? u.hoursTitle : contentDictionary.titles.title_Hours) + "</div><div class=\"cell-desc-month\">" + (u.minutesTitle != null ? u.minutesTitle : contentDictionary.titles.title_Minutes) + "</div></div>" + "<a class=\"row filtered\"><div class=\"cell\"><select name=\"" + F + "\" class=\"hours-list\" />&nbsp;:</div><div class=\"cell\" ><select name=\"" + F + "\" class=\"minutes-list\" /></div></a>").appendTo(g);
		                                    */
		                            	
		                            		// HH : MM
		                                	
		                                	var a = $("<li>" +
		                                			"<ul class=\"list-time\">" +
		                        						"<li>" +
		                    								"<div class=\"q-label\"><label>" + (u.hoursTitle != null ? u.hoursTitle : messages.hours) + "</label></div>" +
		                    								"<div><select name=\"" + F + "\" class=\"hours-list\" /></div>" +
		                    							"</li>" +
		                    							"<li>" +
		                    								"<div class=\"q-label\">&nbsp;</div>" +
		                    								"<div>:</div>" +
		                    							"</li>" +
		                    							"<li>" +
		                									"<div class=\"q-label\"><label>" + (u.minutesTitle != null ? u.minutesTitle : messages.minutes) + "</label></div>" +
		                									"<div><select name=\"" + F + "\" class=\"minutes-list\" /></div>" +
		                								"</li>" +
		                            				"</ul>" +
		                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	var H = a.find(".hours-list");
		                                    	H.loadSelect(messages.hours);
		                                    var N = a.find(".minutes-list");
		                                    	N.loadSelect(messages.minutes);
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < H[0].options.length; p++) {
		                                    			if(H[0].options[p].value == u.answerValue.hours) {
		                                    				H[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    		
		                                    		for(var p = 0; p < N[0].options.length; p++) {
		                                    			if(N[0].options[p].value == u.answerValue.minutes) {
		                                    				N[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    	}
		                                    	
		                                    	
		                                    	/*
		                                    	var t = 0;
		                                    	a.filter('a').click(function (e) {
		                                    		t++;
		                                    		jQuery('body').unbind('click').click(function() {
		                                    			t++;
		                                    			if(t == 1) {
		                                    				jQuery('body').unbind('click');
		                                    				*/
		                                    		
		                                    	var f = a.find('select');
		                                        f.change(function () {
		                                    	
                                    				var m = {
                                                        controlId: F,
                                                        controlParentTypeId: u.parentTypeId,
                                                        controlParentId: u.parentId,
                                                        controlTypeId: u.controlTypeId,
                                                        inputTypeId: u.inputTypeId,
                                                        controlIndex : I.controlIndex,
                                                        controlContent: u.content,
                                                        sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
                                                        sheetIndex: _data.sheets.lastSelected,
                                                        answerText: { hours : H[0].options[H[0].selectedIndex].text , minutes : N[0].options[N[0].selectedIndex].text },
                                                        answerValue: { hours : H.val() , minutes : N.val() }
                                                    };
                                                	
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
															
		                                        });
															
															/*
		                                    			}
		                                    			t = 0;
		                                    		});
		                                    		
		                                    	});
		                                    	*/
		                                    	
		                                    }
		                                    
		                                    break
		                                }
		                            case 10:
		                                {
		                                    
		                            		
		                            		/*
		                                	var a = $("<div class=\"row-desc\"><div class=\"cell-desc\">" + (u.timeZoneTitle != null ? u.timeZoneTitle : contentDictionary.titles.title_TimeZone) + "</div></div>" + "<div class=\"row\"><div class=\"cell\"><select name=\"" + F + "\" class=\"timezones-list\" /></div></div>").appendTo(g);
		                                    */
		                            	
		                            		// TIMEZONE
		                                	
		                                	var a = $("<li>" +
		                                			"<ul class=\"list-date\">" +
		                            					"<li>" +
		                            						"<div class=\"q-label\"><label>" + (u.timeZoneTitle != null ? u.timeZoneTitle : messages.timeZone) + "</label></div>" +
		                            						"<div><select name=\"" + F + "\" class=\"timezones-list\" /></div>" +
		                            					"</li>" +
		                        					"</ul>" +
		                            			"</li>").appendTo(g);
		                                	
		                                	
		                                	
		                                	var T = a.find(".timezones-list");
		                                    	T.loadSelect(messages.timeZones);
		                                    	
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                    	
		                                    	if(u.answerValue != undefined) {
		                                    		for(var p = 0; p < T[0].options.length; p++) {
		                                    			if(T[0].options[p].value == u.answerValue.timeZone) {
		                                    				T[0].selectedIndex = p;
		                                    				break;
		                                    			}
		                                    		}
		                                    	}
		                                    	
		                                        var f = a.find('select');
		                                        f.change(function () {
		                                            var m = {
		                                                controlId: F,
		                                                controlParentTypeId: u.parentTypeId,
		                                                controlParentId: u.parentId,
		                                                controlTypeId: u.controlTypeId,
		                                                inputTypeId: u.inputTypeId,
		                                                controlIndex : I.controlIndex,
		                                                controlContent: u.content,
		                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                sheetIndex: _data.sheets.lastSelected,
		                                                answerText: { timeZone : $(this)[0].options[$(this)[0].selectedIndex].text },
		                                                answerValue: { timeZone : $(this).val() }
		                                            };
		                                            
													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : m
													});
		                                        });
		                                    }
		                                    
		                                    break
		                                }
		                            }
		                            c.appendTo(v);
		                            
		                            if(link) {
		                            	
		                            	// image
		                            	if(u.linkTypeId == 1) {
		                            		c.find('.container-embed-code')
		                            			.html("<img src=" + u.link + " />")
		                            			.show();
		                            	}
		                            	
		                            	// embed code
		                            	if(u.linkTypeId == 2) {
			                            	c.find('.container-embed-code')
			                        			.html(u.link)
			                        			.show();
		                            	}
		                            }
		                            
		                            
		                            /*
		                            break
		                        }
		                    }
		                    */
		                    
		                };
		                G();
		                break
		            }
		        case 10:
		            {
		                var c = E;
		                var link = null;
		                var g = c.find('.container-control-includes');
		                var otherContainer = c.find(".container-control-other");
		                var F = I.controlId;
		                var H = [5, 7, 9, 0, 3, 4, 5, 6, 7, 8, 9, 10];
		                var G = function () {
		                	
		                	/*
		                    for (var x = 0; x < controls.list.length; x++) {
		                        if (controls.list[x].controlId == F) {
		                        	*/
		                	
		                		
		                	
		                			//alert(JSON.stringify(_data));
		                	
		                	
		                        	// return i
		                            I.complete(1);
		                        	
		                        	var u = control; //survey.controls.list[x];
		                            c.find('.header-control-content').html(u.content.replace(/\n/g, "<br/>"));
		                            if (u.isMandatory) {
		                            	
		                            	if(_data.highlightRequiredQuestions) {
		                            		c.find('.label-control-mandatory').show();
		                            	}
		                            	
		                                // mandatory validation
		                            	validateElements.elements.push({
		                            		group : String(F),
		                            		status : c.find('.label-status'),
		                            		rules : [
		                            		         { method : 'required', message : 'This question is required.' }
		                 					]
		                            	});
		                            	
		                            	
		                            }
		                            
		                            if(u.link) {
		                            	link = u.link;
		                            }
		                            
		                            if (u.isEnableNote) {
		                            	if(u.note != null) {
		                            		c.find('.label-control-note').html(u.note.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>")).show()
		                            	}
		                            }
		                            var a = $("<table cellpadding=\"0\" cellspacing=\"1\" border=\"0\" class=\"table-scale\"></table>");
		                            var b = $("<tr class=\"table-scale-header\"></tr>");
		                            var d = $("<tr class=\"table-scale-row\"></tr>");
		                            var e = $("<td>&nbsp;</td>");
		                            var f = $("<td>&nbsp;</td>");
		                            if (u.fromScale != null && u.toScale != null) {
		                                if (u.fromTitle != "" && u.fromTitle != null) {
		                                    b.append(e);
		                                    var h = $("<th>" + u.fromTitle + "</th>");
		                                    d.append(h)
		                                }
		                                for (var y = u.fromScale; y < (H[u.toScale] + 1); y++) {
		                                    var i = $("<th>" + y + "</th>");
		                                    b.append(i);
		                                    var j = $("<td><label><input type=\"radio\" name=\"" + F + "\" optionid=\"" + y + "\" optiontext=\"" + y + "\" value=\"" + y + "\" /></label></td>");
		                                    d.append(j);
		                                    
		                                    if (_data.guidTypeId == 1 && _data.modeId == 1) {
		                                        var s = j.find('input:radio');

		                                        if(s.val() == u.answerValue){
		                                        	s.prop('checked', true);
		                                        }
		                                        
		                                        s.change(function () {
		                                        	
		                                            var a = {
		                                                controlId: F,
		                                                controlParentTypeId: u.parentTypeId,
		                                                controlParentId: u.parentId,
		                                                controlTypeId: u.controlTypeId,
		                                                inputTypeId: u.inputTypeId,
		                                                controlIndex : I.controlIndex,
		                                                controlContent: u.content,
		                                                sheetId: _data.sheets.list[_data.sheets.lastSelected].sheetId,
		                                                sheetIndex: _data.sheets.lastSelected,
		                                                answerValue: $(this).val()
		                                            };

													createResponse({
														guidTypeId : _data.guidTypeId,
														guid : _data.guid,
														modeId : _data.modeId,
														responseTypeId : responseType.control,
														async : true,
														responseData : a
													});
		                                            
		                                        });
		                                    }
		                                    
		                                }
		                                if (u.toTitle != "" && u.toTitle != null) {
		                                    b.append(f);
		                                    var k = $("<th>" + u.toTitle + "</th>");
		                                    d.append(k);
		                                }
		                                a.append(b);
		                                a.append(d);
		                                otherContainer.append(a);
		                            }
		                            c.appendTo(v);
		                            
		                            if(link) {
		                            	
		                            	// image
		                            	if(u.linkTypeId == 1) {
		                            		c.find('.container-embed-code')
		                            			.html("<img src=" + u.link + " />")
		                            			.show();
		                            	}
		                            	
		                            	// embed code
		                            	if(u.linkTypeId == 2) {
			                            	c.find('.container-embed-code')
			                        			.html(u.link)
			                        			.show();
		                            	}
		                            }
		                            
		                            
		                            //break
		                            
		                            /*
		                        }
		                    }
		                    */
		                };
		                G();
		                break
		            }
		        }
		    };
		    
		    J(I.controlTypeId, I.control);
		};
		
		
		// ready
		$(document).ready(function($) {
			
			var target = /(^https?:\/\/[^\/]*(\:\d+)?)?\/.*scripts\/widget\/1.0.2\/survey\.js/; 
			findScript(target).each(function() {
				
				var config = evalConfig($(this).html());
				var el = $("<div class=\"theme-body ui-body-a\" data-theme=\"a\" data-form=\"ui-body-a\"/>")
					.addClass("survey survey-" + config.guid);
				
				var that = this;
				$(that).before(el).remove();
				
				_el = el;
				
				fromConfig(config, function(config, data) {

					// package all script into 
					
					// do render
					render(el, config, data);
					
				});
				
				
				
			});
			
		});
				
	}

})();
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2521304-12']);
//_gaq.push(['_setDomainName', 'inqwise.com']);
//_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();