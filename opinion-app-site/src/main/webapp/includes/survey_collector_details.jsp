
<%@page import="org.apache.commons.lang3.StringUtils"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@page import="com.inqwise.opinion.library.systemFramework.ApplicationConfiguration"%>

<%@ page import="java.util.List" %>
<%@ page import="java.util.*" %>

<%@ page import="java.net.*" %>
<%@ page import="com.inqwise.opinion.cms.common.IPage" %>
<%@ page import="com.inqwise.opinion.cint.systemFramework.CintConfig" %>

<%
	
	String opinionId = request.getParameter("opinion_id");
	String collectorId = request.getParameter("collector_id");
	
	IPage p = (IPage)request.getAttribute(IPage.PAGE_OBJECT_ATTRIBUTE_NAME);
	String absoluteURL = p.getRootAbsoluteUrl();
	String applicationURL = p.getApplicationUrl();
%>

<!--  <link rel="stylesheet" rev="stylesheet" href="<%=applicationURL%>/css/sidebar/sidebar.css" type="text/css" /> -->

<link rel="stylesheet" rev="stylesheet" href="<%=applicationURL%>/css/cint/cint.css" type="text/css" />
<script src="<%=applicationURL%>/scripts/cint/cint.js" type="text/javascript"></script>


<div>
	<table class="placeholder-header">
		<tr>
			<td class="cell-left">
				<h1 style="padding-bottom: 0 !important;display: inline"><a href="<%=absoluteURL %>/surveys/<%=opinionId %>/collectors" title="Collectors">Collectors</a>&nbsp;&rsaquo;&nbsp;<span id="label_collector_name"></span></h1><a href="javascript:;" id="link_rename_collector_name" title="Rename" style="margin-left: 6px;">Rename</a>
			</td>
			<td class="cell-right">
				<a href="<%=absoluteURL %>/surveys/<%=opinionId %>/collectors/create" title="Add Collector" class="button-green"><span><i class="icon-add-white">&nbsp;</i>Add Collector</span></a>
			</td>
		</tr>
	</table>
	<div style="clear: both; height: 16px; padding-top: 4px; padding-bottom: 20px;">
		<ul class="ln" id="list_collector_actions"></ul>
	</div>
	<div style="clear: both;">
		<div>
			
			<div class="content-middle-tabs-section">
				<div class="content-middle-tabs">
					<ul class="content-middle-tabs-container">
						<li><a href="<%=absoluteURL %>/surveys/<%=opinionId %>/collectors/<%=collectorId %>" class="selected" title="Details"><span>Details</span></a></li>
						<li><a href="<%=absoluteURL %>/surveys/<%=opinionId %>/collectors/<%=collectorId %>/settings" title="Settings"><span>Settings</span></a></li>
					</ul>
				</div>
				<div class="content-middle-related">
					
				</div>
			</div>
			
			<div style="clear: both;padding-top: 24px; overflow: hidden;" class="sidebar-relative">
			
				<div id="placeholder_collector_details_invite_your_own_respondents" style="clear: both; display: none;">
					<div class="wrapper-content-left">
						
						<div>
							<h3 class="ui-header-light">Direct Link</h3>
							<div style="Xpadding-top: 12px;">
								<p>To send your survey by email, tweet, or status, copy the link below and paste it into your message. When others receive your message, they can click the link and access your survey.</p>
								<div class="row" style="padding-bottom: 0px;">
									<div class="cell">
										<div class="edge" style="width: 428px;">
											<div class="edge-top"></div>
											<div class="edge-bottom"></div>
											<textarea class="code-snippet" id="input_direct_link" readonly="readonly" autocomplete="off" style="height: 32px;"></textarea>
										</div>
									</div>
								</div>
								<div style="clear: both; padding-top: 8px;"><em style="color: #999">Copy, paste and email the survey link above to your audience.</em></div>
							</div>
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3 class="ui-header-light">HTML Link</h3>
							<div style="padding-top: 12px;">
								<div class="row" style="padding-bottom: 0px;">
									<div class="cell">
										<div class="edge" style="width: 428px;">
											<div class="edge-top"></div>
											<div class="edge-bottom"></div>
											<textarea class="code-snippet" id="input_html_link" readonly="readonly" autocomplete="off" style="height: 50px;"></textarea>
										</div>
									</div>
								</div>
								<div style="clear: both; padding-top: 8px;"><em style="color: #999">Copy and Paste this Code into Your Web Site or Blog Post</em></div>
							</div>
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3>Email</h3>
							<div>
								<p>Send your survey link to email.</p>
								<!-- <p>This method will allow you to send your survey to a list of email recipients.</p> -->
							</div>
							<div><a href="javascript:;" class="button-white" id="button_send_to_email" title="Send to Email"><span><b class="icon-email">&nbsp;</b>Send to Email</span></a></div>	
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3 class="ui-header-light">Share</h3>
							<div style="padding-top: 12px;">
								<div style="padding-bottom: 6px;"><a href="#" title="Share a Link" id="link_facebook_share_link" class="button-white" target="_blank"><span><b class="icon-facebook">&nbsp;</b>Share a Link</span></a></div>
								<div style="padding-bottom: 6px;"><a href="#" title="Tweet" id="link_twitter_share_link" target="_blank" class="button-white"><span><b class="icon-twitter">&nbsp;</b>Tweet</span></a></div>
								<div style="padding-bottom: 6px;"><a href="#" title="Digg This" id="link_digg_this" target="_blank" class="button-white"><span>Digg This</span></a></div>
								<div><a href="#" title="Submit to Reddit" id="link_submit_to_reddit" target="_blank" class="button-white"><span><b class="icon-reddit">&nbsp;</b>Submit to Reddit</span></a></div>
							</div>
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3>QR Code</h3>
							<div>
								<p>Add a survey into printed media that can be scanned with any QR supporting mobile device.</p>
								<div style="padding-bottom: 8px;">
									<div id="image_qr_code" style="min-height: 100px;" class="loading"></div>
								</div>
								<div class="row">
									<div class="cell" style="padding-right: 8px;">Size:</div>
									<div class="cell">
										<select id="select_qr_code_size" autocomplete="off"><option value="100x100">100x100 pixels</option><option value="150x150">150x150 pixels</option><option value="200x200">200x200 pixels</option><option value="250x250">250x250 pixels</option><option value="300x300">300x300 pixels</option></select>
									</div>
								</div>
								<!-- 
								<div class="row">
									<div class="cell" style="padding-right: 8px;">Custom Tags:</div>
									<div class="cell"><input type="text" class="text-field" autocomplete="off" id="input_qr_code_custom_tags" style="width: 225px;" maxlength="150" /></div>
								</div>
								-->
								<div class="row">
									<div class="cell"><a id="link_download_qr_code" class="button-white" title="Download QR Code"><span><b class="icon-down">&nbsp;</b>Download QR Code</span></a></div>
								</div>
							</div>
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3>Embed Code</h3>
							<div>
								<p>Use this code to integrate your Inqwise survey or form into your blog post or web page's.</p>
								<div class="row" style="padding-bottom: 0px;">
									<div class="cell">
										<div class="edge" style="width: 428px;">
											<div class="edge-top"></div>
											<div class="edge-bottom"></div>
											<textarea class="code-snippet" id="input_embed" readonly="readonly" autocomplete="off" style="height: 258px;overflow: auto"></textarea>
										</div>
									</div>
								</div>
								<div style="clear: both; padding-top: 8px;"><em style="color: #999">Copy and paste the HTML code above to embed your survey onto your website.</em></div>
							</div>
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3>HTML Code / Inline</h3>
							<div>
								<p>Insert the survey directly into your website.<br/>This method allows you to insert the survey directly onto your website using an iframe.</p>
								<div class="row" style="padding-bottom: 0px;">
									<div class="cell">
										<div class="edge" style="width: 428px;">
											<div class="edge-top"></div>
											<div class="edge-bottom"></div>
											<textarea class="code-snippet" id="input_html_code_inline" readonly="readonly" autocomplete="off" style="height: 66px;"></textarea>
										</div>
									</div>
								</div>
								<div style="clear: both; padding-top: 8px;"><em style="color: #999">Copy and paste the HTML code above to include your survey within an IFRAME onto your website.</em></div>
							</div>
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3>WordPress Shortcode <span style="font-weight: normal">(Use on <a href="http://wordpress.com/" target="_blank">WordPress.com</a> or with our <a href="http://wordpress.org/plugins/inqwise-shortcode/" target="_blank">plugin</a>!)</span></h3>
							<div style="padding-top: 12px;">
								<div class="row" style="padding-bottom: 0px;">
									<div class="cell">
										<div class="edge" style="width: 428px;">
											<div class="edge-top"></div>
											<div class="edge-bottom"></div>
											<textarea class="code-snippet" id="input_wordpress_shortcode" readonly="readonly" autocomplete="off" style="height: 16px;"></textarea>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div style="padding-top: 24px; clear: both">
							<h3>Pop-Up Link</h3>
							<div>
								<p>Use this link to create a pop-up window to your Inqwise survey or form. May require your users to have their pop-up blockers turned off on their browser.<br/> Preview Pop-Up: <a href="#" id="link_popup_preview" onclick="window.open(this.href,  null, 'height=542, width=680, toolbar=0, location=0, status=1, scrollbars=1, resizable=1'); return false">Please fill out my survey.</a></p>
								<div class="row" style="padding-bottom: 0px;">
									<div class="cell">
										<div class="edge" style="width: 428px;">
											<div class="edge-top"></div>
											<div class="edge-bottom"></div>
											<textarea class="code-snippet" id="input_popup_link" readonly="readonly" autocomplete="off" style="height: 80px;"></textarea>
										</div>
									</div>
								</div>
								<div style="clear: both; padding-top: 8px;"><em style="color: #999">Copy and Paste this Code into Your Web Site or Blog Post</em></div>
							</div>
						</div>
						
						
						
						
						
					</div>
					<div class="wrapper-content-middle">
						
					</div>
				</div>
			
				<div id="placeholder_collector_details_purchase_respondents" style="clear: both; display: none;">
					
					<div id="placeholder_collector_details_purchase_respondents_statistic" style="display: none;">
						<div class="wrapper-content-left">
							<h3 class="ui-header-light">Collector Details</h3>
							<div style="padding: 12px 0 0">
								
								<!--
								<div class="params">
									<div class="param-name">Panel Id:</div>
									<div class="param-value"><span id="label_panel_id" style="color: #000"></span></div>
								</div>
								<div class="params">
									<div class="param-name">Panel Status:</div>
									<div class="param-value"><span id="label_panel_status"></span></div>
								</div>
								-->
								
								<div class="params">
									<div class="param-name">Completed:</div>
									<div class="param-value"><span id="label_panel_completed" style="color: #000">0</span></div>
								</div>
								<div class="params">
									<div class="param-name">Partial:</div>
									<div class="param-value"><span id="label_panel_partial" style="color: #000">0</span></div>
								</div>
								
						</div>
						</div>
					</div>
					
					<div style="display: none;">
						<div id="intro_cint" style="padding-bottom: 24px;">
						Before you start, please check that in your survey you don't:<br/>
		    Ask for personal contact information<br/>
		    Include logos in the survey<br/>
		    Use non-native language
		    			</div>
	    			</div>
	    			<div id="holder_cint"></div>
		    		<div style="display: none;">
						<h3 id="header_cint_price" class="ui-header">CINT Price</h3>
						<div id="purchase">
							<a id="button_purchase" class="button-green" title="Purchase"><span>Purchase</span></a>
						</div>
					</div>
					
				</div>
			
			</div>
		</div>	
	</div>
