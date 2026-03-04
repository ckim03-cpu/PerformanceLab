package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type Workout struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Exercise  string    `json:"exercise"`
	Reps      int       `json:"reps"`
	Weight    float64   `json:"weight"`
	CreatedAt time.Time `json:"created_at"`
}

// GetWorkouts handles GET /api/workouts
func (h *Handler) GetWorkouts(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromContext(r.Context())

	rows, err := h.db.QueryContext(r.Context(),
		"SELECT id, user_id, exercise, reps, weight, created_at FROM workouts WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
		userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch workouts")
		return
	}
	defer rows.Close()

	workouts := []Workout{}
	for rows.Next() {
		var wo Workout
		if err := rows.Scan(&wo.ID, &wo.UserID, &wo.Exercise, &wo.Reps, &wo.Weight, &wo.CreatedAt); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to read workouts")
			return
		}
		workouts = append(workouts, wo)
	}

	writeJSON(w, http.StatusOK, map[string]any{"data": workouts})
}

type createWorkoutRequest struct {
	Exercise string  `json:"exercise"`
	Reps     int     `json:"reps"`
	Weight   float64 `json:"weight"`
}

// CreateWorkout handles POST /api/workouts
func (h *Handler) CreateWorkout(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromContext(r.Context())

	var req createWorkoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Exercise == "" || req.Reps <= 0 {
		writeError(w, http.StatusBadRequest, "exercise and reps are required")
		return
	}

	result, err := h.db.ExecContext(r.Context(),
		"INSERT INTO workouts (user_id, exercise, reps, weight) VALUES (?, ?, ?, ?)",
		userID, req.Exercise, req.Reps, req.Weight)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create workout")
		return
	}

	id, _ := result.LastInsertId()
	writeJSON(w, http.StatusCreated, map[string]any{"data": map[string]any{
		"id":        id,
		"exercise":  req.Exercise,
		"reps":      req.Reps,
		"weight":    req.Weight,
		"createdAt": time.Now(),
	}})
}
