const baseUrl = 'http://localhost:3000/movies';

        // Функция для загрузки фильмов при загрузке страницы
        async function loadMovies() {
            try {
                const response = await fetch(baseUrl);
                const movies = await response.json();
                const tableBody = document.querySelector('#moviesTable tbody');
                tableBody.innerHTML = '';

                movies.forEach(movie => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${movie.title}</td>
                        <td>${movie.genre}</td>
                        <td>${movie.director}</td>
                        <td>${movie.year}</td>
                        <td>
                            <button class="edit-button" data-id="${movie.id}">Edit</button>
                            <button class="delete-button" data-id="${movie.id}">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Привязка обработчиков событий после загрузки данных
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', () => editMovie(button.dataset.id));
                });

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', () => deleteMovie(button.dataset.id));
                });

            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }

        // Загрузка фильмов при первой загрузке страницы
        window.onload = loadMovies;

        document.getElementById('showAddForm').addEventListener('click', () => {
            document.getElementById('addMovieForm').classList.toggle('hidden');
        });

        document.getElementById('addMovie').addEventListener('click', async () => {
            const title = document.getElementById('title').value;
            const genre = document.getElementById('genre').value;
            const director = document.getElementById('director').value;
            const year = document.getElementById('year').value;

            try {
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, genre, director, year })
                });

                if (response.ok) {
                    document.getElementById('addMovieForm').classList.add('hidden');
                    loadMovies(); // Обновляем список фильмов
                } else {
                    console.error('Error adding movie:', await response.text());
                }
            } catch (error) {
                console.error('Error adding movie:', error);
            }
        });

        let currentEditId = null;

        async function editMovie(id) {
            try {
                const response = await fetch(`${baseUrl}/${id}`);
                const movie = await response.json();

                document.getElementById('editTitle').value = movie.title;
                document.getElementById('editGenre').value = movie.genre;
                document.getElementById('editDirector').value = movie.director;
                document.getElementById('editYear').value = movie.year;
                currentEditId = id;

                document.getElementById('editMovieModal').classList.remove('hidden');
            } catch (error) {
                console.error('Error fetching movie for edit:', error);
            }
        }

        document.getElementById('saveEdit').addEventListener('click', async () => {
            const title = document.getElementById('editTitle').value;
            const genre = document.getElementById('editGenre').value;
            const director = document.getElementById('editDirector').value;
            const year = document.getElementById('editYear').value;

            try {
                const response = await fetch(`${baseUrl}/${currentEditId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, genre, director, year })
                });

                if (response.ok) {
                    document.getElementById('editMovieModal').classList.add('hidden');
                    loadMovies(); // Обновляем список фильмов
                } else {
                    console.error('Error updating movie:', await response.text());
                }
            } catch (error) {
                console.error('Error updating movie:', error);
            }
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            document.getElementById('editMovieModal').classList.add('hidden');
        });

        async function deleteMovie(id) {
            try {
                const response = await fetch(`${baseUrl}/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    loadMovies(); // Обновляем список фильмов
                } else {
                    console.error('Error deleting movie:', await response.text());
                }
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }