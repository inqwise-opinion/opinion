
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ page import="java.net.*" %>
<%@ page import="com.inqwise.opinion.library.systemFramework.ApplicationConfiguration"%>

<%

	String guidTypeId = request.getParameter("guid_type_id");
	String guid = request.getParameter("guid");
	String modeId = request.getParameter("mode_id");
	String themeId = request.getParameter("theme_id");
	
	String noStyle = request.getParameter("noStyle");

	URL applicationURL = request.getServerPort() != 80 ? new URL(request.getScheme(), request.getServerName(), request.getServerPort(), request.getContextPath()) : new URL(request.getScheme(), request.getServerName(), request.getContextPath());
	String staticUrl = ApplicationConfiguration.Static.getUrl();
	if(null == staticUrl) { staticUrl = applicationURL.toString(); }
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width" />
		<title></title>
		<meta name="description" content="Create free online surveys in minutes using our advanced and easy to use online survey software. Try our survey tool today for free." />
		<meta name="keywords" content="online survey software, online survey tool, survey software, survey tool, web survey software, web survey tool" />
		
		<link rel="icon" href="<%=applicationURL%>/favicon.ico" type="image/x-icon" />
		<link rel="shortcut icon" href="<%=applicationURL%>/favicon.ico" type="image/x-icon" />
		
		<style type="text/css">
		#notification_box{
			color:#000 !important;
			border-bottom:1px solid #E2C822;
			background:none repeat scroll 0 0 #FFF9D7;
			padding:3px 8px;
			display:none;
			font:11px arial,sans-serif;
		}
		.inspector-highlight {
			border : 1px solid #52a4f7;
		}
		.inspector-highlight .inspector-highlight-wrap {
			position: relative;
		}
		.inspector-highlight 
		.inspector-highlight-wrap 
		.inspector-highlight-label {
			font-family: arial,sans-serif;
			font-size:11px;
			color: #fff;
			display: inline-block;
			padding: 3px;
			background-color: #52a4f7;
			cursor: default;
		}
		</style>
		
		<!-- theme style -->
		<style type="text/css" id="styleblock">
	  	</style>
		<!-- end theme style -->
		
		<% if("true".equals(noStyle)) { %>
		<script type="text/javascript">
		if (!window.location.href.match(/localhost/gi)) {
			document.domain = getDomain();
		}
		
		function getDomain() { 
			
			var domain = "";
			var hostname = window.location.hostname;
		    var arrHostname = hostname.split('.');
		    if(arrHostname.length == 4 && /^\d+$/.test(hostname.replace(/\./g, ''))) {
		    	domain = hostname;
		    } else {
		    	if(arrHostname.length == 1) {
		    		domain = hostname;
		    	} else {
			        var currentdomain = [arrHostname[arrHostname.length - 2], arrHostname[arrHostname.length - 1]].join('.');
			        domain = currentdomain;
		    	}
		    }
		    return domain;
		    
		}
		</script>
		<% } %>
		
	</head>
	<body style="margin: 0; padding:0">
	
		<div id="notification_box">This is in <b>"Preview Mode"</b>. Any answers you enter will not be included in your results and will not cost you a response. This message will not appear when live.</div>
		<script type="text/javascript" src="<%=staticUrl%>/scripts/widget/1.0.4/poll.js">
		{
			"embed" : false,
			"noStyle" : <%=noStyle %>,
		    "guid" : "<%=guid%>",
		    "guidTypeId" : <%= (guidTypeId.equals("d") ? 2 : (guidTypeId.equals("c") ? 1 : 0)) %>,
		    "collectorUrl" : "<%=ApplicationConfiguration.Api.getUrl()%>",
		    "modeId" : <%= modeId %>,
		    "themeId" : <%=themeId%>,
		    "url" : "<%=applicationURL%>/c/2/<%=guid%>/1",
		    "analytics" : <%=ApplicationConfiguration.General.isEnableGoogleAnalytics()%>
		}
		</script>
		<noscript>
			<p><a href="<%=applicationURL%>/c/2/<%=guid%>/1">Online Poll @ Inqwise.com</a></p>
		    <p><a href="http://www.inqwise.com" title="Online surveys and polls" target="_blank">Online Survey Tool</a> by Inqwise</p>
		</noscript>
		
		<div id="highlight" class="inspector-highlight" style="display: none;">
			<div class="inspector-highlight-wrap">
				<span class="inspector-highlight-label">Body</span>
			</div>
		</div>
	
	</body>
</html>