</div>

<!-- <script type="text/javascript" src="<%=applicationURL%>/scripts/sidebar/sidebar.js"></script> -->
<script type="text/javascript" src="<%=applicationURL%>/scripts/components/survey_collector_details.js"></script>
<script type="text/javascript" src="<%=applicationURL%>/scripts/components/survey_collector_view.js"></script>
<script type="text/javascript">

var contentDictionary = {
	titles : {
		closeCollector : "Close Collector",
		openCollector : "Open Collector"
	},
	messages : {
		defaultCloseMessage : "This survey is currently closed.  Please contact the author of this survey for further assistance."
	}
};

var getCollectorType = function(typeId) {
	var s = "";
	switch(typeId) {
		case 1 :
			s = "Direct link";
			break;
		case 2 : 
			s = "CINT panel";
			break;
	}
	return s;
};

var getCollectorStatus = function(statusId, typeId) {
	var s = "";
	switch(statusId) {
		case 1 :
			s = (typeId == 1 ? "Open" : "The panel is live"); 
			break;
		case 2 : 
			s = (typeId == 1 ? "Closed" : "Panel has been completed");
			break;
		case 3 :
			s = "Awaiting payment";
			break;
		case 4 : 
			s = "Panel is being verified";
			break;
		case 5 :
			s = "The panel is live"; // 1
			break;
		case 6 : 
			s = "Panel has been completed"; // 2
			break;
		case 7 : 
			s = "Pending"; // Hold -> Pending
			break;
		case 8 : 
			s = "Canceled";
			break;
	}
	return s;
};


