const validationContainer = document.querySelector('#validacionPendiente');
const approvedContainer = document.querySelector('#tareasAprobadas');
const revisionContainer = document.querySelector('#revisionNecesaria');
const progressContainer = document.querySelector('#progresoLista');
const personasOcupadasList = document.querySelector('#personasOcupadasList');
const disponiblesList = document.querySelector('#disponiblesList');

function setProgress(bar, value) {
  const progressValue = bar.parentElement.querySelector('.progress-value');
  const progressInt = Math.min(100, Math.max(0, Math.round(value)));
  bar.style.width = `${progressInt}%`;
  bar.dataset.progress = progressInt;
  if (progressValue) {
    progressValue.textContent = `${progressInt}%`;
  }
}

function createActionButtons(card) {
  if (card.querySelector('.card-actions')) return;
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const approveBtn = document.createElement('button');
  approveBtn.className = 'btn neon-green approve-btn';
  approveBtn.textContent = '✅ APROBAR TAREA';

  const rejectBtn = document.createElement('button');
  rejectBtn.className = 'btn neon-red reject-btn';
  rejectBtn.textContent = '❌ RECHAZAR TAREA';

  actions.append(approveBtn, rejectBtn);
  card.append(actions);
  attachActionHandlers(card);
}

function setStatusBadge(card, text, className) {
  const badge = card.querySelector('.status-badge');
  if (!badge) return;
  badge.textContent = text;
  badge.className = `status-badge ${className}`;
}

function moveCardWithTransition(card, targetContainer, callback) {
  card.classList.add('fade-transition');
  card.style.opacity = '0';

  setTimeout(() => {
    targetContainer.appendChild(card);
    if (typeof callback === 'function') {
      callback();
    }
    requestAnimationFrame(() => {
      card.style.opacity = '1';
    });
    setTimeout(() => {
      card.classList.remove('fade-transition');
    }, 500);
  }, 300);
}

function createPersonChip(name) {
  const chip = document.createElement('div');
  chip.className = 'person-chip';
  chip.dataset.person = name;

  const info = document.createElement('div');
  info.className = 'person-info';

  const personName = document.createElement('span');
  personName.className = 'person-name';
  personName.textContent = name;

  const role = document.createElement('span');
  role.className = 'person-role';
  role.textContent = 'Equipo Multidisciplinario';

  const badge = document.createElement('span');
  badge.className = 'person-badge estado-disponible';
  badge.textContent = 'DISPONIBLE';

  info.append(personName, role);
  chip.append(info, badge);
  return chip;
}

function setPersonStatus(name, status) {
  let chip = document.querySelector(`.person-chip[data-person="${name}"]`);
  if (!chip) {
    chip = createPersonChip(name);
  }

  const badge = chip.querySelector('.person-badge');
  const isAvailable = status === 'available';

  chip.classList.toggle('disponible', isAvailable);
  chip.classList.toggle('ocupado', !isAvailable);

  if (badge) {
    badge.textContent = isAvailable ? 'DISPONIBLE' : 'EN FOCO';
    badge.className = `person-badge ${
      isAvailable ? 'estado-disponible' : 'estado-en-foco'
    }`;
  }

  const targetContainer = isAvailable ? disponiblesList : personasOcupadasList;
  targetContainer.appendChild(chip);
}

function hasActiveTasks(name) {
  const activeContainers = [progressContainer, validationContainer, revisionContainer];
  return activeContainers.some((container) =>
    Array.from(container.querySelectorAll('.task-card')).some(
      (task) => task.dataset.person === name
    )
  );
}

function updatePersonStatus(name) {
  if (!name) return;
  if (hasActiveTasks(name)) {
    setPersonStatus(name, 'focus');
  } else {
    setPersonStatus(name, 'available');
  }
}

function approveTask(card) {
  const person = card.dataset.person;
  card.dataset.stage = 'approved';
  card.classList.remove('revision', 'pendiente', 'en-progreso');
  card.classList.add('approved');
  setStatusBadge(card, 'Aprobada', 'estado-aprobada');

  const actions = card.querySelector('.card-actions');
  if (actions) {
    actions.remove();
  }

  moveCardWithTransition(card, approvedContainer, () => {
    setPersonStatus(person, 'available');
    evaluateAllPersons();
  });
}

function rejectTask(card) {
  card.dataset.stage = 'revision';
  card.classList.remove('approved', 'pendiente');
  card.classList.add('revision');
  setStatusBadge(card, 'Revisión Necesaria', 'estado-revision');

  moveCardWithTransition(card, revisionContainer, () => {
    const person = card.dataset.person;
    updatePersonStatus(person);
    evaluateAllPersons();
  });
}

function attachActionHandlers(card) {
  const approveBtn = card.querySelector('.approve-btn');
  const rejectBtn = card.querySelector('.reject-btn');

  if (approveBtn) {
    approveBtn.addEventListener('click', () => approveTask(card));
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => rejectTask(card));
  }
}

function ensureValidationState(card) {
  card.dataset.stage = 'validation';
  card.classList.remove('en-progreso', 'approved', 'revision');
  card.classList.add('pendiente');
  setStatusBadge(card, 'Pendiente de Aprobación', 'estado-pendiente');
  createActionButtons(card);
}

Array.from(validationContainer.querySelectorAll('.task-card')).forEach((card) => {
  attachActionHandlers(card);
});

function evaluateAllPersons() {
  const seen = new Set();
  document.querySelectorAll('.task-card').forEach((card) => {
    if (card.dataset.person) {
      seen.add(card.dataset.person);
    }
  });

  seen.forEach((person) => updatePersonStatus(person));
}

document.querySelectorAll('.progress-bar').forEach((bar) => {
  const value = Number(bar.dataset.progress || 0);
  setProgress(bar, value);
});

function scheduleAutoProgress(bar) {
  const card = bar.closest('.task-card');
  if (!card) return;
  if (card.dataset.stage !== 'progress') return;

  const interval = setInterval(() => {
    const current = Number(bar.dataset.progress || 0);
    if (current >= 100 || card.dataset.stage !== 'progress') {
      clearInterval(interval);
      return;
    }

    const increment = Math.floor(Math.random() * 12) + 6;
    const nextValue = Math.min(100, current + increment);
    setProgress(bar, nextValue);

    if (nextValue >= 100) {
      clearInterval(interval);
      moveCardWithTransition(card, validationContainer, () => {
        ensureValidationState(card);
        updatePersonStatus(card.dataset.person);
      });
    }
  }, 3500 + Math.random() * 1200);
}

document.querySelectorAll('.progress-bar[data-auto-progress="true"]').forEach((bar) => {
  scheduleAutoProgress(bar);
});

function observeCompletion() {
  document.querySelectorAll('.task-card[data-stage="progress"]').forEach((card) => {
    const bar = card.querySelector('.progress-bar');
    if (!bar) return;
    const current = Number(bar.dataset.progress || 0);
    if (current >= 100) {
      moveCardWithTransition(card, validationContainer, () => {
        ensureValidationState(card);
        updatePersonStatus(card.dataset.person);
      });
    }
  });
}

observeCompletion();

document.addEventListener('DOMContentLoaded', () => {
  evaluateAllPersons();
});
