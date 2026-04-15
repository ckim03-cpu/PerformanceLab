package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

type Habit struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// GetHabits handles GET /api/habits
func (h *Handler) GetHabits(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromContext(r.Context())

	rows, err := h.db.QueryContext(r.Context(),
		"SELECT id, user_id, name, created_at FROM habits WHERE user_id = ? ORDER BY created_at DESC", userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch habits")
		return
	}
	defer rows.Close()

	habits := []Habit{}
	for rows.Next() {
		var hb Habit
		if err := rows.Scan(&hb.ID, &hb.UserID, &hb.Name, &hb.CreatedAt); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to read habits")
			return
		}
		habits = append(habits, hb)
	}

	writeJSON(w, http.StatusOK, map[string]any{"data": habits})
}

type createHabitRequest struct {
	Name string `json:"name"`
}

// CreateHabit handles POST /api/habits
func (h *Handler) CreateHabit(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromContext(r.Context())

	var req createHabitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Name == "" {
		writeError(w, http.StatusBadRequest, "name is required")
		return
	}

	result, err := h.db.ExecContext(r.Context(),
		"INSERT INTO habits (user_id, name) VALUES (?, ?)", userID, req.Name)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create habit")
		return
	}

	id, _ := result.LastInsertId()
	writeJSON(w, http.StatusCreated, map[string]any{"data": map[string]any{"id": id, "name": req.Name}})
}

type logHabitRequest struct {
	HabitID int64  `json:"habit_id"`
	Date    string `json:"date"` // YYYY-MM-DD
}

// LogHabit handles POST /api/habit-log
func (h *Handler) LogHabit(w http.ResponseWriter, r *http.Request) {
	var req logHabitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.HabitID == 0 {
		writeError(w, http.StatusBadRequest, "habit_id is required")
		return
	}
	if req.Date == "" {
		req.Date = time.Now().Format("2006-01-02")
	}

	_, err := h.db.ExecContext(r.Context(),
		"INSERT INTO habit_logs (habit_id, date, completed) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE completed = 1",
		req.HabitID, req.Date)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to log habit")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "logged"})
}

type updateHabitRequest struct {
	Name string `json:"name"`
}

// UpdateHabit handles PUT /api/habits/:id
func (h *Handler) UpdateHabit(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromContext(r.Context())
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid habit id")
		return
	}

	var req updateHabitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Name == "" {
		writeError(w, http.StatusBadRequest, "name is required")
		return
	}

	result, err := h.db.ExecContext(r.Context(),
		"UPDATE habits SET name = ? WHERE id = ? AND user_id = ?", req.Name, id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to update habit")
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		writeError(w, http.StatusNotFound, "habit not found")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"data": map[string]any{"id": id, "name": req.Name}})
}

// DeleteHabit handles DELETE /api/habits/:id
func (h *Handler) DeleteHabit(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromContext(r.Context())
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid habit id")
		return
	}

	result, err := h.db.ExecContext(r.Context(),
		"DELETE FROM habits WHERE id = ? AND user_id = ?", id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete habit")
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		writeError(w, http.StatusNotFound, "habit not found")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}
