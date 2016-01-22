'use strict';

$(document).ready(function() {
	populateTasks();
	$('.add').click(addTask);
	$('body').on('click','.delete', deleteTask);
	$('body').on('click','.toggle', toggleTask);
	$('table').on('click', '.deleteButton', deleteTask);

});

function populateTasks() {
	$.get('./tasks', function(data) {
		console.log(data);
		appendTask(data);
	})
}

function addTask() {
	var newTask = $('#myInput').val();
	var newDate = $('#date').val();
	$.post('./tasks/add', {
		item: newTask,
		date: newDate,
		checked: false
	})
	.success(function(data) {
		appendItem(data);
	})
	.fail(function(err) {
		//debugger;
		alert('IDK WHY I HAVE THIS ERRROR !! BUT IT WORKS ');
	});
}

function deleteTask() {
	var $tr = $(this).closest('tr');
	var index  = $tr.index() - 1;
	$.post('./tasks/delete', {"index": index})
	.success(function(data) {
		$tr.remove();
	})
	.fail(function(err) {
		//debugger;

		alert('something went wrong');
	});
}

function appendComplete(data, $row) {
	if (data === true) {
		$row.css('text-decoration', 'line-through');
		console.log($row.children('.toggle'));
		$row.find('.toggle').prop('checked', true);
	} else {
		$row.css('text-decoration', 'none');
		$row.find('.toggle').prop('checked', false);
	}
}


function toggleTask() {
	var $tr = $(this).closest('tr');
	var index = $tr.index() - 1;
	console.log(index);
	$.post('./tasks/toggle', {"index": index})
	.success(function(data) {
		appendComplete(data, $tr);
	})
	.fail(function(err) {
		//debugger;
		alert('something went wrong');
	});
}

function appendTask(data) {
	data.forEach(function(obj) {
		var $item = $('#template').clone();
		$item.removeAttr('id');
		$item.children('.tTask').text(obj.item);
		$item.children('.tdue').text(obj.date);
		$('#bigBoy').append($item);
		appendComplete(obj.complete, $item);
	});
}







