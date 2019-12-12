import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Homepage from './Homepage';
import About from './About';
import Shop from './Shop';
import Nav from './Nav';
import ItemDetail from './Itemdetail'

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
          <Switch>
            <Route path="/" exact component={Homepage} />
            <Route path="/about" component={About} />
            <Route path="/shop" exact component={Shop} />
            <Route path="/shop/:id" component={ItemDetail}/>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
