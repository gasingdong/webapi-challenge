import React, { useEffect, useState, Fragment } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [])

  return (
    <div className="App">
      {
        projects.map(project => (
          <Fragment key={project.id}>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
          </Fragment>
        ))
      }
    </div>
  );
}

export default App;