var getCollectorDetails = function(params) {
	
	var obj = { 
		collectors : { 
			getCollectorDetails : {
				accountId : params.accountId,
				collectorId : params.collectorId 
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
        	if(data.collectors.getCollectorDetails.error != undefined) {
        		
        		errorHandler({
					error : data.collectors.getCollectorDetails.error	
				});
        		
        		if(params.error != undefined 
						&& typeof params.error == 'function') {
					params.error(data.collectors.getCollectorDetails);
				}
			} else {
				if(params.success != undefined 
						&& typeof params.success == 'function') {
					params.success(data.collectors.getCollectorDetails);
				}
			}
        },
        error: function (XHR, textStatus, errorThrow) {
            // error
        }
    });
	
	
};

var updateCollectorStatus = function(params) {
	
	var obj = { 
		collectors : { 
			updateCollectorStatus : { 
				accountId : params.accountId,
				collectorId : params.collectorId,
				statusId : params.statusId,
				closeMessage : params.closeMessage,
				isGenerateNewGuid : params.isGenerateNewGuid
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
        	if(data.collectors.updateCollectorStatus.error != undefined) {
        		
        		errorHandler({
					error : data.collectors.updateCollectorStatus.error	
				});
        		
        		if(params.error != undefined 
						&& typeof params.error == 'function') {
					params.error(data.collectors.updateCollectorStatus);
				}
			} else {
				if(params.success != undefined 
						&& typeof params.success == 'function') {
					params.success(data.collectors.updateCollectorStatus);
				}
			}
        },
        error: function (XHR, textStatus, errorThrow) {
            // error
        }
    });
	
};

