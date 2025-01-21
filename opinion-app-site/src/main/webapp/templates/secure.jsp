
<%@ page import="com.inqwise.opinion.infrastructure.systemFramework.ApplicationLog" trimDirectiveWhitespaces="true" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="com.inqwise.opinion.cms.common.IPage" %>
<%@ page import="com.inqwise.opinion.cms.common.IStylesheet" %>
<%@ page import="com.inqwise.opinion.cms.common.IScript" %>
<%@ page import="com.inqwise.opinion.library.systemFramework.ApplicationConfiguration" %>

<%@ page import="java.util.Locale" %>
<%@ page import="org.xnap.commons.i18n.I18n" %>
<%@ page import="org.xnap.commons.i18n.I18nFactory" %>

<%
IPage p = (IPage)request.getAttribute("p");
String absoluteURL = p.getRootAbsoluteUrl();
String applicationURL = p.getApplicationUrl();

String pageKeywords = StringUtils.join(p.getKeywords(), ',');
String pageDescription = p.getDescription();
String pageTitle = p.getTitle();
String pageHeader = p.getHeader();
String pageContent = p.getContent();
String canonicalURL = p.getCanonicalUrl();
String lang = p.getCultureCode().substring(0, 2);
String uri = p.getUri();
//Get current year
Calendar cal=Calendar.getInstance();
int year = cal.get(Calendar.YEAR);

//Translations
Locale locale1 = new Locale(lang);
I18n i18n = I18nFactory.getI18n(this.getClass(), "messages", locale1);

