import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    large: {
      width: theme.spacing(17),
      height: theme.spacing(17),
    },
    button: {
      float: "right",
    },
  })
);

export default function Home() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    id: "",
    email: "",
    name: "",
    surname: "",
    age: "",
    url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      let token = localStorage.getItem("jwt_token") as string;
      const rawResponse = await fetch("http://localhost:8000/auth", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      const content = await rawResponse.json();
      setLoading(false);
      if (content.success) {
        setState(content.data);
      } else {
        alert(content.message);
        localStorage.clear();
        history.push("/login");
      }
    }
    getUserData();
  }, []);

  function logout() {
    localStorage.clear();
    history.push("/login");
  }

  return (
    <Container component="main" maxWidth="md">
      {loading ? <LinearProgress /> : null}
      <Button
        variant="outlined"
        color="secondary"
        className={classes.button}
        onClick={logout}
      >
        Log out
      </Button>

      <Avatar alt="Profile image" src={state.url} className={classes.large} />
      <Typography>Name: {state.name + " " + state.surname}</Typography>
      <Typography>Email: {state.email}</Typography>
      <Typography>Age: {state.age}</Typography>
    </Container>
  );
}
