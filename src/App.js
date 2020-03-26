import React, { useState } from "react";

import Home from "./pages/home/Home";
import Map from "./pages/map/Map";
import Company from "./pages/company/Company";
import Login from "./pages/auth/Login";
import EditCompany from "./pages/editCompany/EditCompany";
import Registration from "./pages/auth/Registration";
import Admin from "./pages/admin/Admin";
import Calendar from "./components/calendar/Calendar";

import "./App.css";

import { BrowserRouter } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";

import { CookiesProvider } from "react-cookie";

const customHistory = createBrowserHistory();

const App = () => {
  return (
    <BrowserRouter history={customHistory}>
      <CookiesProvider>
        <div className="App">
          <Switch>
            <Route exact path="/home/:type?" component={Home} />
            <Route path="/map" component={Map} />
            <Route path="/company/:id" component={Company} />
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/admin/:id" component={Admin} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/editCompany" component={EditCompany} />
            <Redirect to="/home" />
          </Switch>
        </div>
      </CookiesProvider>
    </BrowserRouter>
  );
};

export default App;
