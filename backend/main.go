package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	_ "github.com/go-sql-driver/mysql"

	"github.com/crystalkim/performance-lab/handlers"
)

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "root:password@tcp(localhost:3306)/performancelab?parseTime=true"
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Printf("warning: database not reachable: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "https://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	h := handlers.New(db)

	// Public routes
	r.Get("/health", h.Health)
	r.Post("/api/users", h.CreateUser)
	r.Post("/api/login", h.Login)

	// Protected routes (JWT required)
	r.Group(func(r chi.Router) {
		r.Use(h.AuthMiddleware)
		r.Get("/api/habits", h.GetHabits)
		r.Post("/api/habits", h.CreateHabit)
		r.Put("/api/habits/{id}", h.UpdateHabit)
		r.Delete("/api/habits/{id}", h.DeleteHabit)
		r.Post("/api/habit-log", h.LogHabit)
		r.Get("/api/workouts", h.GetWorkouts)
		r.Post("/api/workouts", h.CreateWorkout)
		r.Delete("/api/workouts/{id}", h.DeleteWorkout)
	})

	log.Printf("server listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
