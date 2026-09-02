package com.example.todolist.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todolist.model.Task;
import com.example.todolist.service.TaskService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/tasks")
public class TaskController {

	private final TaskService taskService;

	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	// GET ALL TASKS
	@GetMapping
	public List<Task> getAllTasks() {
		return taskService.getAllTasks();
	}

	// POST - CREATE TASK
	@PostMapping
	public String createTask(@RequestBody Task task) {

		taskService.createTask(task);

		return "Task created successfully";
	}

	@PutMapping("/{id}")
	public String updateTask(@PathVariable Long id, @RequestBody Task task) {

		int result = taskService.updateTask(id, task);

		if (result == 0) {
			return "Task not found";
		}

		return "Task updated successfully";
	}

	@DeleteMapping("/{id}")
	public String deleteTask(@PathVariable Long id) {

		int result = taskService.deleteTask(id);

		if (result == 0) {
			return "Task not found";
		}

		return "Task deleted successfully";
	}

	@GetMapping("/{id}")
	public ResponseEntity<Task> getTaskById(@PathVariable Long id) {

		Task task = taskService.getTaskById(id);

		if (task == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(task);
	}
}