var payCharge = function(params) {

	var obj = {
		payments : {
			payCharge : {
				accountId: params.accountId,
				chargeId : params.chargeId
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
			if(data.payments.payCharge != undefined) {
				if(data.payments.payCharge.error != undefined) {
					
					errorHandler({
						error : data.payments.payCharge.error	
					});
					
					if(params.error != undefined 
							&& typeof params.error == 'function') {
						params.error(data.payments.payCharge);
					}
				} else {
					if(params.success != undefined 
							&& typeof params.success == 'function') {
						params.success(data.payments.payCharge);
					}
				}
			}
        },
        error: function (XHR, textStatus, errorThrow) {
            // error
        }
    });
};

var changeCollectorName = function(params) {
	
	var obj = {
		collectors : {
			changeCollectorName : {
				accountId : accountId,
				name : params.name,
				collectorId : params.collectorId
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
        	if(data.collectors.changeCollectorName.error != undefined) {
        		
        		errorHandler({
					error : data.collectors.changeCollectorName.error	
				});
        		
        		if(params.error != undefined 
						&& typeof params.error == 'function') {
					params.error(data.collectors.changeCollectorName);
				}
			} else {
				if(params.success != undefined 
						&& typeof params.success == 'function') {
					params.success(data.collectors.changeCollectorName);
				}
			}
        },
        error: function (XHR, textStatus, errorThrow) {
            // error
        }
    });
	
};

var deleteCollectors = function(params) {
	
	var obj = { 
   		collectors : { 
			deleteCollectors : {
				accountId : params.accountId,
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
        	if(data.collectors.deleteCollectors != undefined) {
				if(data.collectors.deleteCollectors.error != undefined) {
					
					errorHandler({
						error : data.collectors.deleteCollectors.error	
					});
					
					if(params.error != undefined 
							&& typeof params.error == 'function') {
						params.error(data.collectors.deleteCollectors);
					}
				} else {
					if(params.success != undefined 
							&& typeof params.success == 'function') {
						params.success(data.collectors.deleteCollectors);
					}
				}
			}
        },
        error: function (XHR, textStatus, errorThrow) {
            // error
        }
    });
	
};

//var accountId = $.cookie("aid"); // auth.userInfo.accountId;

$(function() {
	
	new collectorDetails({
		servletUrl : servletUrl,
		opinionId : <%=opinionId%>,
		collectorId : <%=collectorId%>,
		absoluteUrl : "<%=absoluteURL %>",
		applicationUrl : "<%=applicationURL%>",
		collectorUrl : "<%=ApplicationConfiguration.Opinion.Collector.getUrl()%>",
		success : function(data) {
			
			new collectorView({
				opinionId : <%=opinionId%>,
				servletUrl : servletUrl,
				absoluteUrl : "<%=absoluteURL%>",
				sourceUrl : "<%=ApplicationConfiguration.Api.getUrl()%>",
				collectorUrl : "<%=ApplicationConfiguration.Opinion.Collector.getUrl()%>",
				data : data,
				qrCodeUrl : "<%=applicationURL%>/servlet/QRCode",
				cint : {
					apiKey : "<%=CintConfig.getApiToken()%>",
					baseUrl : "<%=StringUtils.remove(CintConfig.getEndPoint(), "%s.")%>",
					proxyPath : "<%=applicationURL%>/servlet/DataPostmaster",
					language : "en"
				}
			});
			
		}
	});

});
</script>