package com.example.todolist.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.todolist.model.Task;
import com.example.todolist.repository.TaskRepository;

@Service
public class TaskService {

	private final TaskRepository taskRepository;

	public TaskService(TaskRepository taskRepository) {
		this.taskRepository = taskRepository;
	}

	// GET ALL TASKS
	public List<Task> getAllTasks() {
		return taskRepository.getAllTasks();
	}

	// POST - CREATE TASK
	public int createTask(Task task) {
		return taskRepository.createTask(task);
	}

	public int updateTask(Long id, Task task) {

		return taskRepository.updateTask(id, task);
	}

	public int deleteTask(Long id) {

		return taskRepository.deleteTask(id);
	}

	public Task getTaskById(Long id) {
		return taskRepository.getTaskById(id);
	}
}