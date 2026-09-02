package com.example.todolist.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.todolist.model.Task;

@Repository
public class TaskRepository {

	private final JdbcTemplate jdbcTemplate;

	public TaskRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	// GET ALL TASKS
	public List<Task> getAllTasks() {

		String sql = "SELECT * FROM todo";

		return jdbcTemplate.query(sql, (rs, rowNum) -> {

			Task task = new Task();

			task.setId(rs.getLong("id"));
			task.setTitle(rs.getString("title"));
			task.setDescription(rs.getString("description"));
			task.setStatusId(rs.getLong("status_id"));
			task.setDueDate(rs.getString("due_date"));
			task.setPriorityId(rs.getLong("priority_id"));
			task.setCompletionDate(rs.getString("completion_date"));
			task.setCreatedAt(rs.getString("created_at"));
			task.setCreatedBy(rs.getString("created_by"));
			task.setUpdatedAt(rs.getString("updated_at"));
			task.setUpdatedBy(rs.getString("updated_by"));

			return task;
		});
	}

	// POST - CREATE TASK
	public int createTask(Task task) {

		String sql = """
				INSERT INTO todo
				(
				    title,
				    description,
				    status_id,
				    due_date,
				    priority_id,
				    completion_date,
				    created_by,
				    updated_by
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)
				""";

		return jdbcTemplate.update(sql, task.getTitle(), task.getDescription(), task.getStatusId(), task.getDueDate(),
				task.getPriorityId(), task.getCompletionDate(), task.getCreatedBy(), task.getUpdatedBy());
	}

	public int updateTask(Long id, Task task) {

		String sql = """
				UPDATE todo
				SET
				    title = ?,
				    description = ?,
				    status_id = ?,
				    due_date = ?,
				    priority_id = ?,
				    completion_date = ?,
				    updated_by = ?
				WHERE id = ?
				""";

		return jdbcTemplate.update(sql, task.getTitle(), task.getDescription(), task.getStatusId(), task.getDueDate(),
				task.getPriorityId(), task.getCompletionDate(), task.getUpdatedBy(), id);
	}

	public int deleteTask(Long id) {

		String sql = "DELETE FROM todo WHERE id = ?";

		return jdbcTemplate.update(sql, id);
	}

	public Task getTaskById(Long id) {

		String sql = "SELECT * FROM todo WHERE id = ?";

		List<Task> tasks = jdbcTemplate.query(sql, (rs, rowNum) -> {

			Task task = new Task();

			task.setId(rs.getLong("id"));
			task.setTitle(rs.getString("title"));
			task.setDescription(rs.getString("description"));
			task.setStatusId(rs.getLong("status_id"));
			task.setDueDate(rs.getString("due_date"));
			task.setPriorityId(rs.getLong("priority_id"));
			task.setCompletionDate(rs.getString("completion_date"));
			task.setCreatedAt(rs.getString("created_at"));
			task.setCreatedBy(rs.getString("created_by"));
			task.setUpdatedAt(rs.getString("updated_at"));
			task.setUpdatedBy(rs.getString("updated_by"));

			return task;
		}, id);

		return tasks.isEmpty() ? null : tasks.get(0);
	}
}