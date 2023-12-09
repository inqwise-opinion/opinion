
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<%@ page import="java.util.List" %>
<%@ page import="java.net.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@page import="com.opinion.cms.common.IPage"%>
<%
	IPage p = (IPage)request.getAttribute(IPage.PAGE_OBJECT_ATTRIBUTE_NAME);
	String absoluteURL = p.getRootAbsoluteUrl();
	String applicationURL = p.getApplicationUrl();
%>

<div>
	<h1>Categories</h1>
	<div>
		<div>
			<div class="content-middle-tabs-section">
				<div class="content-middle-tabs">
					<ul class="content-middle-tabs-container">
						<li><a href="<%=absoluteURL %>/blog-posts" title="Posts"><span>Posts</span></a></li>
						<li><a href="<%=absoluteURL %>/blog-categories" class="selected" title="Categories"><span>Categories</span></a></li>
						<li><a href="<%=absoluteURL %>/blog-tags" title="Tags"><span>Tags</span></a></li>
						<li><a href="<%=absoluteURL %>/blog-comments" title="Comments"><span>Comments</span></a></li>
					</ul>
				</div>
				<div class="content-middle-related">
					
				</div>
			</div>
		</div>
		<div style="clear: both;padding-top: 20px;">
			<div id="table_blog_categories"></div>
		</div>
	</div>
</div>

<script type="text/javascript">
var getCategories = function(params) {
	
	var obj = {
		blogs : {
			getCategories : {
				
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
        	if(data.blogs.getCategories != undefined) {
	        	if(data.blogs.getCategories.error != undefined) {
	        		errorHandler({
						error : data.blogs.getCategories.error	
					});
	        		if(params.error != undefined 
							&& typeof params.error == 'function') {
						params.error(data.blogs.getCategories);
					}
				} else {
					if(params.success != undefined 
							&& typeof params.success == 'function') {
						params.success(data.blogs.getCategories);
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

var updateCategory = function(params) {
	
	var obj = {
		blogs : {
			updateCategory : {
				categoryId : params.categoryId,
				categoryName : params.categoryName
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
        	if(data.blogs.updateCategory != undefined) {
	        	if(data.blogs.updateCategory.error != undefined) {
	        		errorHandler({
						error : data.blogs.updateCategory.error	
					});
	        		if(params.error != undefined 
							&& typeof params.error == 'function') {
						params.error(data.blogs.updateCategory);
					}
				} else {
					if(params.success != undefined 
							&& typeof params.success == 'function') {
						params.success(data.blogs.updateCategory);
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

var tableBlogCategories = null;
var blogCategories = [];
var renderTableBlogCategories = function() {
	$('#table_blog_categories').empty();
	tableBlogCategories = $('#table_blog_categories').dataTable({
		tableColumns : [
			{ key : 'id', label : '#', sortable: true, width: 46, style : { header: { 'text-align' : 'right' }, cell : { 'text-align' : 'right' } } },
			{ key : 'name', label : 'Category', sortable: true, formatter: function(cell, value, record, source) {
				var editable = $("<div class=\"editable\">" + record.name + "<div class=\"editable-icon\"></div></div>").data(record);
				editable.click(function(event) {
					
					var target = $( event.target );
					if(target.is("a")) {
						//event.preventDefault();
					} else {
						
						var givenData = $(this).data();
						var newLeft = $(this).closest("td").position().left - 5;
						var newTop = $(this).closest("td").position().top - 5;
						
						$('.cell-editor').remove();
						cellEditor = $("<div class=\"cell-editor\">" +
							"<div class=\"cell-editor-overlay\">" +
								"<div><input type=\"text\" id=\"text_cell_editor_name\" name=\"cell_editor_name\" style=\"margin-right: 6px;\" /><a href=\"#\" class=\"button-blue cell-editor-button-save\" title=\"Save\"><span>Save</span></a><a href=\"#\" class=\"button-white cell-editor-button-cancel\" title=\"Cancel\" style=\"margin-left: 6px;\"><span>Cancel</span></a></div>" +
								"<div><label id=\"status_cell_editor_name\"></label></div>" +
							"</div>" +
						"</div>").appendTo(document.body);
						
						cellEditor.css({
							left : newLeft + "px",
							top : newTop + "px",
							"position" : "absolute"
						});
						
						var I = cellEditor.find("#text_cell_editor_name");
						var B = cellEditor.find("#status_cell_editor_name");
						
						var v = new validator({
							elements : [
								{
									element : I,
									status : B,
									rules : [
										{ method : 'required', message : 'This field is required.' },
										{ method : 'rangelength', pattern : [3,100] }
									]
								}
							],
							submitElement : null,
							messages : null,
							accept : function () {
								
								updateCategory({
									categoryId : givenData.id,
									categoryName : $.removeHTMLTags(I.val()).replace(/\r/g, ""),
									success : function(data) {
										
										getCategories({
											success : function(data) {
												blogCategories = data.list;
												renderTableBlogCategories();
											},
											error: function(error) {
												blogCategories = [];
												renderTableBlogCategories();
											}
										});
										
										// and close
										$('.cell-editor').remove();
										
									},
									error: function() {
										//
									}
								});
								
							},
							error: function() {
								
							}
						});
						
						cellEditor.find(".cell-editor-button-save").click(function(event1) {
							event1.preventDefault();
							v.validate();
						});
						
						cellEditor.find(".cell-editor-button-cancel").click(function(event2) {
							event2.preventDefault();
							$('.cell-editor').remove();
						});
						
						// set value
						I.val(givenData.name)
						.focus()
						.keypress(function(event){
						 	if(event.keyCode == 13){
						 		cellEditor.find(".cell-editor-button-save").click();
						  	}
						});
						
						// outside
						$(document).mouseup(function (e){
					    	var container = cellEditor;
					    	if (!container.is(e.target) // if the target of the click isn't the container...
					        	&& container.has(e.target).length === 0) // ... nor a descendant of the container
					    		{
					        		container.remove();
					    		}
						});
						
						
					}
					
				});
				return editable;
			} }
		],
		dataSource : blogCategories, 
		pagingStart : 10,
		show : [5, 10, 25, 50, 100],
		selectable : true,
		actions : [
		    {
		    	label : "New Category",
		    	icon : "add-white",
		    	color : "green",
		    	fire : function() {
		    		location.href = "blog-category-new";
		    	}
		    },
			{ 
				label : "Delete",
				disabled : true,
				fire : function(records, source) {

					if(records.length > 0) {
						
						var list = [];
						$(records).each(function(index) {
							list.push(records[index].id);
						});
						
						var modal = new lightFace({
							title : "Deleting categories",
							message : "Are you sure you want to delete selected categories?",
							actions : [
								{ 
									label : "Delete", 
									fire : function() {
										
										console.log("deleteCategories");
										/*
										deleteOpinions({
											list : list,
											accountId : accountId,
											success : function() {
												
												getList({
													accountId : accountId,
													success : function(data) {
														surveys = data.list;
														renderTableSurveys();
													},
													error : function() {
														surveys = [];
														renderTableSurveys();
													}
												});
												
												
												modal.close();
												
											},
											error : function() {
												//
											}
										});
										*/
										
									},
									color: "blue"
								}, 
								{
									label : "Cancel",
									fire: function() {
										modal.close();
									},
									color: "white"
								}
							],
							overlayAll : true
						});
						
					}
					
				}
			}
		]
	});
};

$(function() {
	
	getCategories({
		success : function(data) {
			blogCategories = data.list;
			renderTableBlogCategories();
		},
		error: function(error) {
			blogCategories = [];
			renderTableBlogCategories();
		}
	});
	
});
</script>