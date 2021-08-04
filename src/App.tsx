import React from "react";
import Home from "./Components/Home"
import Login from "./Components/Login"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect 
} from "react-router-dom";

const  PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {

const condition = localStorage.getItem('jwt_token');

return  condition ? (<Route  path={props.path}  exact={props.exact} component={props.component} />) : 
  (<Redirect  to="/login"  />);
};

function App() {
  return (
    <Router>
      <Switch>
      <Route path="/login" component={Login} />
      <PrivateRoute  path="/"  component={Home}  exact  />
    </Switch>
  </Router>
  );
}

export default App;