String opinionId = null;
opinionId = request.getParameter("opinion_id");
String collectorId = null;
collectorId = request.getParameter("collector_id");
String requestUrl = request.getAttribute("javax.servlet.forward.request_uri").toString();
if(null != requestUrl){
	requestUrl = URLEncoder.encode(p.getServerUrl() + requestUrl,"utf-8");
}
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%=lang%>" lang="<%=lang%>" dir="<%=(lang.equals("he") || lang.equals("ar") ? "rtl" : "ltr")%>">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><%= p.getWindowTitle() %> - Inqwise</title>
		<meta name="description" content="<%=p.getDescription() %>" />
		<meta name="keywords" content="<%=StringUtils.join(p.getKeywords(), ",") %>" />
		<meta property="og:title" content="Inqwise" />
		<meta property="og:description" content="Online surveys - fast, easy and free." />
		<meta property="og:image" content="<%=applicationURL %>/images/100x100.png" />
		<meta http-equiv="content-language" content="<%=lang%>" />
		<meta name="robots" content="noindex, nofollow" />
		
		<link rel="icon" href="<%=applicationURL%>/favicon.ico" type="image/x-icon" />
		<link rel="shortcut icon" href="<%=applicationURL%>/favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css" href="<%=applicationURL%>/css/global.css" />
		<!--[if gte IE 9]>
		  <style type="text/css">
		    .gradient {
		       filter: none;
		    }
		  </style>
		<![endif]-->
		<!--  <link rel="stylesheet" type="text/css" href="<%=applicationURL%>/css/icomoon1.css" /> -->
		<link rel="stylesheet" type="text/css" href="<%=applicationURL%>/css/lightface/lightface.css" />
		<link rel="stylesheet" type="text/css" href="<%=applicationURL%>/css/dialog/dialog.css" />
		<link rel="stylesheet" type="text/css" href="<%=applicationURL%>/css/datepicker/datepicker.css" />
		<link rel="stylesheet" type="text/css" href="<%=applicationURL%>/css/tipsy/tipsy.css" />
		
		<%
			for(IStylesheet css : p.getCssList()){
				out.println(p.getHtmlTag(css));
			}
		%>
		
		<script type="text/javascript" src="<%=applicationURL%>/scripts/jquery/1.8.2/jquery.min.js"></script>
		<!-- <script type="text/javascript">window.jQuery || document.write("<script type=\"text/javascript\" src=\"<%=applicationURL%>/scripts/jquery/1.8.2/jquery.min.js\"><\/script>")</script> -->
		<script type="text/javascript" src="<%=applicationURL%>/scripts/utils/utils.js"></script>
		<!--[if lt IE 8]>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/utils/json2.js"></script>
		<![endif]-->
		
		
		<script type="text/javascript" src="<%=applicationURL%>/scripts/cowboy/cowboy.js"></script>
		<!-- <script type="text/javascript" src="<%=applicationURL%>/scripts/collapsible/collapsible.js"></script> -->
		<!-- <script type="text/javascript" src="<%=applicationURL%>/scripts/autocomplete/jquery.autocomplete.js"></script> -->
		
		<script type="text/javascript" src="<%=applicationURL%>/scripts/utils/date.min.js"></script>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/tipsy/tipsy.min.js"></script>
		
		<script type="text/javascript" src="<%=applicationURL%>/scripts/lightloader/1.0.1/lightloader.min.js"></script>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/validator/validator-1.2.8.js"></script>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/lightface/lightface.min.js"></script>
		
		<script type="text/javascript" src="<%=applicationURL%>/scripts/lightdialog/lightdialog.js"></script>
		
		<%
			for(IScript script : p.getScripts()){
				out.println(p.getHtmlTag(script));
			}
		%>
		<script type="text/javascript">
		var startTime=(new Date).getTime();
		var servletUrl = "<%=applicationURL%>/servlet/DataPostmaster/<%=p.getCultureCode()%>";
		var apiUrl = "<%=ApplicationConfiguration.Api.getUrl()%>/site";
		
		var jsapi = {
			version: "5.11.0"
		};
		jsapi.LOG_LEVEL_QUIET = 0;
		jsapi.LOG_LEVEL_INFO = 1;
		jsapi.LOG_LEVEL_DEBUG = 2;
		jsapi.setLogLevel = function (b) {
	        "undefined" !== typeof console && b > jsapi.LOG_LEVEL_QUIET ? (jsapi.log = function () {
	            console.log("> " + (new Date).toTimeString().substr(3, 6) + Array.prototype.slice.call(arguments).join(" "))
	        }, jsapi.warn = function () {
	            console.warn("> " + (new Date).toTimeString().substr(3, 6) + Array.prototype.slice.call(arguments).join(" "))
	        }, jsapi.debug = b > jsapi.LOG_LEVEL_INFO ? function () {
	            console.log("> " + (new Date).toTimeString().substr(3, 6) + Array.prototype.slice.call(arguments).join(" "))
	        } : function () {}) : jsapi.warn = jsapi.log = jsapi.debug = function () {}
	    };
	    jsapi.setLogLevel(jsapi.LOG_LEVEL_INFO);
	    jsapi.log("Inqwise JSAPI Runtime", jsapi.version);

		// authentication
		;(function($) {
			authentication = function(givenOptions) {
				
				var options = $.extend( {
					servletUrl : null,
					mustAuthenticated : false,
					absoluteUrl : null,
					applicationUrl : null
				}, givenOptions);
				
				var userInfo = {};
				
				var validate = function() {
					
					if($.cookie('sid') != null 
							&& $.cookie('uid') != null) {
						
						$.ajax({
							type: "GET",
							url: options.servletUrl,
						  	async: false,
						  	data: { 
								rq: JSON.stringify({ 
									validateUser : {}
								}), 
								timestamp: $.getTimestamp() 
							},
						  	dataType: "json",
						  	success: function(data) {
						  		if(data.validateUser.error) {
						  			if(options.mustAuthenticated) {
						  				if("NoPackageSelected" == data.validateUser.error){
											location.href = options.absoluteUrl + "/pricing";
										} else {
											location.href = options.absoluteUrl + "/login?ret=<%=requestUrl%>";
										}
						  			} else {
						  				
						  			}
								} else {
									if(options.mustAuthenticated) {
										
										userInfo = data.validateUser;
										
									} else {
										location.href = options.absoluteUrl + "/dashboard";
									}
								}
						  	},
							error: function (XHR, textStatus, errorThrow) {
								// error 
								// connection
							}
						});
							
					} else {
						if(options.mustAuthenticated) {
							location.href = options.absoluteUrl + "/login?ret=<%=requestUrl%>";
						} else {
							
						}
					}
				};
				
				validate();
				
				return {
					userInfo : userInfo
				};
			};
		})(jQuery);
		
		// Your session is about to expire
		// Do you want to stay logged in?
		// Yes, keep me signed in 
		var auth = new authentication({
			servletUrl : servletUrl,
			mustAuthenticated : true,
			absoluteUrl : "<%=absoluteURL %>",
			applicationUrl : "<%=applicationURL%>"
		});
		
		
		var applicationUri = "<%=applicationURL%>";
		var absoluteUrl = "<%=absoluteURL %>";
		
		var loader = null;
		
		var accountId = null;
		
		$(function() {

			loader = new lightLoader({
				message : "<%=i18n.tr("Loading...")%>"
			});

			// display userName
			$('#label_username').text(auth.userInfo.userName);
			
			if(auth.userInfo.accounts != undefined) {
				
				$("#container_switch_account").show();
				
				
				var storedAccountId = $.cookie("aid");
				
				var l = 0;
				var isMatch = false;
				var s = $("#select_account");
				var e = s[0].options;
                for (var f = 0; f < auth.userInfo.accounts.length; f++) {
                	if(storedAccountId == null || storedAccountId == "") {
						if (auth.userInfo.accountId == auth.userInfo.accounts[f].id) {
	                        l = f;
	                        isMatch = true;
	                    }
						$.cookie("aid", auth.userInfo.accountId, { path : "/" });
					} else {
						if(storedAccountId == auth.userInfo.accounts[f].id) {
							l = f;
							isMatch = true;
						}
					}
                	
                    var k = new Option(auth.userInfo.accounts[f].name, auth.userInfo.accounts[f].id);
                    try {
                        e.add(k);
                    } catch (ex) {
                        e.add(k, null)
                    }
                }
                
                if(!isMatch) {
					$.cookie("aid", auth.userInfo.accountId, { path : "/" });
                }
                
                s[0].selectedIndex = l;
                s.change(function () {
                	
                    var a = $(this).find('option:selected');
                    
                 	// change cookie aid
					$.cookie("aid", a.val(), { path : "/" });
					
					location.href = "<%=absoluteURL%>/dashboard";
                    
                });
				
			} else {
				
				$.cookie("aid", auth.userInfo.accountId, { path : "/" });
				
			}
			
			accountId = $.cookie("aid");
			
			jsapi.log("set account id -> " + accountId);
			
		});

		</script>

	</head>
	<body id="top">
		<div class="<%= ((p.getTemplateId() == 2) ? "wrapper-constructed" : "wrapper") %> cW">
			<div class="wrapper-content">
				<div class="wrapper-header">
					<div class="header-container">
						<div class="header-toolbar">
							<div class="header-toolbar-left-panel">
								<div class="logo-container">
									<a href="<%=absoluteURL%>/dashboard" title="Survey Software" class="logo">Online Survey Software</a>
								</div>
							</div>
							<div class="header-toolbar-right-side">
								<div class="login-bar">
									<ul class="lg">
										<li class="first-item"><span id="label_username"></span></li><!-- <li><a href="#" id="link_messages" title="<%=i18n.tr("Messages") %>"><%=i18n.tr("Messages") %><ins id="label_messages" class="label-count" style="display: none;">0</ins></a></li> --><li><a href="javascript:;" onclick="feedback()" title="<%=i18n.tr("Send Feedback") %>"><%=i18n.tr("Send Feedback") %></a></li><li class="last-item"><a href="<%=absoluteURL %>/logout" title="<%=i18n.tr("Sign Out") %>"><%=i18n.tr("Sign Out") %></a></li>
									</ul>
								</div>
							</div>
						</div>
						<div class="header-navigation">
							<ul class="header-navigation-tabs">
								<li class="first-item"><a class="<%= ("dashboard".equals(uri) ? "selected" : "" ) %>" href="<%=absoluteURL%>/dashboard" title="Dashboard"><span>Dashboard</span></a></li>
								<li><a class="<%= (("surveys".equals(uri) || "create-survey".equals(uri) || "survey-details".equals(uri) || "survey-settings".equals(uri) || "survey-edit".equals(uri) || "survey-reordering".equals(uri) || "survey-branding".equals(uri) || "survey-rules".equals(uri) || "survey-collectors".equals(uri) || "survey-collector-details".equals(uri) || "survey-collector-settings".equals(uri) || "survey-create-collector".equals(uri) || "survey-responses".equals(uri) || "survey-response".equals(uri) || "survey-overall-results".equals(uri) || "survey-statistics".equals(uri)) ? "selected" : "" ) %>" href="<%=absoluteURL%>/surveys" title="<%=i18n.tr("Surveys") %>"><span><%=i18n.tr("Surveys") %></span></a></li>
								<!-- <li><a class="<%= (("support".equals(uri) || "support-search".equals(uri) || "bugs".equals(uri) || "create-bug-report".equals(uri)) ? "selected" : "" ) %>" href="<%=absoluteURL%>/support" title="Help / Support"><span>Help / Support</span></a></li> -->
								<li><a class="<%= (("account".equals(uri) || "user-details".equals(uri) || "charges".equals(uri) || "charge".equals(uri) || "upgrade".equals(uri) || "invoices".equals(uri) || "invoice".equals(uri) || "receipts".equals(uri) || "receipt".equals(uri) || "billing-profile".equals(uri) || "transaction-history".equals(uri) || "users".equals(uri) || "cancel-account".equals(uri) || "make-payment".equals(uri)) ? "selected" : "" ) %>" href="<%=absoluteURL%>/account" title="<%=i18n.tr("Account") %>"><span><%=i18n.tr("Account") %></span></a></li>
							</ul>
							<div style="float: right;height: 24px;display: none" id="container_switch_account">
								<select id="select_account" autocomplete="off"></select>
							</div>
						</div>
					</div>
				</div>
				
				<table cellpadding="0" cellspacing="0" border="0" width="100%">
					<tr>
						<td valign="top">
							
							
							<!--
							<div class="cA1">
								<div class="flyover">
									<div class="flyover-bar">
										<div class="cA3">
	
										</div>
									</div>
									<div class="flyover-container">
										<div class="cA5">
											<div style="padding: 10px;" class="_5cw7">
												<div class="cA9">
													<a class="cA4" title="Collapse navigation panel" style="display: none">Collapse navigation panel</a>
													<a class="cA7" title="Lock navigation panel">Lock navigation panel</a>
												</div>
												<div>
													<div class="search-across">
														<input type="text" id="text_search_across" placeholder="Search..." />
														<div id="container_search_across" style="position: relative"></div>
													</div>
												</div>
											</div>
											<table cellpadding="0" cellspacing="0" border="0" class="stack-panel">
												<tr>
													<td class="stack-panel-content">
													</td>
												</tr>
												<tr>
													<td class="stack-panel-item">
														<a href="<%=absoluteURL%>/messages" title="<%=i18n.tr("Messages") %>"><%=i18n.tr("Messages") %></a>
													</td>
												</tr>
											</table>
										</div>
									</div>
								</div>
							</div>
							-->
							<div class="content-container XcO">
								
								<div class="breadcrumbs">
								<%
								StringBuilder sb = new StringBuilder();
								if(p.hasParent()){
									sb.append("<span class=\"child-item\">" + p.getTitle() + "</span>");;
									IPage actualPage = p.getParent();
									while(actualPage.hasParent()){
										
										// survey collectors
										if(actualPage.getUri().equals("survey-collectors") && !actualPage.getUri().equalsIgnoreCase("create-collector")) {
											sb.insert(0, "<a href=\"" + absoluteURL + "/surveys/" + opinionId + "/collectors/" + collectorId
													+ "\" class=\"child-item\" style=\"color: #324E8D;\" id=\"breadcrumb_collector_name\">&nbsp;</a>");
										}
										
										if(actualPage.getUri().equals("survey-collectors") || actualPage.getUri().equals("survey-responses")) {
											
											
											sb.insert(0, "<a href=\"" + absoluteURL + "/"
													+ actualPage.getParent().getUri() + "/" + opinionId + "/" + actualPage.getUri().replaceFirst("survey-", "")
													+ "\" title=\"" + actualPage.getTitle() + "\" class=\"child-item\" " + "style=\"color: #324E8D;\"" + ">" + actualPage.getTitle() + "</a>");
											
										} else {
											
											sb.insert(0, "<a href=\"" + absoluteURL + "/"
													+ actualPage.getUri()
													+ "\" title=\"" + actualPage.getTitle() + "\" class=\"child-item\" " + "style=\"color: #324E8D;\"" + ">" + actualPage.getTitle() + "</a>");
											
										}
										
										
										actualPage = actualPage.getParent();
									}
									
									if(actualPage != p){
										
										if(actualPage.getUri().equals("surveys")) {
											sb.insert(0, "<a href=\"" + absoluteURL + "/surveys/" + opinionId + "/edit"
													+ "\" class=\"child-item\" style=\"color: #324E8D;\" id=\"breadcrumb_survey_name\">&nbsp;</a>");
										}
										
										sb.insert(0, "<a href=\"" + actualPage.getAbsoluteUrl() + "\" title=\"" + actualPage.getTitle() + "\">" + actualPage.getTitle() + "</a>");
									}
									
									
								} else {
									sb.append("<span style=\"color: #999\">" + p.getTitle() + "</span>");
								}
								
								out.print(sb.toString());
								%>
								</div>
								
								<div>
									<% if(!p.isComplex()) { %>
									<h1><%= p.getHeader() %></h1>
									<div>
										<%out.print(p.getContent()); %>
									</div>
									<% 
									  } else { 
										  out.print(p.getContent()); 
									  } 
									%>
								</div>
								<div style="clear: both; padding-top: 20px;">
									<!-- <a href="#top" title="Back to Top">Top</a> --> &nbsp;
								</div>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div class="wrapper-footer XcO">
				<div class="footer-container">
					<div>
						<div class="footer-navigation-left-panel">
							<ul class="ld">
								<li class="first-item last-item"><a href="<%=absoluteURL%>/create-bug-report" title="Report a Bug">Report a Bug</a></li>
							</ul>
						</div>
						<div class="footer-navigation-right-panel"></div>
					</div>
					<div class="footer-copyright">
						<table cellpadding="0" cellspacing="0" border="0" width="100%">
							<tr>
								<td valign="top">Copyright &copy; 2011-<%=year %> Inqwise Ltd. All rights reserved.</td>
								<td valign="top" style="text-align: right"></td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
		
		<div class="fileupload-mole">
			<div class="fileupload-mole-title">
				<span class="fileupload-mole-status">Uploading...</span>
				<a class="fileupload-mole-minimize" title="Minimize"></a>
				<a class="fileupload-mole-close" title="Close"></a>
			</div>
			<!--
			<div style="margin: 10px;">
				<div id="progress" class="progress">
			        <div class="progress-bar progress-bar-success"></div>
			    </div>
		    </div>
		    -->
		    <div id="files" class="files">
		    	<table>
		    		<tbody id="list_files"></tbody>
		    	</table>
		    </div>
		</div>
		
		<!--
		<script type="text/javascript" src="<%=applicationURL%>/scripts/fileupload/vendor/jquery.ui.widget.js"></script>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/fileupload/jquery.iframe-transport.js"></script>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/fileupload/jquery.fileupload.js"></script>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/fileupload/jquery.fileupload-process.js"></script>
		<script type="text/javascript" src="<%=applicationURL%>/scripts/fileupload/jquery.fileupload-validate.js"></script>
		<script type="text/javascript">
		$(function () {
		    'use strict';
		    
		    if(auth.userInfo.permissions.importExportOpinion) {
		    	$('#link_import').show();
		    }
		    
		    var url = "<%=applicationURL%>/servlet/Import";
		    
		    /*
		    uploadButton = $('<button/>')
		    .addClass('btn btn-primary')
		    .prop('disabled', true)
		    .text('Processing...')
		    .on('click', function () {
		        var $this = $(this),
		            data = $this.data();
		        $this
		            .off('click')
		            .text('Abort')
		            .on('click', function () {
		                $this.remove();
		                data.abort();
		            });
		        data.submit().always(function () {
		            $this.remove();
		        });
		    });
		    */
		    
		    $('#fileupload').fileupload({
		        url: url,
		        dataType: 'json',
		        autoUpload: true,
		        acceptFileTypes: /(\.|\/)(json)$/i, // /(\.|\/)(gif|jpe?g|png)$/i
		        maxFileSize: 5000000, // 5 MB
		        
		        /*
		        done: function (e, data) {
		            $.each(data.result.files, function (index, file) {
		                $('<p/>').text(file.name).appendTo('#files');
		            });
		        },
		        */
		        /*
		        change : function(e, data) {
		        	$.each(data.files, function (index, file) {
		                console.log('Selected file: ' + file.name);
		            });
		        },
		        */
		        /*
		        progressall: function (e, data) {
		            var progress = parseInt(data.loaded / data.total * 100, 10);
		            $('#progress .progress-bar').css(
		                'width',
		                progress + '%'
		            );
		        }
		        */
		    }).on('fileuploadadd', function (e, data) {
		    	
		    	$(".fileupload-mole-minimize")
		    		.attr("title", "Minimize")
		    		.removeClass("active");
		    	
		    	$('.fileupload-mole')
		    		.css( { bottom: 0 })
		    		.show();
		    	
		    	
		        data.context = $('#files table'); //$("<tr/>").appendTo('#files');
		        
		        $.each(data.files, function (index, file) {
		            
		        	/*
		        	var node = $('<div/>')
		                    .append($('<span/>').text(file.name));
		        	*/
		        	
		        	var node = $("<tr>" +
		        		"<td class=\"upload-file-name\">" + file.name + "</td>" +
		        		"<td class=\"upload-file-size\">0 KB</td>" +
		        		"<td class=\"upload-file-progress\">" +
		        			"<span class=\"upload-file-status\">Uploaded</span>" +
		        			"<div class=\"progress\">" +
		    	        		"<div class=\"progress-bar progress-bar-success\"></div>" +
		    	    		"</div>" +
		        		"</td>" +
		        	"</tr>");
		        	node.appendTo("#list_files");
		        	
		            /*
		            if (!index) {
		                node
		                    .append('<br>')
		                    .append(uploadButton.clone(true).data(data));
		            }
		            */
		            
		        });
		    }).on('fileuploadprocessalways', function (e, data) {
		        var index = data.index,
		            file = data.files[index],
		            node = $(data.context.children()[index]);
		        /*
		        if (file.preview) {
		            node
		                .prepend('<br>')
		                .prepend(file.preview);
		        }
		        */
		        if (file.error) {
		        	
		        	node.find(".progress").hide();
		        	
		        	node.find(".upload-file-status")
		    		.show()
		    		.text(file.error);
		        	
		        	/*
		        	node
		                .append('<br>')
		                .append(file.error);
		        	*/
		        }
		        /*
		        if (index + 1 === data.files.length) {
		            data.context.find('button')
		                .text('Upload')
		                .prop('disabled', !!data.files.error);
		        }
		        */
		    }).on('fileuploadprogress', function (e, data) {
		        
		    	// Log the current bitrate for this upload:
		        console.log("____" + data.progressInterval);
		    
		    }).on('fileuploadprogressall', function (e, data) {
		        
		    	var progress = parseInt(data.loaded / data.total * 100, 10);
		        
		    	var percentComplete = data.loaded / data.total;
		        console.log(percentComplete);
		        
		        /*
		        $('#progress .progress-bar').css(
		            'width',
		            progress + '%'
		        );
		        */
		        
		    }).on('fileuploaddone', function (e, data) {
		        $.each(data.result.files, function (index, file) {
		            
		        	/*
		        	 var index = data.index,
		             	file = data.files[index],
		             */
		             
		             
		             /*
		             	node = $(data.context.children()[index]);
		        	
		        	
		        	 	node.find(".upload-file-name").text("link");
		        	*/
		        	
		        	/*
		        	var link = $('<a>')
		            .attr('target', '_blank')
		            .prop('href', file.url);
		        	
		        	node.find(".upload-file-name").text();
		        	*/
		        	
		        	/*
		        	var link = $('<a>')
		                .attr('target', '_blank')
		                .prop('href', file.url);
		        	
		            $(data.context.children()[index])
		                .wrap(link);
		            */
		           	
		        });
		        
		        //$(".fileupload-mole-status").text("Upload complete");
		        
		    }).on('fileuploadfail', function (e, data) {
		        $.each(data.result.files, function (index, file) {
		            
		        	/*
		        	var error = $('<span/>').text(file.error);
		            $(data.context.children()[index])
		                .append('<br>')
		                .append(error);
		            */
		            
		        });
		        
		    }).prop('disabled', !$.support.fileInput)
		        .parent().addClass($.support.fileInput ? undefined : 'disabled');
		    
		    
		    $(".fileupload-mole-close").click(function(e) {
		    	
		    	$('.fileupload-mole').hide();
		    	
		    	e.preventDefault();
		    });
		    
			$(".fileupload-mole-minimize").click(function(e) {
				
				if(!$(this).hasClass("active")) {
					// minimize
					$('.fileupload-mole').animate({ bottom:-176}, 120, function() {
						$(".fileupload-mole-minimize")
							.attr("title", "Maximize")
							.addClass("active");
					});
				} else {
					// maximize
					$('.fileupload-mole').animate({ bottom:0}, 120, function() {
						$(".fileupload-mole-minimize")
							.attr("title", "Minimize")
							.removeClass("active");
					});
				}
				
				e.preventDefault();
		    });
		   
		    
		});
		</script>
		-->
		
		
		
		<script type="text/javascript">
		var jsapi = jsapi || {};
		/*
		jsapi.messages = {
			getList : function(params) {
				
				var obj = {
					messages : {
						getList : {
							userId : params.userId,
							includeClosed : params.includeClosed
						}
					}
				};
				
				$.ajax({
			        url: servletUrl,
			        data: { 
			        	rq : JSON.stringify(obj),
			        	timestamp : $.getTimestamp()  
			        },
			        dataType: "json",
			        success: function (data, status) {
			        	if(data.messages.getList != undefined) {
				        	if(data.messages.getList.error != undefined) {
				        		errorHandler({
									error : data.messages.getList.error	
								});
				        		if(params.error != undefined 
										&& typeof params.error == 'function') {
									params.error(data.messages.getList);
								}
							} else {
								if(params.success != undefined 
										&& typeof params.success == 'function') {
									params.success(data.messages.getList);
								}
							}
			        	} else {
			        		if(params.error != undefined 
									&& typeof params.error == 'function') {
								params.error();
							}
			        	}
			        },
			        error: function (XHR, textStatus, errorThrow) {
			            // error
			        }
			    });
			},
			closeList : function(params) {
				
				var obj = {
					messages : {
						closeList: {
							userId : params.userId,
							list : params.list
						}
					}
				};
				
				$.ajax({
			        url: servletUrl,
			        data: { 
			        	rq : JSON.stringify(obj),
			        	timestamp : $.getTimestamp()  
			        },
			        dataType: "json",
			        success: function (data, status) {
			        	if(data.messages.closeList != undefined) {
				        	if(data.messages.closeList.error != undefined) {
				        		errorHandler({
									error : data.messages.closeList.error	
								});
				        		if(params.error != undefined 
										&& typeof params.error == 'function') {
									params.error(data.messages.closeList);
								}
							} else {
								if(params.success != undefined 
										&& typeof params.success == 'function') {
									params.success(data.messages.closeList);
								}
							}
			        	} else {
			        		if(params.error != undefined 
									&& typeof params.error == 'function') {
								params.error();
							}
			        	}
			        },
			        error: function (XHR, textStatus, errorThrow) {
			            // error
			        }
			    });
			},
			deleteList : function(params) {
				
				var obj = {
					messages : {
						deleteList : {
							userId : params.userId,
							list : params.list
						}
					}
				};
				
				$.ajax({
			        url: servletUrl,
			        data: { 
			        	rq : JSON.stringify(obj),
			        	timestamp : $.getTimestamp()  
			        },
			        dataType: "json",
			        success: function (data, status) {
			        	if(data.messages.deleteList != undefined) {
				        	if(data.messages.deleteList.error != undefined) {
				        		errorHandler({
									error : data.messages.deleteList.error	
								});
				        		if(params.error != undefined 
										&& typeof params.error == 'function') {
									params.error(data.messages.deleteList);
								}
							} else {
								if(params.success != undefined 
										&& typeof params.success == 'function') {
									params.success(data.messages.deleteList);
								}
							}
			        	} else {
			        		if(params.error != undefined 
									&& typeof params.error == 'function') {
								params.error();
							}
			        	}
			        },
			        error: function (XHR, textStatus, errorThrow) {
			            // error
			        }
			    });
			}
		};
		*/
		
		var errorHandler = function(params) {
			if(params.error == "NotSignedIn") {
				var modal = new lightFace({
					title : "Session expired",
					message : "Your browser session has expired after a period of inactivity, or is no longer valid.<br/>Please relogin to Inqwise and try again.",
					actions : [
						{ 
							label : "Relogin", 
							fire : function() { 
								// redirect
								location.href = "<%=absoluteURL%>/login?ret=<%=requestUrl%>";
							}, 
							color: "blue" 
						}
					],
					overlayAll : true
				});
			}
		};
		
		var feedback = function() {
			
			var v = null;
			var M = $("<div>" +
				"<div style=\"padding: 0 0 12px 0\">Inqwise Feedback lets you send Inqwise problem reports, feature ideas and<br/> general suggestions or comments.</div>" +
				"<div class=\"row\" style=\"height: 72px;\">" +
					"<div class=\"cell\">" +
						"<div><textarea id=\"textarea_feedback_message\" name=\"textarea_feedback_message\" placeholder=\"Tell us about your expirience\" autocomplete=\"off\" style=\"width: 314px; height: 64px;\"></textarea></div>" +
						"<div><label id=\"status_feedback_message\"></label></div>" +
					"</div>" +
				"</div>" +
				"<div style=\"padding: 0 0 6px 0; clear: both; font-weight: bold;\">Would you like to be contacted regarding your feedback?</div>" +
				"<div class=\"row\">" +
					"<select id=\"select_feedback\"><option value=\"0\">No - don't contact me. I just wanted to tell you something.</option><option value=\"1\">Yes - please contact me at the email address</option></select>" +
				"</div>" +
				"<div style=\"display: none; clear: both\" id=\"container_feedback_email\">" +
					"<div style=\"padding: 0 0 6px 0; font-weight: bold;\">Email address:</div>" +
					"<div class=\"row\">" +
						"<div class=\"cell\">" +
							"<div><input type=\"text\" id=\"text_feedback_email\" name=\"text_feedback_email\" autocomplete=\"off\" /></div>" +
							"<div><label id=\"status_feedback_email\"></label></div>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>");
			
			var I = M.find('#textarea_feedback_message');
			var B = M.find('#status_feedback_message');
			
			var E = M.find('#text_feedback_email');
			var R = M.find('#status_feedback_email');
			var selectFeedback = M.find('#select_feedback');
			var containerFeedbackEmail = M.find('#container_feedback_email');
			
			var modal = new lightFace({
				title : "Feedback",
				message : M,
				actions : [
					{ 
				    	label : "Submit", 
				    	fire : function() {	   
				       		// check validation
							v.validate();
				        	   
				     	}, 
				        color: "blue" 
				    },
				    { 
				    	label : "Cancel", 
				    	fire : function() { 
				    		modal.close(); 
				    	}, 
				    	color: "white" 
				    }
				],
				overlayAll: true,
				complete : function() {
					
					I.focus();
					
					selectFeedback
					.unbind("keyup change")
					.bind("keyup change", function() {
						if($(this).val() != 0) {
							containerFeedbackEmail.show();
						} else {
							containerFeedbackEmail.hide();
						}
					});
					
					// set default user email
					E.val(auth.userInfo.email);
					
					v = new validator({
						elements : [
							{
								element : I,
								status : B,
								rules : [
									{ method : 'required', message : 'This field is required.' }
								]
							},
							{
								element : E,
								status : R,
								rules : [
									{ method : 'required', message : 'This field is required.' },
									{ method : 'email', message : 'Please enter a valid email address.' }
								],
								validate : function() {
									return (selectFeedback.val() != 0);
								}
					        }
						],
						submitElement : null,
						messages : null,
						accept : function () {
							
							var obj = {
								giveUsYourFeedback : {
									title : "Feedback",
									email : (selectFeedback.val() != 0 ? E.val() : undefined),
									description : $.removeHTMLTags(I.val()).replace(/\r/g, "")
								}
							};
					
							$.getJSON(servletUrl, { rq : JSON.stringify(obj), timestamp: $.getTimestamp() }, function(data) {
								if(data.giveUsYourFeedback.error != undefined) {
									alert(data.giveUsYourFeedback.errorDescription);
								} else {
									modal.close();		
								}
							});
							
						},
						error : function() {
						
						}
					});
					
				}
			});
		};
		
		
		var suggestions = [];
		
		var getAll = function(params) {
			
			var obj = {
				opinions : {
					getList : {
						opinionTypeId : 1,
						top:100
					}
				}
			};

			$.ajax({
		        url: servletUrl,
		        data: { 
		        	rq : JSON.stringify(obj),
		        	timestamp : $.getTimestamp()  
		        },
		        dataType: "json",
		        success: function (data, status) {
		        	if(data.opinions.getList != undefined) {
			        	if(data.opinions.getList.error != undefined) {
							
			        		errorHandler({
								error : data.opinions.getList.error	
							});
			        		
			        		if(params.error != undefined 
									&& typeof params.error == 'function') {
								params.error(data.opinions.getList);
							}
						} else {
							if(params.success != undefined 
									&& typeof params.success == 'function') {
								params.success(data.opinions.getList);
							}
						}
		        	} else {
		        		if(params.error != undefined 
								&& typeof params.error == 'function') {
							params.error();
						}
		        	}
		        },
		        error: function (XHR, textStatus, errorThrow) {
		            // error
		        }
		    });
		};
		
		$(function() {
			'use strict';
			
			
			
			/*
			getAll({
				success : function(data) {
					for(var i = 0; i < data.list.length; i++) {
						suggestions.push({
							value : data.list[i].name,
							data : { opinionId : data.list[i].opinionId }
						});
					}
				},
				error: function() {
					
				}
			});
			
			$('#text_search_across')._autocomplete({
				appendTo : '#container_search_across',
			    lookup: suggestions,
			    onSelect: function (suggestion) {
			        location.href = "<%=absoluteURL%>/surveys/" + suggestion.data.opinionId + "/edit";
			    }
			});
			
			var newMessages = [];
			var messagesContent = $("<div><ul class=\"messages\"></ul></div>");
			
			$('#link_messages').click(function(e) {
				
				if(newMessages.length != 0) {
					
					var dialogMessages = $('#label_messages').lightDialog({
						direction : "right",
						message : messagesContent,
						actions : [
						    {
						    	label : "See all messages",
						    	fire : function() {
						    		location.href = "<%=absoluteURL%>/messages";
						    	}
						    },
							{
								label : "Close",
								fire : function() {
									
									// cancel
									dialogMessages.hide();
									
								},
								color : "white"
							}
						],
						complete: function() {
							
							jsapi.messages.closeList({
								list : newMessages,
								success : function() {
									newMessages = [];
									$('#label_messages').hide();
								},
								error: function(error) {
									
								}
							});
							
						}
					});
				
				} else {
					location.href = "<%=absoluteURL%>/messages";
				}
				
				e.preventDefault();
			
			});
			
			// check for new messages
			jsapi.messages.getList({
				success : function(data) {
					if(data.list.length > 0) {
						
						var messagesList = messagesContent.find('ul.messages');
						// filter 
						for(var i = 0; i < data.list.length; i++) {
								
							newMessages.push(data.list[i].id);
							
							$("<li>" +
								"<div><span class=\"light\">" + data.list[i].publishDate + "</span></div>" +
								"<div><b>" + data.list[i].name + "</b></div>" +
								"<p>" + $.replaceEmailWithHTMLLinks($.replaceURLWithHTMLLinks(data.list[i].content.replace(/\n/gi, "<br/>").replace(/%0A/gi, "<br/>"), true)) + "</p>" +
							"</li>").appendTo(messagesList);
							
						}
						
						// show bubble count of new messages
						if(newMessages.length != 0) {
							$('#label_messages')
							.html("&nbsp;(" + newMessages.length + ")")
							.show();
						}
						
					}
				},
				error: function(error) {
					//
				}
			});
			*/
			
		});
		</script>
		
		<%if(p.isEnableGoogleAnalytics() && ApplicationConfiguration.General.isEnableGoogleAnalytics()){ %>
		<script type="text/javascript">
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-2521304-11']);
		_gaq.push(['_trackPageview']);
		(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
		</script>
		<%}%>
		 
	</body>
</html>
