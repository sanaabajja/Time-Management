import { useEffect, useState } from "react";
import "./App.css";

const categories = [
  {
    id: "urgent-important",
    number: "01",
    title: "Urgent et important",
    subtitle: "À faire immédiatement",
    color: "coral",
    icon: "🔥",
  },
  {
    id: "important",
    number: "02",
    title: "Important, non urgent",
    subtitle: "À planifier",
    color: "blue",
    icon: "🎯",
  },
  {
    id: "urgent",
    number: "03",
    title: "Urgent, moins important",
    subtitle: "À déléguer si possible",
    color: "amber",
    icon: "⚡",
  },
  {
    id: "neither",
    number: "04",
    title: "Ni urgent ni important",
    subtitle: "À limiter ou reporter",
    color: "slate",
    icon: "🌿",
  },
];

const initialTasks = {
  "urgent-important": [],
  important: [],
  urgent: [],
  neither: [],
};

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("time-management-tasks");
      return saved ? { ...initialTasks, ...JSON.parse(saved) } : initialTasks;
    } catch {
      return initialTasks;
    }
  });
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    localStorage.setItem("time-management-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(categoryId) {
    const text = (inputs[categoryId] || "").trim();
    if (!text) return;

    const newTask = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      completed: false,
    };

    setTasks((current) => ({
      ...current,
      [categoryId]: [...current[categoryId], newTask],
    }));
    setInputs((current) => ({ ...current, [categoryId]: "" }));
  }

  function toggleTask(categoryId, taskId) {
    setTasks((current) => ({
      ...current,
      [categoryId]: current[categoryId].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  }

  function deleteTask(categoryId, taskId) {
    setTasks((current) => ({
      ...current,
      [categoryId]: current[categoryId].filter((task) => task.id !== taskId),
    }));
  }

  const allTasks = Object.values(tasks).flat();
  const completedCount = allTasks.filter((task) => task.completed).length;
  const progress = allTasks.length
    ? Math.round((completedCount / allTasks.length) * 100)
    : 0;

  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TimeWise accueil">
          <span className="brand-mark">T</span>
          <span>TimeWise<span className="brand-dot">.</span></span>
        </a>
        <span className="today-label">{today}</span>
      </header>

      <section className="intro" id="top">
        <div className="eyebrow"><span></span> ORGANISE TA JOURNÉE</div>
        <h1>Fais de ton temps<br /><em>ton meilleur allié.</em></h1>
        <p className="intro-copy">
          Note tes tâches dans la bonne catégorie, commence par les plus importantes
          et avance une étape à la fois.
        </p>

        <div className="progress-card">
          <div className="progress-top">
            <div>
              <span className="progress-kicker">TA PROGRESSION DU JOUR</span>
              <strong>{completedCount} <small>/ {allTasks.length} tâches terminées</small></strong>
            </div>
            <span className="progress-percent">{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="matrix-heading">
        <div>
          <span className="section-kicker">TA MATRICE</span>
          <h2>Qu’est-ce qui compte aujourd’hui ?</h2>
        </div>
        <span className="matrix-hint">Ajoute tes tâches dans chaque zone</span>
      </section>

      <section className="task-grid">
        {categories.map((category) => (
          <article className={`task-card ${category.color}`} key={category.id}>
            <div className="card-heading">
              <span className="card-number">{category.number}</span>
              <span className="card-icon">{category.icon}</span>
            </div>
            <h3>{category.title}</h3>
            <p className="card-subtitle">{category.subtitle}</p>

            <form
              className="add-form"
              onSubmit={(event) => {
                event.preventDefault();
                addTask(category.id);
              }}
            >
              <input
                type="text"
                value={inputs[category.id] || ""}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    [category.id]: event.target.value,
                  }))
                }
                placeholder="Écris une tâche..."
                aria-label={`Nouvelle tâche : ${category.title}`}
              />
              <button type="submit" aria-label="Ajouter une tâche">+</button>
            </form>

            <div className="tasks-list">
              {tasks[category.id].length === 0 ? (
                <div className="empty-state">
                  <span>✦</span>
                  <p>Aucune tâche pour le moment</p>
                </div>
              ) : (
                tasks[category.id].map((task) => (
                  <div className={`task-row ${task.completed ? "is-completed" : ""}`} key={task.id}>
                    <label className="task-label">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(category.id, task.id)}
                      />
                      <span className="custom-check"></span>
                      <span className="task-text">{task.text}</span>
                    </label>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => deleteTask(category.id, task.id)}
                      aria-label={`Supprimer ${task.text}`}
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="card-footer">
              <span>{tasks[category.id].length} tâche(s)</span>
              <span>{tasks[category.id].filter((task) => task.completed).length} terminée(s)</span>
            </div>
          </article>
        ))}
      </section>

      <footer className="footer-note">
        <span>✦</span>
        <p>Un petit pas aujourd’hui vaut mieux qu’un grand plan jamais commencé.</p>
      </footer>
    </main>
  );
}

export default App;

