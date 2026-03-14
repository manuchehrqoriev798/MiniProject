import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEACHER_EMAIL_KEY, TEACHER_TOKEN_KEY } from '../../constants/teacherAuth';
import {
  createQuestionRequest,
  deleteQuestionRequest,
  getQuestionsRequest,
  updateQuestionRequest,
} from '../../services/teacherApi';

function buildInitialForm() {
  return {
    questionText: '',
    choices: ['', '', '', ''],
    correctAnswer: '0',
    order: '',
  };
}

function normalizePayload(form, defaultOrder) {
  return {
    questionText: form.questionText.trim(),
    choices: form.choices.map((value) => value.trim()),
    correctAnswer: Number(form.correctAnswer),
    order: Number(form.order) || defaultOrder,
  };
}

function validateQuestionForm(form) {
  if (!form.questionText.trim()) {
    return 'Question text is required.';
  }

  if (form.choices.some((choice) => !choice.trim())) {
    return 'All 4 answer choices are required.';
  }

  const correct = Number(form.correctAnswer);
  if (![0, 1, 2, 3].includes(correct)) {
    return 'Correct answer must be A, B, C or D.';
  }

  return '';
}

function toEditForm(question) {
  return {
    questionText: question.questionText,
    choices: [
      question.choices?.[0] || '',
      question.choices?.[1] || '',
      question.choices?.[2] || '',
      question.choices?.[3] || '',
    ],
    correctAnswer: String(question.correctAnswer ?? 0),
    order: String(question.order ?? ''),
  };
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState('');
  const [form, setForm] = useState(buildInitialForm());

  const token = localStorage.getItem(TEACHER_TOKEN_KEY) || '';
  const teacherEmail = localStorage.getItem(TEACHER_EMAIL_KEY) || 'teacher@school.edu';

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => Number(a.order) - Number(b.order)),
    [questions]
  );

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const list = await getQuestionsRequest(token);
      setQuestions(list);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load questions.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  function resetModal() {
    setShowFormModal(false);
    setEditQuestionId('');
    setForm(buildInitialForm());
  }

  function openCreateModal() {
    setError('');
    setSuccess('');
    setEditQuestionId('');
    setForm(buildInitialForm());
    setShowFormModal(true);
  }

  function openEditModal(question) {
    setError('');
    setSuccess('');
    setEditQuestionId(question.id);
    setForm(toEditForm(question));
    setShowFormModal(true);
  }

  function handleChoiceChange(index, value) {
    setForm((prev) => {
      const next = [...prev.choices];
      next[index] = value;
      return { ...prev, choices: next };
    });
  }

  async function handleSaveQuestion(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateQuestionForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    const payload = normalizePayload(form, questions.length + 1);

    try {
      if (editQuestionId) {
        await updateQuestionRequest(token, editQuestionId, payload);
        await loadQuestions();
        setSuccess('Question updated successfully.');
      } else {
        await createQuestionRequest(token, payload);
        await loadQuestions();
        setSuccess('Question created successfully.');
      }

      resetModal();
    } catch (saveError) {
      setError(saveError.message || 'Failed to save question.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteQuestion(questionId) {
    const confirmed = window.confirm('Are you sure you want to delete this question?');
    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await deleteQuestionRequest(token, questionId);
      setQuestions((prev) => prev.filter((question) => question.id !== questionId));
      setSuccess('Question deleted successfully.');
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete question.');
    }
  }

  function handleLogout() {
    localStorage.removeItem(TEACHER_TOKEN_KEY);
    localStorage.removeItem(TEACHER_EMAIL_KEY);
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  }

  function scrollToQuestions() {
    const target = document.getElementById('questions-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  }

  return (
    <div className="teacher-dashboard-page">
      <header className="teacher-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>{teacherEmail}</p>
        </div>
        <div className="teacher-header-actions">
          <button className="menu-toggle" onClick={() => setMenuOpen((prev) => !prev)}>
            Menu
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="teacher-layout">
        <aside className={`teacher-sidebar ${menuOpen ? 'open' : ''}`}>
          <button className="sidebar-link" onClick={scrollToQuestions}>
            Questions
          </button>
        </aside>

        <main className="teacher-content" id="questions-section">
          <section className="content-header-row">
            <h2>Questions</h2>
            <button className="primary-button" onClick={openCreateModal}>
              Add Question
            </button>
          </section>

          {success ? <div className="notice success">{success}</div> : null}
          {error ? <div className="notice error">{error}</div> : null}

          {isLoading ? (
            <div className="loading">Loading questions...</div>
          ) : sortedQuestions.length === 0 ? (
            <div className="empty-state">No questions found. Add the first question.</div>
          ) : (
            <>
              <div className="questions-table-wrap">
                <table className="questions-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Question</th>
                      <th>Correct Answer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedQuestions.map((question) => (
                      <tr key={question.id}>
                        <td>{question.order}</td>
                        <td>{question.questionText}</td>
                        <td>{question.choices[question.correctAnswer] || 'N/A'}</td>
                        <td>
                          <div className="row-actions">
                            <button className="secondary-button" onClick={() => openEditModal(question)}>
                              Edit
                            </button>
                            <button
                              className="danger-button"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="questions-cards">
                {sortedQuestions.map((question) => (
                  <article key={`card-${question.id}`} className="question-card">
                    <p className="question-order">Question {question.order}</p>
                    <p>{question.questionText}</p>
                    <p>
                      <strong>Correct:</strong> {question.choices[question.correctAnswer] || 'N/A'}
                    </p>
                    <div className="row-actions">
                      <button className="secondary-button" onClick={() => openEditModal(question)}>
                        Edit
                      </button>
                      <button className="danger-button" onClick={() => handleDeleteQuestion(question.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {showFormModal ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>{editQuestionId ? 'Edit Question' : 'Create Question'}</h3>

            <form onSubmit={handleSaveQuestion} className="question-form" noValidate>
              <label>
                Question Text
                <textarea
                  value={form.questionText}
                  onChange={(event) => setForm((prev) => ({ ...prev, questionText: event.target.value }))}
                  rows={3}
                  required
                />
              </label>

              {['A', 'B', 'C', 'D'].map((label, index) => (
                <label key={label}>
                  Choice {label}
                  <input
                    type="text"
                    value={form.choices[index]}
                    onChange={(event) => handleChoiceChange(index, event.target.value)}
                    required
                  />
                </label>
              ))}

              <div className="form-grid">
                <label>
                  Correct Answer
                  <select
                    value={form.correctAnswer}
                    onChange={(event) => setForm((prev) => ({ ...prev, correctAnswer: event.target.value }))}
                  >
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                  </select>
                </label>

                <label>
                  Order
                  <input
                    type="number"
                    min="1"
                    value={form.order}
                    onChange={(event) => setForm((prev) => ({ ...prev, order: event.target.value }))}
                    placeholder={String(questions.length + 1)}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={resetModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
