const input = document.getElementById('searchInput');
const resultsList = document.getElementById('search-results');
let res= []
let currentIndex = -1;

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const fetchData = async () => {
  const res = await fetch('data.json'); // or API endpoint
  return await res.json();
};

const highlightMatch = (text, query) => {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

const renderResults = (query) => {
  resultsList.innerHTML = '';
  if (!query) return;

  const filtered = res.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  filtered.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = highlightMatch(item, query);
    li.setAttribute('role', 'option');
    li.addEventListener('click', () => {
      input.value = item;
      resultsList.innerHTML = '';
    });
    resultsList.appendChild(li);
  });
};

const handleKeyDown = (e) => {
  const items = resultsList.querySelectorAll('li');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    currentIndex = (currentIndex + 1) % items.length;
  } else if (e.key === 'ArrowUp') {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (e.key === 'Enter') {
    if (currentIndex >= 0) {
      input.value = items[currentIndex].textContent;
      resultsList.innerHTML = '';
    }
  }

  items.forEach((item, idx) => {
    item.classList.toggle('highlighted', idx === currentIndex);
  });
};

const init = async () => {
  const results = await fetchData();
  res = results.first_generation_pokemon
  input.addEventListener('input', debounce(() => renderResults(input.value), 300));
  input.addEventListener('keydown', handleKeyDown);
};

init();
